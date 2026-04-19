'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Users, MapPin, Globe, Instagram, Linkedin, Facebook, Building, Target } from 'lucide-react'

interface ScrapingResult {
  leads_scraped: number
  leads: any[]
}

interface ScrapingForm {
  source: 'gmb' | 'google' | 'instagram' | 'linkedin' | 'facebook' | 'website' | 'vibeprospecting'
  query: string
  location: string
  industry?: string
  company_size?: string
  title?: string
  limit: number
}

export default function LeadScraping() {
  const [formData, setFormData] = useState<ScrapingForm>({
    source: 'gmb',
    query: '',
    location: '',
    limit: 50
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ScrapingResult | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const sources = [
    {
      id: 'gmb' as const,
      name: 'Google My Business',
      icon: Building,
      description: 'Find local businesses with contact info',
      placeholder: 'restaurant, hotel, clinic...',
      requiresLocation: true
    },
    {
      id: 'google' as const,
      name: 'Google Search',
      icon: Search,
      description: 'Search for businesses and websites',
      placeholder: 'company name or industry',
      requiresLocation: false
    },
    {
      id: 'instagram' as const,
      name: 'Instagram',
      icon: Instagram,
      description: 'Find businesses on Instagram',
      placeholder: '#hashtag or @username',
      requiresLocation: false
    },
    {
      id: 'linkedin' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      description: 'Find companies and professionals',
      placeholder: 'company name or industry',
      requiresLocation: false
    },
    {
      id: 'facebook' as const,
      name: 'Facebook',
      icon: Facebook,
      description: 'Find pages and groups',
      placeholder: 'page name or group',
      requiresLocation: false
    },
    {
      id: 'website' as const,
      name: 'Website Contact',
      icon: Globe,
      description: 'Extract contacts from any website',
      placeholder: 'https://example.com',
      requiresLocation: false
    },
    {
      id: 'vibeprospecting' as const,
      name: 'VibeProspecting',
      icon: Target,
      description: 'B2B lead discovery with advanced filters',
      placeholder: 'keywords, company names...',
      requiresLocation: false
    }
  ]

  const currentSource = sources.find(s => s.id === formData.source)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/leads/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Scraping failed')
      }

      setResults(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Scraping failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ScrapingForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Lead Scraping</h1>
            <p className="text-gray-300">Automatically find and import leads from various sources</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            View All Leads
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scraping Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Scrape Leads</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Data Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sources.map((source) => {
                    const Icon = source.icon
                    return (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => handleInputChange('source', source.id)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          formData.source === source.id
                            ? 'border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF]'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <div className="text-sm font-medium">{source.name}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Query Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={formData.query}
                  onChange={(e) => handleInputChange('query', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder={currentSource?.placeholder || 'Enter search query'}
                  required
                />
              </div>

              {/* Location Input (conditional) */}
              {currentSource?.requiresLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                      placeholder="City, State or Country"
                      required
                    />
                  </div>
                </div>
              )}

              {/* VibeProspecting Filters */}
              {formData.source === 'vibeprospecting' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                      placeholder="Technology, Healthcare..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Size
                    </label>
                    <select
                      value={formData.company_size || ''}
                      onChange={(e) => handleInputChange('company_size', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    >
                      <option value="">Any size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                      placeholder="CEO, Manager, Director..."
                    />
                  </div>
                </div>
              )}

              {/* Limit Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Results (1-200)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.limit}
                  onChange={(e) => handleInputChange('limit', parseInt(e.target.value) || 50)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.query}
                className="w-full bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Scraping...
                  </div>
                ) : (
                  `Scrape ${currentSource?.name} Leads`
                )}
              </button>
            </form>

            {/* Cost Information */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center text-blue-400 mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Estimated Cost</span>
              </div>
              <p className="text-blue-300 text-sm">
                ~${(formData.limit * 0.02).toFixed(2)} for {formData.limit} leads
              </p>
              <p className="text-blue-300/70 text-xs mt-1">
                Billed to your account after successful scraping
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {results ? (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Scraping Results</h2>
                <div className="text-[#00F5FF] font-semibold">
                  {results.leads_scraped} leads found
                </div>
              </div>

              {results.leads.length > 0 ? (
                <div className="space-y-4">
                  {results.leads.map((lead, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 border border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {lead.company || `${lead.first_name} ${lead.last_name}` || 'Unknown'}
                          </h3>
                          <div className="text-sm text-gray-300 mt-1">
                            {lead.email && <div>📧 {lead.email}</div>}
                            {lead.phone && <div>📞 {lead.phone}</div>}
                            {lead.website && <div>🌐 {lead.website}</div>}
                            {lead.city && lead.country && <div>📍 {lead.city}, {lead.country}</div>}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 uppercase">
                          {lead.source}
                        </div>
                      </div>
                    </div>
                  ))}

                  {results.leads_scraped > 10 && (
                    <div className="text-center py-4">
                      <p className="text-gray-400">
                        And {results.leads_scraped - 10} more leads saved to your database
                      </p>
                      <Link
                        href="/dashboard/leads"
                        className="inline-block mt-2 text-[#00F5FF] hover:text-[#00F5FF]/80 transition-colors"
                      >
                        View All Leads →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No leads found matching your criteria</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search query or location</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Scrape</h3>
                <p className="text-gray-400 mb-6">
                  Select a data source and enter your search criteria to start finding leads
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Google My Business: Best for local business contact info</p>
                  <p>• Instagram: Great for social media presence</p>
                  <p>• LinkedIn: Professional contacts and companies</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}