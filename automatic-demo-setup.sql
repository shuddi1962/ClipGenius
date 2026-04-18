-- AUTOMATIC DEMO SETUP - RUN THIS IN INSFORGE SQL EDITOR
-- This script creates complete demo data automatically

-- Create Client User
INSERT INTO auth.users (email, password, email_verified, profile, metadata, is_project_admin, is_anonymous)
VALUES ('client@clipgenius.ai', 'temp_password_123', true,
        '{"full_name": "John Smith", "business_name": "Smith Marketing Agency", "country": "United States", "plan": "pro", "role": "client"}',
        '{"user_type": "client", "onboarding_completed": true}',
        false, false)
ON CONFLICT (email) DO NOTHING;

-- Create Admin User
INSERT INTO auth.users (email, password, email_verified, profile, metadata, is_project_admin, is_anonymous)
VALUES ('admin@clipgenius.ai', 'temp_password_123', true,
        '{"full_name": "Admin User", "role": "admin"}',
        '{"user_type": "admin", "permissions": ["users.manage", "system.admin", "billing.admin"]}',
        true, false)
ON CONFLICT (email) DO NOTHING;

-- Create Workspace
INSERT INTO workspaces (user_id, business_name, business_profile_json, plan)
SELECT id, 'Smith Marketing Agency',
       '{"industry": "Marketing & Advertising", "services": ["Lead Generation", "Content Creation", "Social Media Management"], "location": "Port Harcourt, Nigeria", "target_audience": "Small businesses, startups, entrepreneurs"}',
       'pro'
FROM auth.users WHERE email = 'client@clipgenius.ai'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Add Sample Leads
INSERT INTO leads (workspace_id, source, first_name, last_name, email, phone, company, city, country, score, tier, status, notes)
SELECT w.id, 'Google Search', 'Michael', 'Johnson', 'michael.johnson@techcorp.ng', '+2348012345678', 'TechCorp Nigeria', 'Lagos', 'Nigeria', 85, 'hot', 'qualified', 'Interested in CCTV systems for office security'
FROM workspaces w WHERE w.business_name = 'Smith Marketing Agency'
LIMIT 1;

INSERT INTO leads (workspace_id, source, first_name, last_name, email, phone, company, city, country, score, tier, status, notes)
SELECT w.id, 'Instagram', 'Sarah', 'Williams', 'sarah.williams@startup.ng', '+2348023456789', 'StartupHub', 'Abuja', 'Nigeria', 72, 'warm', 'contacted', 'Looking for solar power solutions'
FROM workspaces w WHERE w.business_name = 'Smith Marketing Agency'
LIMIT 1;

-- Add Sample Content
INSERT INTO content (user_id, business_type, product, audience, captions, hashtags, post_ideas, status)
SELECT u.id, 'Technology', 'CCTV Security Systems', 'Small business owners in Nigeria',
       '["Secure your business 24/7 with CCTV systems!", "Professional installation guaranteed!", "From Lagos to Abuja - we protect businesses!"]',
       '["#CCTV", "#Security", "#BusinessSecurity", "#Nigeria"]',
       '["Customer testimonial video", "Before/after security footage", "Mobile app demo"]',
       'draft'
FROM auth.users u WHERE u.email = 'client@clipgenius.ai'
LIMIT 1;

-- Add Scheduled Post
INSERT INTO scheduled_posts (workspace_id, platform, content, scheduled_at, status)
SELECT w.id, 'instagram', 'Secure your business with our CCTV services! From Lagos to Port Harcourt. Contact us today! #BusinessSecurity #Nigeria',
       NOW() + INTERVAL '1 day', 'scheduled'
FROM workspaces w WHERE w.business_name = 'Smith Marketing Agency'
LIMIT 1;

-- Add Connected Account
INSERT INTO connected_accounts (workspace_id, platform, account_name)
SELECT w.id, 'instagram', '@smithmarketingagency'
FROM workspaces w WHERE w.business_name = 'Smith Marketing Agency'
LIMIT 1;

-- Add User Settings
INSERT INTO user_settings (user_id, company_name, niche, location, tone, target_audience, products, website)
SELECT u.id, 'Smith Marketing Agency', 'Security & Solar Solutions', 'Port Harcourt, Nigeria', 'Professional',
       'Small business owners, entrepreneurs', '["CCTV Installation", "Solar Power Systems", "Security Cameras"]',
       'https://smithmarketingagency.com'
FROM auth.users u WHERE u.email = 'client@clipgenius.ai'
LIMIT 1;

-- ============================================================================
-- VERIFICATION: Check if everything was created successfully
-- ============================================================================

-- Run these queries after setup:
-- SELECT email, profile->>'full_name' as name FROM auth.users WHERE email LIKE '%clipgenius.ai';
-- SELECT business_name FROM workspaces;
-- SELECT COUNT(*) as leads_count FROM leads;
-- SELECT COUNT(*) as content_count FROM content;
-- SELECT COUNT(*) as posts_count FROM scheduled_posts;

-- ============================================================================
-- PASSWORD RESET REQUIRED (IMPORTANT!)
-- ============================================================================
/*
AFTER RUNNING THIS SCRIPT, YOU MUST RESET PASSWORDS IN THE INSFORGE UI:

1. Go to Authentication → Users
2. Find "client@clipgenius.ai" → Click "Reset Password" → Set to: demo123!
3. Find "admin@clipgenius.ai" → Click "Reset Password" → Set to: admin123!

Then you can login to the application at:
https://clip-genius-sigma.vercel.app/

Client Login: client@clipgenius.ai / demo123!
Admin Login: admin@clipgenius.ai / admin123!
*/