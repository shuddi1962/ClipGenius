-- PERFECTLY CORRECTED CLIPGENIUS DEMO SETUP
-- Fixed JSONB columns and auto-generated UUIDs
-- Run this in InsForge SQL Editor

-- ============================================================================
-- STEP 1: Create Demo Users (Auto-generated UUIDs)
-- ============================================================================

-- Create Client User
INSERT INTO auth.users (
  email,
  password,
  email_verified,
  created_at,
  updated_at,
  profile,
  metadata,
  is_project_admin,
  is_anonymous
) VALUES (
  'client@clipgenius.ai',
  '$2b$10$abcdefghijklmnopqrstuv',
  true,
  NOW(),
  NOW(),
  '{"full_name": "John Smith", "business_name": "Smith Marketing Agency", "country": "United States", "plan": "pro", "role": "client"}',
  '{"user_type": "client", "onboarding_completed": true}',
  false,
  false
) ON CONFLICT (email) DO NOTHING;

-- Create Admin User
INSERT INTO auth.users (
  email,
  password,
  email_verified,
  created_at,
  updated_at,
  profile,
  metadata,
  is_project_admin,
  is_anonymous
) VALUES (
  'admin@clipgenius.ai',
  '$2b$10$abcdefghijklmnopqrstuv',
  true,
  NOW(),
  NOW(),
  '{"full_name": "Admin User", "role": "admin"}',
  '{"user_type": "admin", "permissions": ["users.manage", "system.admin", "billing.admin"]}',
  true,
  false
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 2: Create Workspace
-- ============================================================================

INSERT INTO workspaces (
  user_id,
  business_name,
  business_profile_json,
  plan,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'client@clipgenius.ai' LIMIT 1),
  'Smith Marketing Agency',
  '{"industry": "Marketing & Advertising", "services": ["Lead Generation", "Content Creation"], "location": "Port Harcourt, Nigeria"}',
  'pro',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 3: Add Sample Leads
-- ============================================================================

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
-- STEP 4: Add Sample Content (Fixed JSONB format)
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
  (SELECT id FROM auth.users WHERE email = 'client@clipgenius.ai' LIMIT 1),
  'Technology',
  'CCTV Security Systems',
  'Small business owners in Nigeria',
  '["Secure your business 24/7 with CCTV systems!", "Professional installation guaranteed!", "From Lagos to Abuja - we protect businesses!"]',
  '["#CCTV", "#Security", "#BusinessSecurity", "#Nigeria"]',
  '["Customer testimonial video", "Before/after security footage", "Mobile app demo"]',
  'draft',
  NOW(),
  NOW()
);

-- ============================================================================
-- STEP 5: Add Scheduled Post
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
-- STEP 6: Add Connected Account
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
-- STEP 7: Add User Settings
-- ============================================================================

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
  (SELECT id FROM auth.users WHERE email = 'client@clipgenius.ai' LIMIT 1),
  'Smith Marketing Agency',
  'Security & Solar Solutions',
  'Port Harcourt, Nigeria',
  'Professional',
  'Small business owners, entrepreneurs',
  '["CCTV Installation", "Solar Power Systems", "Security Cameras"]',
  'https://smithmarketingagency.com',
  NOW(),
  NOW()
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check users: SELECT email, profile->>'full_name' as name FROM auth.users WHERE email LIKE '%clipgenius.ai';
-- Check workspace: SELECT business_name FROM workspaces WHERE business_name = 'Smith Marketing Agency';
-- Check leads: SELECT COUNT(*) as leads_count FROM leads;
-- Check content: SELECT captions, hashtags FROM content LIMIT 1;
-- Check posts: SELECT COUNT(*) as posts_count FROM scheduled_posts;