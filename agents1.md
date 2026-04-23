# NEXUS — Ultimate Production-Ready All-In-One SaaS Platform
## Final Build Prompt for Claude Code
### Backend: InsForge | Frontend: Next.js 15 | Multi-Tenant | Admin + User Dashboards | Ads Management | Marketing OS

---

> **CLAUDE CODE INSTRUCTIONS:** Read this entire prompt before writing a single line of code.
> Build each phase sequentially. The backend uses **InsForge exclusively** — never Supabase, Firebase, MongoDB, or Prisma.
> Two completely separate dashboards: **Admin** (controls everything) and **User** (uses the platform).
> All third-party API keys are entered by the **Admin only** — never by users, never hardcoded, never during build time.
> Every feature must work end-to-end. No mock data. No placeholder functions. No "coming soon" screens.
> The UI must look and feel like a real, premium, production SaaS product — not AI-generated, not generic, not template-looking.
> The marketing homepage must look like a world-class SaaS landing page (think Linear, Vercel, Notion combined).

---

## ═══════════════════════════════════════════════
## VIBE CODING RULES — READ BEFORE WRITING ANY CODE
## ═══════════════════════════════════════════════

These rules prevent the "AI slop" appearance. Every engineer on this project must follow them.

### Typography Rules
- **Primary font**: Instrument Sans (headlines, UI labels, body)
- **Accent font**: Fraunces (hero headlines, pull quotes, feature section headings only)
- **Never use**: Inter, Roboto, system-ui, -apple-system, or any default sans-serif
- Font weights: 400 (body), 500 (labels/nav), 600 (subheadings), 700 (headings only)
- Letter spacing: headlines `tracking-tight` (-0.02em), body `tracking-normal`

### Color System — Custom Design Tokens
```css
/* Base palette — warm, not cold */
--nexus-bg:           #FAFAF8;      /* Warm off-white, never pure #FFFFFF */
--nexus-bg-secondary: #F4F3F0;      /* Cards, input backgrounds */
--nexus-bg-tertiary:  #EEECEA;      /* Hover states, dividers */
--nexus-surface:      #FFFFFF;      /* Elevated cards */
--nexus-border:       rgba(0,0,0,0.08);  /* Default borders */
--nexus-border-strong:rgba(0,0,0,0.15);  /* Focused borders */

/* Brand colors */
--nexus-accent:       #1A1A2E;      /* Deep navy — primary brand */
--nexus-accent-2:     #16213E;      /* Darker navy */
--nexus-blue:         #0652DD;      /* Action blue */
--nexus-blue-light:   #EFF4FF;      /* Blue tint backgrounds */
--nexus-violet:       #6C47FF;      /* Feature highlights */
--nexus-violet-light: #F3EFFF;      /* Violet tint backgrounds */
--nexus-green:        #12A150;      /* Success, positive metrics */
--nexus-amber:        #D97706;      /* Warnings */
--nexus-red:          #DC2626;      /* Errors, negative */

/* Text */
--nexus-text-primary:   #0A0A0A;    /* Almost black, not pure black */
--nexus-text-secondary: #525252;    /* Secondary text */
--nexus-text-tertiary:  #8A8A8A;    /* Placeholder, hints */
--nexus-text-inverse:   #FAFAF8;    /* Text on dark backgrounds */
```

### Texture & Depth Rules
- Add subtle grain texture to hero sections: `background-image: url("data:image/svg+xml,...")` — SVG noise filter at 3% opacity
- Shadows must be intentional: use custom shadows, not Tailwind defaults
  ```css
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-lg:  0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05);
  --shadow-xl:  0 24px 64px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06);
  ```
- Cards have `border: 1px solid var(--nexus-border)` — never box-shadow only
- Hover: translate Y by -1px or -2px + shadow deepens — not color change alone

### Layout Rules
- Base spacing unit: 4px. All spacing is multiples of 4
- Section padding: 96px vertical on desktop, 64px on tablet, 48px on mobile
- Max content width: 1280px (dashboard), 1440px (homepage)
- Column gutter: 24px
- Never use full-bleed white backgrounds in sections — alternate between `--nexus-bg` and `--nexus-bg-secondary`
- No purple gradients. No rainbow gradients. Gradients only in specific cases: subtle angle from `--nexus-bg` to `--nexus-bg-secondary`

### Component Rules
- Buttons: 36px height (sm), 40px (md/default), 48px (lg). Rounded: 8px
- Inputs: 40px height, `border-radius: 8px`, focus ring is `--nexus-blue` at 2px offset
- All dropdowns are `<select>` styled with custom CSS or Radix UI Select — never radio buttons or cards for model selection
- Navigation is sticky, with glass blur on scroll: `backdrop-filter: blur(12px); background: rgba(250,250,248,0.9);`
- Sidebar sections have visual grouping with 4px left border accent, not just label text
- Every loading state shows a skeleton, not a spinner unless <300ms operation
- Modals use `backdrop-filter: blur(4px)` behind them

### Animation Rules
- Framer Motion only — no raw CSS transitions for page-level animations
- Page transitions: 200ms fade + 8px upward translate
- Hover states: 150ms ease-out
- Skeleton loading: pulse animation, 1.5s cycle
- 3D effects on homepage: subtle `perspective(1000px) rotateX(2deg)` on dashboard preview images
- Dashboard cards on homepage: stagger animation on scroll, 50ms delay between cards
- Analytics charts on homepage: draw-on animation when they enter viewport
- Never animate layout properties (width, height) — only transform and opacity

### Image Rules
- Dashboard/app screenshots on homepage: use free stock from Unsplash, Pexels, Unsplash API
  - Fetch via: `https://source.unsplash.com/1600x900/?dashboard,analytics,business`
  - Or use Pexels API (free): `https://api.pexels.com/v1/search?query=business+dashboard`
  - Apply subtle dark overlay + rounded corners + shadow on these images
- For hero section background: abstract geometric shapes in brand colors, not photos
- All product screenshots in feature sections: use `aspect-ratio: 16/9` containers with `object-fit: cover`
- Team/people images (testimonials): Unsplash person photos
- Never use placeholder images in production build

### Code Quality Rules
- TypeScript strict mode: `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`
- No `any` types — use `unknown` and type guards
- No inline styles (except dynamic values in style prop)
- Components under 200 lines — split if larger
- All API calls wrapped in try/catch with proper error typing
- Console.log is banned in production code — use pino logger
- Environment variables validated at startup via Zod schema

---

## ═══════════════════════════════════════════════
## PART 0: WHAT THIS PLATFORM IS
## ═══════════════════════════════════════════════

Nexus is a **multi-tenant SaaS platform** — the operating system for modern businesses. It replaces 55+ separate tools with one unified dashboard. Serving marketers, agencies, e-commerce businesses, dropshippers, content creators, and SaaS companies.

**Category Summary:**
- **CRM & Sales** — contacts, pipelines, appointments, invoices, proposals, phone system
- **Marketing** — email, SMS, WhatsApp, social media, SEO, content creation, multi-platform ad management
- **Creative Studio** — image generation, video editor, UGC ads, design canvas, music creation, presentations
- **Intelligence** — product research, ad spy, competitor analysis, keyword research, backlinks, site audits
- **Automation** — chatbots, workflow builder, voice AI, auto-indexing, site manager
- **Commerce** — online store, payment processing, memberships, courses, affiliate management
- **Advertising** — manage Meta, Google, TikTok, Twitter, LinkedIn, Snapchat, Pinterest, YouTube ads end-to-end
- **Infrastructure** — white-label SaaS mode, embeddable widgets, code builder, reporting

**Critical Design Philosophy:**
1. This is NOT an AI-themed product. It's a business platform that uses AI under the hood. Feature names: "Content Writer" not "AI Content Writer", "Image Studio" not "AI Image Generator".
2. UI feels like Notion meets Linear meets Stripe — clean, professional, intentional.
3. Every model/engine selector is a **dropdown select** component — never radio buttons, cards, or pills.
4. Source images are fetched from original URLs first, lightly modified. Generate only when no source image exists.
5. All API keys are admin-only, AES-256 encrypted in InsForge.
6. The marketing homepage is world-class: 3D animations, real dashboard screenshots/mockups, animated analytics charts, professional sections.

---

## ═══════════════════════════════════════════════
## PART 1: TECH STACK
## ═══════════════════════════════════════════════

### Backend
```
Runtime:             Node.js 22 LTS
Language:            TypeScript (strict mode)
Framework:           Fastify 5
Database:            InsForge (exclusive — PostgreSQL, JWT auth, S3 storage, edge functions)
Queue:               BullMQ + Redis 7
Scheduler:           node-cron
WebSockets:          Socket.io 4
Auth:                jsonwebtoken + bcrypt + InsForge JWT
HTTP:                axios + got
Browser automation:  Playwright (scraping, site manager)
Parsing:             cheerio + @mozilla/readability
RSS:                 rss-parser
Images:              sharp + canvas
Video processing:    ffmpeg (via fluent-ffmpeg)
Validation:          zod
Logging:             pino + pino-pretty (dev)
Email:               nodemailer
File upload:         fastify-multipart + InsForge S3
Encryption:          node:crypto (AES-256-GCM)
Testing:             vitest + supertest
Rate limiting:       @fastify/rate-limit
CORS:                @fastify/cors
Helmet:              @fastify/helmet
```

