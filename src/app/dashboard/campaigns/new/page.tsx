'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Send, Eye, Mail, Users, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { insforge } from '@/lib/insforge'

interface Template {
  id: string
  name: string
  channel: 'email' | 'whatsapp' | 'sms'
  subject?: string
  body_html?: string
  body_text?: string
  variables: string[]
}

interface CampaignForm {
  name: string
  type: 'email' | 'whatsapp' | 'sms' | 'voice'
  template_id: string
  lead_list_id: string
  scheduled_at: string
  subject: string
  content: string
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [leadLists, setLeadLists] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    type: 'email',
    template_id: '',
    lead_list_id: '',
    scheduled_at: '',
    subject: '',
    content: ''
  })

  useEffect(() => {
    fetchData()
  }, [formData.type]) // Re-fetch when campaign type changes

  const fetchData = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Fetch templates based on campaign type
      let channelFilter = 'email'
      if (formData.type === 'whatsapp') channelFilter = 'whatsapp'
      if (formData.type === 'sms') channelFilter = 'sms'

      const { data: templatesData } = await insforge
        .from('templates')
        .select('*')
        .eq('workspace_id', workspace.id)
        .eq('channel', channelFilter)

      setTemplates(templatesData || [])

      // Fetch lead lists
      const { data: listsData } = await insforge
        .from('lead_lists')
        .select('*')
        .eq('workspace_id', workspace.id)

      setLeadLists(listsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      template_id: template.id,
      subject: template.subject || '',
      content: template.body_html || template.body_text || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Create campaign
      const { data: campaign, error } = await insforge
        .from('campaigns')
        .insert({
          workspace_id: workspace.id,
          name: formData.name,
          type: formData.type,
          status: formData.scheduled_at ? 'scheduled' : 'draft',
          template_id: formData.template_id,
          lead_list_id: formData.lead_list_id,
          scheduled_at: formData.scheduled_at || null
        })
        .select()
        .single()

      if (error) throw error

      router.push('/dashboard/campaigns')
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/campaigns"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Campaign</h1>
            <p className="text-gray-300">Set up an automated outreach campaign</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Campaign Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                placeholder="Welcome Series 2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaign Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    type: e.target.value as any,
                    template_id: '',
                    subject: '',
                    content: ''
                  }))
                  setSelectedTemplate(null)
                }}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              >
                <option value="email">Email Campaign</option>
                <option value="whatsapp">WhatsApp Campaign</option>
                <option value="sms">SMS Campaign</option>
                <option value="voice">Voice Campaign</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience
              </label>
              <select
                value={formData.lead_list_id}
                onChange={(e) => setFormData(prev => ({ ...prev, lead_list_id: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                required
              >
                <option value="">Select a lead list...</option>
                {leadLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              />
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Choose Template</h2>

          {templates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                      : 'border-gray-600 hover:border-[#00F5FF]/50'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                  {template.subject && (
                    <p className="text-sm text-gray-400 mb-2">Subject: {template.subject}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    Variables: {template.variables.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No email templates found</p>
              <Link
                href="/dashboard/templates/new"
                className="text-[#00F5FF] hover:text-[#00F5FF]/80 transition-colors"
              >
                Create your first template →
              </Link>
            </div>
          )}
        </div>

        {/* Content Preview/Edit */}
        {selectedTemplate && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Campaign Content</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {formData.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="Enter subject line..."
                  />
                </div>
              )}

              <div className={formData.type === 'email' ? 'flex items-end' : 'md:col-span-2'}>
                <button
                  type="button"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Template
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] font-mono text-sm"
                placeholder="Edit your email content here..."
              />
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">Available Variables</h4>
              <div className="text-blue-300 text-sm">
                Use these variables in your content: {selectedTemplate.variables.map(v => `{{${v}}}`).join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/campaigns"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.lead_list_id}
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  )
}