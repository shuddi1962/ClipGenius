'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function ContentGenerator() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    products: '',
    targetAudience: '',
    brandVoice: '',
    keyMessage: '',
    platform: 'instagram',
    contentType: 'carousel',
    duration: '7',
    goals: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
          <p className="text-gray-600">Generate marketing content, captions, and post ideas</p>

          {/* Quick Start Guide */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">🚀 Quick Start Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-indigo-900">1. Fill Business Form</div>
                <div className="text-xs text-indigo-700">Enter your business details</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-medium text-indigo-900">2. Choose Strategy</div>
                <div className="text-xs text-indigo-700">Platform & duration</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium text-indigo-900">3. Generate Content</div>
                <div className="text-xs text-indigo-700">AI creates your calendar</div>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm font-medium text-indigo-900">4. Export & Post</div>
                <div className="text-xs text-indigo-700">Share on social media</div>
              </div>
            </div>
          </div>

          {/* Roshanal Infotech Business Showcase */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">🏢 Featured Business: Roshanal Infotech Limited</h3>
                <p className="text-blue-700">Marine Equipment & Security Solutions • Port Harcourt, Nigeria</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">300%</div>
                <div className="text-sm text-blue-600">Engagement Increase</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Business Overview */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">📋 Business Overview</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Roshanal Infotech Limited is a technology and marine equipment solutions company based in Port Harcourt, Nigeria.
                  The business specializes in providing high-quality marine, security, and power solutions for individuals, businesses, and industrial operations.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg mb-1">🚤</div>
                    <div className="text-xs font-medium text-blue-900">Marine Equipment</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg mb-1">🛟</div>
                    <div className="text-xs font-medium text-green-900">Safety Gear</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg mb-1">📹</div>
                    <div className="text-xs font-medium text-purple-900">Security Systems</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg mb-1">☀️</div>
                    <div className="text-xs font-medium text-orange-900">Power Solutions</div>
                  </div>
                </div>
              </div>

              {/* Key Products */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🛠️ Core Products</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Fibre glass boats & engines</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Life jackets & safety kits</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span>CCTV & smart locks</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <span>Solar panels & inverters</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    <span>Installation services</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Voice & CTA */}
            <div className="mt-6 pt-4 border-t border-blue-200">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Brand Voice</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">"Safety First, Always"</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">"Reliable Technology"</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">"One-Stop Solution"</span>
                  </div>
                </div>
                <div className="text-center">
                  <Button size="sm" className="mb-2">
                    Generate Roshanal Content Plan
                  </Button>
                  <p className="text-xs text-gray-600">See their 7-day strategy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Content Strategies */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Featured Content Strategies</h3>
            <p className="text-blue-700 mb-3">Get inspired with our pre-built content strategies for different industries:</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors">
                🛟 Marine Safety Equipment
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors">
                🍽️ Restaurant & Food
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors">
                💼 Professional Services
              </button>
              <button className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 transition-colors">
                🛒 E-commerce Store
              </button>
            </div>
          </div>
        </div>

        {/* Content Templates Section */}
        <div className="mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Content Strategy Templates</h3>
            <p className="text-gray-600 mb-4">Choose from our pre-built content strategies or create your own custom plan:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Marine Safety Template */}
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🛟</span>
                  <h4 className="font-semibold text-blue-900">Marine Safety Equipment</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">Complete 7-day strategy for boat safety companies</p>
                <div className="text-xs text-blue-600">
                  <div>✅ Daily content themes</div>
                  <div>✅ Safety-focused messaging</div>
                  <div>✅ Professional voiceover scripts</div>
                </div>
              </div>

              {/* Restaurant Template */}
              <div className="p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🍽️</span>
                  <h4 className="font-semibold text-green-900">Restaurant & Food</h4>
                </div>
                <p className="text-sm text-green-700 mb-3">Engaging content for food businesses</p>
                <div className="text-xs text-green-600">
                  <div>✅ Menu highlights</div>
                  <div>✅ Customer testimonials</div>
                  <div>✅ Special promotions</div>
                </div>
              </div>

              {/* Professional Services Template */}
              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💼</span>
                  <h4 className="font-semibold text-purple-900">Professional Services</h4>
                </div>
                <p className="text-sm text-purple-700 mb-3">Authority-building content for consultants</p>
                <div className="text-xs text-purple-600">
                  <div>✅ Industry insights</div>
                  <div>✅ Case studies</div>
                  <div>✅ Lead generation</div>
                </div>
              </div>

              {/* E-commerce Template */}
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">🛒</span>
                  <h4 className="font-semibold text-orange-900">E-commerce Store</h4>
                </div>
                <p className="text-sm text-orange-700 mb-3">Product-focused content for online stores</p>
                <div className="text-xs text-orange-600">
                  <div>✅ Product showcases</div>
                  <div>✅ Customer reviews</div>
                  <div>✅ Shopping tips</div>
                </div>
              </div>

              {/* Technology Template */}
              <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">💻</span>
                  <h4 className="font-semibold text-indigo-900">Technology Solutions</h4>
                </div>
                <p className="text-sm text-indigo-700 mb-3">Tech education and innovation content</p>
                <div className="text-xs text-indigo-600">
                  <div>✅ Product demos</div>
                  <div>✅ Tech tips</div>
                  <div>✅ Industry news</div>
                </div>
              </div>

              {/* Custom Template */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border-dashed">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">✨</span>
                  <h4 className="font-semibold text-gray-900">Custom Strategy</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">Build your own content strategy</p>
                <div className="text-xs text-gray-600">
                  <div>🔧 Use form below</div>
                  <div>📊 AI-powered generation</div>
                  <div>🎯 Industry-specific</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sample Content Preview */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Sample Content Preview</h3>
            <p className="text-gray-600 mb-4">See what your generated content will look like:</p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium mr-2">Day 1</span>
                  <span className="text-sm font-medium text-gray-900">Marine Safety Essentials</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Roshanal Infotech Strategy</span>
                  <div className="text-xs text-blue-600 font-medium">Instagram Carousel</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Caption:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    🌊 MARINE SAFETY STARTS HERE 🌊<br/>
                    Your safety is our priority at Roshanal Infotech! We provide top-quality life jackets, life buoys, and marine safety kits for all your water safety needs.<br/>
                    <em>"Safety First, Always"</em><br/>
                    #MarineSafety #BoatSafety #LifeJacket #RoshanalInfotech
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Voiceover Script:</span>
                  <p className="text-sm text-blue-800 mt-1 italic">
                    "Hey everyone! Safety first when you're on the water! At Roshanal Infotech, we provide top-quality marine safety equipment including life jackets, life buoys, and complete safety kits. Don't risk it - stay safe with gear you can trust! Located in Port Harcourt for your convenience."
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Hashtags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">#MarineSafety</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">#BoatSafety</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">#LifeJacket</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">#RoshanalInfotech</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">#PortHarcourt</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Call-to-Action:</span>
                  <p className="text-sm text-green-800 mt-1">
                    DM "SAFETY" for your free marine safety checklist! 📞 Call 080-XXXX-XXXX | 📍 Port Harcourt, Nigeria
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-3">Generate complete 7/30-day content calendars with captions, hashtags, and strategies!</p>
              <Button variant="outline" size="sm">
                View Full Sample Strategy →
              </Button>
            </div>
          </Card>
        </div>

        {/* Content Tips Section */}
        <div className="mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Content Creation Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📸 Visual Content</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• High-quality photos (1080x1080)</li>
                  <li>• Consistent branding</li>
                  <li>• Show products in use</li>
                  <li>• Natural lighting</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">⏰ Posting Strategy</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Post consistently daily</li>
                  <li>• Optimal times: 7AM, 12PM, 6PM</li>
                  <li>• Mix content types</li>
                  <li>• Engage within 24 hours</li>
                </ul>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎯 Engagement Boost</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Ask questions in captions</li>
                  <li>• Use relevant hashtags</li>
                  <li>• Run polls and stories</li>
                  <li>• Respond to comments</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Roshanal Business Details */}
        <div className="mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Roshanal Infotech: Target Audience & Messaging</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Audience */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">👥 Target Audience</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Boat owners & marine transport operators</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Oil & gas companies & offshore workers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span>Fishermen & waterfront businesses</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <span>Homeowners & real estate developers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    <span>Corporate organizations & construction</span>
                  </div>
                </div>
              </div>

              {/* Key Messaging */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">💬 Key Messaging & Brand Voice</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900 mb-1">"Safety First, Always"</div>
                    <div className="text-sm text-blue-700">Core brand promise emphasizing safety</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900 mb-1">"Reliable Technology You Can Trust"</div>
                    <div className="text-sm text-green-700">Focus on quality and durability</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900 mb-1">"One-Stop Marine & Security Solution"</div>
                    <div className="text-sm text-purple-700">Comprehensive service offering</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-900 mb-1">"Power, Protection & Performance"</div>
                    <div className="text-sm text-orange-700">Complete solution promise</div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Professional Tone:</div>
                  <div className="text-sm text-gray-700">Trustworthy • Solution-driven • Persuasive • Local expertise</div>
                </div>
              </div>
            </div>

            {/* Content Direction */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">📱 Content Direction Ideas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg mb-1">🚤</div>
                  <div className="text-xs font-medium text-blue-900">Product Showcases</div>
                  <div className="text-xs text-blue-700">Boats, engines, CCTV</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg mb-1">🛟</div>
                  <div className="text-xs font-medium text-green-900">Safety Education</div>
                  <div className="text-xs text-green-700">Life jackets, tips</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs font-medium text-purple-900">Installation Stories</div>
                  <div className="text-xs text-purple-700">Before/after videos</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg mb-1">💬</div>
                  <div className="text-xs font-medium text-orange-900">Customer Testimonials</div>
                  <div className="text-xs text-orange-700">Success stories</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Success Stories Section */}
        <div className="mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🌟 Success Stories</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Roshanal Infotech Story */}
              <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🛟</span>
                    <div>
                      <h4 className="font-semibold text-blue-900">Roshanal Infotech Limited</h4>
                      <p className="text-sm text-blue-700">Marine & Security Solutions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">300%</div>
                    <div className="text-xs text-blue-600">Engagement</div>
                  </div>
                </div>
                <blockquote className="text-sm text-blue-800 italic mb-3">
                  "ClipGenius transformed our social media presence! The marine safety content strategy perfectly captured our 'Safety First, Always' brand voice and helped us connect with boat owners, fishermen, and businesses across Port Harcourt."
                </blockquote>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <span>📈 300% engagement increase</span>
                    <span>🎯 Port Harcourt focus</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <span>🚤 Marine equipment showcase</span>
                    <span>🛟 Safety gear promotion</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <span>📹 CCTV installation stories</span>
                    <span>☀️ Solar power solutions</span>
                  </div>
                </div>
              </div>

              {/* Restaurant Story */}
              <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🍽️</span>
                  <div>
                    <h4 className="font-semibold text-green-900">Bella's Kitchen</h4>
                    <p className="text-sm text-green-700">Fine Dining Restaurant</p>
                  </div>
                </div>
                <blockquote className="text-sm text-green-800 italic mb-3">
                  "The food content calendar helped us showcase our menu beautifully. Customer reservations increased by 150%!"
                </blockquote>
                <div className="flex items-center text-xs text-green-600">
                  <span>📈 150% reservation increase</span>
                  <span className="mx-2">•</span>
                  <span>🍽️ Menu-focused content</span>
                </div>
              </div>

              {/* Tech Company Story */}
              <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">💻</span>
                  <div>
                    <h4 className="font-semibold text-purple-900">TechFlow Solutions</h4>
                    <p className="text-sm text-purple-700">IT Consulting Firm</p>
                  </div>
                </div>
                <blockquote className="text-sm text-purple-800 italic mb-3">
                  "Our lead generation improved significantly. The professional content established us as industry experts."
                </blockquote>
                <div className="flex items-center text-xs text-purple-600">
                  <span>📈 200% lead increase</span>
                  <span className="mx-2">•</span>
                  <span>🎯 Authority building</span>
                </div>
              </div>

              {/* E-commerce Story */}
              <div className="p-4 border border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🛒</span>
                  <div>
                    <h4 className="font-semibold text-orange-900">StyleHub Online</h4>
                    <p className="text-sm text-orange-700">Fashion E-commerce</p>
                  </div>
                </div>
                <blockquote className="text-sm text-orange-800 italic mb-3">
                  "Product showcase content drove our sales up by 180%. The shopping tips series was a game-changer!"
                </blockquote>
                <div className="flex items-center text-xs text-orange-600">
                  <span>📈 180% sales increase</span>
                  <span className="mx-2">•</span>
                  <span>🛍️ Product-focused</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., Roshanal Infotech Limited"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select industry</option>
                    <option value="marine">Marine & Boat Equipment</option>
                    <option value="safety">Safety & Security</option>
                    <option value="technology">Technology Solutions</option>
                    <option value="energy">Power & Energy</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="food">Food & Beverage</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select business type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="service">Service Provider</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Boat owners, Fishermen, Businesses"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products/Services
                </label>
                <textarea
                  value={formData.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  placeholder="Describe your main products/services..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Brand & Content Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Voice
                  </label>
                  <select
                    value={formData.brandVoice}
                    onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select voice</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Message
                  </label>
                  <input
                    type="text"
                    value={formData.keyMessage}
                    onChange={(e) => handleInputChange('keyMessage', e.target.value)}
                    placeholder="e.g., Safety First, Always"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="all">All Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => handleInputChange('contentType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="carousel">Image Carousel</option>
                    <option value="video">Video Content</option>
                    <option value="mixed">Mixed Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Goals (Optional)
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="e.g., Increase brand awareness, drive sales, educate customers..."
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGenerate}
                  disabled={!formData.businessName || !formData.industry || !formData.products || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Generating Content Plan...' : 'Generate Content Plan'}
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {generatedContent && (
              <>
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 {formData.duration}-Day Content Calendar</h3>
                  <p className="text-gray-600 mb-4">
                    Complete social media strategy for {formData.businessName} targeting {formData.platform}
                  </p>

                  <div className="space-y-4">
                    {generatedContent.calendar?.map((day: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-indigo-600">
                            Day {day.day}: {day.theme}
                          </h4>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                            {day.platform}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Content Type</h5>
                            <p className="text-sm text-gray-600">{day.contentType}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Best Posting Time</h5>
                            <p className="text-sm text-gray-600">{day.postingTime}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Caption</h5>
                          <div className="p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                            <p className="text-gray-900 whitespace-pre-line">{day.caption}</p>
                          </div>
                        </div>

                        {day.voiceover && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">🎵 Voiceover Script</h5>
                            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                              <p className="text-gray-900 whitespace-pre-line">{day.voiceover}</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Hashtags</h5>
                          <div className="flex flex-wrap gap-2">
                            {day.hashtags?.map((hashtag: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {day.visualSuggestions && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">📸 Visual Suggestions</h5>
                            <p className="text-sm text-gray-600">{day.visualSuggestions}</p>
                          </div>
                        )}

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">🎯 Call-to-Action</h5>
                          <p className="text-sm text-gray-600">{day.cta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {generatedContent.summary && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Content Strategy Summary</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">{generatedContent.summary.totalPosts}</div>
                          <div className="text-sm text-gray-600">Total Posts</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">{generatedContent.summary.educationalPosts}</div>
                          <div className="text-sm text-gray-600">Educational</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-2xl font-bold text-purple-600">{generatedContent.summary.promotionalPosts}</div>
                          <div className="text-sm text-gray-600">Promotional</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-2xl font-bold text-orange-600">{generatedContent.summary.interactivePosts}</div>
                          <div className="text-sm text-gray-600">Interactive</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Content Creation Guide</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tools Recommended:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li><strong>Canva:</strong> Free design tool for carousels and graphics</li>
                        <li><strong>CapCut:</strong> Free video editor for TikTok/Reels</li>
                        <li><strong>Buffer/Later:</strong> Social media scheduling</li>
                        <li><strong>Phone Camera:</strong> High-quality product photos</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Post consistently at optimal times</li>
                        <li>Use high-quality, well-lit photos</li>
                        <li>Include relevant hashtags (5-10 per post)</li>
                        <li>Always add clear call-to-actions</li>
                        <li>Engage with comments within 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="secondary">Save Content Plan</Button>
                  <Button variant="outline">Download as PDF</Button>
                  <Button variant="outline">Export to CSV</Button>
                  <Button variant="outline">Share Plan</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}