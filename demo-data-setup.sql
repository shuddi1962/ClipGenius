-- Demo Account Setup SQL Script for InsForge
-- Run these commands in the InsForge SQL Editor

-- Create Client User (if not exists)
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  'client-demo-uuid-001',
  'client@clipgenius.ai',
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "John Smith", "business_name": "Smith Marketing Agency", "country": "United States", "plan": "pro"}'
) ON CONFLICT (email) DO NOTHING;

-- Create Admin User (if not exists)
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  'admin-demo-uuid-001',
  'admin@clipgenius.ai',
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Admin User", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Create Client Workspace
INSERT INTO workspaces (
  user_id,
  business_name,
  business_profile_json,
  plan,
  created_at,
  updated_at
) VALUES (
  'client-demo-uuid-001',
  'Smith Marketing Agency',
  '{
    "industry": "Marketing & Advertising",
    "services": ["Lead Generation", "Content Creation", "Social Media Management", "Email Marketing"],
    "location": "Port Harcourt, Nigeria",
    "target_audience": "Small businesses, startups, entrepreneurs",
    "niche": "B2B Marketing",
    "products": ["CCTV Installation", "Solar Power Solutions", "Security Systems"],
    "company_size": "Small Business",
    "tone": "Professional",
    "website": "https://smithmarketingagency.com"
  }',
  'pro',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Add Sample Leads
INSERT INTO leads (
  workspace_id,
  source,
  first_name,
  last_name,
  email,
  phone,
  company,
  city,
  country,
  score,
  tier,
  status,
  notes,
  created_at,
  updated_at
) VALUES
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'Apify Google Search',
  'Michael',
  'Johnson',
  'michael.johnson@techcorp.ng',
  '+2348012345678',
  'TechCorp Nigeria',
  'Lagos',
  'Nigeria',
  85,
  'hot',
  'qualified',
  'Interested in CCTV systems for office security',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'Instagram Scraper',
  'Sarah',
  'Williams',
  'sarah.williams@startup.ng',
  '+2348023456789',
  'StartupHub',
  'Abuja',
  'Nigeria',
  72,
  'warm',
  'contacted',
  'Looking for solar power solutions',
  NOW() - INTERVAL '2 days',
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'LinkedIn',
  'David',
  'Brown',
  'david.brown@construction.ng',
  '+2348034567890',
  'Brown Construction',
  'Port Harcourt',
  'Nigeria',
  68,
  'warm',
  'new',
  'Construction company interested in security systems',
  NOW() - INTERVAL '1 day',
  NOW()
);

-- Add Sample Content
INSERT INTO content (
  user_id,
  business_type,
  product,
  audience,
  captions,
  hashtags,
  post_ideas,
  status,
  created_at,
  updated_at
) VALUES (
  'client-demo-uuid-001',
  'Technology',
  'CCTV Security Systems',
  'Small business owners in Nigeria',
  ARRAY[
    'Secure your business 24/7 with our advanced CCTV systems! 🏢✨ #SecurityFirst',
    'Professional installation, reliable monitoring, peace of mind guaranteed! 🔒💪',
    'From Lagos to Abuja, we protect Nigerian businesses with cutting-edge security! 🇳🇬'
  ],
  ARRAY['#CCTV', '#Security', '#BusinessSecurity', '#Nigeria', '#PortHarcourt'],
  ARRAY[
    'Customer testimonial video about our installation process',
    'Before/after security footage showing system effectiveness',
    'Live demo of mobile app monitoring features'
  ],
  'draft',
  NOW(),
  NOW()
);

-- Add Sample Scheduled Posts
INSERT INTO scheduled_posts (
  workspace_id,
  platform,
  content,
  scheduled_at,
  status,
  created_at,
  updated_at
) VALUES
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'instagram',
  '🔒 Secure your business with our professional CCTV installation services! From Lagos to Port Harcourt, we provide reliable security solutions. Contact us today! #BusinessSecurity #Nigeria',
  NOW() + INTERVAL '1 day',
  'scheduled',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'facebook',
  '🌞 Go green with our solar power solutions! Perfect for Nigerian businesses looking to reduce energy costs and environmental impact. Professional installation available across the country.',
  NOW() + INTERVAL '2 days',
  'scheduled',
  NOW(),
  NOW()
);

-- Add Sample User Settings
INSERT INTO user_settings (
  user_id,
  company_name,
  niche,
  location,
  tone,
  target_audience,
  products,
  website,
  created_at,
  updated_at
) VALUES (
  'client-demo-uuid-001',
  'Smith Marketing Agency',
  'Security & Solar Solutions',
  'Port Harcourt, Nigeria',
  'Professional',
  'Small business owners, entrepreneurs',
  ARRAY['CCTV Installation', 'Solar Power Systems', 'Security Cameras'],
  'https://smithmarketingagency.com',
  NOW(),
  NOW()
);

-- Add Sample Connected Accounts (mock data)
INSERT INTO connected_accounts (
  workspace_id,
  platform,
  account_name,
  created_at,
  updated_at
) VALUES
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'instagram',
  '@smithmarketingagency',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'facebook',
  'Smith Marketing Agency',
  NOW(),
  NOW()
);