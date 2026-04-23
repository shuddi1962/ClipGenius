import 'dotenv/config';
import fastify from 'fastify';
import { z } from 'zod';
import { initializeInsForge } from './database/insforge.js';
import { initializeCollections } from './database/init.js';
import { AuthService } from './auth/auth-service.js';
import { authRoutes } from './auth/auth-routes.js';
import { APIKeysVaultService } from './api-keys/vault-service.js';
import { apiKeysRoutes } from './api-keys/vault-routes.js';
import { QueueService } from './queue/queue-service.js';
import { adminRoutes } from './admin/admin-routes.js';
import { ModelSyncService } from './services/model-sync.js';
import { requireAuth } from './auth/rbac.js';
import { APIKeysVaultService } from './api-keys/vault-service.js';
import { apiKeysRoutes } from './api-keys/vault-routes.js';
import { QueueService } from './queue/queue-service.js';
import { adminRoutes } from './admin/admin-routes.js';
import { ModelSyncService } from './services/model-sync.js';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('3001'),
  API_BASE_URL: z.string().url(),
  INSFORGE_URL: z.string().url(),
  INSFORGE_API_KEY: z.string(),
  INSFORGE_DB_NAME: z.string().default('nexus'),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ENCRYPTION_KEY: z.string().length(64), // 32-byte hex
  ENCRYPTION_IV_LENGTH: z.string().transform(Number).default('16'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  FRONTEND_URL: z.string().url(),
  SYSTEM_SMTP_HOST: z.string().optional(),
  SYSTEM_SMTP_PORT: z.string().transform(Number).optional(),
  SYSTEM_SMTP_USER: z.string().optional(),
  SYSTEM_SMTP_PASS: z.string().optional(),
  SYSTEM_FROM_EMAIL: z.string().email().default('noreply@nexus.app'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

// Initialize InsForge connection
initializeInsForge(env.INSFORGE_URL, env.INSFORGE_API_KEY, env.INSFORGE_DB_NAME);

// Initialize database collections
await initializeCollections();

// Create Fastify instance
const server = fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    transport: env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
});

// Initialize auth service
const authService = new AuthService(
  env.JWT_SECRET,
  env.JWT_REFRESH_SECRET,
  env.JWT_EXPIRES_IN,
  env.JWT_REFRESH_EXPIRES_IN
);

// Initialize API keys vault service
const vaultService = new APIKeysVaultService(env.ENCRYPTION_KEY, env.ENCRYPTION_IV_LENGTH);

// Initialize model sync service
const modelSyncService = new ModelSyncService(vaultService);

// Initialize queue service (optional - Redis not required for basic functionality)
let queueService: QueueService | undefined;
try {
  queueService = new QueueService(env.REDIS_URL);
} catch (error) {
  console.log('⚠️  Redis not available, running without queue service');
}

// Attach services to server for use in routes
(server as any).authService = authService;
(server as any).vaultService = vaultService;
(server as any).queueService = queueService;

// Make vault service globally available for queue jobs
(global as any).vaultService = vaultService;

// Register plugins (temporarily disabled for compatibility)
try {
  await server.register(import('@fastify/cors'), {
    origin: [env.FRONTEND_URL],
    credentials: true,
  });
} catch (error) {
  console.log('⚠️  CORS plugin not available, continuing without it');
}

try {
  await server.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });
} catch (error) {
  console.log('⚠️  Rate limit plugin not available, continuing without it');
}

// Register auth routes
await authRoutes(server, authService);

// Register API keys vault routes
await apiKeysRoutes(server, vaultService);

// Register admin routes
await adminRoutes(server, authService);

// Model API routes (public for authenticated users)
server.get('/api/models/:type', { preHandler: requireAuth }, async (request, reply) => {
  const { type } = request.params as { type: 'llm' | 'image' | 'video' | 'music' };
  const { filter } = request.query as { filter?: string[] };

  const models = await modelSyncService.getModelsByType(type);

  // Apply filters if provided
  let filteredModels = models;
  if (filter && filter.length > 0) {
    filteredModels = models.filter(model =>
      filter.some(capability => model.capabilities?.includes(capability))
    );
  }

  return reply.send({ models: filteredModels });
});

// Health check route
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root route
server.get('/', async () => {
  return {
    name: 'Nexus Backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');

  try {
    await server.close();
    if (queueService) {
      await queueService.close();
    }
    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 Nexus Backend running on port ${env.PORT}`);

    // Initial model sync
    console.log('🔄 Performing initial model sync...');
    try {
      await modelSyncService.syncOpenRouterModels();
      await modelSyncService.syncKieModels();
      console.log('✅ Initial model sync completed');
    } catch (error) {
      console.log('⚠️  Initial model sync failed, will retry in background');
    }

    // Schedule recurring model sync jobs (if queue service is available)
    if (queueService) {
      await queueService.addJob('model-sync', 'sync-openrouter', { provider: 'openrouter' }, {
        repeat: { every: 6 * 60 * 60 * 1000 }, // Every 6 hours
      });

      await queueService.addJob('model-sync', 'sync-kie', { provider: 'kie' }, {
        repeat: { every: 6 * 60 * 60 * 1000 }, // Every 6 hours
      });
    }

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();