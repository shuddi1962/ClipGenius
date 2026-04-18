-- COMPLETE CLIPGENIUS DATABASE SCHEMA
-- Run this entire script in your InsForge SQL Editor
-- URL: https://wk49fyqm.us-east.insforge.app

-- ============================================================================
-- 1. AUTH USERS SETUP (Demo Accounts)
-- ============================================================================

-- Create Client Demo Account
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
  '{
    "full_name": "John Smith",
    "business_name": "Smith Marketing Agency",
    "country": "United States",
    "plan": "pro",
    "role": "client"
  }'
) ON CONFLICT (email) DO NOTHING;

-- Create Admin Demo Account
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
  '{
    "full_name": "Admin User",
    "role": "admin",
    "permissions": ["users.manage", "system.admin", "billing.admin"]
  }'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 2. WORKSPACE SETUP
-- ============================================================================

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
    "services": ["Lead Generation", "Content Creation", "Social Media Management", "Email Marketing", "PPC Advertising"],
    "location": "Port Harcourt, Nigeria",
    "target_audience": "Small businesses, startups, entrepreneurs in Nigeria",
    "niche": "B2B Marketing & Technology Solutions",
    "products": ["CCTV Installation", "Solar Power Solutions", "Security Systems", "Digital Marketing Services"],
    "company_size": "Small Business (5-20 employees)",
    "tone": "Professional yet approachable",
    "brand_colors": ["#1a365d", "#2b77e6", "#fbbf24"],
    "website": "https://smithmarketingagency.com",
    "social_media": {
      "instagram": "@smithmarketingagency",
      "facebook": "Smith Marketing Agency",
      "linkedin": "smith-marketing-agency"
    },
    "competitors": ["TechCorp Nigeria", "Digital Solutions NG", "Marketing Masters"]
  }',
  'pro',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. SAMPLE LEADS DATA
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
  qualified_data,
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
  'CEO of TechCorp Nigeria, interested in CCTV systems for their new office building. Budget: ₦2-3M. Timeline: 2-3 months.',
  '{
    "company_size": "50-100 employees",
    "industry": "Technology",
    "decision_maker": true,
    "budget_range": "High",
    "timeline": "Medium",
    "pain_points": ["Security", "Employee safety", "Asset protection"]
  }',
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
  78,
  'hot',
  'contacted',
  'Co-founder of StartupHub, looking for solar power solutions for their co-working space. Previously worked with a competitor.',
  '{
    "company_size": "20-50 employees",
    "industry": "Real Estate",
    "decision_maker": true,
    "budget_range": "Medium-High",
    "timeline": "Short",
    "pain_points": ["Energy costs", "Sustainability", "Brand image"]
  }',
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
  'Brown Construction Ltd',
  'Port Harcourt',
  'Nigeria',
  72,
  'warm',
  'new',
  'Operations Manager at Brown Construction, interested in security systems for multiple construction sites.',
  '{
    "company_size": "100+ employees",
    "industry": "Construction",
    "decision_maker": false,
    "budget_range": "High",
    "timeline": "Long",
    "pain_points": ["Site security", "Equipment protection", "Worker safety"]
  }',
  NOW() - INTERVAL '1 day',
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'Facebook Groups',
  'Grace',
  'Okafor',
  'grace.okafor@hospital.ng',
  '+2348045678901',
  'City General Hospital',
  'Enugu',
  'Nigeria',
  65,
  'warm',
  'new',
  'Procurement Officer at City General Hospital, researching security systems for patient safety.',
  '{
    "company_size": "200+ employees",
    "industry": "Healthcare",
    "decision_maker": false,
    "budget_range": "High",
    "timeline": "Medium",
    "pain_points": ["Patient security", "Medical equipment protection", "Emergency response"]
  }',
  NOW() - INTERVAL '3 days',
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'VibeProspecting',
  'Emmanuel',
  'Adebayo',
  'emmanuel.adebayo@school.ng',
  '+2348056789012',
  'Lagos International School',
  'Lagos',
  'Nigeria',
  58,
  'cold',
  'new',
  'IT Director at Lagos International School, exploring solar solutions for sustainable campus energy.',
  '{
    "company_size": "150-200 employees",
    "industry": "Education",
    "decision_maker": false,
    "budget_range": "Medium",
    "timeline": "Long",
    "pain_points": ["Energy costs", "Environmental responsibility", "Educational brand"]
  }',
  NOW() - INTERVAL '5 days',
  NOW()
);

-- ============================================================================
-- 4. SAMPLE CONTENT & SOCIAL MEDIA
-- ============================================================================

-- Sample Content
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
    '🔒 Secure your business 24/7 with our advanced CCTV systems! Professional installation, reliable monitoring, peace of mind guaranteed. From Lagos to Abuja, we protect Nigerian businesses! 🇳🇬 #SecurityFirst',
    '🏢 Transform your workplace security with cutting-edge surveillance technology. HD cameras, night vision, mobile app access. Your business deserves the best protection! 💪',
    '⚡ Lightning-fast installation, unbeatable customer service. Join hundreds of satisfied Nigerian businesses already protected by our CCTV solutions. Ready to secure your future? 📞'
  ],
  ARRAY['#CCTV', '#Security', '#BusinessSecurity', '#Nigeria', '#PortHarcourt', '#Lagos', '#Abuja', '#TechSecurity'],
  ARRAY[
    'Customer testimonial video: "How our CCTV system prevented a break-in"',
    'Before/after comparison showing system effectiveness',
    'Live demo of mobile app monitoring features',
    'Q&A session about choosing the right security system',
    'Behind-the-scenes installation process'
  ],
  'draft',
  NOW(),
  NOW()
);

