-- Commerce Tables

CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_research (
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

CREATE TABLE IF NOT EXISTS store_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  revenue_estimate DECIMAL(12,2),
  products_found INTEGER,
  tech_stack JSONB DEFAULT '{}',
  traffic_sources JSONB DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);