### Frontend
```
Framework:           Next.js 15 (App Router, Server Components)
Language:            TypeScript strict
Styling:             Tailwind CSS 4 + CSS custom properties (design tokens above)
Components:          Radix UI primitives + custom component library
State:               Zustand + TanStack Query v5
Forms:               react-hook-form + zod
Editor:              TipTap 2 (rich text), Monaco (code)
Charts:              Recharts + D3 v7
Video:               React Player + custom timeline editor
Canvas:              Fabric.js 6 (design studio)
DnD:                 @dnd-kit/core + @dnd-kit/sortable
Motion:              Framer Motion 12
Icons:               Lucide React (ONLY — no emoji as icons)
Real-time:           Socket.io client
Fonts:               Instrument Sans (Google Fonts) + Fraunces (Google Fonts)
3D (homepage):       Three.js (particle background, 3D card effects)
Scroll animations:   Intersection Observer API + Framer Motion scroll
```

### Third-Party Integrations (Admin enters keys post-deployment)
```
LLM Gateway:         OpenRouter.ai (300+ models — all available, auto-updated)
Multi-Modal:         Kie.ai (ALL available models — Veo, Runway, Wan, Kling, Flux, Suno, etc.)
SEO Data:            DataForSEO
Email:               Mailgun / SendGrid / custom SMTP
SMS/Voice:           Twilio
WhatsApp:            WhatsApp Business API / 360dialog
Payments:            Stripe, Paystack, Flutterwave, NOWPayments
Search Indexing:     Google Search Console API, Bing IndexNow API
Social Auth:         Facebook, Instagram, TikTok, LinkedIn, Twitter/X APIs
Ads Management:      Meta Ads API, Google Ads API, TikTok Ads API, Twitter Ads API,
                     LinkedIn Campaign Manager API, Snapchat Marketing API,
                     Pinterest Ads API, YouTube Ads API (Google), Amazon Ads API
Calendar:            Google Calendar API, Outlook Calendar API
Storage:             InsForge S3 (primary), Cloudflare R2 (CDN)
Scraping:            Apify (Google Maps, LinkedIn, Instagram, TikTok, Facebook, Web)
Lead Enrichment:     ZeroBounce / NeverBounce / Hunter.io / Clearbit
Domains:             Namecheap API / GoDaddy API / Cloudflare Registrar API
Stock Images:        Unsplash API + Pexels API (for homepage, presentations, articles)
```

---

## ═══════════════════════════════════════════════
## PART 2: MARKETING HOMEPAGE (Public-Facing Website)
## ═══════════════════════════════════════════════

Route: `/` — completely separate layout from dashboard. This is what prospects see first.

### Homepage Architecture

```
/                    — Main landing page
/pricing             — Pricing plans (full feature comparison)
/features            — All features overview
/features/[slug]     — Individual feature deep-dive
/use-cases/[slug]    — Agency, E-commerce, Creator, SaaS
/blog                — Blog (uses Content Writer module)
/changelog           — Product updates
/about               — About page
/contact             — Contact / demo booking
/login               — Login page
/register            — Registration / trial signup
/legal/privacy       — Privacy Policy
/legal/terms         — Terms of Service
```

### Navigation Bar

**Sticky, glass-effect on scroll. Logo left, nav center, CTA right.**

```
[NEXUS LOGO]    Products ▾    Solutions ▾    Pricing    Resources ▾    [Login]  [Start Free Trial →]
```

Products mega-menu (full-width dropdown):
- Column 1: CRM & Sales (Contacts, Pipelines, Inbox, Prospecting)
- Column 2: Marketing (Content, SEO, Social, Email, SMS, Ads)
- Column 3: Creative (Design Studio, Image, Video, Music)
- Column 4: Commerce (Store, Product Research, Payments)
- Each item has a small Lucide icon, title, and one-line description

Solutions dropdown:
- For Agencies
- For E-commerce
- For Creators
- For SaaS Companies
- For Dropshippers

Resources dropdown:
- Blog, Documentation, API Reference, Changelog, Status

**Logo**: NEXUS wordmark in Fraunces, deep navy. Small geometric mark (abstract N shape).

### Section 1: Hero

**Full-viewport height. Dark navy background. Animated particle field (Three.js). Subtle grid overlay.**

Layout: Centered, max-width 900px

```
[Badge: "Rated #1 All-in-One Business Platform"]

The Operating System
for Modern Business

[Fraunces headline, 72px desktop / 48px mobile]

Replace 55+ tools with one platform. CRM, marketing,
creative studio, advertising, automation — all connected.

[Instrument Sans, 20px, --nexus-text-tertiary on dark bg]

[Start Free 14-Day Trial]  [Watch Demo →]
[Primary CTA: --nexus-blue, 48px height]   [Ghost CTA]

─────────────────────────────────────────
Trusted by 12,000+ businesses worldwide
[Logo strip: 6 company logos, grayscale, opacity 60%]
─────────────────────────────────────────

[HERO DASHBOARD IMAGE]
— 3D perspective: perspective(1200px) rotateX(8deg)
— Real Unsplash dashboard photo + overlay
— Floating analytics cards: animated counters
— Bottom gradient fade into next section
— Shadow: 0 40px 80px rgba(0,0,0,0.4)
```

Floating cards around the dashboard image (animated, stagger in):
- "↑ 247% Revenue Growth" — green badge, bottom-left
- "12,847 Leads Generated" — metric card, top-right
- "AI Content Published: 94" — stats card, bottom-right

### Section 2: Social Proof Bar

Light gray background. Single row, centered.

```
"Nexus replaced our entire marketing stack. We went from 12 tools to 1."
— Sarah K., Marketing Director @ TechCorp

★★★★★  4.9/5 on G2    ★★★★★  4.8/5 on Capterra    1,200+ Reviews
```

### Section 3: Feature Highlights (Bento Grid)

**White background. "Everything your business needs" headline. Bento-grid layout.**

Large bento grid with 6 cells:
- Large cell (2-col): CRM + Inbox — screenshot with contacts list visible
- Medium cell: Content Writer — animated typing effect of article being written
- Medium cell: Ad Manager — mini analytics chart (Chart.js bar chart, animated)
- Small cell: 55+ tools replaced
- Small cell: 300+ AI models
- Large cell (2-col): Design Studio — colorful canvas preview

Each cell:
- Border: 1px solid var(--nexus-border)
- Border-radius: 16px
- Background: white
- Hover: slight shadow increase + Y translate -2px
- Shows actual UI mockup or screenshot, not just text

### Section 4: Ads Management Feature (NEW MAJOR SECTION)

**This deserves its own prominent section. Background: dark navy.**

Headline: "Run every ad platform from one dashboard"
Subheadline: Connect Meta, Google, TikTok, LinkedIn, Twitter — manage campaigns, budgets, creatives, and analytics without switching tabs.

Layout: Left text + right animated dashboard mockup

Left side content:
- Connect accounts with one click
- Launch campaigns in minutes
- Track ROAS across every platform
- Pay for ads directly from Nexus
- 10% commission goes to your ad spend account

Platform logos (animated entry): Meta, Google, TikTok, Twitter/X, LinkedIn, Snapchat, Pinterest, YouTube, Amazon

Feature list:
- ✓ Campaign creation & management
- ✓ Audience targeting & custom audiences
- ✓ Creative library & ad variations
- ✓ Budget management & pacing
- ✓ Real-time performance analytics
- ✓ Cross-platform attribution
- ✓ Automated rules & optimization
- ✓ Billing consolidation
- ✓ ROI & ROAS tracking dashboard

Right side: Animated dashboard showing a live analytics chart (Recharts line chart with gradient, animates on scroll)

### Section 5: Animated Stats Section

**Background: subtle gradient, --nexus-bg to --nexus-bg-secondary.**

4 large animated counter stats (count up when entering viewport):
- 55+ Tools Replaced
- 300+ AI Models
- 10M+ Leads Generated
- $2.8B+ Ad Spend Managed

### Section 6: Module Showcase (Tabbed)

Tabs: CRM | Marketing | Creative | Ads | Automation | Commerce

Each tab shows:
- Large product screenshot (Unsplash/Pexels + UI overlay)
- 3-4 feature bullet points
- "Learn more →" link

### Section 7: How It Works

**3 steps, centered, light background.**

1. Connect Your Tools — Import existing data, connect social/ad accounts
2. Build Your Workflow — Set up CRM, content pipeline, automation
3. Watch It Scale — Analytics, AI optimization, multi-channel growth

Visual: Simple animated flow diagram (SVG, drawn on scroll)

### Section 8: Testimonials

**White background. Grid of 6 testimonial cards.**

Each card:
- Avatar (Unsplash person photo, circular)
- 5-star rating
- Quote (2-3 sentences)
- Name, title, company
- Company logo (grayscale)

