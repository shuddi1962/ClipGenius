-- Ads Management Tables

CREATE TABLE IF NOT EXISTS ad_accounts (
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

CREATE TABLE IF NOT EXISTS ad_campaigns (
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

CREATE TABLE IF NOT EXISTS ad_sets (
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

CREATE TABLE IF NOT EXISTS ads (
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

CREATE TABLE IF NOT EXISTS ad_creatives (
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

CREATE TABLE IF NOT EXISTS ad_analytics (
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

CREATE TABLE IF NOT EXISTS ad_audiences (
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

CREATE TABLE IF NOT EXISTS ad_payments (
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

CREATE TABLE IF NOT EXISTS ad_rules (
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