'use client'

import { useState, useEffect } from 'react'
import { User, Shield, Bell, Palette, Database, Save, Key, Mail, Smartphone } from 'lucide-react'
import insforge from '@/lib/insforge'

interface UserSettings {
  id?: string
  user_id: string
  company_name: string
  niche: string
  location: string
  tone: string
  target_audience: string
  products: string
  whatsapp: string
  website: string
  email_notifications: boolean
  campaign_alerts: boolean
  weekly_reports: boolean
  theme: 'dark' | 'light' | 'auto'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    user_id: '',
    company_name: '',
    niche: '',
    location: '',
    tone: 'professional',
    target_audience: '',
    products: '',
    whatsapp: '',
    website: '',
    email_notifications: true,
    campaign_alerts: true,
    weekly_reports: true,
    theme: 'dark'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'integrations'>('profile')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data, error } = await insforge
        .from('user_settings')
        .select('*')
        .eq('user_id', userData.user.id)
        .single()

      if (data && !error) {
        setSettings({
          ...data,
          email_notifications: data.email_notifications ?? true,
          campaign_alerts: data.campaign_alerts ?? true,
          weekly_reports: data.weekly_reports ?? true,
          theme: data.theme ?? 'dark'
        })
      } else {
        setSettings(prev => ({ ...prev, user_id: userData.user?.id || '' }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await insforge
        .from('user_settings')
        .upsert(settings)

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300">Customize your account preferences and integrations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Palette },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'integrations', label: 'Integrations', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-3 text-blue-400" />
              Business Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry/Niche
                </label>
                <input
                  type="text"
                  value={settings.niche}
                  onChange={(e) => setSettings(prev => ({ ...prev, niche: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Technology, Marketing, Consulting..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Communication Tone
                </label>
                <select
                  value={settings.tone}
                  onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience Description
                </label>
                <textarea
                  value={settings.target_audience}
                  onChange={(e) => setSettings(prev => ({ ...prev, target_audience: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Describe your ideal customers..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Products/Services
                </label>
                <textarea
                  value={settings.products}
                  onChange={(e) => setSettings(prev => ({ ...prev, products: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="List your main products or services..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-3 text-purple-400" />
              App Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="dark">Dark (Current)</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Campaign Type
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  AI Content Preferences
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emoji"
                      className="w-4 h-4 text-[#00F5FF] bg-gray-900 border-gray-600 rounded focus:ring-[#00F5FF] focus:ring-2"
                    />
                    <label htmlFor="emoji" className="ml-3 text-sm text-gray-300">
                      Include emojis in generated content
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hashtags"
                      defaultChecked
                      className="w-4 h-4 text-[#00F5FF] bg-gray-900 border-gray-600 rounded focus:ring-[#00F5FF] focus:ring-2"
                    />
                    <label htmlFor="hashtags" className="ml-3 text-sm text-gray-300">
                      Auto-generate hashtags for social posts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="personalization"
                      defaultChecked
                      className="w-4 h-4 text-[#00F5FF] bg-gray-900 border-gray-600 rounded focus:ring-[#00F5FF] focus:ring-2"
                    />
                    <label htmlFor="personalization" className="ml-3 text-sm text-gray-300">
                      Use personalization tokens in campaigns
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-3 text-yellow-400" />
              Notification Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Campaign Updates</div>
                      <div className="text-gray-400 text-sm">Get notified when campaigns are sent or completed</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.campaign_alerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, campaign_alerts: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F5FF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F5FF]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Weekly Reports</div>
                      <div className="text-gray-400 text-sm">Receive weekly performance summaries</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weekly_reports}
                        onChange={(e) => setSettings(prev => ({ ...prev, weekly_reports: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F5FF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F5FF]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Lead Alerts</div>
                      <div className="text-gray-400 text-sm">Notifications for new high-quality leads</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F5FF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F5FF]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Security Alerts</div>
                      <div className="text-gray-400 text-sm">Important security and login notifications</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F5FF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F5FF]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-red-400" />
              API Integrations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-white font-medium">SendGrid</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 text-sm mb-3">Email campaign delivery</p>
                <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm">
                  Configure →
                </button>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-white font-medium">Twilio</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 text-sm mb-3">WhatsApp & SMS messaging</p>
                <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm">
                  Configure →
                </button>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 text-purple-400 mr-3" />
                    <span className="text-white font-medium">Apify</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 text-sm mb-3">Lead scraping automation</p>
                <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm">
                  Configure →
                </button>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-cyan-400 mr-3" />
                    <span className="text-white font-medium">InsForge.dev</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 text-sm mb-3">Backend & database</p>
                <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm">
                  View Status →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">API Usage & Limits</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">SendGrid Emails</div>
                  <div className="text-gray-400 text-sm">2,450 / 10,000 this month</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Twilio Messages</div>
                  <div className="text-gray-400 text-sm">890 / 5,000 this month</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '17.8%' }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Apify Scrapes</div>
                  <div className="text-gray-400 text-sm">1,250 / 50,000 this month</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '2.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-8 py-4 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
        >
          <Save className="w-5 h-5 mr-3" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}