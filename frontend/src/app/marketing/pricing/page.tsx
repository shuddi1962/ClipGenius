'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Users, Building2, Star } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 49, yearly: 39 },
    description: 'Best for solopreneurs and freelancers',
    icon: Zap,
    color: 'blue',
    features: [
      '1 workspace',
      '2,500 contacts',
      '5 connected sites',
      '50 AI content pieces/mo',
      'Basic CRM, Email, SMS',
      '1 chatbot',
      'Community support',
    ],
    limitations: [
      'Limited AI generations',
      'Basic analytics',
      'Email support only',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 149, yearly: 119 },
    description: 'Most popular — for growing businesses',
    icon: Users,
    color: 'violet',
    popular: true,
    features: [
      '3 workspaces',
      '25,000 contacts',
      '25 connected sites',
      '500 AI content pieces/mo',
      '100GB storage',
      'Full CRM, all marketing channels',
      '5 chatbots',
      'Video editor, Design Studio',
      'Ad Manager (all platforms)',
      'Product research & ad intelligence',
      'Priority email support',
    ],
    limitations: [],
  },
  {
    name: 'Agency',
    price: { monthly: 349, yearly: 279 },
    description: 'For agencies managing multiple clients',
    icon: Building2,
    color: 'green',
    features: [
      '20 workspaces (sub-accounts)',
      '250,000 contacts',
      'Unlimited connected sites',
      'Unlimited AI content',
      '1TB storage',
      'Everything in Pro',
      'White-label platform (custom domain, logo, colors)',
      'Client reporting & dashboards',
      'Staff roles (20 team members)',
      'Dedicated account manager',
      'SLA: 99.9% uptime',
    ],
    limitations: [],
  },
];

const allFeatures = [
  { category: 'Core Features', features: [
    'Workspaces', 'Contacts limit', 'Connected sites', 'Storage',
  ]},
  { category: 'AI & Content', features: [
    'AI content pieces/mo', 'AI models access', 'Content Writer', 'SEO Engine',
    'Auto-indexing', 'Site Manager', 'Design Studio', 'Image Studio',
    'Video Editor', 'Music Creator', 'Presentations',
  ]},
  { category: 'Marketing & Sales', features: [
    'CRM & Contacts', 'Inbox (Unified)', 'Pipelines', 'Prospecting',
    'Email Marketing', 'SMS Marketing', 'WhatsApp', 'Social Planner',
  ]},
  { category: 'Advertising', features: [
    'Ad Manager', 'Campaign management', 'Creative library', 'Audiences',
    'Analytics & ROAS', 'Billing & payments', 'Automated rules',
  ]},
  { category: 'Automation', features: [
    'Chatbots', 'Workflows', 'Voice calls', 'Broadcasting',
  ]},
  { category: 'Commerce', features: [
    'Product research', 'Ad intelligence', 'UGC ads', 'Online store',
    'Payment processing', 'Invoices & payments',
  ]},
  { category: 'Business Tools', features: [
    'Websites & funnels', 'Hosting & domains', 'Calendars', 'Courses & memberships',
    'Reviews & reputation', 'Code builder', 'Chat hub', 'Reports & analytics',
  ]},
  { category: 'White-label & Support', features: [
    'White-label branding', 'Custom domain', 'Client reporting', 'Team management',
    'Priority support', 'Dedicated account manager', '99.9% uptime SLA',
  ]},
];

