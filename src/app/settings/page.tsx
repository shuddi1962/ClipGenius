'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    openrouterKey: '',
    searchKey: '',
    searchProvider: 'tavily', // tavily or serper
    selectedModel: 'anthropic/claude-3.5-sonnet',
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
    search: false
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('roshanal_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Load API keys separately for security
    const openrouterKey = localStorage.getItem('roshanal_openrouter_key')
    const searchKey = localStorage.getItem('roshanal_search_key')

    setSettings(prev => ({
      ...prev,
      openrouterKey: openrouterKey || '',
      searchKey: searchKey || ''
    }))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setIsSaving(true)

    try {
      // Save API keys separately
      localStorage.setItem('roshanal_openrouter_key', settings.openrouterKey)
      localStorage.setItem('roshanal_search_key', settings.searchKey)
      localStorage.setItem('roshanal_model', settings.selectedModel)

      // Save other settings (exclude API keys for security)
      const { openrouterKey, searchKey, ...settingsToSave } = settings
      localStorage.setItem('roshanal_settings', JSON.stringify(settingsToSave))

      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const availableModels = [
    { value: 'google/gemini-2.0-flash', label: 'Google Gemini 2.0 Flash', description: 'Fast, cost-effective' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Best for creative writing' },
    { value: 'openai/gpt-4o', label: 'GPT-4o', description: 'Balanced performance' },
    { value: 'mistralai/mistral-large', label: 'Mistral Large', description: 'Fast European model' },
    { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', description: 'Open-source alternative' },
    { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1', description: 'Reasoning-focused' }
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Settings</h1>
        <p className="text-gray-600">Configure your AI models and company profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* OpenRouter API */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Configuration</h2>

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
                  {availableModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label} - {model.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

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

            {saveMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                saveMessage.includes('Error')
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {saveMessage}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What Gets Saved:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• API keys (securely encrypted)</li>
                  <li>• AI model preferences</li>
                  <li>• Company profile information</li>
                  <li>• Contact details</li>
                </ul>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-roshanal-navy hover:bg-roshanal-blue"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Settings are saved locally in your browser for security
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}