import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { insforgeClient } from '../database/insforge.js';
import { requireAdmin } from '../auth/rbac.js';
import { AuthService } from '../auth/auth-service.js';

// Explicitly type z.any as any to avoid Zod v3/v4 overload issues
const anySchema = z.any() as any

// Billing config schemas - using any for flexibility
const billingConfigSchema = z.object({
  gateways: z.record(anySchema).optional(),
  commission_rates: z.record(z.number()).optional(),
  plans: z.record(anySchema).optional(),
})

export async function adminRoutes(server: FastifyInstance, authService: AuthService) {
  // Admin dashboard overview
  server.get('/admin/dashboard', { preHandler: requireAdmin }, async (request, reply) => {
    // Get basic stats
    const totalUsers = await insforgeClient.find('users', {}).then((users: any) => users.length);
    const totalOrgs = await insforgeClient.find('organizations', {}).then((orgs: any) => orgs.length);
    const activeApiKeys = await insforgeClient.find('api_keys_vault', { active: true }).then((keys: any) => keys.length);

    return reply.send({
      stats: {
        totalUsers,
        totalOrgs,
        activeApiKeys,
      },
    });
  });

  // User management - Enhanced
  server.get('/admin/users', { preHandler: requireAdmin }, async (request, reply) => {
    const { page = 1, limit = 50, search, role, status } = request.query as {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: 'active' | 'suspended' | 'pending';
    };

    const skip = (page - 1) * limit;
    const filter: any = {};

    // Apply filters
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    const users = await insforgeClient.find('users', filter, {
      skip,
      limit,
      sort: { created_at: -1 },
    });

    const total = await insforgeClient.find('users', filter).then((users: any) => users.length);

    return reply.send({
      users: users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        email_verified: user.email_verified,
        last_login_at: user.last_login_at,
        created_at: user.created_at,
        status: user.status || 'active',
        suspended_at: user.suspended_at,
        suspension_reason: user.suspension_reason,
        org_count: 0, // TODO: count organizations
      })),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    });
  });

  // Update user - Enhanced
  server.patch('/admin/users/:id', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        role: z.enum(['admin', 'owner', 'manager', 'staff', 'viewer']).optional(),
        email_verified: z.boolean().optional(),
        status: z.enum(['active', 'suspended']).optional(),
        suspension_reason: z.string().optional(),
      }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;
    const user = (request as any).user;

    // Track changes for audit log
    const existingUser = await insforgeClient.findOne('users', { id });

    if (updates.status === 'suspended') {
      updates.suspended_at = new Date();
    } else if (updates.status === 'active') {
      updates.suspended_at = null;
      updates.suspension_reason = null;
    }

    await insforgeClient.updateOne('users', { id }, updates);

    // Create audit log
    await insforgeClient.insertOne('audit_log', {
      id: authService.generateSecureToken(16),
      user_id: user.userId,
      action: 'user_updated',
      resource: 'user',
      details: { userId: id, updates },
      ip: request.ip,
      created_at: new Date(),
    });

    return reply.send({ message: 'User updated successfully' });
  });

  // Impersonate user
  server.post('/admin/users/:id/impersonate', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const adminUser = (request as any).user;

    const targetUser = await insforgeClient.findOne('users', { id });
    if (!targetUser) {
      return reply.code(404).send({ error: 'User not found' });
    }

    // Get user's organization
    const member = await insforgeClient.findOne('org_members', { user_id: id });
    const orgId = member?.org_id;

    // Generate impersonation token (short-lived)
     const impersonationToken = authService.generateAccessToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      orgId,
      impersonated: true,
      impersonator: adminUser.userId,
    });

    // Create audit log
    await insforgeClient.insertOne('audit_log', {
      id: authService.generateSecureToken(16),
      user_id: adminUser.userId,
      action: 'user_impersonated',
      resource: 'user',
      details: { targetUserId: id },
      ip: request.ip,
      created_at: new Date(),
    });

    return reply.send({
      impersonationToken,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        orgId,
      },
    });
  });

  // Delete user
  server.delete('/admin/users/:id', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = (request as any).user;

    const existingUser = await insforgeClient.findOne('users', { id });
    if (!existingUser) {
      return reply.code(404).send({ error: 'User not found' });
    }

    await insforgeClient.deleteOne('users', { id });

    // Create audit log
    await insforgeClient.insertOne('audit_log', {
      id: authService.generateSecureToken(16),
      user_id: user.userId,
      action: 'user_deleted',
      resource: 'user',
      details: { deletedUserId: id, deletedUser: existingUser },
      ip: request.ip,
      created_at: new Date(),
    });

    return reply.send({ message: 'User deleted successfully' });
  });

  // Organization management
  server.get('/admin/organizations', { preHandler: requireAdmin }, async (request, reply) => {
    const { page = 1, limit = 50 } = request.query as { page?: number; limit?: number };

    const skip = (page - 1) * limit;
    const orgs = await insforgeClient.find('organizations', {}, {
      skip,
      limit,
      sort: { created_at: -1 },
    });

    const total = await insforgeClient.find('organizations', {}).then((orgs: any) => orgs.length);

    return reply.send({
      organizations: orgs,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    });
  });

  // Module toggle system - per-plan control
  server.get('/admin/modules', { preHandler: requireAdmin }, async (request, reply) => {
    const modules = await insforgeClient.find('platform_settings', {
      key: { $regex: '^module_' },
    });

    const plans = await insforgeClient.find('platform_settings', {
      key: { $regex: '^plan_' },
    });

    const moduleConfig = modules.reduce((acc: Record<string, Record<string, boolean>>, mod: any) => {
      const [, planId, moduleName] = mod.key.split('_');
      if (!acc[planId]) acc[planId] = {};
      acc[planId][moduleName] = JSON.parse(mod.value);
      return acc;
    }, {} as Record<string, Record<string, boolean>>);

    return reply.send({
      modules: moduleConfig,
      available_modules: [
        'crm', 'contacts', 'inbox', 'pipelines', 'prospecting',
        'content_writer', 'social_planner', 'email_marketing', 'sms_marketing', 'whatsapp',
        'seo_engine', 'auto_indexing', 'site_manager', 'keywords', 'backlinks',
        'ads_manager', 'campaigns', 'creative_library', 'audiences', 'analytics',
        'commerce', 'product_research', 'ad_intelligence', 'ugc_ads', 'online_store',
        'creative', 'design_studio', 'image_studio', 'video_editor', 'music_creator',
        'automation', 'chatbots', 'workflows', 'voice_calls', 'broadcasting',
        'build', 'websites_funnels', 'hosting_domains', 'business_name_generator', 'calendars',
        'courses_memberships', 'reviews_reputation', 'code_builder', 'chat_hub',
        'reports_analytics', 'team_roles', 'settings',
      ],
    });
  });

  server.patch('/admin/modules/:planId/:moduleName', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({
        planId: z.string(),
        moduleName: z.string(),
      }),
      body: z.object({
        enabled: z.boolean(),
      }),
    },
  }, async (request, reply) => {
    const { planId, moduleName } = request.params as { planId: string; moduleName: string };
    const { enabled } = request.body as { enabled: boolean };
    const user = (request as any).user;

    await insforgeClient.updateOne(
      'platform_settings',
      { key: `module_${planId}_${moduleName}` },
      {
        key: `module_${planId}_${moduleName}`,
        value: JSON.stringify(enabled),
        updated_by: user.userId,
        updated_at: new Date(),
      },
      { upsert: true }
    );

    return reply.send({ message: 'Module setting updated successfully' });
  });

  // Plugin system
  server.get('/admin/plugins', { preHandler: requireAdmin }, async (request, reply) => {
    const plugins = await insforgeClient.find('plugins', {});
    return reply.send({ plugins });
  });

  server.post('/admin/plugins', {
    preHandler: requireAdmin,
    schema: {
      body: z.object({
        name: z.string(),
        description: z.string(),
        version: z.string(),
        config: z.record(anySchema).optional(),
      }),
    },
  }, async (request, reply) => {
    const { name, description, version, config } = request.body as any;
    const user = (request as any).user;

    const plugin = {
      id: authService.generateSecureToken(16),
      name,
      description,
      version,
      enabled: false,
      config: config || {},
      created_by: user.userId,
      created_at: new Date(),
    };

    await insforgeClient.insertOne('plugins', plugin);

    return reply.code(201).send({ plugin });
  });

  server.patch('/admin/plugins/:id', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        enabled: z.boolean().optional(),
        config: z.record(anySchema).optional(),
      }),
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;

    await insforgeClient.updateOne('plugins', { id }, updates);

    return reply.send({ message: 'Plugin updated successfully' });
  });

  // Billing configuration
  server.get('/admin/billing/config', { preHandler: requireAdmin }, async (request, reply) => {
    const config = await insforgeClient.find('platform_settings', {
      key: { $regex: '^billing_' },
    });

    const billingConfig = config.reduce((acc: Record<string, any>, setting: any) => {
      const key = setting.key.replace('billing_', '');
      acc[key] = JSON.parse(setting.value);
      return acc;
    }, {} as Record<string, any>);

    return reply.send({
      gateways: billingConfig.gateways || {
        stripe: { enabled: false, secret_key: '', webhook_secret: '' },
        paystack: { enabled: false, secret_key: '', webhook_secret: '' },
        flutterwave: { enabled: false, secret_key: '', webhook_secret: '' },
        nowpayments: { enabled: false, api_key: '', ipn_secret: '' },
      },
      commission_rates: billingConfig.commission_rates || {
        ad_spend_commission: 7, // percentage
      },
      plans: billingConfig.plans || {
        starter: { price_monthly: 49, price_yearly: 39 },
        pro: { price_monthly: 149, price_yearly: 119 },
        agency: { price_monthly: 349, price_yearly: 279 },
      },
    });
  });

  server.patch('/admin/billing/config', {
    preHandler: requireAdmin,
    schema: {
      body: z.object({
        gateways: z.record(anySchema).optional(),
        commission_rates: z.record(z.number()).optional(),
        plans: z.record(anySchema).optional(),
      }),
    },
  }, async (request, reply) => {
    const updates = request.body as any;
    const user = (request as any).user;

    for (const [key, value] of Object.entries(updates)) {
      await insforgeClient.updateOne(
        'platform_settings',
        { key: `billing_${key}` },
        {
          key: `billing_${key}`,
          value: JSON.stringify(value),
          updated_by: user.userId,
          updated_at: new Date(),
        },
        { upsert: true }
      );
    }

    return reply.send({ message: 'Billing configuration updated successfully' });
  });

  // White-label settings
  server.get('/admin/white-label', { preHandler: requireAdmin }, async (request, reply) => {
    const settings = await insforgeClient.find('platform_settings', {
      key: { $regex: '^whitelabel_' },
    });

    const whiteLabelConfig = settings.reduce((acc: Record<string, any>, setting: any) => {
      const key = setting.key.replace('whitelabel_', '');
      acc[key] = JSON.parse(setting.value);
      return acc;
    }, {} as Record<string, any>);

    return reply.send({
      enabled: whiteLabelConfig.enabled || false,
      branding: {
        name: whiteLabelConfig.name || 'Nexus',
        logo_url: whiteLabelConfig.logo_url || '',
        favicon_url: whiteLabelConfig.favicon_url || '',
        primary_color: whiteLabelConfig.primary_color || '#1A1A2E',
        secondary_color: whiteLabelConfig.secondary_color || '#0652DD',
        custom_domain: whiteLabelConfig.custom_domain || '',
        custom_email_domain: whiteLabelConfig.custom_email_domain || '',
      },
      features: {
        remove_branding: whiteLabelConfig.remove_branding || false,
        custom_support_email: whiteLabelConfig.custom_support_email || '',
        custom_docs_url: whiteLabelConfig.custom_docs_url || '',
        custom_privacy_policy_url: whiteLabelConfig.custom_privacy_policy_url || '',
        custom_terms_url: whiteLabelConfig.custom_terms_url || '',
      },
    });
  });

  server.patch('/admin/white-label', {
    preHandler: requireAdmin,
    schema: {
      body: z.object({
        enabled: z.boolean().optional(),
        branding: z.object({
          name: z.string().optional(),
          logo_url: z.string().optional(),
          favicon_url: z.string().optional(),
          primary_color: z.string().optional(),
          secondary_color: z.string().optional(),
          custom_domain: z.string().optional(),
          custom_email_domain: z.string().optional(),
        }).optional(),
        features: z.object({
          remove_branding: z.boolean().optional(),
          custom_support_email: z.string().optional(),
          custom_docs_url: z.string().optional(),
          custom_privacy_policy_url: z.string().optional(),
          custom_terms_url: z.string().optional(),
        }).optional(),
      }),
    },
  }, async (request, reply) => {
    const updates = request.body as any;
    const user = (request as any).user;

    const flattenUpdates = (obj: any, prefix = ''): Record<string, any> => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(result, flattenUpdates(value, `${prefix}${key}_`));
        } else {
          result[`whitelabel_${prefix}${key}`] = JSON.stringify(value);
        }
      }
      return result;
    };

    const flattenedUpdates = flattenUpdates(updates);

    for (const [key, value] of Object.entries(flattenedUpdates)) {
      await insforgeClient.updateOne(
        'platform_settings',
        { key },
        {
          key,
          value,
          updated_by: user.userId,
          updated_at: new Date(),
        },
        { upsert: true }
      );
    }

    return reply.send({ message: 'White-label settings updated successfully' });
  });

  // Platform settings - Enhanced
  server.get('/admin/settings', { preHandler: requireAdmin }, async (request, reply) => {
    const settings = await insforgeClient.find('platform_settings', {
      key: { $regex: '^(?!module_|plan_|billing_|whitelabel_|kie_|openrouter_)' },
    });

    const settingsMap = settings.reduce((acc: Record<string, any>, setting: any) => {
      acc[setting.key] = JSON.parse(setting.value);
      return acc;
    }, {} as Record<string, any>);

    return reply.send({
      settings: {
        maintenance_mode: settingsMap.maintenance_mode || false,
        maintenance_message: settingsMap.maintenance_message || 'System is under maintenance',
        timezone: settingsMap.timezone || 'UTC',
        date_format: settingsMap.date_format || 'YYYY-MM-DD',
        time_format: settingsMap.time_format || 'HH:mm:ss',
        currency: settingsMap.currency || 'USD',
        language: settingsMap.language || 'en',
        security: {
          session_timeout: settingsMap.session_timeout || 24, // hours
          password_min_length: settingsMap.password_min_length || 8,
          two_fa_required: settingsMap.two_fa_required || false,
          ip_whitelist: settingsMap.ip_whitelist || [],
        },
        limits: {
          max_users_per_org: settingsMap.max_users_per_org || 100,
          max_orgs_per_user: settingsMap.max_orgs_per_user || 5,
          max_api_keys_per_org: settingsMap.max_api_keys_per_org || 50,
          rate_limit_requests: settingsMap.rate_limit_requests || 100,
          rate_limit_window: settingsMap.rate_limit_window || 60, // seconds
        },
        ...settingsMap,
      },
    });
  });

  server.patch('/admin/settings/:key', {
    preHandler: requireAdmin,
    schema: {
      params: z.object({ key: z.string() }),
      body: z.object({ value: z.any() }),
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    const { value } = request.body as { value: any };
    const user = (request as any).user;

    await insforgeClient.updateOne(
      'platform_settings',
      { key },
      {
        key,
        value: JSON.stringify(value),
        updated_by: user.userId,
        updated_at: new Date(),
      },
      { upsert: true }
    );

    // Create audit log
    await insforgeClient.insertOne('audit_log', {
      id: authService.generateSecureToken(16),
      user_id: user.userId,
      action: 'platform_setting_updated',
      resource: 'platform_settings',
      details: { key, value },
      ip: request.ip,
      created_at: new Date(),
    });

    return reply.send({ message: 'Setting updated successfully' });
  });

  // Audit log
  server.get('/admin/audit-log', { preHandler: requireAdmin }, async (request, reply) => {
    const { page = 1, limit = 50 } = request.query as { page?: number; limit?: number };

    const skip = (page - 1) * limit;
    const logs = await insforgeClient.find('audit_log', {}, {
      skip,
      limit,
      sort: { created_at: -1 },
    });

    const total = await insforgeClient.find('audit_log', {}).then((logs: any) => logs.length);

    return reply.send({
      logs,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    });
  });
}