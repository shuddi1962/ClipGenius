'use client'

import { useState, useEffect } from 'react'
import { Building, Globe, Phone, Mail, MapPin, Users, DollarSign, FileText, Upload, Save } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface BusinessProfile {
  name: string
  industry: string
  description: string
  website: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  employee_count: string
  revenue_range: string
  target_audience: string
  products: string[]
}

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    industry: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    employee_count: '',
    revenue_range: '',
    target_audience: '',
    products: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBusinessProfile()
  }, [])

  const loadBusinessProfile = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('*')
        .eq('user_id', userData.user.id)
        .single()

      if (workspace) {
        setProfile({
          name: workspace.business_name || '',
          industry: workspace.business_profile_json?.industry || '',
          description: workspace.business_profile_json?.description || '',
          website: workspace.business_profile_json?.website || '',
          phone: workspace.business_profile_json?.phone || '',
          email: workspace.business_profile_json?.email || '',
          address: workspace.business_profile_json?.address || '',
          city: workspace.business_profile_json?.city || '',
          country: workspace.business_profile_json?.country || '',
          employee_count: workspace.business_profile_json?.employee_count || '',
          revenue_range: workspace.business_profile_json?.revenue_range || '',
          target_audience: workspace.business_profile_json?.target_audience || '',
          products: workspace.business_profile_json?.products || []
        })
      }
    } catch (error) {
      console.error('Error loading business profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      await insforge
        .from('workspaces')
        .update({
          business_name: profile.name,
          business_profile_json: {
            industry: profile.industry,
            description: profile.description,
            website: profile.website,
            phone: profile.phone,
            email: profile.email,
            address: profile.address,
            city: profile.city,
            country: profile.country,
            employee_count: profile.employee_count,
            revenue_range: profile.revenue_range,
            target_audience: profile.target_audience,
            products: profile.products
          }
        })
        .eq('user_id', userData.user.id)

      alert('Business profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addProduct = () => {
    setProfile(prev => ({
      ...prev,
      products: [...prev.products, '']
    }))
  }

  const updateProduct = (index: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      products: prev.products.map((product, i) => i === index ? value : product)
    }))
  }

  const removeProduct = (index: number) => {
    setProfile(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Business Profile</h1>
        <p className="text-gray-300">Define your business details and help our AI understand your brand</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Building className="w-5 h-5 mr-3 text-blue-400" />
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Description
                </label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Describe your business, mission, and what you do..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-3 text-green-400" />
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="contact@yourcompany.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  value={profile.country}
                  onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="123 Business St, Suite 100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-3 text-purple-400" />
              Business Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Size
                </label>
                <select
                  value={profile.employee_count}
                  onChange={(e) => setProfile(prev => ({ ...prev, employee_count: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Revenue Range
                </label>
                <select
                  value={profile.revenue_range}
                  onChange={(e) => setProfile(prev => ({ ...prev, revenue_range: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="">Select Range</option>
                  <option value="Under $100K">Under $100K</option>
                  <option value="$100K - $500K">$100K - $500K</option>
                  <option value="$500K - $1M">$500K - $1M</option>
                  <option value="$1M - $5M">$1M - $5M</option>
                  <option value="$5M - $10M">$5M - $10M</option>
                  <option value="$10M+">$10M+</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={profile.target_audience}
                  onChange={(e) => setProfile(prev => ({ ...prev, target_audience: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Describe your ideal customers (age, industry, pain points, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Products & Services */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-yellow-400" />
                Products & Services
              </h2>
              <button
                onClick={addProduct}
                className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg hover:bg-[#00F5FF]/80 transition-colors text-sm font-medium"
              >
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {profile.products.map((product, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => updateProduct(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="Product or service name"
                  />
                  <button
                    onClick={() => removeProduct(index)}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {profile.products.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No products added yet. Add your main products or services to help our AI understand your offerings.</p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
            >
              <Save className="w-5 h-5 mr-3" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
            <div className="space-y-3">
              {[
                { label: 'Business Name', completed: !!profile.name },
                { label: 'Industry', completed: !!profile.industry },
                { label: 'Description', completed: !!profile.description },
                { label: 'Contact Info', completed: !!(profile.website || profile.phone || profile.email) },
                { label: 'Address', completed: !!(profile.address && profile.city && profile.country) },
                { label: 'Business Details', completed: !!(profile.employee_count && profile.revenue_range) },
                { label: 'Target Audience', completed: !!profile.target_audience },
                { label: 'Products', completed: profile.products.length > 0 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm ${item.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00F5FF]">
                  {Math.round(([
                    !!profile.name, !!profile.industry, !!profile.description,
                    !!(profile.website || profile.phone || profile.email),
                    !!(profile.address && profile.city && profile.country),
                    !!(profile.employee_count && profile.revenue_range),
                    !!profile.target_audience, profile.products.length > 0
                  ].filter(Boolean).length / 8) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p>💡 <strong>Pro tip:</strong> The more detailed your business profile, the better our AI can generate personalized content and qualify leads.</p>
              </div>
              <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p>🎯 <strong>Lead scoring:</strong> Your target audience details help our AI score leads more accurately.</p>
              </div>
              <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <p>📝 <strong>Content generation:</strong> Product information enables better marketing copy and campaign suggestions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}