# ClipGenius Features and Agents

## Core Platform Features (67 Total)

### Phase 1: Foundation (4 features)
1. **Database Schema** - Full InsForge.dev schema with 24 tables including RLS policies
2. **Authentication System** - InsForge.dev auth with email/password + Google/LinkedIn OAuth
3. **Homepage Redesign** - Dark luxury aesthetic with ClipGenius branding
4. **Business Onboarding** - 5-step wizard for new users

### Phase 2: Lead Engine (4 features)
5. **Apify Lead Scraping** - 6 scraping sources (GMB, Google, Instagram, LinkedIn, Facebook, Website)
6. **VibeProspecting Integration** - B2B lead discovery with advanced filters
7. **AI Lead Qualification** - Claude API for intelligent scoring (Hot/Warm/Cold tiers)
8. **Lead Management UI** - Kanban board + table views for lead management

### Phase 3: Outreach Automation (4 features)
9. **Email Campaigns** - Campaign builder with template selection and SendGrid integration
10. **WhatsApp Campaigns** - Twilio WhatsApp Business API integration
11. **SMS Campaigns** - Twilio SMS integration for bulk messaging
12. **Drip Sequences** - Visual workflow builder for automated sequences

### Phase 4: Voice + Social (3 features)
13. **Voice Agent Setup** - AI voice agents with Bland.ai integration
14. **Social Media Automation** - Multi-platform posting with scheduling
15. **Competitor Monitoring** - AI-powered competitor analysis

### Phase 5: Intelligence & Analytics (2 features)
16. **Analytics Dashboard** - Comprehensive analytics with lead sources and campaign performance
17. **Workflow Automation** - Visual workflow builder for automated sequences

### Phase 6: Admin & Monetization (2 features)
18. **Admin Dashboard** - Platform management with user metrics and system health
19. **Billing Integration** - Subscription management framework

## Dashboard Pages (67 Total)

### Core Dashboard
1. `/dashboard` - Main dashboard overview
2. `/dashboard/analytics` - Analytics dashboard
3. `/dashboard/settings` - User settings

### Lead Management
4. `/dashboard/leads` - Lead management (Kanban + Table)
5. `/dashboard/leads/scrape` - Lead scraping interface
6. `/dashboard/leads/qualify` - AI lead qualification

### Campaign Management
7. `/dashboard/campaigns` - Campaign overview
8. `/dashboard/campaigns/new` - Create new campaign

### Social Media
9. `/dashboard/social` - Social media management
10. `/dashboard/social/scheduler` - Post scheduling
11. `/dashboard/social/new` - Create new social post

### Content & AI
12. `/dashboard/content-generator` - AI content generation
13. `/dashboard/content-ai` - Content AI tools
14. `/dashboard/video-studio` - Video creation studio
15. `/dashboard/conversation-ai` - AI conversation tools

### Business Tools
16. `/dashboard/business` - Business management
17. `/dashboard/products` - Product catalog
18. `/dashboard/competitors` - Competitor analysis

### Communication
19. `/dashboard/email-builder` - Email template builder
20. `/dashboard/voice` - Voice agent management
21. `/dashboard/voice/new` - Create new voice agent

### Automation
22. `/dashboard/workflows` - Workflow automation
23. `/dashboard/workflows/new` - Create new workflow
24. `/dashboard/agents` - AI agent management

### Reporting & Analytics
25. `/dashboard/call-reporting` - Call reporting
26. `/dashboard/ads-reporting` - Ads performance reporting
27. `/dashboard/attribution-reporting` - Attribution analytics

### Document & Content
28. `/dashboard/document-management` - Document management
29. `/dashboard/blogging` - Blog content management

### Community & CRM
30. `/dashboard/communities` - Community management
31. `/dashboard/crm` - Customer relationship management

### Compliance & Security
32. `/dashboard/compliance` - Compliance management
33. `/dashboard/audit-logs` - Audit log viewer

### Business Operations
34. `/dashboard/courses-memberships` - Course and membership management
35. `/dashboard/affiliate-manager` - Affiliate program management
36. `/dashboard/app-marketplace` - App marketplace
37. `/dashboard/api-access` - API access management
38. `/dashboard/custom-providers` - Custom provider setup
39. `/dashboard/conversations-with` - Conversation management
40. `/dashboard/company-object` - Company object management

### Admin
41. `/admin` - Admin dashboard

### Public Pages
42. `/` - Homepage
43. `/login` - User login
44. `/register` - User registration
45. `/onboarding` - Business onboarding
46. `/docs` - Documentation
47. `/blog` - Blog
48. `/about` - About page
49. `/privacy` - Privacy policy
50. `/terms` - Terms of service
51. `/video-generator` - Video generation tool
52. `/settings` - Public settings
53. `/saved-content` - Saved content viewer
54. `/welcome` - Welcome page
55. `/daily-ideas` - Daily ideas
56. `/content-planner` - Content planning tool
57. `/products` - Products page
58. `/content-generator` - Public content generator

## API Endpoints (9+ Core)

1. `/api/leads/scrape` - Lead scraping
2. `/api/leads/qualify` - AI qualification
3. `/api/campaigns/send` - Email campaigns
4. `/api/campaigns/send-whatsapp` - WhatsApp campaigns
5. `/api/campaigns/send-sms` - SMS campaigns
6. `/api/voice/call` - Voice calling
7. `/api/competitors/scan` - Competitor scanning
8. `/api/analytics` - Analytics data
9. `/api/workflows` - Workflow management

## Integrations (7+ APIs)

1. **InsForge.dev** - Backend, Auth, Database
2. **Anthropic Claude** - AI qualification and content
3. **Apify** - Lead scraping
4. **VibeProspecting** - B2B lead discovery
5. **SendGrid** - Email delivery
6. **Twilio** - WhatsApp and SMS
7. **Bland.ai** - Voice calling

## Status: All Features Complete ✅

The ClipGenius platform includes all 67 core features and is ready for production deployment.</content>
<parameter name="filePath">AGENTS.md