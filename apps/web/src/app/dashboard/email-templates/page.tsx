'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Send,
  Settings,
  BarChart3,
  Users,
  Target,
  FileText,
  Palette,
  Sparkles
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: 'welcome' | 'newsletter' | 'promotional' | 'transactional' | 'follow-up'
  thumbnail?: string
  variables: string[]
  isPublic: boolean
  usageCount: number
  created_at: string
}

export default function EmailTemplatesPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'create' | 'analytics'>('templates')
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // New template form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'welcome' as EmailTemplate['category'],
    variables: [] as string[],
    variableInput: ''
  })

  useEffect(() => {
    if (activeTab === 'templates' || activeTab === 'analytics') {
      fetchTemplates()
    }
  }, [activeTab])

  const fetchTemplates = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('email_templates')
        .select('*')
        .or(`workspace_id.eq.${workspace.id},is_public.eq.true`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { error } = await insforge
        .from('email_templates')
        .insert({
          workspace_id: workspace.id,
          name: newTemplate.name,
          subject: newTemplate.subject,
          content: newTemplate.content,
          category: newTemplate.category,
          variables: newTemplate.variables.filter(v => v.trim()),
          is_public: false,
          usage_count: 0
        })

      if (error) throw error

      alert('Email template created successfully!')
      setShowNewForm(false)
      setNewTemplate({
        name: '',
        subject: '',
        content: '',
        category: 'welcome',
        variables: [],
        variableInput: ''
      })
      fetchTemplates()
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create email template')
    }
  }

  const duplicateTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return

      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { error } = await insforge
        .from('email_templates')
        .insert({
          workspace_id: workspace.id,
          name: `${template.name} (Copy)`,
          subject: template.subject,
          content: template.content,
          category: template.category,
          variables: template.variables,
          is_public: false,
          usage_count: 0
        })

      if (error) throw error

      fetchTemplates()
    } catch (error) {
      console.error('Error duplicating template:', error)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await insforge
        .from('email_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      setTemplates(templates.filter(template => template.id !== templateId))
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const addVariable = () => {
    if (newTemplate.variableInput.trim() && !newTemplate.variables.includes(newTemplate.variableInput.trim())) {
      setNewTemplate(prev => ({
        ...prev,
        variables: [...prev.variables, prev.variableInput.trim()],
        variableInput: ''
      }))
    }
  }

  const removeVariable = (variableToRemove: string) => {
    setNewTemplate(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variableToRemove)
    }))
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end)
      const newText = `${before}{{${variable}}}}${after}`

      setNewTemplate(prev => ({ ...prev, content: newText }))

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
      }, 0)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'welcome': return 'bg-blue-500/20 text-blue-400'
      case 'newsletter': return 'bg-green-500/20 text-green-400'
      case 'promotional': return 'bg-purple-500/20 text-purple-400'
      case 'transactional': return 'bg-orange-500/20 text-orange-400'
      case 'follow-up': return 'bg-pink-500/20 text-pink-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredTemplates = templates.filter(template =>
    selectedCategory === 'all' || template.category === selectedCategory
  )

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'welcome', name: 'Welcome' },
    { id: 'newsletter', name: 'Newsletter' },
    { id: 'promotional', name: 'Promotional' },
    { id: 'transactional', name: 'Transactional' },
    { id: 'follow-up', name: 'Follow-up' }
  ]

  const tabs = [
    { id: 'templates', name: 'Templates', icon: Mail },
    { id: 'create', name: 'Create Template', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  const sampleTemplates = [
    {
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}!',
      content: 'Hi {{first_name}},\n\nWelcome to {{company_name}}! We\'re excited to have you on board.\n\n{{custom_message}}\n\nBest regards,\n{{company_name}} Team',
      category: 'welcome' as const,
      variables: ['first_name', 'company_name', 'custom_message']
    },
    {
      name: 'Newsletter',
      subject: '{{month}} Newsletter - {{topic}}',
      content: 'Hi {{first_name}},\n\nHere\'s what\'s new this month:\n\n{{newsletter_content}}\n\nStay tuned for more updates!\n\nBest,\n{{company_name}}',
      category: 'newsletter' as const,
      variables: ['first_name', 'month', 'topic', 'newsletter_content', 'company_name']
    },
    {
      name: 'Promotional Email',
      subject: '🚀 Special Offer: {{discount}}% Off!',
      content: 'Hi {{first_name}},\n\nDon\'t miss our special offer!\n\n{{offer_details}}\n\nUse code: {{promo_code}}\n\nLimited time only!\n\n{{company_name}}',
      category: 'promotional' as const,
      variables: ['first_name', 'discount', 'offer_details', 'promo_code', 'company_name']
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Templates</h1>
          <p className="text-gray-300">Create and manage professional email templates</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#00F5FF] text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <div className="text-gray-400 text-sm mt-1 line-clamp-1">
                        Subject: {template.subject}
                      </div>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-gray-300 text-sm line-clamp-3">
                      {template.content.replace(/\{\{.*?\}\}/g, '[variable]')}
                    </div>

                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                            +{template.variables.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Used {template.usageCount} times</span>
                      <span>{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black flex-1">
                        <Send className="w-4 h-4 mr-1" />
                        Use Template
                      </Button>
                      <Button
                        onClick={() => duplicateTemplate(template.id)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteTemplate(template.id)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sample Templates */}
            {filteredTemplates.length === 0 && selectedCategory === 'all' && (
              <div className="col-span-full">
                <h3 className="text-xl font-semibold text-white mb-4">Sample Templates</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleTemplates.map((template, index) => (
                    <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                            <div className="text-gray-400 text-sm mt-1 line-clamp-1">
                              Subject: {template.subject}
                            </div>
                          </div>
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-gray-300 text-sm line-clamp-3">
                            {template.content.replace(/\{\{.*?\}\}/g, '[variable]')}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable) => (
                              <Badge key={variable} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                                {variable}
                              </Badge>
                            ))}
                          </div>

                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white w-full">
                            <Copy className="w-4 h-4 mr-1" />
                            Use Sample
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredTemplates.length === 0 && selectedCategory !== 'all' && (
              <div className="col-span-full text-center py-12">
                <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No templates in this category</h3>
                <p className="text-gray-400 mb-6">
                  Create your first {categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} template
                </p>
                <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Template Tab */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Create Email Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Template Name
                  </label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Welcome Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as EmailTemplate['category'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="welcome">Welcome</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotional">Promotional</option>
                    <option value="transactional">Transactional</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject Line
                </label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Welcome to {{company_name}}!"
                />
              </div>

              {/* Variables */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Variables
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTemplate.variableInput}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, variableInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    placeholder="Add a variable (e.g., first_name)"
                  />
                  <Button onClick={addVariable} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newTemplate.variables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {newTemplate.variables.map((variable) => (
                      <Badge
                        key={variable}
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                        onClick={() => insertVariable(variable)}
                      >
                        {variable} ×
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-gray-400 text-sm">
                  Click on variables above to insert them into your template content
                </p>
              </div>

              {/* Template Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Content
                </label>
                <textarea
                  id="template-content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[300px] resize-none font-mono text-sm"
                  placeholder="Hi {{first_name}},

Welcome to {{company_name}}!

{{custom_message}}

Best regards,
{{company_name}} Team"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Use {'{{variable_name}}'} syntax for dynamic content
                </p>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preview
                </label>
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="text-white font-medium mb-2">
                    Subject: {newTemplate.subject || '[Subject Line]'}
                  </div>
                  <div className="text-gray-300 text-sm whitespace-pre-line">
                    {newTemplate.content || 'Your email content will appear here...'}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('templates')}
                >
                  Cancel
                </Button>
                <Button onClick={createTemplate} disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.content} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Template Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Most Popular Template</div>
                    <div className="text-gray-400 text-sm">Welcome Email</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00F5FF]">8,542</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Average Open Rate</div>
                    <div className="text-gray-400 text-sm">Across all templates</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">34.7%</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Templates Created</div>
                    <div className="text-gray-400 text-sm">This month</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{templates.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Category Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { category: 'Welcome', usage: 35, color: 'bg-blue-500' },
                  { category: 'Newsletter', usage: 28, color: 'bg-green-500' },
                  { category: 'Promotional', usage: 22, color: 'bg-purple-500' },
                  { category: 'Transactional', usage: 10, color: 'bg-orange-500' },
                  { category: 'Follow-up', usage: 5, color: 'bg-pink-500' }
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-white text-sm">{item.category}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{item.usage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}