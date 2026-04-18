-- CORRECTED CLIPGENIUS DEMO SETUP
-- Fixed UUID generation and table structure
-- Run this in InsForge SQL Editor

-- ============================================================================
-- STEP 1: Create Demo Users (Auto-generated UUIDs)
-- ============================================================================

-- Create Client User (let PostgreSQL generate UUID)
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
  '$2b$10$abcdefghijklmnopqrstuv', -- Placeholder hash - will be reset via UI
  true,
  NOW(),
  NOW(),
  '{"full_name": "John Smith", "business_name": "Smith Marketing Agency", "country": "United States", "plan": "pro", "role": "client"}',
  '{"user_type": "client", "onboarding_completed": true}',
  false,
  false
) ON CONFLICT (email) DO NOTHING;

-- Create Admin User (let PostgreSQL generate UUID)
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
  '$2b$10$abcdefghijklmnopqrstuv', -- Placeholder hash - will be reset via UI
  true,
  NOW(),
  NOW(),
  '{"full_name": "Admin User", "role": "admin"}',
  '{"user_type": "admin", "permissions": ["users.manage", "system.admin", "billing.admin"]}',
  true,
  false
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 2: Create Workspace (Reference by user lookup)
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
  (SELECT id FROM auth.users WHERE email = 'client@clipgenius.ai' LIMIT 1),
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
-- VERIFICATION QUERIES (Run these after setup)
-- ============================================================================

-- Check users were created:
-- SELECT email, profile->>'full_name' as name, id FROM auth.users WHERE email LIKE '%clipgenius.ai';

-- Check workspace exists:
-- SELECT business_name, plan FROM workspaces WHERE business_name = 'Smith Marketing Agency';

-- Check leads count:
-- SELECT COUNT(*) as leads_count FROM leads;

-- Check content exists:
-- SELECT COUNT(*) as content_count FROM content WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'client@clipgenius.ai');

-- ============================================================================
-- PASSWORD RESET INSTRUCTIONS
-- ============================================================================

/*
After running this script, you MUST reset passwords in the InsForge UI:

1. Go to Authentication → Users
2. Find "client@clipgenius.ai" → Click "Reset Password" → Set to: demo123!
3. Find "admin@clipgenius.ai" → Click "Reset Password" → Set to: admin123!

Then you can login to the application at:
https://clip-genius-sigma.vercel.app/

Client Login:
- Email: client@clipgenius.ai
- Password: demo123!

Admin Login:
- Email: admin@clipgenius.ai
- Password: admin123!
*/