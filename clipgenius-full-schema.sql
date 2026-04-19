-- CLIPGENIUS FULL DATABASE SCHEMA
-- Insforge.dev PostgreSQL with Row Level Security (RLS)
-- Run this in Insforge.dev SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================================================
-- CORE AUTH TABLES (Managed by Insforge.dev Auth)
-- ============================================================================

-- Users table (extends Insforge.dev auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own record (unless admin)
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- WORKSPACES (Multi-tenancy)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  business_name text,
  business_profile_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id) -- One workspace per user for now
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspaces_owner_access" ON public.workspaces
  FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- BUSINESS KNOWLEDGE BASE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.business_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('url', 'image', 'text', 'doc')),
  raw_content text,
  processed_content text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.business_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_sources_workspace_access" ON public.business_sources
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- PRODUCT CATALOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric,
  image_url text,
  category text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_workspace_access" ON public.products
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- LEADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  source text,
  first_name text,
  last_name text,
  email text,
  phone text,
  company text,
  city text,
  country text,
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  tier text DEFAULT 'cold' CHECK (tier IN ('hot', 'warm', 'cold')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'responded', 'converted', 'lost')),
  notes text,
  qualified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_workspace_access" ON public.leads
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- LEAD LISTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lead_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  lead_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.lead_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_lists_workspace_access" ON public.lead_lists
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- CAMPAIGNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('email', 'whatsapp', 'sms', 'voice')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'completed', 'paused')),
  template_id uuid,
  lead_list_id uuid REFERENCES public.lead_lists(id),
  scheduled_at timestamptz,
  completed_at timestamptz,
  stats_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_workspace_access" ON public.campaigns
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- CAMPAIGN LOGS (Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaign_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  channel text CHECK (channel IN ('email', 'whatsapp', 'sms', 'voice')),
  status text CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'replied', 'failed')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_logs_workspace_access" ON public.campaign_logs
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM public.campaigns WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE user_id = auth.uid()
      )
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  channel text CHECK (channel IN ('email', 'whatsapp', 'sms')),
  subject text,
  body_html text,
  body_text text,
  variables text[] DEFAULT '{}',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates_workspace_access" ON public.templates
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- CONNECTED SOCIAL ACCOUNTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  platform text CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube', 'pinterest', 'telegram')),
  access_token text, -- Encrypted in Insforge.dev Vault
  refresh_token text, -- Encrypted
  account_name text,
  account_id text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "connected_accounts_workspace_access" ON public.connected_accounts
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- SCHEDULED SOCIAL POSTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  platform text CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube', 'pinterest', 'telegram')),
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  scheduled_at timestamptz NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'draft')),
  published_at timestamptz,
  post_id text, -- Platform's post ID
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scheduled_posts_workspace_access" ON public.scheduled_posts
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- VOICE AGENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.voice_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  personality text,
  voice_id text,
  language text DEFAULT 'en',
  goal text,
  faq_json jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.voice_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "voice_agents_workspace_access" ON public.voice_agents
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- CALL LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id),
  agent_id uuid REFERENCES public.voice_agents(id),
  direction text DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  duration integer, -- seconds
  transcript text,
  summary text,
  outcome text CHECK (outcome IN ('interested', 'not_interested', 'callback', 'voicemail', 'no_answer', 'hung_up')),
  recording_url text, -- Insforge.dev Storage
  cost numeric,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "call_logs_workspace_access" ON public.call_logs
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- COMPETITOR MONITORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  website text,
  social_handles jsonb DEFAULT '{}',
  last_scanned timestamptz,
  analysis_json jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "competitors_workspace_access" ON public.competitors
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- AUTOMATION WORKFLOWS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  trigger_type text CHECK (trigger_type IN ('lead_added', 'campaign_sent', 'email_opened', 'manual', 'schedule')),
  trigger_config jsonb DEFAULT '{}',
  steps_json jsonb DEFAULT '[]',
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_workspace_access" ON public.workflows
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- SUBSCRIPTIONS & BILLING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan text CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  stripe_subscription_id text,
  paystack_subscription_code text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id) -- One subscription per user
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_owner_access" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- USAGE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  feature text CHECK (feature IN ('leads', 'emails', 'whatsapp', 'sms', 'voice_calls', 'social_posts', 'competitors')),
  count integer DEFAULT 1,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_workspace_access" ON public.usage_logs
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE user_id = auth.uid()
    ) OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- ADMIN: ENCRYPTED API KEYS (Stored in Insforge.dev Vault)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text UNIQUE NOT NULL,
  encrypted_key text NOT NULL, -- Use Insforge.dev Vault
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES public.users(id)
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can access API keys
CREATE POLICY "api_keys_admin_only" ON public.api_keys
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can see audit logs
CREATE POLICY "audit_logs_admin_only" ON public.audit_logs
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_lists_updated_at BEFORE UPDATE ON public.lead_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connected_accounts_updated_at BEFORE UPDATE ON public.connected_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON public.scheduled_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_agents_updated_at BEFORE UPDATE ON public.voice_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON public.competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default email templates
INSERT INTO public.templates (workspace_id, name, channel, subject, body_text, is_default)
SELECT
  w.id,
  'Welcome Email',
  'email',
  'Welcome to ClipGenius!',
  'Hi {{first_name}},

Welcome to ClipGenius! We''re excited to help you grow your business with AI-powered marketing automation.

Your business: {{business_name}}
Your goals: Automated lead generation, qualified prospects, and closed deals.

Get started by connecting your social accounts and setting up your first campaign.

Best,
The ClipGenius Team',
  true
FROM public.workspaces w
WHERE w.business_name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default WhatsApp templates
INSERT INTO public.templates (workspace_id, name, channel, body_text, is_default)
SELECT
  w.id,
  'Lead Follow-up',
  'whatsapp',
  'Hi {{first_name}}! This is {{business_name}}. We noticed you''re interested in our services. Would you like to schedule a quick call to learn more?',
  true
FROM public.workspaces w
WHERE w.business_name IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.templates (workspace_id, name, channel, body_text, is_default)
SELECT
  w.id,
  'New Customer Welcome',
  'whatsapp',
  'Welcome to {{business_name}}, {{first_name}}! Thank you for choosing us. We''re here to help grow your business. How can we assist you today?',
  false
FROM public.workspaces w
WHERE w.business_name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert default SMS templates
INSERT INTO public.templates (workspace_id, name, channel, body_text, is_default)
SELECT
  w.id,
  'Appointment Reminder',
  'sms',
  'Hi {{first_name}}, reminder: Your appointment with {{business_name}} is tomorrow. Reply CONFIRM to confirm or CANCEL to reschedule.',
  true
FROM public.workspaces w
WHERE w.business_name IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.templates (workspace_id, name, channel, body_text, is_default)
SELECT
  w.id,
  'Lead Nurture',
  'sms',
  'Hi {{first_name}}, we have some exciting updates about {{company}}. Would you like to learn more? Reply YES for details.',
  false
FROM public.workspaces w
WHERE w.business_name IS NOT NULL
ON CONFLICT DO NOTHING;