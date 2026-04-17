'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050A18] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#FFB800]/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F5FF]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">⚡</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#00F5FF] to-[#FFB800] bg-clip-text text-transparent">
            ClipGenius
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center space-x-8"
        >
          <a href="#features" className="text-gray-300 hover:text-[#00F5FF] transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-[#00F5FF] transition-colors">Pricing</a>
          <a href="#integrations" className="text-gray-300 hover:text-[#00F5FF] transition-colors">Integrations</a>
          <a href="#about" className="text-gray-300 hover:text-[#00F5FF] transition-colors">About</a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-4"
        >
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
          >
            Start Free →
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              The AI That Grows Your
              <br />
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] bg-clip-text text-transparent">
                Business While You Sleep
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Scrape leads, qualify prospects, send campaigns, post content, and close deals — all automated.
              Built for businesses worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#00F5FF]/50 transition-all transform hover:scale-105"
              >
                Start Free Today
              </Link>
              <button className="border border-[#00F5FF]/50 text-[#00F5FF] px-8 py-4 rounded-xl font-semibold hover:bg-[#00F5FF]/10 transition-all">
                ▶ Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-black/30 backdrop-blur-sm border border-[#00F5FF]/20 rounded-2xl p-6 max-w-md mx-auto"
          >
            <div className="text-3xl font-bold text-[#00F5FF] mb-2">47,392</div>
            <div className="text-gray-400">Leads Generated Today</div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From lead generation to customer conversion, we've automated the entire sales funnel.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Lead Scraping',
                description: 'Google, GMB, Social, Web — find prospects automatically'
              },
              {
                icon: '🎯',
                title: 'AI Qualification',
                description: 'Score and segment leads based on your ideal customer profile'
              },
              {
                icon: '📧',
                title: 'Outreach Automation',
                description: 'Email, WhatsApp, SMS, Voice — multi-channel campaigns'
              },
              {
                icon: '📊',
                title: 'Competitor Intelligence',
                description: 'Monitor rivals and discover untapped opportunities'
              },
              {
                icon: '📱',
                title: 'Social Auto-Publishing',
                description: 'All platforms, scheduled or live posting'
              },
              {
                icon: '🤖',
                title: 'Business-Trained AI Agent',
                description: 'Knows YOUR business and handles customer interactions'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/20 backdrop-blur-sm border border-[#00F5FF]/10 rounded-2xl p-8 hover:border-[#00F5FF]/30 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#00F5FF]">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free, scale as you grow. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: [
                  '50 leads/month',
                  '1 email campaign',
                  '2 social accounts',
                  'Basic AI features',
                  'Community support'
                ],
                cta: 'Get Started',
                popular: false
              },
              {
                name: 'Pro',
                price: '$79',
                period: 'per month',
                features: [
                  '5,000 leads/month',
                  'Unlimited campaigns',
                  '15 social accounts',
                  'Voice calls (200/month)',
                  'Priority support',
                  'Advanced analytics'
                ],
                cta: 'Start Pro Trial',
                popular: true
              },
              {
                name: 'Agency',
                price: '$199',
                period: 'per month',
                features: [
                  'Unlimited everything',
                  'White-label option',
                  '20 team members',
                  '1,000 voice calls',
                  'Dedicated support',
                  'Custom integrations'
                ],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative bg-black/20 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-[#00F5FF] shadow-2xl shadow-[#00F5FF]/20'
                    : 'border-[#00F5FF]/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-5xl font-bold mb-1 text-[#00F5FF]">
                    {plan.price}
                  </div>
                  <div className="text-gray-400">{plan.period}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <span className="text-[#00F5FF] mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Free' ? '/register' : '/register?plan=' + plan.name.toLowerCase()}
                  className={`w-full block text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black hover:shadow-2xl hover:shadow-[#00F5FF]/50'
                      : 'border border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#00F5FF]/10 to-[#FFB800]/10 border border-[#00F5FF]/20 rounded-3xl p-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Automate Your Growth?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using ClipGenius to scale their marketing efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#00F5FF]/50 transition-all transform hover:scale-105"
            >
              Start Free Today
            </Link>
            <Link
              href="#features"
              className="border border-[#00F5FF]/50 text-[#00F5FF] px-8 py-4 rounded-xl font-semibold hover:bg-[#00F5FF]/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00F5FF]/10 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">⚡</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00F5FF] to-[#FFB800] bg-clip-text text-transparent">
                  ClipGenius
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The AI that grows your business while you sleep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#00F5FF] transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-[#00F5FF] transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-[#00F5FF] transition-colors">Twitter</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#00F5FF]">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#00F5FF]">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#00F5FF]">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#00F5FF]/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ClipGenius. All rights reserved. Available Worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}