'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function Settings() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const [settings, setSettings] = useState({
    aiProvider: 'openrouter', // openrouter or kie
    openrouterKey: '',
    kieKey: '',
    searchKey: '',
    searchProvider: 'tavily', // tavily or serper
    selectedModel: 'anthropic/claude-3.5-sonnet',
    kieModel: 'kie/grok-2-1212',
    companyName: 'Roshanal Infotech Limited',
    niche: 'Security Systems, Marine Equipment, Solar Installation',
    location: 'Port Harcourt, Rivers State, Nigeria',
    tone: 'Professional, trustworthy, solution-focused',
    targetAudience: 'Oil & gas companies, boat owners, homes, businesses, Niger Delta region',
    products: 'CCTV, Smart Locks, Car Trackers, Solar, Outboard Engines, Fiberglass Boats, Marine Accessories',
    whatsapp: '08109522432',
    website: 'www.roshanalinfotech.com',
    address: 'No 18A Rumuola/Rumuadaolu Road, Adjacent Rumuadaolu Town Hall, Port Harcourt, Rivers State'
  })

  const [showKeys, setShowKeys] = useState({
    openrouter: false,
    kie: false,
    search: false
  })

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('roshanal_admin_auth') === 'true'
    setIsAdminAuthenticated(isAuthenticated)
  }, [])

  // Load settings from localStorage on mount
  useEffect(() => {
    if (!isAdminAuthenticated) return

    const savedSettings = localStorage.getItem('roshanal_settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(prev => ({ ...prev, ...parsed }))
    }

    // Load API keys separately for security
    const openrouterKey = localStorage.getItem('roshanal_openrouter_key')
    const kieKey = localStorage.getItem('roshanal_kie_key')
    const searchKey = localStorage.getItem('roshanal_search_key')
    const aiProvider = localStorage.getItem('roshanal_ai_provider') || 'openrouter'
    const selectedModel = localStorage.getItem('roshanal_model') || 'anthropic/claude-3.5-sonnet'
    const kieModel = localStorage.getItem('roshanal_kie_model') || 'kie/grok-2-1212'

    setSettings(prev => ({
      ...prev,
      openrouterKey: openrouterKey || '',
      kieKey: kieKey || '',
      searchKey: searchKey || '',
      aiProvider,
      selectedModel,
      kieModel
    }))
  }, [isAdminAuthenticated])

  const handleAdminLogin = () => {
    // Simple admin password check - in production, use proper authentication
    if (adminPassword === 'roshanal2026') {
      localStorage.setItem('roshanal_admin_auth', 'true')
      setIsAdminAuthenticated(true)
      toast.success('Admin authentication successful')
    } else {
      toast.error('Invalid admin password')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    try {
      // Save API keys and preferences separately
      localStorage.setItem('roshanal_openrouter_key', settings.openrouterKey)
      localStorage.setItem('roshanal_kie_key', settings.kieKey)
      localStorage.setItem('roshanal_search_key', settings.searchKey)
      localStorage.setItem('roshanal_ai_provider', settings.aiProvider)
      localStorage.setItem('roshanal_model', settings.selectedModel)
      localStorage.setItem('roshanal_kie_model', settings.kieModel)

      // Save other settings (exclude API keys for security)
      const { openrouterKey, kieKey, searchKey, ...settingsToSave } = settings
      localStorage.setItem('roshanal_settings', JSON.stringify(settingsToSave))

      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Error saving settings. Please try again.')
    }
  }

  const openrouterModels = [
    { value: 'google/gemini-2.0-flash', label: 'Google Gemini 2.0 Flash', description: 'Fast, cost-effective' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Best for creative writing' },
    { value: 'openai/gpt-4o', label: 'GPT-4o', description: 'Balanced performance' },
    { value: 'mistralai/mistral-large', label: 'Mistral Large', description: 'Fast European model' },
    { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', description: 'Open-source alternative' },
    { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1', description: 'Reasoning-focused' }
  ]

  const kieModels = [
    { value: 'kie/grok-2-1212', label: 'Grok 2', description: 'xAI\'s advanced reasoning model' },
    { value: 'kie/grok-2-beta', label: 'Grok 2 Beta', description: 'Latest Grok iteration' },
    { value: 'kie/grok-1.5', label: 'Grok 1.5', description: 'Stable production model' },
    { value: 'kie/grok-vision', label: 'Grok Vision', description: 'Multi-modal with image understanding' },
    { value: 'kie/grok-code', label: 'Grok Code', description: 'Specialized for programming tasks' }
  ]

  // Admin authentication check
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-roshanal-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-roshanal-navy mb-2">Admin Access Required</h1>
            <p className="text-gray-600">Enter admin password to access settings</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{authError}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <Button onClick={handleAdminLogin} className="w-full bg-roshanal-navy hover:bg-roshanal-blue">
              Access Settings
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Settings</h1>
        <p className="text-gray-600">Configure your AI models and company profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Provider Selection */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Provider</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Service Provider
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="openrouter"
                      checked={settings.aiProvider === 'openrouter'}
                      onChange={(e) => handleInputChange('aiProvider', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">OpenRouter (Multiple AI models)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="kie"
                      checked={settings.aiProvider === 'kie'}
                      onChange={(e) => handleInputChange('aiProvider', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">kie.ai (xAI Grok models)</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* OpenRouter API */}
          {settings.aiProvider === 'openrouter' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">OpenRouter Configuration</h2>

              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.openrouter ? 'text' : 'password'}
                    value={settings.openrouterKey}
                    onChange={(e) => handleInputChange('openrouterKey', e.target.value)}
                    placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, openrouter: !prev.openrouter }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys.openrouter ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-roshanal-blue hover:underline">openrouter.ai</a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  value={settings.selectedModel}
                  onChange={(e) => handleInputChange('selectedModel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                >
                  {openrouterModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label} - {model.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
          )}

          {/* kie.ai API */}
          {settings.aiProvider === 'kie' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">kie.ai Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    kie.ai API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.kie ? 'text' : 'password'}
                      value={settings.kieKey}
                      onChange={(e) => handleInputChange('kieKey', e.target.value)}
                      placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeys(prev => ({ ...prev, kie: !prev.kie }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showKeys.kie ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-roshanal-blue hover:underline">kie.ai</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    kie.ai Model
                  </label>
                  <select
                    value={settings.kieModel}
                    onChange={(e) => handleInputChange('kieModel', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  >
                    {kieModels.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}

          {/* Web Search API */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Web Search Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Provider
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="tavily"
                      checked={settings.searchProvider === 'tavily'}
                      onChange={(e) => handleInputChange('searchProvider', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Tavily (Recommended - Free tier available)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="serper"
                      checked={settings.searchProvider === 'serper'}
                      onChange={(e) => handleInputChange('searchProvider', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Serper.dev (Alternative)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.search ? 'text' : 'password'}
                    value={settings.searchKey}
                    onChange={(e) => handleInputChange('searchKey', e.target.value)}
                    placeholder={settings.searchProvider === 'tavily' ? 'tvly-xxxxxxxxxxxxxxxxxxxx' : 'xxxxxxxxxx'}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, search: !prev.search }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showKeys.search ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.searchProvider === 'tavily' ? (
                    <>Get Tavily API key from <a href="https://tavily.com" target="_blank" rel="noopener noreferrer" className="text-roshanal-blue hover:underline">tavily.com</a> (1,000 free searches/month)</>
                  ) : (
                    <>Get Serper API key from <a href="https://serper.dev" target="_blank" rel="noopener noreferrer" className="text-roshanal-blue hover:underline">serper.dev</a></>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Company Profile */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry/Niche
                </label>
                <input
                  type="text"
                  value={settings.niche}
                  onChange={(e) => handleInputChange('niche', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Tone
                </label>
                <input
                  type="text"
                  value={settings.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={settings.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products/Services
                </label>
                <textarea
                  value={settings.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="08109522432"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  value={settings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.roshanalinfotech.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Save Panel */}
        <div>
          <Card className="sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Settings</h3>

            <Button onClick={handleSave} className="w-full bg-roshanal-navy hover:bg-roshanal-blue">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Settings are saved locally in your browser for security
            </p>
        </Card>
      </div>
    </div>
  )
}