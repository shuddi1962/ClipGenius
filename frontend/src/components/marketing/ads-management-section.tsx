'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

// Animated chart component
function AnimatedChart() {
  const data = [45, 52, 48, 61, 55, 67, 71, 68, 72, 78, 82, 85];

  return (
    <div className="bg-nexus-bg-tertiary rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-nexus-text-primary">Ad Performance</h4>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-nexus-green rounded-full"></div>
          <span className="text-xs text-nexus-text-secondary">ROAS</span>
        </div>
      </div>

      <div className="h-32 flex items-end justify-between">
        {data.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            whileInView={{ height: `${value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-gradient-to-t from-nexus-green to-nexus-blue rounded-sm flex-1 mx-1 relative"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-nexus-text-secondary">
              {value}%
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-xs text-nexus-text-tertiary">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  );
}

export default function AdsManagementSection() {
  const platforms = [
    { name: 'Meta Ads', color: 'bg-blue-600' },
    { name: 'Google Ads', color: 'bg-green-600' },
    { name: 'TikTok Ads', color: 'bg-pink-600' },
    { name: 'Twitter/X Ads', color: 'bg-gray-800' },
    { name: 'LinkedIn Ads', color: 'bg-blue-700' },
    { name: 'Snapchat Ads', color: 'bg-yellow-500' },
    { name: 'Pinterest Ads', color: 'bg-red-600' },
    { name: 'YouTube Ads', color: 'bg-red-500' },
    { name: 'Amazon Ads', color: 'bg-orange-600' },
  ];

  const features = [
    'Campaign creation & management',
    'Audience targeting & custom audiences',
    'Creative library & ad variations',
    'Budget management & pacing',
    'Real-time performance analytics',
    'Cross-platform attribution',
    'Automated rules & optimization',
    'Billing consolidation',
    'ROI & ROAS tracking dashboard',
  ];

  return (
    <section className="py-24 bg-nexus-accent text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Run every ad platform from one dashboard
            </h2>

            <p className="text-xl text-nexus-text-tertiary mb-8 leading-relaxed">
              Connect Meta, Google, TikTok, LinkedIn, Twitter — manage campaigns, budgets, creatives,
              and analytics without switching tabs.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-nexus-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span>Connect accounts with one click</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-nexus-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span>Launch campaigns in minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-nexus-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span>Track ROAS across every platform</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-nexus-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span>Pay for ads directly from Nexus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-nexus-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span>10% commission goes to your ad spend account</span>
              </div>
            </div>

            {/* Platform Logos */}
            <div className="mb-8">
              <p className="text-sm text-nexus-text-tertiary mb-4">Supported Platforms</p>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium"
                  >
                    {platform.name}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-nexus-blue hover:bg-nexus-accent px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Start Managing Ads
              <Target className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard Mockup */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-nexus-bg-secondary px-6 py-4 border-b border-nexus-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-nexus-text-primary">Ads Manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-nexus-green rounded-full"></div>
                    <span className="text-sm text-nexus-text-secondary">Live</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-nexus-green" />
                      <span className="text-xs text-nexus-text-secondary">Spend</span>
                    </div>
                    <div className="text-lg font-bold text-nexus-text-primary">$12,847</div>
                  </div>

                  <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-nexus-blue" />
                      <span className="text-xs text-nexus-text-secondary">ROAS</span>
                    </div>
                    <div className="text-lg font-bold text-nexus-text-primary">3.2x</div>
                  </div>

                  <div className="bg-nexus-bg-tertiary rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-nexus-violet" />
                      <span className="text-xs text-nexus-text-secondary">Clicks</span>
                    </div>
                    <div className="text-lg font-bold text-nexus-text-primary">8,432</div>
                  </div>
                </div>

                {/* Chart */}
                <AnimatedChart />

                {/* Campaign List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-nexus-text-primary">
                    <span>Active Campaigns</span>
                    <span className="text-nexus-green">+12.5%</span>
                  </div>

                  {[
                    { name: 'Summer Sale 2024', platform: 'Meta', spend: '$2,341', roas: '4.1x' },
                    { name: 'Product Launch', platform: 'Google', spend: '$1,847', roas: '2.8x' },
                    { name: 'Brand Awareness', platform: 'TikTok', spend: '$956', roas: '3.5x' },
                  ].map((campaign, index) => (
                    <motion.div
                      key={campaign.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-nexus-bg-tertiary rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-nexus-text-primary">{campaign.name}</div>
                        <div className="text-xs text-nexus-text-secondary">{campaign.platform}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-nexus-text-primary">{campaign.spend}</div>
                        <div className="text-xs text-nexus-green">{campaign.roas}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature List Overlay */}
            <div className="absolute -right-4 -bottom-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <h4 className="font-semibold text-nexus-text-primary mb-3 text-sm">Everything you need:</h4>
              <ul className="space-y-2 text-xs text-nexus-text-secondary">
                {features.slice(0, 5).map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-3 h-3 text-nexus-green flex-shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}