-- Sample Scheduled Posts
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
  '🔒 Secure your business 24/7 with our professional CCTV installation services! From Lagos to Port Harcourt, we provide reliable security solutions for Nigerian businesses. Contact us today for a free consultation! 📞\n\n#BusinessSecurity #Nigeria #CCTV #PortHarcourt #Lagos',
  NOW() + INTERVAL '1 day',
  'scheduled',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'facebook',
  '🌞 Go green and save money with our solar power solutions! Perfect for Nigerian businesses looking to reduce energy costs and environmental impact. Professional installation available across Nigeria.\n\nBenefits:\n✅ Reduce electricity bills by up to 80%\n✅ Government incentives available\n✅ 25-year warranty on panels\n✅ Professional maintenance services\n\nReady to power your business sustainably? Contact us today! ☀️\n\n#SolarPower #Nigeria #SustainableEnergy #BusinessSolutions',
  NOW() + INTERVAL '2 days',
  'scheduled',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'linkedin',
  '🚀 Digital Marketing Excellence in Nigeria\n\nIn today\'s competitive landscape, your business needs more than just a website—it needs a comprehensive digital presence that drives results.\n\nOur services include:\n• SEO optimization\n• Social media management\n• PPC advertising\n• Content marketing\n• Email campaigns\n\nServing businesses across Nigeria with measurable ROI. Let\'s discuss how we can grow your business online.\n\n#DigitalMarketing #Nigeria #BusinessGrowth #SEO #PPC',
  NOW() + INTERVAL '3 days',
  'scheduled',
  NOW(),
  NOW()
);

-- ============================================================================
-- 5. CONNECTED ACCOUNTS
-- ============================================================================

INSERT INTO connected_accounts (
  workspace_id,
  platform,
  account_name,
  access_token,
  refresh_token,
  expires_at,
  created_at,
  updated_at
) VALUES
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'instagram',
  '@smithmarketingagency',
  '[MOCK_TOKEN_INSTAGRAM]',
  '[MOCK_REFRESH_TOKEN]',
  NOW() + INTERVAL '60 days',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'facebook',
  'Smith Marketing Agency',
  '[MOCK_TOKEN_FACEBOOK]',
  '[MOCK_REFRESH_TOKEN]',
  NOW() + INTERVAL '60 days',
  NOW(),
  NOW()
),
(
  (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency' LIMIT 1),
  'linkedin',
  'smith-marketing-agency',
  '[MOCK_TOKEN_LINKEDIN]',
  '[MOCK_REFRESH_TOKEN]',
  NOW() + INTERVAL '60 days',
  NOW(),
  NOW()
);

-- ============================================================================
-- 6. USER SETTINGS & PREFERENCES
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
  'client-demo-uuid-001',
  'Smith Marketing Agency',
  'Security & Solar Solutions',
  'Port Harcourt, Nigeria',
  'Professional',
  'Small business owners, entrepreneurs, decision-makers',
  ARRAY['CCTV Installation', 'Solar Power Systems', 'Security Cameras', 'Digital Marketing', 'Consultation Services'],
  'https://smithmarketingagency.com',
  NOW(),
  NOW()
);

-- ============================================================================
-- 7. SAMPLE PROJECTS
-- ============================================================================

INSERT INTO projects (
  user_id,
  name,
  type,
  description,
  status,
  created_at,
  updated_at
) VALUES (
  'client-demo-uuid-001',
  'Q2 2025 Marketing Campaign',
  'marketing',
  'Comprehensive marketing campaign targeting Lagos business owners for CCTV and solar solutions',
  'active',
  NOW(),
  NOW()
),
(
  'client-demo-uuid-001',
  'TechCorp Nigeria Partnership',
  'sales',
  'Lead qualification and follow-up for TechCorp Nigeria CCTV project',
  'active',
  NOW(),
  NOW()
);

-- ============================================================================
-- 8. SAMPLE ASSETS (Mock Data)
-- ============================================================================

INSERT INTO assets (
  user_id,
  filename,
  file_url,
  file_type,
  file_size,
  created_at
) VALUES (
  'client-demo-uuid-001',
  'cctv-installation-guide.pdf',
  'https://wk49fyqm.storage.insforge.app/assets/cctv-guide.pdf',
  'application/pdf',
  2048000,
  NOW()
),
(
  'client-demo-uuid-001',
  'solar-power-brochure.jpg',
  'https://wk49fyqm.storage.insforge.app/assets/solar-brochure.jpg',
  'image/jpeg',
  1024000,
  NOW()
);

-- ============================================================================
-- VERIFICATION QUERIES (Run these after setup to verify)
-- ============================================================================

-- Check users were created
-- SELECT id, email, raw_user_meta_data->>'full_name' as name FROM auth.users WHERE email LIKE '%clipgenius.ai';

-- Check workspace was created
-- SELECT id, business_name, plan FROM workspaces WHERE business_name = 'Smith Marketing Agency';

-- Check leads were added
-- SELECT COUNT(*) as total_leads FROM leads WHERE workspace_id IN (SELECT id FROM workspaces WHERE business_name = 'Smith Marketing Agency');

-- Check content was added
-- SELECT COUNT(*) as total_content FROM content WHERE user_id = 'client-demo-uuid-001';