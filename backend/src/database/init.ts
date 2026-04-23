import { insforgeClient } from './insforge.js';

export async function initializeCollections() {
  const collections = [
    // Core
    {
      name: 'users',
      schema: {
        id: 'string',
        email: 'string',
        password_hash: 'string',
        name: 'string',
        avatar: 'string?',
        role: 'string', // admin/owner/manager/staff/viewer
        plan: 'string?',
        email_verified: 'boolean',
        two_fa_secret: 'string?',
        last_login_at: 'date?',
        created_at: 'date',
      },
    },
    {
      name: 'organizations',
      schema: {
        id: 'string',
        name: 'string',
        owner_id: 'string',
        logo: 'string?',
        domain: 'string?',
        white_label_config: 'object?',
        settings: 'object?',
        created_at: 'date',
      },
    },
    {
      name: 'org_members',
      schema: {
        id: 'string',
        org_id: 'string',
        user_id: 'string',
        role: 'string',
        permissions: 'object?',
        invited_by: 'string?',
        joined_at: 'date',
      },
    },
    {
      name: 'sessions',
      schema: {
        id: 'string',
        user_id: 'string',
        token_hash: 'string',
        ip: 'string',
        user_agent: 'string',
        expires_at: 'date',
      },
    },
    {
      name: 'api_keys_vault',
      schema: {
        id: 'string',
        provider: 'string',
        encrypted_key: 'string',
        label: 'string',
        category: 'string',
        added_by: 'string',
        last_tested_at: 'date?',
        test_status: 'string',
        usage_this_month: 'number',
        active: 'boolean',
      },
    },
    // CRM
    {
      name: 'contacts',
      schema: {
        id: 'string',
        org_id: 'string',
        first_name: 'string',
        last_name: 'string',
        email: 'string',
        phone: 'string?',
        company: 'string?',
        tags: 'array',
        custom_fields: 'object?',
        lead_score: 'number',
        source: 'string',
        source_detail: 'string?',
        email_verified: 'boolean',
        phone_verified: 'boolean',
        lifecycle_stage: 'string',
        assigned_to: 'string?',
        created_at: 'date',
      },
    },
    {
      name: 'conversations',
      schema: {
        id: 'string',
        org_id: 'string',
        contact_id: 'string',
        channel: 'string', // email/sms/whatsapp/instagram/messenger/call
        status: 'string',
        assigned_to: 'string?',
        last_message_at: 'date',
      },
    },
    {
      name: 'messages',
      schema: {
        id: 'string',
        conversation_id: 'string',
        direction: 'string', // inbound/outbound
        content: 'string',
        attachments: 'array?',
        channel: 'string',
        read: 'boolean',
        delivered: 'boolean',
        created_at: 'date',
      },
    },
    {
      name: 'pipelines',
      schema: {
        id: 'string',
        org_id: 'string',
        name: 'string',
        stages: 'array',
        color: 'string',
        created_at: 'date',
      },
    },
    {
      name: 'opportunities',
      schema: {
        id: 'string',
        pipeline_id: 'string',
        contact_id: 'string',
        stage: 'string',
        value: 'number',
        currency: 'string',
        probability: 'number',
        expected_close: 'date',
        assigned_to: 'string?',
        notes: 'array?',
        created_at: 'date',
      },
    },
    {
      name: 'tasks',
      schema: {
        id: 'string',
        org_id: 'string',
        contact_id: 'string?',
        title: 'string',
        description: 'string?',
        due_date: 'date?',
        priority: 'string',
        assigned_to: 'string?',
        completed: 'boolean',
        completed_at: 'date?',
      },
    },
    {
      name: 'notes',
      schema: {
        id: 'string',
        contact_id: 'string',
        content: 'string',
        created_by: 'string',
        pinned: 'boolean',
        created_at: 'date',
      },
    },
    {
      name: 'appointments',
      schema: {
        id: 'string',
        org_id: 'string',
        contact_id: 'string',
        title: 'string',
        start_time: 'date',
        end_time: 'date',
        location: 'string?',
        calendar_id: 'string?',
        meeting_link: 'string?',
        status: 'string',
        reminder_sent: 'boolean',
        created_at: 'date',
      },
    },
    // Ads Management
    {
      name: 'ad_accounts',
      schema: {
        id: 'string',
        org_id: 'string',
        platform: 'string', // meta/google/tiktok/twitter/linkedin/snapchat/pinterest/youtube/amazon
        account_id: 'string',
        account_name: 'string',
        credentials_encrypted: 'string',
        status: 'string', // connected/disconnected/error
        currency: 'string',
        timezone: 'string',
        billing_method: 'string',
        connected_at: 'date',
      },
    },
    {
      name: 'ad_campaigns',
      schema: {
        id: 'string',
        org_id: 'string',
        ad_account_id: 'string',
        platform: 'string',
        external_campaign_id: 'string',
        name: 'string',
        objective: 'string',
        status: 'string', // active/paused/draft/archived
        daily_budget: 'number',
        lifetime_budget: 'number?',
        currency: 'string',
        start_date: 'date',
        end_date: 'date?',
        targeting: 'object?',
        bid_strategy: 'string',
        created_at: 'date',
        synced_at: 'date',
      },
    },
    {
      name: 'ad_sets',
      schema: {
        id: 'string',
        campaign_id: 'string',
        external_adset_id: 'string',
        name: 'string',
        status: 'string',
        budget: 'number?',
        targeting: 'object?',
        optimization_goal: 'string',
        bid_amount: 'number?',
        start_time: 'date?',
        end_time: 'date?',
        created_at: 'date',
      },
    },
    {
      name: 'ads',
      schema: {
        id: 'string',
        ad_set_id: 'string',
        external_ad_id: 'string',
        name: 'string',
        status: 'string',
        creative_id: 'string',
        headline: 'string',
        body_text: 'string',
        cta: 'string',
        destination_url: 'string',
        preview_url: 'string?',
        created_at: 'date',
      },
    },
    {
      name: 'ad_creatives',
      schema: {
        id: 'string',
        org_id: 'string',
        name: 'string',
        type: 'string', // image/video/carousel/collection
        media_urls: 'array',
        headline: 'string',
        body: 'string',
        cta: 'string',
        used_in_campaigns: 'array',
        created_at: 'date',
      },
    },
    {
      name: 'ad_analytics',
      schema: {
        id: 'string',
        ad_account_id: 'string',
        campaign_id: 'string?',
        ad_set_id: 'string?',
        ad_id: 'string?',
        date: 'date',
        impressions: 'number',
        clicks: 'number',
        ctr: 'number',
        cpc: 'number',
        cpm: 'number',
        conversions: 'number',
        conversion_value: 'number',
        roas: 'number',
        spend: 'number',
        reach: 'number',
        frequency: 'number',
        platform: 'string',
        synced_at: 'date',
      },
    },
    // Platform settings
    {
      name: 'platform_settings',
      schema: {
        id: 'string',
        key: 'string',
        value: 'string',
        updated_by: 'string',
        updated_at: 'date',
      },
    },
    // Usage tracking
    {
      name: 'usage_tracking',
      schema: {
        id: 'string',
        org_id: 'string',
        module: 'string',
        model: 'string',
        tokens_used: 'number',
        cost_usd: 'number',
        created_at: 'date',
      },
    },
    // Audit log
    {
      name: 'audit_log',
      schema: {
        id: 'string',
        user_id: 'string',
        action: 'string',
        resource: 'string',
        details: 'object?',
        ip: 'string',
        created_at: 'date',
      },
    },
  ];

  console.log('🗄️  Initializing InsForge collections...');

  for (const collection of collections) {
    try {
      await insforgeClient.createCollection(collection.name, collection.schema);
      console.log(`✅ Created collection: ${collection.name}`);
    } catch (error) {
      console.log(`⚠️  Collection ${collection.name} may already exist or failed to create`);
    }
  }

  console.log('🎉 All collections initialized!');
}