-- Nexus Platform Database Schema for InsForge
-- Core Tables

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT,
  avatar TEXT,
  role TEXT CHECK (role IN ('admin', 'owner', 'manager', 'staff', 'viewer')),
  plan TEXT,
  email_verified BOOLEAN DEFAULT false,
  two_fa_secret TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_self" ON users FOR SELECT USING (auth.uid() = id);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  logo TEXT,
  domain TEXT,
  white_label_config JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_members" ON organizations FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = organizations.id
  )
);

CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer',
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_members_self" ON org_members FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_self" ON sessions FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE api_keys_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  label TEXT,
  category TEXT,
  added_by UUID REFERENCES users(id),
  last_tested_at TIMESTAMPTZ,
  test_status TEXT DEFAULT 'untested',
  usage_this_month INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE api_keys_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_only" ON api_keys_vault FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- CRM Tables

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  lead_score DECIMAL(3,2),
  source TEXT,
  source_detail TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  lifecycle_stage TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_contacts" ON contacts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = contacts.org_id
  )
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel TEXT CHECK (channel IN ('email', 'sms', 'whatsapp', 'instagram', 'messenger', 'call')),
  status TEXT DEFAULT 'active',
  assigned_to UUID REFERENCES users(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_conversations" ON conversations FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = conversations.org_id
  )
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  attachments TEXT[] DEFAULT '{}',
  channel TEXT,
  read BOOLEAN DEFAULT false,
  delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_messages" ON messages FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN conversations c ON om.org_id = c.org_id
    WHERE c.id = messages.conversation_id
  )
);

CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stages JSONB DEFAULT '[]',
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_pipelines" ON pipelines FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = pipelines.org_id
  )
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  stage TEXT,
  value DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  probability DECIMAL(5,2),
  expected_close DATE,
  assigned_to UUID REFERENCES users(id),
  notes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_opportunities" ON opportunities FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN pipelines p ON om.org_id = p.org_id
    WHERE p.id = opportunities.pipeline_id
  )
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_tasks" ON tasks FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = tasks.org_id
  )
);

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_notes" ON notes FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN contacts c ON om.org_id = c.org_id
    WHERE c.id = notes.contact_id
  )
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  calendar_id TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_appointments" ON appointments FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = appointments.org_id
  )
);

-- Prospecting & Lead Generation Tables

CREATE TABLE prospecting_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_type TEXT,
  search_query JSONB DEFAULT '{}',
  filters JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  leads_found INTEGER DEFAULT 0,
  apify_run_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE prospecting_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_prospecting_campaigns" ON prospecting_campaigns FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = prospecting_campaigns.org_id
  )
);

CREATE TABLE scraped_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES prospecting_campaigns(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  raw_data JSONB DEFAULT '{}',
  business_name TEXT,
  contact_name TEXT,
  email TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT false,
  website TEXT,
  address TEXT,
  social_profiles JSONB DEFAULT '{}',
  rating DECIMAL(3,1),
  review_count INTEGER,
  industry TEXT,
  enrichment_data JSONB DEFAULT '{}',
  lead_score DECIMAL(3,2),
  qualification TEXT,
  imported_to_crm BOOLEAN DEFAULT false,
  contact_id UUID REFERENCES contacts(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE scraped_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_scraped_leads" ON scraped_leads FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = scraped_leads.org_id
  )
);

CREATE TABLE outreach_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  steps JSONB DEFAULT '[]',
  channels TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  enrolled_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE outreach_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_sequences" ON outreach_sequences FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = outreach_sequences.org_id
  )
);

CREATE TABLE outreach_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  channel TEXT NOT NULL,
  delay_days INTEGER DEFAULT 0,
  delay_hours INTEGER DEFAULT 0,
  template_content TEXT,
  subject_line TEXT,
  ab_variants JSONB DEFAULT '[]',
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE outreach_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_steps" ON outreach_steps FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_sequences os ON om.org_id = os.org_id
    WHERE os.id = outreach_steps.sequence_id
  )
);

CREATE TABLE outreach_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  last_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE outreach_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_enrollments" ON outreach_enrollments FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_sequences os ON om.org_id = os.org_id
    WHERE os.id = outreach_enrollments.sequence_id
  )
);

CREATE TABLE outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES outreach_enrollments(id) ON DELETE CASCADE,
  step_id UUID REFERENCES outreach_steps(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  channel TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_events" ON outreach_events FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_enrollments oe ON om.org_id = oe.org_id
    JOIN outreach_sequences os ON oe.sequence_id = os.id
    WHERE oe.id = outreach_events.enrollment_id
  )
);

CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  smtp_check_result JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_email_verifications" ON email_verifications FOR SELECT USING (true);

CREATE TABLE dnc_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  reason TEXT,
  added_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dnc_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_dnc_list" ON dnc_list FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = dnc_list.org_id
  )
);