const featureMatrix = {
  Starter: {
    'Workspaces': '1', 'Contacts limit': '2,500', 'Connected sites': '5', 'Storage': '10GB',
    'AI content pieces/mo': '50', 'AI models access': '✓', 'Content Writer': '✓', 'SEO Engine': 'Basic',
    'Auto-indexing': '✓', 'Site Manager': '✓', 'Design Studio': 'Basic', 'Image Studio': '✓',
    'Video Editor': '✗', 'Music Creator': '✗', 'Presentations': '✗',
    'CRM & Contacts': '✓', 'Inbox (Unified)': '✓', 'Pipelines': '✓', 'Prospecting': 'Basic',
    'Email Marketing': '✓', 'SMS Marketing': '✓', 'WhatsApp': '✗', 'Social Planner': 'Basic',
    'Ad Manager': '✗', 'Campaign management': '✗', 'Creative library': '✗', 'Audiences': '✗',
    'Analytics & ROAS': '✗', 'Billing & payments': '✗', 'Automated rules': '✗',
    'Chatbots': '1', 'Workflows': 'Basic', 'Voice calls': '✗', 'Broadcasting': 'Basic',
    'Product research': 'Basic', 'Ad intelligence': 'Basic', 'UGC ads': '✗', 'Online store': 'Basic',
    'Payment processing': 'Basic', 'Invoices & payments': 'Basic',
    'Websites & funnels': 'Basic', 'Hosting & domains': 'Basic', 'Calendars': '✓', 'Courses & memberships': '✗',
    'Reviews & reputation': 'Basic', 'Code builder': 'Basic', 'Chat hub': '✓', 'Reports & analytics': 'Basic',
    'White-label branding': '✗', 'Custom domain': '✗', 'Client reporting': '✗', 'Team management': '✗',
    'Priority support': '✗', 'Dedicated account manager': '✗', '99.9% uptime SLA': '✗',
  },
  Pro: {
    'Workspaces': '3', 'Contacts limit': '25,000', 'Connected sites': '25', 'Storage': '100GB',
    'AI content pieces/mo': '500', 'AI models access': '✓', 'Content Writer': '✓', 'SEO Engine': '✓',
    'Auto-indexing': '✓', 'Site Manager': '✓', 'Design Studio': '✓', 'Image Studio': '✓',
    'Video Editor': '✓', 'Music Creator': '✓', 'Presentations': '✓',
    'CRM & Contacts': '✓', 'Inbox (Unified)': '✓', 'Pipelines': '✓', 'Prospecting': '✓',
    'Email Marketing': '✓', 'SMS Marketing': '✓', 'WhatsApp': '✓', 'Social Planner': '✓',
    'Ad Manager': '✓', 'Campaign management': '✓', 'Creative library': '✓', 'Audiences': '✓',
    'Analytics & ROAS': '✓', 'Billing & payments': '✓', 'Automated rules': '✓',
    'Chatbots': '5', 'Workflows': '✓', 'Voice calls': '✓', 'Broadcasting': '✓',
    'Product research': '✓', 'Ad intelligence': '✓', 'UGC ads': '✓', 'Online store': '✓',
    'Payment processing': '✓', 'Invoices & payments': '✓',
    'Websites & funnels': '✓', 'Hosting & domains': '✓', 'Calendars': '✓', 'Courses & memberships': '✓',
    'Reviews & reputation': '✓', 'Code builder': '✓', 'Chat hub': '✓', 'Reports & analytics': '✓',
    'White-label branding': '✗', 'Custom domain': '✗', 'Client reporting': '✗', 'Team management': '✗',
    'Priority support': '✓', 'Dedicated account manager': '✗', '99.9% uptime SLA': '✗',
  },
  Agency: {
    'Workspaces': '20', 'Contacts limit': '250,000', 'Connected sites': 'Unlimited', 'Storage': '1TB',
    'AI content pieces/mo': 'Unlimited', 'AI models access': '✓', 'Content Writer': '✓', 'SEO Engine': '✓',
    'Auto-indexing': '✓', 'Site Manager': '✓', 'Design Studio': '✓', 'Image Studio': '✓',
    'Video Editor': '✓', 'Music Creator': '✓', 'Presentations': '✓',
    'CRM & Contacts': '✓', 'Inbox (Unified)': '✓', 'Pipelines': '✓', 'Prospecting': '✓',
    'Email Marketing': '✓', 'SMS Marketing': '✓', 'WhatsApp': '✓', 'Social Planner': '✓',
    'Ad Manager': '✓', 'Campaign management': '✓', 'Creative library': '✓', 'Audiences': '✓',
    'Analytics & ROAS': '✓', 'Billing & payments': '✓', 'Automated rules': '✓',
    'Chatbots': 'Unlimited', 'Workflows': '✓', 'Voice calls': '✓', 'Broadcasting': '✓',
    'Product research': '✓', 'Ad intelligence': '✓', 'UGC ads': '✓', 'Online store': '✓',
    'Payment processing': '✓', 'Invoices & payments': '✓',
    'Websites & funnels': '✓', 'Hosting & domains': '✓', 'Calendars': '✓', 'Courses & memberships': '✓',
    'Reviews & reputation': '✓', 'Code builder': '✓', 'Chat hub': '✓', 'Reports & analytics': '✓',
    'White-label branding': '✓', 'Custom domain': '✓', 'Client reporting': '✓', 'Team management': '20 users',
    'Priority support': '✓', 'Dedicated account manager': '✓', '99.9% uptime SLA': '✓',
  },
};

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-nexus-bg">
      {/* Header */}
      <div className="bg-white border-b border-nexus-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-nexus-text-primary mb-4">
              Choose your plan
            </h1>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto mb-8">
              Start free and scale as you grow. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${!isYearly ? 'text-nexus-text-primary font-semibold' : 'text-nexus-text-secondary'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-nexus-blue' : 'bg-nexus-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isYearly ? 'text-nexus-text-primary font-semibold' : 'text-nexus-text-secondary'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="text-xs bg-nexus-green text-white px-2 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-nexus-blue shadow-xl scale-105'
                    : 'border-nexus-border shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-nexus-blue text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    plan.color === 'blue' ? 'bg-nexus-blue-light' :
                    plan.color === 'violet' ? 'bg-nexus-violet-light' :
                    'bg-nexus-green/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.color === 'blue' ? 'text-nexus-blue' :
                      plan.color === 'violet' ? 'text-nexus-violet' :
                      'text-nexus-green'
                    }`} />
                  </div>

                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-nexus-text-secondary mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-nexus-text-primary">
                      ${price}
                    </span>
                    <span className="text-nexus-text-secondary">
                      /{isYearly ? 'mo' : 'mo'}
                    </span>
                    {isYearly && (
                      <div className="text-sm text-nexus-text-tertiary">
                        billed annually
                      </div>
                    )}
                  </div>

                  <Link
                    href="/register"
                    className={`w-full btn ${
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-nexus-green mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-nexus-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-nexus-bg-secondary rounded-2xl p-8 border border-nexus-border">
            <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">
              Need more? Try Enterprise
            </h3>
            <p className="text-nexus-text-secondary mb-6 max-w-2xl mx-auto">
              Custom plans for large teams and platform resellers with unlimited everything,
              SSO/SAML authentication, custom infrastructure, and dedicated support.
            </p>
            <Link
              href="/contact"
              className="btn btn-secondary"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>

        {/* Feature Comparison Toggle */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="btn btn-secondary"
          >
            {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
          </button>
        </div>

        {/* Feature Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-white rounded-xl border border-nexus-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nexus-bg-secondary">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                      Starter
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                      Pro
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider">
                      Agency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nexus-border">
                  {allFeatures.map((category) => (
                    <>
                      <tr key={category.category} className="bg-nexus-bg-tertiary">
                        <td colSpan={4} className="p-4 font-semibold text-nexus-text-primary">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr key={feature} className="hover:bg-nexus-bg-secondary">
                          <td className="p-4 text-sm text-nexus-text-primary font-medium">
                            {feature}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm ${
                              (featureMatrix.Starter as any)[feature] === '✓' ? 'text-nexus-green font-semibold' :
                              (featureMatrix.Starter as any)[feature] === '✗' ? 'text-nexus-red' :
                              'text-nexus-text-primary'
                            }`}>
                              {(featureMatrix.Starter as any)[feature]}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm ${
                              (featureMatrix.Pro as any)[feature] === '✓' ? 'text-nexus-green font-semibold' :
                              (featureMatrix.Pro as any)[feature] === '✗' ? 'text-nexus-red' :
                              'text-nexus-text-primary'
                            }`}>
                              {(featureMatrix.Pro as any)[feature]}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-sm ${
                              (featureMatrix.Agency as any)[feature] === '✓' ? 'text-nexus-green font-semibold' :
                              (featureMatrix.Agency as any)[feature] === '✗' ? 'text-nexus-red' :
                              'text-nexus-text-primary'
                            }`}>
                              {(featureMatrix.Agency as any)[feature]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}