Cards use masonry-style layout (varying heights). Subtle hover animation.

### Section 9: Pricing Preview

**Section linking to full /pricing page.**

3 plan cards inline:
- Starter: $49/mo
- Pro: $149/mo
- Agency: $349/mo

"Compare all features →" CTA button

### Section 10: Integration Logos

**"Works with 100+ platforms"**

Scrolling marquee of integration logos (CSS scroll animation, infinite loop):
Row 1 (left to right): Meta, Google, Stripe, Shopify, WordPress, Mailchimp, HubSpot, Zapier, Slack, TikTok...
Row 2 (right to left): Twilio, WhatsApp, Zoom, PayPal, Cloudflare, Notion, Linear, Figma, GitHub...

### Section 11: CTA Section

**Dark navy background. Centered.**

```
Start your free 14-day trial

No credit card required. Setup in under 5 minutes.
Cancel anytime.

[Start Free Trial →]  [Book a Demo]
```

### Section 12: Footer

**Dark background (#0A0A0A). Four-column layout.**

```
Col 1: NEXUS logo + 2-line description + social icons (Twitter, LinkedIn, YouTube, Instagram)

Col 2: Products
- CRM & Contacts
- Content Writer
- Ad Manager
- Design Studio
- SEO Engine
- Video Editor
[+ 8 more]

Col 3: Company
- About
- Blog
- Careers
- Press Kit
- Partners
- Affiliate Program
- Status Page
- Changelog

Col 4: Legal & Support
- Documentation
- API Reference
- Help Center
- Contact Us
- Privacy Policy
- Terms of Service
- Cookie Policy
- GDPR

Bottom bar: © 2025 Nexus. All rights reserved. | 🌍 English ▾ | Made with ♥ for marketers worldwide
```

### Pricing Page (/pricing)

**3 tiers + Enterprise. Annual/monthly toggle (saves 20% annually).**

#### Starter — $49/mo ($39/mo annual)
Best for solopreneurs and freelancers
- 1 workspace
- 2,500 contacts
- 5 connected sites
- 50 AI content pieces/mo
- Basic CRM, Email, SMS
- 1 chatbot
- Community support

#### Pro — $149/mo ($119/mo annual)
Most popular — for growing businesses
- 3 workspaces
- 25,000 contacts
- 25 connected sites
- 500 AI content pieces/mo
- 100GB storage
- Full CRM, all marketing channels
- 5 chatbots
- Video editor, Design Studio
- Ad Manager (all platforms)
- Product research & ad intelligence
- Priority email support

#### Agency — $349/mo ($279/mo annual)
For agencies managing multiple clients
- 20 workspaces (sub-accounts)
- 250,000 contacts
- Unlimited connected sites
- Unlimited AI content
- 1TB storage
- Everything in Pro
- White-label platform (custom domain, logo, colors)
- Client reporting & dashboards
- Staff roles (20 team members)
- Dedicated account manager
- SLA: 99.9% uptime

#### Enterprise — Custom
For large teams and platform resellers
- Unlimited workspaces
- Unlimited everything
- Custom API rate limits
- SSO / SAML authentication
- Custom onboarding
- Dedicated infrastructure
- Custom contracts
- Phone support

**Feature comparison table** below cards — full matrix of every feature with ✓/✗ or quantity.

---

## ═══════════════════════════════════════════════
## PART 3: DATABASE SCHEMA (InsForge Collections)
## ═══════════════════════════════════════════════

### Core
```
users                    — id, email, password_hash, name, avatar, role (admin/owner/manager/staff/viewer), plan, email_verified, two_fa_secret, last_login_at, created_at
organizations            — id, name, owner_id, logo, domain, white_label_config{}, settings{}, created_at
org_members              — id, org_id, user_id, role, permissions{}, invited_by, joined_at
sessions                 — id, user_id, token_hash, ip, user_agent, expires_at
api_keys_vault           — id, provider, encrypted_key, label, category, added_by, last_tested_at, test_status, usage_this_month, active
```

### CRM
```
contacts                 — id, org_id, first_name, last_name, email, phone, company, tags[], custom_fields{}, lead_score, source, source_detail, email_verified, phone_verified, lifecycle_stage, assigned_to, created_at
conversations            — id, org_id, contact_id, channel (email/sms/whatsapp/instagram/messenger/call), status, assigned_to, last_message_at
messages                 — id, conversation_id, direction (inbound/outbound), content, attachments[], channel, read, delivered, created_at
pipelines                — id, org_id, name, stages[], color, created_at
opportunities            — id, pipeline_id, contact_id, stage, value, currency, probability, expected_close, assigned_to, notes[], created_at
tasks                    — id, org_id, contact_id, title, description, due_date, priority, assigned_to, completed, completed_at
notes                    — id, contact_id, content, created_by, pinned, created_at
appointments             — id, org_id, contact_id, title, start_time, end_time, location, calendar_id, meeting_link, status, reminder_sent, created_at
```

### Prospecting & Lead Generation
```
prospecting_campaigns    — id, org_id, name, source_type, search_query{}, filters{}, status, leads_found, apify_run_id, created_at
scraped_leads            — id, campaign_id, org_id, raw_data{}, business_name, contact_name, email, email_verified, phone, phone_verified, website, address, social_profiles{}, rating, review_count, industry, enrichment_data{}, lead_score, qualification, imported_to_crm, contact_id, created_at
outreach_sequences       — id, org_id, name, steps[], channels[], status, enrolled_count, replied_count, created_at
outreach_steps           — id, sequence_id, step_number, channel, delay_days, delay_hours, template_content, subject_line, ab_variants[], conditions{}, created_at
outreach_enrollments     — id, sequence_id, contact_id, current_step, status, enrolled_at, last_action_at
outreach_events          — id, enrollment_id, step_id, event_type, channel, created_at
email_verifications      — id, email, status, smtp_check_result, verified_at
dnc_list                 — id, org_id, email, phone, reason, added_at
```

### Content & SEO
```
articles                 — id, org_id, title, slug, content, excerpt, featured_image, images[], status, seo_meta{}, source_url, rewritten_from, model_used, published_to[], scheduled_at, created_at
content_sources          — id, org_id, type (rss/url/manual), url, name, last_fetched, active
seo_audits               — id, org_id, site_url, issues[], score, fixes_applied[], audit_date
indexed_pages            — id, org_id, url, status (indexed/pending/error), engine, submitted_at
connected_sites          — id, org_id, url, platform, credentials_encrypted, mode, health_score
keyword_tracking         — id, org_id, keyword, position, search_volume, difficulty, url, engine, tracked_at
backlink_profiles        — id, org_id, domain, total_backlinks, referring_domains, new_lost[], analyzed_at
```

### Ads Management (NEW)
```
ad_accounts              — id, org_id, platform (meta/google/tiktok/twitter/linkedin/snapchat/pinterest/youtube/amazon), account_id, account_name, credentials_encrypted, status (connected/disconnected/error), currency, timezone, billing_method, connected_at
ad_campaigns             — id, org_id, ad_account_id, platform, external_campaign_id, name, objective, status (active/paused/draft/archived), daily_budget, lifetime_budget, currency, start_date, end_date, targeting{}, bid_strategy, created_at, synced_at
ad_sets                  — id, campaign_id, external_adset_id, name, status, budget, targeting{}, optimization_goal, bid_amount, start_time, end_time, created_at
ads                      — id, ad_set_id, external_ad_id, name, status, creative_id, headline, body_text, cta, destination_url, preview_url, created_at
ad_creatives             — id, org_id, name, type (image/video/carousel/collection), media_urls[], headline, body, cta, used_in_campaigns[], created_at
ad_analytics             — id, ad_account_id, campaign_id, ad_set_id, ad_id, date, impressions, clicks, ctr, cpc, cpm, conversions, conversion_value, roas, spend, reach, frequency, platform, synced_at
ad_audiences             — id, org_id, platform, audience_id, name, type (custom/lookalike/saved), size, source, status, created_at
ad_payments              — id, org_id, ad_account_id, platform, amount, currency, nexus_fee_pct, nexus_fee_amount, status, payment_method, paid_at, external_ref
ad_rules                 — id, org_id, campaign_id, trigger_metric, trigger_condition, trigger_value, action, action_value, active, last_triggered_at
```

### Commerce
```
products                 — id, org_id, name, description, price, cost, images[], variants[], inventory, status
orders                   — id, org_id, contact_id, items[], total, payment_status, fulfillment_status, created_at
product_research         — id, org_id, product_name, source_url, cost, sell_price, margin, orders_monthly, score, trend, saturation, supplier_urls[], saved_at
store_analyses           — id, org_id, url, revenue_estimate, products_found, tech_stack{}, traffic_sources{}, analyzed_at
```

### Creative
```
designs                  — id, org_id, name, type, canvas_data{}, thumbnail, size, created_by, created_at
media_library            — id, org_id, filename, url, type, size_bytes, metadata{}, created_at
video_projects           — id, org_id, name, timeline_data{}, duration, resolution, status, output_url, created_at
music_tracks             — id, org_id, prompt, genre, duration, model_used, url, created_at
presentations            — id, org_id, title, slides[], theme, research_sources[], created_at
```

### Automation
```
chatbots                 — id, org_id, name, flow_data{}, channels[], mode, training_data{}, embed_config{}, active
workflows                — id, org_id, name, trigger, actions[], active, executions_count
workflow_executions      — id, workflow_id, contact_id, status, steps_completed[], started_at, finished_at
scheduled_posts          — id, org_id, content, platform, media[], scheduled_for, status, posted_at
broadcasts               — id, org_id, channel, audience_filter{}, content, sent_count, delivered, opened, clicked, created_at
```

### Billing & Admin
```
subscriptions            — id, org_id, plan, status, gateway, gateway_subscription_id, current_period_start, current_period_end
invoices                 — id, org_id, amount, currency, status, gateway, items[], created_at
usage_tracking           — id, org_id, module, model, tokens_used, cost_usd, created_at
platform_settings        — id, key, value, updated_by, updated_at
plugins                  — id, name, description, version, enabled, config{}, created_by
audit_log                — id, user_id, action, resource, details{}, ip, created_at
```

### Domains & Business
```
domains                  — id, org_id, domain_name, registrar, status, dns_records{}, ssl_status, created_at
hosted_sites             — id, org_id, site_id, domain_id, subdomain, hosting_type, bandwidth_used, ssl_provisioned, created_at
name_searches            — id, org_id, query, industry, style, results[], created_at
generated_logos          — id, org_id, business_name, style, variations[], selected_variant, svg_url, png_url, created_at
brand_kits               — id, org_id, name, logo_url, colors{}, fonts{}, social_assets{}, created_at
user_payment_gateways    — id, org_id, gateway, credentials_encrypted, active, created_at
user_transactions        — id, org_id, gateway, amount, currency, customer_email, status, site_id, created_at
```

---

## ═══════════════════════════════════════════════
## PART 4: ADMIN DASHBOARD
## ═══════════════════════════════════════════════

Route: `/admin/*` — requires `role === 'admin'` at middleware level. Completely separate layout.

### Admin Sidebar
```
OVERVIEW
├── Dashboard
├── Activity Feed

USERS
├── All Users
├── Organizations
├── Staff & Roles

CONFIGURATION
├── API Keys Vault ← CRITICAL
├── Modules & Plans
├── Plugins

REVENUE
├── Billing Overview
├── Transactions
├── Subscriptions
├── Promo Codes

PLATFORM
├── White-Label Settings
├── Email Templates
├── System Settings
├── Maintenance

MONITORING
├── System Health
├── Error Logs
├── API Usage
├── Audit Log
```

### Admin → API Keys Vault

**ALL API keys live here. Users never see this.**

```
CATEGORY: Language Models (LLM)
├── OpenRouter API Key
│   — Fetch available models live from OpenRouter /models endpoint
│   — Models auto-populate in ALL model dropdowns platform-wide
│   — New models appear automatically as OpenRouter adds them
│   — No hardcoded model lists anywhere

CATEGORY: Multi-Modal (Video / Image / Music)
├── Kie.ai API Key
│   — Fetch ALL available models from Kie.ai endpoint
│   — Auto-populate: Image Studio, Video Editor, UGC Ads, Music Creator, Article→Video
│   — New Kie.ai models appear automatically when released
│   — No hardcoded model lists

CATEGORY: SEO & Data
├── DataForSEO API Key + Email (Login)
├── Google Search Console Service Account JSON (file upload)
├── Bing Webmaster Tools API Key

CATEGORY: Email
├── Mailgun API Key + Domain
├── SendGrid API Key
├── Custom SMTP (host, port, user, pass, encryption)

CATEGORY: SMS & Voice
├── Twilio Account SID
├── Twilio Auth Token
├── Twilio Phone Numbers (list, add, remove)

CATEGORY: Messaging
├── WhatsApp Business API (Cloud API credentials)
├── 360dialog API Key
├── Telegram Bot Token
├── Facebook Page Access Token
├── Instagram Access Token

CATEGORY: Social Platforms
├── Facebook App ID + App Secret
├── TikTok Client Key + Client Secret
├── LinkedIn Client ID + Client Secret
├── Twitter/X API Key + Secret + Bearer Token
├── Pinterest App ID + App Secret
├── Snapchat App ID + App Secret
├── YouTube (via Google OAuth credentials)

CATEGORY: Ads Platforms
├── Meta Ads (Facebook) App ID + Secret + System User Token
│   — Connects to: Meta Business Manager, Ad Accounts
├── Google Ads Developer Token + OAuth Credentials
│   — Connects to: Google Ads, YouTube Ads
├── TikTok Ads App ID + Secret
│   — Connects to: TikTok Ads Manager
├── Twitter/X Ads OAuth credentials (same as Twitter API above)
│   — Connects to: Twitter Campaign Manager
├── LinkedIn Ads Client ID + Secret
│   — Connects to: LinkedIn Campaign Manager
├── Snapchat Ads Client ID + Secret
├── Pinterest Ads App ID + Secret
├── Amazon Advertising Client ID + Secret + Profile ID

CATEGORY: Payments (Platform billing)
├── Stripe Secret Key + Webhook Secret
├── Paystack Secret Key + Webhook Secret
├── Flutterwave Secret Key + Webhook Secret
├── NOWPayments API Key + IPN Secret

CATEGORY: Storage & CDN
├── InsForge S3 (auto-configured)
├── Cloudflare R2 (Access Key, Secret, Bucket, Account ID)
├── Cloudflare API Token (for domain routing, SSL)

CATEGORY: Scraping & Data
├── Apify API Token
│   — Powers: Prospecting (Google Maps, LinkedIn, Instagram, TikTok, Facebook, Web)
│   — Powers: Product Research, Ad Intelligence, Domain Checker
├── ZeroBounce API Key (email verification)
├── NeverBounce API Key (alternative)
├── Hunter.io API Key (email finder)
├── Clearbit API Key (company enrichment)

CATEGORY: Calendar & Communication
├── Google Calendar Service Account JSON
├── Outlook OAuth Client ID + Secret
├── Zoom API Key
├── Zoom API Secret

CATEGORY: Domain Management
├── Namecheap API Key
├── Namecheap API Username
├── GoDaddy API Key
├── GoDaddy API Secret
├── Cloudflare Registrar Token

CATEGORY: Analytics & Stock Images
├── Google Analytics Measurement ID
├── Facebook Pixel ID
├── Google Tag Manager ID
├── Unsplash API Access Key
├── Pexels API Key

CATEGORY: Miscellaneous
├── Google Maps API Key
├── Yext API Key
├── Custom (add any key with label, endpoint, notes)
```

Each key entry shows:
- Provider name + logo
- Status badge: Active (green) / Invalid (red) / Untested (gray) / Expired (amber)
- Last tested timestamp
- Usage this month (API calls / cost estimate)
- "Test Connection" button — pings the provider and updates status
- "Regenerate" / "Delete" actions
- Encrypted at storage: "🔒 AES-256 encrypted" badge
- Never returned in plaintext via any API endpoint

---

## ═══════════════════════════════════════════════
## PART 5: USER DASHBOARD SIDEBAR
## ═══════════════════════════════════════════════

Route: `/dashboard/*` — authenticated user with active subscription.

```
CORE
├── Home
├── Contacts & CRM
├── Inbox (Unified)
├── Pipelines
└── Prospecting

MARKETING
├── Content Writer
├── Social Planner
├── Email Marketing
├── SMS Marketing
├── WhatsApp
├── SEO Engine
├── Auto-Indexing
├── Site Manager
├── Keywords
└── Backlinks

ADS MANAGER ← NEW MAJOR MODULE
├── Ad Dashboard
├── Campaigns
├── Ad Sets & Ads
├── Creative Library
├── Audiences
├── Analytics & ROAS
├── Billing & Payments
└── Automated Rules

COMMERCE
├── Product Research
├── Ad Intelligence
├── UGC Ads
├── Online Store
└── Invoices & Payments

CREATIVE
├── Design Studio
├── Image Studio
├── Video Editor
├── Music Creator
├── Presentations
├── Logo Creator
└── Article → Video

AUTOMATION
├── Chatbots
├── Workflows
├── Voice Calls
└── Broadcasting

BUILD
├── Websites & Funnels
├── Hosting & Domains
├── Business Name Generator
├── Calendars
├── Courses & Memberships
├── Reviews & Reputation
├── Code Builder
└── Chat Hub

SYSTEM
├── Reports & Analytics
├── Team & Roles
└── Settings
```

---

## ═══════════════════════════════════════════════
## PART 6: ADS MANAGER MODULE — FULL SPECIFICATION
## ═══════════════════════════════════════════════

This is a new major module. Users connect their own ad accounts and manage everything from Nexus.

### 6.1 Connect Ad Accounts

**Step 1: Choose Platform**
Grid of platform cards with logos: Meta Ads, Google Ads, TikTok Ads, Twitter/X Ads, LinkedIn Ads, Snapchat Ads, Pinterest Ads, YouTube Ads, Amazon Ads

**Step 2: OAuth Flow**
Each platform uses OAuth 2.0 — user is redirected to the platform, grants permission, returns with access token. Tokens stored encrypted per org in `ad_accounts` table.

**What gets imported on connect:**
- All ad accounts under the user's business manager
- All existing campaigns (synced to `ad_campaigns`)
- All ad sets and ads
- Historical analytics (last 90 days)
- Audiences and custom audiences
- Payment methods on file

**Sync frequency:** Every 15 minutes for active campaigns. Real-time webhooks where supported.

### 6.2 Ad Dashboard (Overview)

**Top metrics bar (date range selector):**
- Total Spend (all platforms combined)
- Total Impressions
- Total Clicks
- Average CTR
- Total Conversions
- Blended ROAS
- Total Revenue from Ads

**Charts:**
- Spend by platform (stacked bar chart, 30 days)
- ROAS trend over time (line chart per platform)
- Top performing campaigns table

**Platform tabs:** All | Meta | Google | TikTok | Twitter | LinkedIn | Snapchat | Pinterest | YouTube | Amazon

### 6.3 Campaign Management

**Campaign List View:**
Columns: Platform (icon), Campaign Name, Status (toggle), Objective, Budget/day, Spend (this month), Impressions, Clicks, CTR, CPC, ROAS, Conversions

Filters: Platform, Status, Objective, Date range, Budget range

Actions per campaign:
- Pause / Resume
- Edit budget
- Duplicate
- View analytics
- Clone to another platform
- Archive

**Create New Campaign:**

Step-by-step wizard:

1. Choose Platform (dropdown: Meta/Google/TikTok/Twitter/LinkedIn/Snapchat/Pinterest/YouTube/Amazon)
2. Select Ad Account (populated from connected accounts)
3. Campaign Objective (options vary by platform — populated dynamically from platform API)
4. Campaign Name + Budget (daily/lifetime) + Currency + Dates
5. Bid Strategy (dropdown from platform options)
6. Create Ad Sets inside campaign
7. Create Ads inside ad sets
8. Review + Launch

**All campaign creation happens via the platform's API.** Changes are pushed to the live ad platform and reflected back. If the user creates a campaign in Nexus, it appears in their Meta/Google/TikTok account.

### 6.4 Ad Sets

Each ad set specifies targeting, placement, budget, and optimization.

**Targeting Builder:**
- Location targeting (countries, regions, cities, radius)
- Demographic targeting (age range, gender)
- Interest targeting (searchable interest list from platform)
- Behavioral targeting
- Custom audience selection
- Lookalike audience selection
- Platform-specific options (Meta: detailed targeting, Google: keywords, TikTok: creator categories)

**Placements:** Automatic or manual per platform
**Budget:** Override campaign budget or set ad set level
**Schedule:** Start/end times, dayparting

### 6.5 Ad Creative Management

**Creative Library:**
- Centralized library of all ad creatives across platforms
- Types: Single image, Video, Carousel, Collection, Dynamic
- Upload from device, pick from Media Library, or pull from AI generation

**Create Ad:**
- Select creative from library OR create inline
- Write headline, primary text, description, CTA
- Preview across platforms and placements (mobile, desktop, stories, feed, reels)
- A/B testing: add multiple variations of headline/copy/creative
- Platform validation: warns if creative doesn't meet platform specs (resolution, aspect ratio, text %, video length)

**AI Ad Copy:**
- "Generate copy" button → describes product/offer → AI writes platform-optimized headline, primary text, description
- Model selector dropdown (from OpenRouter connection)
- Tone options: Professional, Casual, Urgent, Benefit-focused, Story-based

**Ad Preview:**
- Real-time preview renders the ad as it will appear on each platform
- Switch between: Facebook Feed, Instagram Feed, Instagram Stories, TikTok Feed, Twitter Timeline, etc.

### 6.6 Audience Management

**Audience Types:**
- **Custom Audiences**: Upload customer list (CSV/email list), website visitors (pixel-based), app events, video viewers, page engagers
- **Lookalike Audiences**: From any custom audience, select similarity % (1-10%)
- **Saved Audiences**: Reusable targeting combinations
- **Interest-Based**: Build from platform interest categories

**Sync to CRM:**
- Import audience from CRM contacts (filter by tags, lifecycle stage, custom fields)
- Export ad engagement data back to CRM (add "saw ad" tag, update lead score)

### 6.7 Analytics & Attribution

**Dashboard:**
Date range selector. Platform selector (all/individual).

**Metrics displayed:**
- Spend, Impressions, Reach, Frequency
- Clicks, CTR, CPC, CPM, CPR (cost per result)
- Conversions, Conversion Rate
- Revenue, ROAS, MER (marketing efficiency ratio)
- Video views, view rates, completion rates (for video ads)

**Breakdown options:**
- By campaign, ad set, ad
- By age, gender, device, placement, region
- By day, week, month

**Attribution:**
- Last-click, first-click, linear, time-decay attribution models
- Cross-platform attribution (see the full customer journey: first saw TikTok ad → clicked Google ad → converted via Meta retargeting)
- UTM parameter management and tracking

**Charts:**
- Spend vs. ROAS over time (dual-axis line chart)
- Conversion funnel per platform
- Geographic performance heatmap
- Creative performance comparison table (sorted by ROAS)

### 6.8 Ad Payments from Nexus

Users can top up their ad account balances directly from the Nexus dashboard.

**Flow:**
1. User selects platform + ad account
2. Enters top-up amount
3. Selects payment method (Stripe card, Paystack, Flutterwave, bank transfer)
4. Nexus processes payment
5. **Nexus keeps 5–10% commission** (configured by admin, default: 7%)
6. Net amount is credited to user's ad account via platform API
7. Confirmation + receipt generated in Nexus

**Transaction history**: Full log of all ad payment transactions, receipts downloadable as PDF.

**Budget monitoring**: Set alerts when ad account balance drops below threshold → email/SMS notification.

### 6.9 Automated Rules

Create rules that automatically adjust campaigns based on performance:

**Examples:**
- "If CPC > $5.00 AND CTR < 1% for 24 hours → Pause ad"
- "If ROAS > 4.0 for 3 consecutive days → Increase budget by 20%"
- "If daily spend reaches 80% of budget → Send notification"
- "If frequency > 5 → Expand audience or duplicate to new ad set"

**Rule Builder (visual):**
- Trigger metric (dropdown: CPC, CTR, ROAS, Spend, Frequency, Conversions...)
- Condition (greater than / less than / equals)
- Threshold value + time window
- Action (pause/resume/increase budget/decrease budget/notify/create alert)
- Scope (specific campaign/ad set/ad or all)
- Active/inactive toggle

---

## ═══════════════════════════════════════════════
## PART 7: ALL OTHER MODULES — FULL SPECIFICATIONS
## ═══════════════════════════════════════════════

### 7.1 Content Writer

- Paste article URL → fetch full article text + images via @mozilla/readability + cheerio
- AI rewrites using selected model (OpenRouter dropdown — all available models, dynamically fetched)
- **Original images**: fetch actual images from source article via got → apply Sharp transforms (crop 2-5%, color temperature ±5%, subtle overlay) → stored in InsForge S3
- If no source images: generate using Kie.ai image model (dropdown selection)
- Output: full article + SEO meta + schema markup + table of contents + FAQ section + internal links
- Publish to connected WordPress/Ghost/Webflow sites
- Auto-submit to search engines via Auto-Indexing on publish
- **Autoblog**: RSS feeds or keyword monitors → auto-fetch, rewrite, publish on schedule
- Bulk rewrite mode
- Content calendar (visual, drag-and-drop)
- Draft/Publish toggle (default: Draft)

**Model selector**: Dropdown populated live from OpenRouter `/models` endpoint. Groups: GPT-4o models, Claude models, Gemini models, DeepSeek models, Llama models, Mistral models, Grok models, other. Auto-updates when OpenRouter adds new models.

### 7.2 SEO Engine

- Full site audit: 200+ checks via DataForSEO On-Page API
- On-page SEO checker (specific recommendations per page)
- AI SEO Agent: auto-fix meta tags, schema, alt text, canonical URLs, heading hierarchy on connected sites
- LLM Brand Tracker: search ChatGPT, Perplexity, Gemini, Claude for brand mentions
- White-label PDF reports (branded for client delivery)
- Position tracking: daily rankings, 130+ countries

### 7.3 Auto-Indexing

- Google Search Console API + Bing IndexNow
- Auto-submit on every publish event (Content Writer, Site Manager, Store)
- Bulk indexing tool
- Index status dashboard: indexed/pending/error/excluded
- Scheduled re-index for updated content

### 7.4 Site Manager

- Connect: WordPress (plugin), Shopify (app), Webflow (API), custom (FTP/SFTP)
- AI crawl: 200+ issue audit
- Three modes: Autopilot, Review, Report Only
- Fixes: meta, schema, internal links, broken links, image optimization, page speed, canonical, hreflang, robots.txt, sitemap
- Content optimization: thin page rewrites, FAQ additions
- Action log with before/after diffs

### 7.5 Product Research

- 10M+ product database (Shopify, Amazon, AliExpress, TikTok Shop, eBay, Walmart, Etsy, Temu)
- AI score (0-100): demand, margin, saturation, trend
- URL Analyzer: paste any URL → extract products, revenue, tech, suppliers, ads, funnels
- Store spy + tracking
- Supplier comparison
- One-click import to store

### 7.6 Ad Intelligence (Ad Spy)

- Search competitor ads: Facebook, TikTok, Instagram, Pinterest, Google, Snapchat
- Filters: keyword, domain, spend, engagement, date, platform, ad type
- Full creative + copy + CTA + landing page
- Save and monitor ads over time
- One-click AI recreation with user's product
- Landing page capture and funnel mapping

### 7.7 UGC Ads

- URL-to-Video: paste product page → AI generates complete UGC-style video
- **Video model dropdown**: ALL models from Kie.ai connection (Veo 3.1, Veo 3.1 Fast, Runway Aleph, Wan 2.6, Kling 2.6, and any new models added by Kie.ai — auto-fetched, never hardcoded)
- 1,500+ AI avatars, custom avatar creation
- AI scriptwriter with frameworks (AIDA, PAS, BAB)
- TTS: 140+ voices, 29+ languages
- Batch mode
- Formats: 9:16, 16:9, 1:1, 4:5 — up to 4K
- Push to connected ad accounts (Meta, TikTok, YouTube)

### 7.8 Video Editor

Full timeline-based editor:
- Multi-track: video, audio, text, overlays
- Trim, cut, split, merge
- 50+ transitions
- Text: titles, lower thirds, captions, animated text
- Audio: music, voiceover, SFX, volume, fade
- Color: brightness, contrast, saturation, temperature, LUTs
- Speed control, slow motion, time-lapse
- Filters, blur, vignette, glow, grain
- Chroma key (green screen)
- AI background removal (no green screen needed)
- Background replacement
- Video background removal + replacement (frame-by-frame, no green screen)
- PiP (picture-in-picture)
- AI editing: natural language instructions → edits applied
- Export: MP4/MOV/WebM/GIF, 720p/1080p/4K, 24/30/60fps
- Templates: TikTok, Reels, YouTube Shorts/Long, Stories, Ads
- Version history + auto-save

### 7.9 Design Studio

Fabric.js canvas:
- All platform sizes pre-built
- Reference image upload → AI incorporates into design
- AI generation from text prompt
- Layers panel (reorder, lock, group, opacity)
- Text: 1,000+ fonts, curved text, effects
- Shapes, custom paths
- Sticker library: 100,000+ elements
- Brand Kit (apply across designs)
- Smart resize (one design → all platform sizes)
- Animation → GIF/MP4 export
- Multi-page (brochures, carousels, decks)
- Collaboration + comments
- Export: PNG, JPEG, WebP, SVG, PDF, GIF, MP4

### 7.10 Image Studio

- **Image model dropdown**: ALL models from Kie.ai (Stable Diffusion XL, DALL·E 3, Flux Kontext, 4o Image, Nano Banana Pro, Imagen 4, and all new models Kie.ai adds — auto-fetched, never hardcoded)
- Text-to-image with style presets
- Reference image upload → AI variations
- Photorealistic human model generation
- Image-to-image transformation
- Inpainting, outpainting, object removal, blending
- Background removal + replacement
- Video background removal + replacement (frame-by-frame, no green screen)
- Watermark removal (images + video, batch)
- Upscaling to 8K
- Batch processing all operations

### 7.11 Music Creator

- **Music model dropdown**: ALL Suno models from Kie.ai (V3.5, V4, V4.5, V4.5 Plus, and any newer versions — auto-fetched)
- Text prompt → original tracks up to 8 minutes
- Genre presets + custom genre
- AI vocals with lyrics / instrumental only
- Write or AI-generate lyrics
- Commercial licensing
- Export: MP3, WAV, FLAC, AAC
- Integration with Video Editor and UGC Ads

### 7.12 Presentations

- Topic or uploaded content → AI research → presentation deck
- Live web search for latest statistics and data
- AI writes slides with proper hierarchy
- Real images sourced from Unsplash/Pexels API (not AI-generated where possible)
- Customizable themes
- Slide editor
- Export: PPTX, PDF, Google Slides compatible
- Present mode with animations

### 7.13 Chat Hub

- **Model dropdown**: ALL models from OpenRouter connection — GPT-4o, Claude Opus/Sonnet/Haiku, Gemini 2.5 Pro/Flash, DeepSeek V3, Llama 4, Mistral Large, Grok 3, Qwen, Command R+, hundreds more — dynamically fetched, auto-updates
- Modes: single, side-by-side compare (2), compare-all
- File upload: PDFs, images, spreadsheets, code
- Conversation history + search
- Custom system prompts
- Team sharing
- Code execution within chat

### 7.14 Code Builder

- Claude (via OpenRouter) primary model, model dropdown for selection
- Natural language → complete working applications
- Supports: React, Next.js, Python, Node.js, WordPress plugins, Shopify themes, Chrome extensions, APIs, scripts, dashboards, bots
- Monaco editor (syntax highlighting, auto-complete, error detection)
- Live preview/sandbox
- Version control with diff + rollback
- Deploy to InsForge Cloud or download
- Templates: landing page, REST API, browser extension, SaaS app scaffold

### 7.15 Chatbots

- Visual flow builder (drag-and-drop)
- Deploy to: WhatsApp, Telegram, Instagram, Messenger, website, SMS
- Three modes: Off, Suggestive, Autopilot
- Training: web crawler (4,000 URLs), FAQ, file upload, URL scraping
- Embed export: JS snippet, iFrame, React component, WP plugin, Shopify app, REST API
- Widget customization (colors, position, avatar, welcome message)
- Analytics: conversations, conversions, drop-off, ratings

### 7.16 Prospecting & Lead Generation

(Full 5-step pipeline — Apify powered)

**Step 1: Lead Discovery**
- Google Maps, LinkedIn, Instagram, TikTok, Facebook Pages, Website scraping, Amazon/Shopify stores, CSV/Excel import
- Powered by Apify API (admin enters one token, 20,000+ actors available)

**Step 2: Enrichment & Qualification**
- Email finder (Hunter.io / pattern guessing)
- Email verification (ZeroBounce / NeverBounce / built-in SMTP)
- Phone validation
- Company enrichment (Clearbit)
- AI lead scoring (0-100)
- Qualification tags: Hot/Warm/Cold/Unqualified
- Duplicate detection

**Step 3: Outreach Sequences**
- Email: multi-step drip, AI-personalized per lead, A/B test
- SMS: follow-up texts
- WhatsApp: template messages
- LinkedIn: connection + follow-up (Playwright browser automation)
- Voicemail drops (Twilio)
- Multi-channel sequences with conditional logic

**Step 4: Pipeline Integration**
- Qualified leads auto-move through stages
- Stage transitions trigger workflow actions

**Step 5: Compliance**
- CAN-SPAM / GDPR compliance
- Rate limiting
- DNC list management
- Proxy rotation (Apify handles)

### 7.17 Business Name Generator & Domain Finder

- AI generates 50+ name suggestions from business description
- For each name: availability on 60+ TLDs + social handles (Instagram, Twitter, TikTok, Facebook, LinkedIn, YouTube, Pinterest, Threads, Reddit) + trademark conflicts (USPTO/EUIPO)
- One-click domain purchase (if admin connected Namecheap/GoDaddy/Cloudflare)
- Auto-generate brand kit: logo, colors, fonts, social assets

### 7.18 Logo Creator

- AI logo from name + industry + style
- Style presets: modern, minimal, vintage, playful, corporate, geometric, hand-drawn, abstract, mascot, lettermark, wordmark, emblem
- Auto-suggest color palettes by industry
- 8-12 variations per generation
- Edit in Design Studio
- Export: SVG, PNG (transparent + white), PDF, ICO
- Auto-generate: favicon, social profile images, business card, email signature, watermark

### 7.19 Website Hosting & Domains

- Platform hosting with free subdomain (`sitename.nexus.app`)
- Custom domain with auto SSL
- Cloudflare CDN for all hosted sites
- Analytics: page views, visitors, bounce rate, traffic sources
- Uptime monitoring with alerts

### 7.20 Payment Integration for User Websites

- Users connect own payment gateways (Stripe Connect, Paystack, Flutterwave, NOWPayments, PayPal, Square)
- Multiple gateways simultaneously
- Transaction logging and reporting

### 7.21 Article-to-Video

- Select published article or paste URL
- **Video model dropdown**: ALL Kie.ai models (auto-fetched, never hardcoded)
- AI extracts key points + creates video
- Uses original article images where available
- AI voiceover (voice + language selectable)
- Animated text overlays for quotes + stats
- Background music
- Output: 9:16, 16:9, 1:1
- Batch conversion
- Auto-publish to connected social accounts

### 7.22 Social Planner

- Schedule posts to: Instagram, Facebook, TikTok, Twitter/X, LinkedIn, Pinterest, YouTube, Threads
- Visual calendar view
- Multi-platform post creation (one post → customize per platform)
- AI caption writer (model dropdown — OpenRouter)
- Media library integration
- First comment scheduling
- Hashtag suggestions
- Best-time-to-post recommendations
- Analytics: reach, engagement, growth per platform

### 7.23 Workflows (Automation)

- Visual workflow builder
- Triggers: new contact, form submission, tag added, deal stage change, email opened, appointment booked, payment received, ad conversion, custom webhook
- Actions: send email, send SMS, send WhatsApp, update contact, create task, move pipeline stage, add tag, wait, condition branch, webhook, run script
- 300+ pre-built workflow templates
- Execution history + logs

### 7.24 Reports & Analytics

- Attribution dashboard (cross-channel: organic, email, SMS, ads, social)
- Pipeline reports (conversion rates, deal velocity, revenue forecast)
- Content performance (articles, social posts, videos)
- Ad performance summary (pulls from Ads Manager)
- Email/SMS performance
- Chatbot analytics
- Agency rollup view (all org clients in one dashboard)
- Export: CSV, PDF (branded)
- Scheduled email reports (daily/weekly/monthly)

---

## ═══════════════════════════════════════════════
## PART 8: DYNAMIC MODEL LOADING — CRITICAL IMPLEMENTATION
## ═══════════════════════════════════════════════

This is one of the most important technical requirements. NEVER hardcode model names.

### OpenRouter Models
```typescript
// Backend service: runs on startup + every 6 hours
async function syncOpenRouterModels() {
  const apiKey = await getDecryptedApiKey('openrouter');
  const response = await axios.get('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  // Store in platform_settings: key='openrouter_models', value=JSON
  await platformSettings.set('openrouter_models', response.data.data);
  // Cache in Redis with 6h TTL
  await redis.set('openrouter:models', JSON.stringify(response.data.data), 'EX', 21600);
}

// API endpoint for frontend
GET /api/models/llm
→ Returns cached model list
→ Format: { id, name, context_length, pricing, capabilities[] }
```

### Kie.ai Models
```typescript
// Similar pattern — fetch from Kie.ai models endpoint
async function syncKieModels() {
  const apiKey = await getDecryptedApiKey('kie_ai');
  // Fetch all available models: image, video, music, LLM
  const response = await axios.get('https://api.kie.ai/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  await platformSettings.set('kie_models', response.data);
  await redis.set('kie:models', JSON.stringify(response.data), 'EX', 21600);
}

GET /api/models/multimodal
→ Returns { image: [...], video: [...], music: [...] }
```

### Frontend Dropdown Component
```typescript
// Reusable ModelSelector component
<ModelSelector
  type="llm"           // | "image" | "video" | "music"
  value={selectedModel}
  onChange={setSelectedModel}
  filter={["text-generation"]}  // optional capability filter
/>
// Internally fetches from /api/models/[type], renders as Radix UI Select
// Shows model name + context window + pricing per token
// Automatically shows new models the moment they appear on OpenRouter or Kie.ai
```

---

## ═══════════════════════════════════════════════
## PART 9: COMPLETE API KEYS LIST (Admin Vault)
## ═══════════════════════════════════════════════

All keys below are entered by Admin only. Platform does not function for those modules until the relevant key is entered.

```
LANGUAGE MODELS
OpenRouter API Key            — all text generation platform-wide

MULTI-MODAL
Kie.ai API Key                — all image/video/music generation

SEO & DATA
DataForSEO API Key            — keyword research, backlinks, SERP, on-page
DataForSEO Email Login        — authentication (DataForSEO uses Basic auth)
Google Search Console JSON    — auto-indexing (Google)
Bing Webmaster API Key        — auto-indexing (Bing/IndexNow)

EMAIL
Mailgun API Key               — transactional + marketing emails
Mailgun Domain                — sending domain
SendGrid API Key              — alternative email provider
Custom SMTP Host/Port/User/Pass — self-hosted SMTP

SMS & VOICE
Twilio Account SID            — SMS, voice, voicemail drops
Twilio Auth Token
Twilio Phone Numbers          — list of purchased numbers

MESSAGING
WhatsApp Business API (Cloud API credentials)
360dialog API Key
Telegram Bot Token            — Telegram bots + broadcasts
Facebook Page Access Token    — Messenger bots, Facebook posting
Instagram Access Token        — Instagram messaging + posting
TikTok Client Key             — TikTok posting + DMs
TikTok Client Secret
LinkedIn Client ID            — LinkedIn posting + messaging
LinkedIn Client Secret
Twitter/X API Key
Twitter/X API Secret
Twitter/X Bearer Token
Pinterest App ID
Pinterest App Secret
Snapchat App ID
Snapchat App Secret

ADS PLATFORMS
Meta Ads App ID               — Meta (Facebook + Instagram) Ads Manager
Meta Ads App Secret
Meta System User Token        — for Business Manager API access
Google Ads Developer Token    — Google + YouTube Ads
Google Ads OAuth Client ID
Google Ads OAuth Client Secret
TikTok Ads App ID
TikTok Ads App Secret
Twitter/X Ads OAuth credentials (same as Twitter API above)
LinkedIn Ads Client ID (same as LinkedIn above)
LinkedIn Ads Client Secret
Snapchat Ads Client ID
Snapchat Ads Client Secret
Pinterest Ads App ID (same as Pinterest above)
Amazon Advertising Client ID
Amazon Advertising Client Secret
Amazon Advertising Profile ID

PLATFORM PAYMENTS (for Nexus subscriptions)
Stripe Secret Key
Stripe Webhook Secret
Paystack Secret Key
Paystack Webhook Secret
Flutterwave Secret Key
Flutterwave Webhook Secret
NOWPayments API Key
NOWPayments IPN Secret

STORAGE & CDN
Cloudflare R2 Access Key
Cloudflare R2 Secret Key
Cloudflare R2 Bucket Name
Cloudflare R2 Account ID
Cloudflare R2 Endpoint
Cloudflare API Token          — domain routing, SSL

SCRAPING & ENRICHMENT
Apify API Token               — all scraping/prospecting
ZeroBounce API Key            — email verification
NeverBounce API Key           — alternative email verification
Hunter.io API Key             — email finder
Clearbit API Key              — company enrichment

CALENDAR & COMMUNICATION
Google Calendar Service Account JSON
Outlook OAuth Client ID
Outlook OAuth Client Secret
Zoom API Key
Zoom API Secret

DOMAIN MANAGEMENT
Namecheap API Key
Namecheap API Username
GoDaddy API Key
GoDaddy API Secret
Cloudflare Registrar Token

ANALYTICS & STOCK IMAGES
Google Analytics Measurement ID
Facebook Pixel ID
Google Tag Manager ID
Unsplash API Access Key
Pexels API Key

MISC
Google Maps API Key
Yext API Key
Custom (add any key with label, endpoint, notes)
```

---

## ═══════════════════════════════════════════════
## PART 10: BUILD PHASES
## ═══════════════════════════════════════════════

### Phase 1 — Foundation & Infrastructure
1. Monorepo: `/backend` + `/frontend` + `/packages/shared`
2. InsForge connection + all collections created
3. Full auth system (register → email verify → login → refresh → logout → 2FA → password reset)
4. RBAC middleware (admin, owner, manager, staff, viewer)
5. API Keys Vault (AES-256 encrypted storage, CRUD, test connection, live status)
6. Admin layout + Admin Home dashboard
7. Environment validation (Zod schema at startup)
8. Redis + BullMQ queue setup
9. Background jobs for OpenRouter + Kie.ai model syncing
✅ Verify: auth flow, admin key vault, role separation, encryption

### Phase 2 — Admin Dashboard Complete
1. Users management (CRUD, suspend, impersonate, role assignment, permissions matrix)
2. Module toggle system (per-module, per-plan control)
3. Dynamic model sync (OpenRouter + Kie.ai background jobs)
4. Plugin system
5. Billing configuration
6. White-label settings
7. Platform settings (security, timezone, maintenance mode)
8. Audit logging
✅ Verify: admin manages everything, models auto-sync, white-label applies

### Phase 3 — Marketing Homepage + Auth Pages
1. Design system setup (tokens, fonts, custom Tailwind config)
2. Navigation (sticky, glass effect, mega menu)
3. Hero section (Three.js particles, 3D dashboard preview, animated stats)
4. All homepage sections (social proof, bento grid, ads feature, stats, testimonials)
5. Pricing page (full feature comparison table, annual/monthly toggle)
6. Features pages, use-case pages
7. Login/register pages (clean, branded)
8. Footer with all links
✅ Verify: homepage loads beautifully, passes Core Web Vitals, mobile responsive

### Phase 4 — User Dashboard Shell + CRM
1. User registration + login flow
2. Dashboard layout (grouped sidebar, module gating by plan)
3. Home dashboard (KPIs, activity feed, quick actions)
4. WebSocket real-time connection
5. Contacts (CRUD, import/export, custom fields, tags, lead scoring, activity timeline)
6. Unified Inbox (all channels, message threading)
7. Pipelines (Kanban, drag-and-drop)
8. Tasks and Notes
✅ Verify: complete CRM workflow

### Phase 5 — Ads Manager Module
1. Ad account connection (OAuth for Meta, Google, TikTok, Twitter, LinkedIn, Snapchat, Pinterest, Amazon)
2. Campaign sync (import existing campaigns, ads, analytics)
3. Campaign CRUD (create/edit/pause/resume via platform APIs)
4. Ad set + ad management
5. Creative library
6. Analytics dashboard (spend, ROAS, charts)
7. Audience management
8. Ad payments with Nexus commission
9. Automated rules
10. Real-time sync (15-minute polling + webhooks)
✅ Verify: create campaign in Nexus → appears in Meta/Google/TikTok ad account

### Phase 6 — Content & SEO
1. Content Writer (URL → rewrite → original images → publish)
2. SEO Engine (audit, on-page, position tracking, LLM tracker)
3. Auto-Indexing (Google + Bing)
4. Site Manager (connect → crawl → audit → fix)
5. Keyword Research (DataForSEO)
6. Backlink Analysis (DataForSEO)
7. Social Planner (schedule to all platforms)
✅ Verify: full content workflow end-to-end

### Phase 7 — Commerce & Intelligence
1. Product Research (multi-marketplace, URL analyzer, store spy)
2. Ad Intelligence (competitor ad search, tracker)
3. UGC Ads (URL → video, all Kie.ai models in dropdown)
4. Online Store (products, orders, checkout, inventory)
5. Payment processing
✅ Verify: product research → create UGC ad → process payment

### Phase 8 — Creative Suite
1. Design Studio (Fabric.js, AI generation, reference image, brand kit, smart resize)
2. Image Studio (all Kie.ai models in dropdown, all editing tools)
3. Video Editor (full timeline, all effects, AI editing, export)
4. Music Creator (all Suno models via Kie.ai in dropdown)
5. Presentations (live research, real images, PPTX export)
6. Logo Creator
7. Article-to-Video
✅ Verify: create with reference image, edit video with AI, generate music, build presentation

### Phase 9 — Automation & Build
1. Chatbots (flow builder, multi-channel deploy, embed export)
2. Workflows (visual builder, triggers, actions, templates)
3. Voice AI (Twilio integration, transcription, CRM update)
4. Broadcasting (bulk WhatsApp/email/SMS with segmentation)
5. Websites & Funnels (drag-and-drop builder)
6. Calendars (booking, reminders, payment at booking)
7. Courses & Memberships
8. Reviews & Reputation
9. Code Builder (Claude via OpenRouter, Monaco, sandbox)
10. Chat Hub (all OpenRouter models in dropdown)
✅ Verify: chatbot → deploy → workflow triggers → calendar booking

### Phase 10 — Prospecting Module
1. Apify integration (Google Maps, LinkedIn, Instagram, TikTok, Facebook, web scraping)
2. Lead enrichment (email finder, verification, company data)
3. AI lead scoring
4. Outreach sequences (email, SMS, WhatsApp, voicemail, LinkedIn)
5. Pipeline integration (auto-stage movement)
6. Compliance tools (DNC list, unsubscribe, GDPR)
✅ Verify: scrape leads → enrich → score → outreach sequence → move through pipeline

### Phase 11 — Polish & Performance
1. Reports dashboard (full attribution, cross-platform analytics)
2. White-label: end-to-end verification
3. Mobile responsive (all views at 768px+)
4. Error handling (user-friendly messages, no raw errors)
5. Loading states (skeleton screens everywhere)
6. Performance optimization (lazy loading, code splitting, image optimization)
7. Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
8. Security audit (OWASP Top 10, rate limiting, CSRF, SQL injection prevention)
✅ Verify: complete user journey from registration to publishing ads and content

---

## ═══════════════════════════════════════════════
## PART 11: CRITICAL IMPLEMENTATION RULES
## ═══════════════════════════════════════════════

1. **InsForge ONLY** — Never reference Supabase, Firebase, MongoDB, Prisma, or any other database.
2. **API keys admin-only** — Users never see or manage API keys. AES-256-GCM encrypted in InsForge.
3. **Model dropdowns are always dynamic** — Never hardcode model names. Always fetch from `/api/models/[type]` which reads from Redis cache, which is populated by background jobs from OpenRouter/Kie.ai. New models appear automatically.
4. **Images from original sources** — Sharp transforms: crop ±5%, hue rotate ±3°, saturation ×0.95, brightness ±2%. Never identical pixel copies, but realistic quality preserved.
5. **No "AI" prefix on features** — "Content Writer", "Image Studio", "Video Editor". Not "AI Content Writer".
6. **Role separation absolute** — Admin: `/admin/*` with `role === 'admin'`. User: `/dashboard/*` with `org_id` verification on every resource.
7. **Budget enforcement** — Track every API call cost via `usage_tracking`. Admin sets global + per-org limits. 429 with clear UI warning when exceeded.
8. **TypeScript strict mode** — `"strict": true`. No `any`. All return types declared.
9. **API keys encrypted at rest** — AES-256-GCM. Salt + IV per key. Never returned in plaintext.
10. **Paginate everything** — All list endpoints: `page`, `limit` (max 100), `total`, `hasMore`.
11. **Real-time via WebSocket** — Inbox messages, bot conversations, workflow executions, indexing status, ad performance updates.
12. **Homepage must pass** — Core Web Vitals, mobile-first design, real photos from Unsplash/Pexels, 3D animations with Three.js, animated charts with Chart.js, professional SaaS aesthetic.
13. **Multi-gateway payments** — Stripe (global), Paystack (Africa), Flutterwave (Africa/global), NOWPayments (crypto). Admin enables gateways. Users see available gateways at checkout.
14. **Ad platform APIs are bidirectional** — Changes in Nexus → pushed to ad platform. Changes on ad platform → pulled to Nexus (15-min sync + webhooks).
15. **Ad payments commission** — Admin configures commission % (default 7%). Nexus processes payment, net amount credited to ad account.
16. **Vibe coding rules enforced** — Instrument Sans + Fraunces fonts only. Warm off-white backgrounds. Custom shadows. No Tailwind defaults exposed. No purple gradients. No emoji as nav icons. All spacing multiples of 4px.
17. **Environment validation** — Zod schema validates all env vars at startup. Clear error messages when missing.
18. **Mobile-first responsive** — Sidebar collapses to icon rail at 1024px, hidden at 768px with hamburger menu.
19. **Video Editor uses ffmpeg** — fluent-ffmpeg backend. Timeline UI: custom React + canvas + requestAnimationFrame. No third-party video editor SDK.
20. **Draft/Publish default = Draft** — Safety first on all content modules. Confirmation dialog on Draft → Published. Clear status badge on every piece of content.

---

## ═══════════════════════════════════════════════
## PART 12: ENVIRONMENT VARIABLES (Backend .env)
## ═══════════════════════════════════════════════

```env
# InsForge
INSFORGE_URL=
INSFORGE_API_KEY=
INSFORGE_DB_NAME=nexus

# Server
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.nexus.app

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption (for API keys vault)
ENCRYPTION_KEY=     # 32-byte hex string
ENCRYPTION_IV_LENGTH=16

# Redis
REDIS_URL=redis://localhost:6379

# Frontend URL
FRONTEND_URL=https://nexus.app

# Email (platform transactional — before admin configures)
SYSTEM_SMTP_HOST=
SYSTEM_SMTP_PORT=
SYSTEM_SMTP_USER=
SYSTEM_SMTP_PASS=
SYSTEM_FROM_EMAIL=noreply@nexus.app
```

```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.nexus.app
NEXT_PUBLIC_WS_URL=wss://api.nexus.app
NEXT_PUBLIC_APP_NAME=Nexus
NEXT_PUBLIC_APP_URL=https://nexus.app
```

---

> **START: Phase 1 — Foundation**
>
> Set up the monorepo structure. Initialize Node.js 22 + TypeScript backend with Fastify 5. Connect InsForge. Create ALL database collections. Implement complete auth (register → email verify → login → refresh → logout → 2FA → password reset). Implement RBAC middleware with all five roles. Build API Keys Vault with AES-256-GCM encryption. Set up Redis + BullMQ. Create admin layout and Home dashboard. Set up background jobs for OpenRouter + Kie.ai model syncing.
>
> **Phase 1 Verification Checklist:**
> - [ ] User registers → receives verification email
> - [ ] User verifies email → account activated
> - [ ] User logs in → receives access + refresh JWT
> - [ ] Protected routes return 401 without valid token
> - [ ] Admin routes return 403 with user token, 200 with admin token
> - [ ] Admin adds API key → stored AES-256 encrypted → never returned in plaintext
> - [ ] Admin clicks "Test Connection" → pings OpenRouter/Kie.ai → updates status
> - [ ] Background job fetches OpenRouter models → cached in Redis → available via GET /api/models/llm
> - [ ] All environment variables validated at startup (Zod) — missing vars exit with clear message
> - [ ] Rate limiting active on all routes
>
> **Do not proceed to Phase 2 until ALL Phase 1 checks pass.**