'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Upload, Globe, FileText, Users, Share2 } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface OnboardingData {
  businessSource: {
    type: 'url' | 'image' | 'text' | 'doc' | null
    content: string
  }
  audience: {
    industry: string
    geography: string
    customerType: 'B2B' | 'B2C' | 'Both'
    companySize: string
  }
  socialAccounts: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
    tiktok: string
  }
  communication: {
    email: string
    whatsapp: string
  }
  competitors: string[]
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    businessSource: {
      type: null,
      content: ''
    },
    audience: {
      industry: '',
      geography: '',
      customerType: 'B2B',
      companySize: ''
    },
    socialAccounts: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      tiktok: ''
    },
    communication: {
      email: '',
      whatsapp: ''
    },
    competitors: []
  })

  const steps = [
    { id: 1, title: 'Add Your Business', icon: Globe },
    { id: 2, title: 'Define Audience', icon: Users },
    { id: 3, title: 'Connect Social', icon: Share2 },
    { id: 4, title: 'Communication', icon: Upload },
    { id: 5, title: 'Competitors', icon: FileText }
  ]

  const updateData = (section: keyof OnboardingData, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Get current user
      const { data: userData, error: userError } = await insforge.auth.getUser()
      if (userError || !userData.user) {
        router.push('/login')
        return
      }

      // Get or create workspace
      let { data: workspace, error: workspaceError } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (workspaceError || !workspace) {
        // Create workspace if it doesn't exist
        const { data: newWorkspace, error: createError } = await insforge
          .from('workspaces')
          .insert({
            user_id: userData.user.id,
            business_name: 'My Business' // Default name, can be updated later
          })
          .select('id')
          .single()

        if (createError || !newWorkspace) {
          console.error('Error creating workspace:', createError)
          return
        }
        workspace = newWorkspace
      }

      const workspaceId = workspace.id

      // Save business source
      if (data.businessSource.type && data.businessSource.content) {
        await insforge.from('business_sources').insert({
          workspace_id: workspaceId,
          type: data.businessSource.type,
          raw_content: data.businessSource.content
        })
      }

      // Update workspace with audience info
      await insforge.from('workspaces').update({
        business_profile_json: {
          industry: data.audience.industry,
          geography: data.audience.geography,
          customer_type: data.audience.customerType,
          company_size: data.audience.companySize
        }
      }).eq('id', workspaceId)

      // Save social accounts
      const socialAccounts = Object.entries(data.socialAccounts)
        .filter(([_, value]) => value)
        .map(([platform, accountName]) => ({
          workspace_id: workspaceId,
          platform,
          account_name: accountName
        }))

      if (socialAccounts.length > 0) {
        await insforge.from('connected_accounts').insert(socialAccounts)
      }

      // Update user settings
      await insforge.from('user_settings').upsert({
        user_id: userData.user.id,
        niche: data.audience.industry,
        location: data.audience.geography,
        target_audience: data.audience.customerType,
        website: data.communication.email,
        whatsapp: data.communication.whatsapp
      })

      // Save competitors
      if (data.competitors.length > 0) {
        const competitorInserts = data.competitors.map(url => ({
          workspace_id: workspaceId,
          website: url
        }))
        await insforge.from('competitors').insert(competitorInserts)
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Tell Us About Your Business</h2>
              <p className="text-gray-300">Choose how you'd like the AI to learn about your company</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => updateData('businessSource', { ...data.businessSource, type: 'url' })}
                className={`p-6 border-2 rounded-xl text-left transition-all ${
                  data.businessSource.type === 'url'
                    ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                    : 'border-gray-600 hover:border-[#00F5FF]/50'
                }`}
              >
                <Globe className="w-8 h-8 text-[#00F5FF] mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Website URL</h3>
                <p className="text-gray-300">Enter your website URL and we'll scrape it automatically</p>
              </button>

              <button
                onClick={() => updateData('businessSource', { ...data.businessSource, type: 'image' })}
                className={`p-6 border-2 rounded-xl text-left transition-all ${
                  data.businessSource.type === 'image'
                    ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                    : 'border-gray-600 hover:border-[#00F5FF]/50'
                }`}
              >
                <Upload className="w-8 h-8 text-[#00F5FF] mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Upload Image/Document</h3>
                <p className="text-gray-300">Upload a flyer, brochure, or business card</p>
              </button>

              <button
                onClick={() => updateData('businessSource', { ...data.businessSource, type: 'text' })}
                className={`p-6 border-2 rounded-xl text-left transition-all md:col-span-2 ${
                  data.businessSource.type === 'text'
                    ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                    : 'border-gray-600 hover:border-[#00F5FF]/50'
                }`}
              >
                <FileText className="w-8 h-8 text-[#00F5FF] mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Describe Your Business</h3>
                <p className="text-gray-300">Tell us about your business in your own words</p>
              </button>
            </div>

            {data.businessSource.type && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {data.businessSource.type === 'url' ? 'Website URL' :
                   data.businessSource.type === 'image' ? 'Image URL or Upload' : 'Business Description'}
                </label>
                {data.businessSource.type === 'text' ? (
                  <textarea
                    value={data.businessSource.content}
                    onChange={(e) => updateData('businessSource', { ...data.businessSource, content: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    rows={4}
                    placeholder="Describe your business, products, services, target audience..."
                  />
                ) : (
                  <input
                    type={data.businessSource.type === 'url' ? 'url' : 'text'}
                    value={data.businessSource.content}
                    onChange={(e) => updateData('businessSource', { ...data.businessSource, content: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder={data.businessSource.type === 'url' ? 'https://yourwebsite.com' : 'Upload or enter image URL'}
                  />
                )}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Define Your Target Audience</h2>
              <p className="text-gray-300">Help us understand who you serve</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Industry/Niche</label>
                <input
                  type="text"
                  value={data.audience.industry}
                  onChange={(e) => updateData('audience', { ...data.audience, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="e.g., Technology, Healthcare, Real Estate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Geography</label>
                <input
                  type="text"
                  value={data.audience.geography}
                  onChange={(e) => updateData('audience', { ...data.audience, geography: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="e.g., United States, Nigeria, Worldwide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Type</label>
                <select
                  value={data.audience.customerType}
                  onChange={(e) => updateData('audience', { ...data.audience, customerType: e.target.value as 'B2B' | 'B2C' | 'Both' })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="B2B">Business-to-Business (B2B)</option>
                  <option value="B2C">Business-to-Consumer (B2C)</option>
                  <option value="Both">Both B2B and B2C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Size (if B2B)</label>
                <select
                  value={data.audience.companySize}
                  onChange={(e) => updateData('audience', { ...data.audience, companySize: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="">Not applicable</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Connect Social Accounts</h2>
              <p className="text-gray-300">Link your social media accounts for automated posting</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(data.socialAccounts).map(([platform, value]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {platform} {platform === 'twitter' ? '(X)' : ''} Account
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateData('socialAccounts', { ...data.socialAccounts, [platform]: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder={`@${platform}account`}
                  />
                </div>
              ))}
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> You'll need to connect these accounts in your dashboard settings after onboarding.
                For now, just enter your account names.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Communication Channels</h2>
              <p className="text-gray-300">Set up your email and messaging preferences</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={data.communication.email}
                  onChange={(e) => updateData('communication', { ...data.communication, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={data.communication.whatsapp}
                  onChange={(e) => updateData('communication', { ...data.communication, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> Email and WhatsApp setup will be configured in your dashboard integrations section.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Monitor Competitors</h2>
              <p className="text-gray-300">Enter competitor websites to track their strategies</p>
            </div>

            <div className="space-y-4">
              {data.competitors.map((competitor, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="url"
                    value={competitor}
                    onChange={(e) => {
                      const newCompetitors = [...data.competitors]
                      newCompetitors[index] = e.target.value
                      updateData('competitors', newCompetitors)
                    }}
                    className="flex-1 px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="https://competitor.com"
                  />
                  <button
                    onClick={() => {
                      const newCompetitors = data.competitors.filter((_, i) => i !== index)
                      updateData('competitors', newCompetitors)
                    }}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => updateData('competitors', [...data.competitors, ''])}
                className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-[#00F5FF] rounded-lg text-gray-400 hover:text-[#00F5FF] transition-colors"
              >
                + Add Another Competitor
              </button>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm">
                <strong>Pro tip:</strong> We'll automatically analyze their content, posting frequency, and engagement strategies to help you compete better.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#050A18] text-white">
      {/* Progress Bar */}
      <div className="bg-black/30 border-b border-[#00F5FF]/10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? 'text-[#00F5FF]' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 ${
                    step.id < currentStep
                      ? 'bg-[#00F5FF] border-[#00F5FF] text-black'
                      : step.id === currentStep
                      ? 'border-[#00F5FF] text-[#00F5FF]'
                      : 'border-gray-600'
                  }`}>
                    {step.id < currentStep ? <span>✓</span> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              )
            })}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-gray-600 rounded-lg hover:border-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Setting Up...' : 'Complete Setup'}
            </button>
          )}
        </div>

        {/* Skip option */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-[#00F5FF] transition-colors text-sm"
          >
            Skip for now → Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}