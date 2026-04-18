-- CLIPGENIUS DEMO DATA SETUP
-- Run this in InsForge SQL Editor
-- URL: https://wk49fyqm.us-east.insforge.app

-- ============================================================================
-- STEP 1: Create Demo Users (Simple version)
-- ============================================================================

-- Create Client User
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
  '{"full_name": "John Smith", "business_name": "Smith Marketing Agency", "country": "United States", "plan": "pro", "role": "client"}'
) ON CONFLICT (email) DO NOTHING;

-- Create Admin User
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

-- ============================================================================
-- STEP 2: Create Workspace (Simple version)
-- ============================================================================

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
  '{"industry": "Marketing & Advertising", "services": ["Lead Generation", "Content Creation"], "location": "Port Harcourt, Nigeria"}',
  'pro',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 3: Add Sample Leads (One by one)
-- ============================================================================

-- Lead 1: Michael Johnson
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
) VALUES (
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'Google Search',
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
);

-- Lead 2: Sarah Williams
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
) VALUES (
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'Instagram',
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
);

-- ============================================================================
-- STEP 4: Add Sample Content
-- ============================================================================

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
  ARRAY['Secure your business 24/7 with CCTV systems!', 'Professional installation guaranteed!', 'From Lagos to Abuja - we protect businesses!'],
  ARRAY['#CCTV', '#Security', '#BusinessSecurity', '#Nigeria'],
  ARRAY['Customer testimonial video', 'Before/after security footage', 'Mobile app demo'],
  'draft',
  NOW(),
  NOW()
);

-- ============================================================================
-- STEP 5: Add Scheduled Posts
-- ============================================================================

INSERT INTO scheduled_posts (
  workspace_id,
  platform,
  content,
  scheduled_at,
  status,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'instagram',
  'Secure your business with our CCTV services! From Lagos to Port Harcourt. Contact us today! #BusinessSecurity #Nigeria',
  NOW() + INTERVAL '1 day',
  'scheduled',
  NOW(),
  NOW()
);

-- ============================================================================
-- STEP 6: Add Connected Accounts
-- ============================================================================

INSERT INTO connected_accounts (
  workspace_id,
  platform,
  account_name,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'instagram',
  '@smithmarketingagency',
  NOW(),
  NOW()
);

-- ============================================================================
-- VERIFICATION: Check if everything was created
-- ============================================================================

-- Run these queries to verify:
-- SELECT COUNT(*) as users_created FROM auth.users WHERE email LIKE '%clipgenius.ai';
-- SELECT business_name FROM workspaces WHERE business_name = 'Smith Marketing Agency';
-- SELECT COUNT(*) as leads_created FROM leads;
-- SELECT COUNT(*) as content_created FROM content WHERE user_id = 'client-demo-uuid-001';