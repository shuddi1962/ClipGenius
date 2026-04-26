import Link from 'next/link'
import { ArrowLeft, Book, Code, Settings, Zap, Users, Shield } from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function Docs() {
  const docSections = [
    {
      title: "Getting Started",
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      description: "Quick start guides and platform overview",
      articles: [
        { title: "Platform Overview", time: "5 min read" },
        { title: "Setting Up Your Account", time: "3 min read" },
        { title: "First Campaign Setup", time: "10 min read" },
        { title: "Business Profile Configuration", time: "8 min read" }
      ]
    },
    {
      title: "AI Features",
      icon: <Book className="w-6 h-6 text-blue-600" />,
      description: "Learn about our AI-powered marketing tools",
      articles: [
        { title: "Content Generation Guide", time: "12 min read" },
        { title: "AI Lead Qualification", time: "8 min read" },
        { title: "Voice Agent Setup", time: "15 min read" },
        { title: "Competitor Analysis", time: "6 min read" }
      ]
    },
    {
      title: "Integrations",
      icon: <Code className="w-6 h-6 text-green-600" />,
      description: "Connect with your favorite tools and platforms",
      articles: [
        { title: "Social Media Platforms", time: "10 min read" },
        { title: "Email Service Providers", time: "7 min read" },
        { title: "CRM Integrations", time: "9 min read" },
        { title: "API Reference", time: "20 min read" }
      ]
    },
    {
      title: "Automation",
      icon: <Settings className="w-6 h-6 text-purple-600" />,
      description: "Build workflows and automate your marketing",
      articles: [
        { title: "Campaign Automation", time: "14 min read" },
        { title: "Drip Sequence Setup", time: "11 min read" },
        { title: "Workflow Builder", time: "16 min read" },
        { title: "Trigger Configuration", time: "8 min read" }
      ]
    },
    {
      title: "Account Management",
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      description: "Manage your account, billing, and team",
      articles: [
        { title: "Team Collaboration", time: "6 min read" },
        { title: "Billing & Subscriptions", time: "5 min read" },
        { title: "User Permissions", time: "7 min read" },
        { title: "Account Security", time: "4 min read" }
      ]
    },
    {
      title: "Security & Compliance",
      icon: <Shield className="w-6 h-6 text-red-600" />,
      description: "Privacy, security, and regulatory compliance",
      articles: [
        { title: "Data Protection", time: "8 min read" },
        { title: "GDPR Compliance", time: "10 min read" },
        { title: "Security Best Practices", time: "6 min read" },
        { title: "Compliance Checklist", time: "5 min read" }
      ]
    }
  ]

  const quickStart = [
    "Create your account and verify email",
    "Set up your business profile",
    "Connect your social media accounts",
    "Configure email and SMS settings",
    "Create your first AI-generated content",
    "Set up automated campaigns",
    "Monitor performance and optimize"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Comprehensive guides, API references, and best practices to help you
            master ClipGenius and automate your marketing success.
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start">
            <div className="mr-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
              <p className="text-gray-700 mb-6">
                Get up and running with ClipGenius in just 7 steps. Follow this guide
                to set up your account and launch your first automated campaign.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {quickStart.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/register">
                  <Button size="lg">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Documentation Sections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Documentation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docSections.map((section, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {section.description}
                </p>
                <div className="space-y-3">
                  {section.articles.map((article, articleIndex) => (
                    <div key={articleIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                        {article.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {article.time}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Articles
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Help & Support */}
        <Card className="p-8 bg-gray-900 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Get answers to your questions
              and make the most of ClipGenius.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Documentation</h3>
                <p className="text-gray-300">Browse our comprehensive guides and tutorials</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-300">Connect with other users and share best practices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Support</h3>
                <p className="text-gray-300">Get help from our expert support team</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Join Community
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}