-- Content & SEO Tables

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  seo_meta JSONB DEFAULT '{}',
  source_url TEXT,
  rewritten_from UUID REFERENCES articles(id),
  model_used TEXT,
  published_to TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_articles" ON articles FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = articles.org_id
  )
);

CREATE TABLE content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('rss', 'url', 'manual')),
  url TEXT,
  name TEXT,
  last_fetched TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_content_sources" ON content_sources FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = content_sources.org_id
  )
);

CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  issues JSONB DEFAULT '[]',
  score DECIMAL(5,2),
  fixes_applied JSONB DEFAULT '[]',
  audit_date TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_seo_audits" ON seo_audits FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = seo_audits.org_id
  )
);

CREATE TABLE indexed_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT CHECK (status IN ('indexed', 'pending', 'error')),
  engine TEXT DEFAULT 'google',
  submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE indexed_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_indexed_pages" ON indexed_pages FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = indexed_pages.org_id
  )
);

CREATE TABLE connected_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  platform TEXT,
  credentials_encrypted TEXT,
  mode TEXT DEFAULT 'autopilot',
  health_score DECIMAL(3,1),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE connected_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_connected_sites" ON connected_sites FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = connected_sites.org_id
  )
);

CREATE TABLE keyword_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  position INTEGER,
  search_volume INTEGER,
  difficulty DECIMAL(5,2),
  url TEXT,
  engine TEXT DEFAULT 'google',
  tracked_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE keyword_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_keyword_tracking" ON keyword_tracking FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = keyword_tracking.org_id
  )
);

CREATE TABLE backlink_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  total_backlinks INTEGER DEFAULT 0,
  referring_domains INTEGER DEFAULT 0,
  new_lost JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE backlink_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_backlink_profiles" ON backlink_profiles FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = backlink_profiles.org_id
  )
);

-- Ads Management Tables

CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('meta', 'google', 'tiktok', 'twitter', 'linkedin', 'snapchat', 'pinterest', 'youtube', 'amazon')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  credentials_encrypted TEXT,
  status TEXT DEFAULT 'disconnected',
  currency TEXT DEFAULT 'USD',
  timezone TEXT,
  billing_method TEXT,
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_accounts" ON ad_accounts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_accounts.org_id
  )
);

CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  platform TEXT,
  external_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT DEFAULT 'draft',
  daily_budget DECIMAL(12,2),
  lifetime_budget DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  targeting JSONB DEFAULT '{}',
  bid_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ
);

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_campaigns" ON ad_campaigns FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_campaigns.org_id
  )
);

CREATE TABLE ad_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  external_adset_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  budget DECIMAL(12,2),
  targeting JSONB DEFAULT '{}',
  optimization_goal TEXT,
  bid_amount DECIMAL(8,2),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_sets" ON ad_sets FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN ad_campaigns ac ON om.org_id = ac.org_id
    WHERE ac.id = ad_sets.campaign_id
  )
);

CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
  external_ad_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  creative_id UUID,
  headline TEXT,
  body_text TEXT,
  cta TEXT,
  destination_url TEXT,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ads" ON ads FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN ad_campaigns ac ON om.org_id = ac.org_id
    JOIN ad_sets ads ON ac.id = ads.campaign_id
    WHERE ads.id = ads.ad_set_id
  )
);

CREATE TABLE ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video', 'carousel', 'collection')),
  media_urls TEXT[] DEFAULT '{}',
  headline TEXT,
  body TEXT,
  cta TEXT,
  used_in_campaigns UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_creatives" ON ad_creatives FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_creatives.org_id
  )
);

CREATE TABLE ad_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE SET NULL,
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE SET NULL,
  ad_id UUID REFERENCES ads(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,4),
  cpc DECIMAL(8,2),
  cpm DECIMAL(8,2),
  conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL(12,2),
  roas DECIMAL(5,2),
  spend DECIMAL(12,2),
  reach INTEGER DEFAULT 0,
  frequency DECIMAL(4,2),
  platform TEXT,
  synced_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_analytics" ON ad_analytics FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_accounts.org_id
    FROM ad_accounts WHERE ad_accounts.id = ad_analytics.ad_account_id
  )
);

CREATE TABLE ad_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT,
  audience_id TEXT,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('custom', 'lookalike', 'saved')),
  size INTEGER,
  source TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_audiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_audiences" ON ad_audiences FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_audiences.org_id
  )
);

CREATE TABLE ad_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  platform TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  nexus_fee_pct DECIMAL(4,2) DEFAULT 7.0,
  nexus_fee_amount DECIMAL(12,2),
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  external_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_payments" ON ad_payments FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_payments.org_id
  )
);

