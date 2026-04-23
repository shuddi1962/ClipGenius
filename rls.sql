-- Enable RLS and create policies for new tables

-- Ads tables
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_accounts" ON ad_accounts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_accounts.org_id
  )
);

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_campaigns" ON ad_campaigns FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_campaigns.org_id
  )
);

ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_sets" ON ad_sets FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN ad_campaigns ac ON om.org_id = ac.org_id
    WHERE ac.id = ad_sets.campaign_id
  )
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ads" ON ads FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN ad_campaigns ac ON om.org_id = ac.org_id
    JOIN ad_sets ads ON ac.id = ads.campaign_id
    WHERE ads.id = ads.ad_set_id
  )
);

ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_creatives" ON ad_creatives FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_creatives.org_id
  )
);

ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_analytics" ON ad_analytics FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_accounts.org_id
    FROM ad_accounts WHERE ad_accounts.id = ad_analytics.ad_account_id
  )
);

ALTER TABLE ad_audiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_audiences" ON ad_audiences FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_audiences.org_id
  )
);

ALTER TABLE ad_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_payments" ON ad_payments FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_payments.org_id
  )
);

ALTER TABLE ad_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_ad_rules" ON ad_rules FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = ad_rules.org_id
  )
);

-- Content tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_articles" ON articles FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = articles.org_id
  )
);

ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_content_sources" ON content_sources FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = content_sources.org_id
  )
);

ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_seo_audits" ON seo_audits FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = seo_audits.org_id
  )
);

ALTER TABLE indexed_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_indexed_pages" ON indexed_pages FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = indexed_pages.org_id
  )
);

ALTER TABLE connected_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_connected_sites" ON connected_sites FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = connected_sites.org_id
  )
);

ALTER TABLE keyword_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_keyword_tracking" ON keyword_tracking FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = keyword_tracking.org_id
  )
);

ALTER TABLE backlink_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_backlink_profiles" ON backlink_profiles FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = backlink_profiles.org_id
  )
);

-- Prospecting tables
ALTER TABLE prospecting_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_prospecting_campaigns" ON prospecting_campaigns FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = prospecting_campaigns.org_id
  )
);

ALTER TABLE scraped_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_scraped_leads" ON scraped_leads FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = scraped_leads.org_id
  )
);

ALTER TABLE outreach_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_sequences" ON outreach_sequences FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = outreach_sequences.org_id
  )
);

ALTER TABLE outreach_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_steps" ON outreach_steps FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_sequences os ON om.org_id = os.org_id
    WHERE os.id = outreach_steps.sequence_id
  )
);

ALTER TABLE outreach_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_enrollments" ON outreach_enrollments FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_sequences os ON om.org_id = os.id
    WHERE os.id = outreach_enrollments.sequence_id
  )
);

ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_outreach_events" ON outreach_events FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN outreach_enrollments oe ON om.org_id = oe.org_id
    JOIN outreach_sequences os ON oe.sequence_id = os.id
    WHERE oe.id = outreach_events.enrollment_id
  )
);

ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_email_verifications" ON email_verifications FOR SELECT USING (true);

ALTER TABLE dnc_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_dnc_list" ON dnc_list FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = dnc_list.org_id
  )
);

-- Commerce tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_products" ON products FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = products.org_id
  )
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_orders" ON orders FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = orders.org_id
  )
);

ALTER TABLE product_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_product_research" ON product_research FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = product_research.org_id
  )
);

ALTER TABLE store_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_store_analyses" ON store_analyses FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = store_analyses.org_id
  )
);

-- Creative tables
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_designs" ON designs FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = designs.org_id
  )
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_media_library" ON media_library FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = media_library.org_id
  )
);

ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_video_projects" ON video_projects FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = video_projects.org_id
  )
);

ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_music_tracks" ON music_tracks FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = music_tracks.org_id
  )
);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_presentations" ON presentations FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = presentations.org_id
  )
);

-- Automation tables
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_chatbots" ON chatbots FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = chatbots.org_id
  )
);

ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_workflow_executions" ON workflow_executions FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members om
    JOIN workflows w ON om.org_id = w.org_id
    WHERE w.id = workflow_executions.workflow_id
  )
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_broadcasts" ON broadcasts FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = broadcasts.org_id
  )
);

-- Domains tables
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_domains" ON domains FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = domains.org_id
  )
);

ALTER TABLE hosted_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_hosted_sites" ON hosted_sites FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = hosted_sites.org_id
  )
);

ALTER TABLE name_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_name_searches" ON name_searches FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = name_searches.org_id
  )
);

ALTER TABLE generated_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_generated_logos" ON generated_logos FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = generated_logos.org_id
  )
);

ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_brand_kits" ON brand_kits FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = brand_kits.org_id
  )
);

ALTER TABLE user_payment_gateways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_user_payment_gateways" ON user_payment_gateways FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = user_payment_gateways.org_id
  )
);

ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_user_transactions" ON user_transactions FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM org_members WHERE org_id = user_transactions.org_id
  )
);