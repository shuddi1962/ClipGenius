-- Content & SEO Tables

CREATE TABLE IF NOT EXISTS articles (
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

CREATE TABLE IF NOT EXISTS content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('rss', 'url', 'manual')),
  url TEXT,
  name TEXT,
  last_fetched TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  issues JSONB DEFAULT '[]',
  score DECIMAL(5,2),
  fixes_applied JSONB DEFAULT '[]',
  audit_date TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS indexed_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT CHECK (status IN ('indexed', 'pending', 'error')),
  engine TEXT DEFAULT 'google',
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS connected_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  platform TEXT,
  credentials_encrypted TEXT,
  mode TEXT DEFAULT 'autopilot',
  health_score DECIMAL(3,1),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keyword_tracking (
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

CREATE TABLE IF NOT EXISTS backlink_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  total_backlinks INTEGER DEFAULT 0,
  referring_domains INTEGER DEFAULT 0,
  new_lost JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);