CREATE TABLE ad_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  trigger_metric TEXT,
  trigger_condition TEXT,
  trigger_value DECIMAL(12,2),
  action TEXT,
  action_value DECIMAL(12,2),
  active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ad_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_rules" ON ad_rules FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_rules.org_id
  )
);

-- Commerce Tables

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  inventory INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_products" ON products FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = products.org_id
  )
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_orders" ON orders FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = orders.org_id
  )
);

CREATE TABLE product_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  source_url TEXT,
  cost DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  margin DECIMAL(5,2),
  orders_monthly INTEGER,
  score DECIMAL(3,1),
  trend TEXT,
  saturation DECIMAL(3,1),
  supplier_urls TEXT[] DEFAULT '{}',
  saved_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_product_research" ON product_research FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = product_research.org_id
  )
);

CREATE TABLE store_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  revenue_estimate DECIMAL(12,2),
  products_found INTEGER,
  tech_stack JSONB DEFAULT '{}',
  traffic_sources JSONB DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE store_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_store_analyses" ON store_analyses FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = store_analyses.org_id
  )
);

-- Creative Tables

CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  canvas_data JSONB,
  thumbnail TEXT,
  size TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_designs" ON designs FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = designs.org_id
  )
);

CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_media_library" ON media_library FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = media_library.org_id
  )
);

CREATE TABLE video_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timeline_data JSONB,
  duration INTEGER,
  resolution TEXT,
  status TEXT DEFAULT 'draft',
  output_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_video_projects" ON video_projects FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = video_projects.org_id
  )
);

CREATE TABLE music_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  prompt TEXT,
  genre TEXT,
  duration INTEGER,
  model_used TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_music_tracks" ON music_tracks FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = music_tracks.org_id
  )
);

CREATE TABLE presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slides JSONB DEFAULT '[]',
  theme TEXT,
  research_sources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_presentations" ON presentations FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = presentations.org_id
  )
);

-- Automation Tables

CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  flow_data JSONB,
  channels TEXT[] DEFAULT '{}',
  mode TEXT DEFAULT 'manual',
  training_data JSONB,
  embed_config JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_chatbots" ON chatbots FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = chatbots.org_id
  )
);

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger TEXT,
  actions JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT false,
  executions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_workflows" ON workflows FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = workflows.org_id
  )
);

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'running',
  steps_completed JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_workflow_executions" ON workflow_executions FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN workflows w ON om.org_id = w.org_id
    WHERE w.id = workflow_executions.workflow_id
  )
);

CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  content TEXT,
  platform TEXT,
  media TEXT[] DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_scheduled_posts" ON scheduled_posts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = scheduled_posts.org_id
  )
);

CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  audience_filter JSONB DEFAULT '{}',
  content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_broadcasts" ON broadcasts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = broadcasts.org_id
  )
);

-- Billing & Admin Tables

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  gateway TEXT,
  gateway_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_subscriptions" ON subscriptions FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = subscriptions.org_id
  )
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft',
  gateway TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_invoices" ON invoices FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = invoices.org_id
  )
);

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(8,4),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_usage_tracking" ON usage_tracking FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = usage_tracking.org_id
  )
);

CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_platform_settings" ON platform_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE TABLE plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  version TEXT,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_plugins" ON plugins FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB DEFAULT '{}',
  ip INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_audit_logs" ON audit_logs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Domains & Business Tables

CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  registrar TEXT,
  status TEXT DEFAULT 'pending',
  dns_records JSONB DEFAULT '[]',
  ssl_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_domains" ON domains FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = domains.org_id
  )
);

CREATE TABLE hosted_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  site_id TEXT,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  subdomain TEXT,
  hosting_type TEXT,
  bandwidth_used INTEGER DEFAULT 0,
  ssl_provisioned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hosted_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_hosted_sites" ON hosted_sites FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = hosted_sites.org_id
  )
);

CREATE TABLE name_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  industry TEXT,
  style TEXT,
  results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE name_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_name_searches" ON name_searches FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = name_searches.org_id
  )
);

CREATE TABLE generated_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  style TEXT,
  variations JSONB DEFAULT '[]',
  selected_variant TEXT,
  svg_url TEXT,
  png_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE generated_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_generated_logos" ON generated_logos FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = generated_logos.org_id
  )
);

CREATE TABLE brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  colors JSONB DEFAULT '{}',
  fonts JSONB DEFAULT '{}',
  social_assets JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_brand_kits" ON brand_kits FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = brand_kits.org_id
  )
);

CREATE TABLE user_payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL,
  credentials_encrypted TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_payment_gateways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_user_payment_gateways" ON user_payment_gateways FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = user_payment_gateways.org_id
  )
);

CREATE TABLE user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  gateway TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  customer_email TEXT,
  status TEXT DEFAULT 'pending',
  site_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_user_transactions" ON user_transactions FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = user_transactions.org_id
  )
);