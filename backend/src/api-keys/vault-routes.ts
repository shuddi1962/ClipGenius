import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { APIKeysVaultService } from './vault-service.js';
import { requireAdmin } from '../auth/rbac.js';

const createKeySchema = z.object({
  provider: z.string(),
  key: z.string(),
  label: z.string(),
  category: z.string(),
});

const updateKeySchema = z.object({
  label: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().optional(),
});

export async function apiKeysRoutes(server: FastifyInstance, vaultService: APIKeysVaultService) {
  // Get all API keys (admin only)
  server.get('/admin/api-keys', { preHandler: requireAdmin }, async (request, reply) => {
    const keys = await vaultService.getKeys();
    return reply.send({ keys });
  });

  // Create new API key
  server.post('/admin/api-keys', {
    preHandler: requireAdmin,
    schema: {
      body: createKeySchema,
    },
  }, async (request, reply) => {
    const { provider, key, label, category } = request.body as z.infer<typeof createKeySchema>;
    const user = (request as any).user;

    const keyEntry = await vaultService.createKey({
      provider,
      key,
      label,
      category,
      added_by: user.userId,
    });

    return reply.code(201).send({ key: keyEntry });
  });

  // Update API key
  server.patch('/admin/api-keys/:id', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
      body: updateKeySchema,
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as z.infer<typeof updateKeySchema>;

    await vaultService.updateKey(id, updates);

    return reply.send({ message: 'API key updated successfully' });
  });

  // Delete API key
  server.delete('/admin/api-keys/:id', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    await vaultService.deleteKey(id);

    return reply.send({ message: 'API key deleted successfully' });
  });

  // Test API key connection
  server.post('/admin/api-keys/:id/test', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const key = await vaultService.getKeyById(id);
    if (!key) {
      return reply.code(404).send({ error: 'API key not found' });
    }

    const result = await vaultService.testConnection(key.provider);

    return reply.send(result);
  });

  // Get decrypted key for internal use (only for specific providers)
  server.get('/internal/api-keys/:provider', { preHandler: requireAdmin }, async (request, reply) => {
    const { provider } = request.params as { provider: string };

    const key = await vaultService.getDecryptedKey(provider);
    if (!key) {
      return reply.code(404).send({ error: 'API key not found' });
    }

    return reply.send({ key });
  });
}