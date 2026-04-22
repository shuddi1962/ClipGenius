'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Funnel,
  Plus,
  Copy,
  Edit,
  Trash2,
  Eye,
  Play,
  Settings,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface FunnelTemplate {
  id: string
  name: string
  description: string
  category: 'lead-generation' | 'sales' | 'onboarding' | 'retention' | 'upsell'
  steps: FunnelStep[]
  isPublic: boolean
  usageCount: number
  conversionRate: number
  created_at: string
}

interface FunnelStep {
  id: string
  name: string
  type: 'email' | 'sms' | 'webhook' | 'wait' | 'condition'
  delay?: number // minutes
  content?: string
  config?: any
}

export default function FunnelTemplatesPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'create' | 'analytics'>('templates')
  const [templates, setTemplates] = useState<FunnelTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // New template form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'lead-generation' as FunnelTemplate['category'],
    steps: [] as FunnelStep[]
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
        .from('funnel_templates')
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
        .from('funnel_templates')
        .insert({
          workspace_id: workspace.id,
          name: newTemplate.name,
          description: newTemplate.description,
          category: newTemplate.category,
          steps: newTemplate.steps,
          is_public: false,
          usage_count: 0,
          conversion_rate: 0
        })

      if (error) throw error

      alert('Funnel template created successfully!')
      setShowNewForm(false)
      setNewTemplate({
        name: '',
        description: '',
        category: 'lead-generation',
        steps: []
      })
      fetchTemplates()
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create funnel template')
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
        .from('funnel_templates')
        .insert({
          workspace_id: workspace.id,
          name: `${template.name} (Copy)`,
          description: template.description,
          category: template.category,
          steps: template.steps,
          is_public: false,
          usage_count: 0,
          conversion_rate: 0
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
        .from('funnel_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      setTemplates(templates.filter(template => template.id !== templateId))
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const addStep = (type: FunnelStep['type']) => {
    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      type,
      delay: type === 'wait' ? 1440 : undefined, // 24 hours default
      content: type !== 'wait' && type !== 'condition' ? 'Sample content...' : undefined
    }

    setNewTemplate(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (index: number, updates: Partial<FunnelStep>) => {
    setNewTemplate(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, ...updates } : step
      )
    }))
  }

  const removeStep = (index: number) => {
    setNewTemplate(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lead-generation': return 'bg-blue-500/20 text-blue-400'
      case 'sales': return 'bg-green-500/20 text-green-400'
      case 'onboarding': return 'bg-purple-500/20 text-purple-400'
      case 'retention': return 'bg-orange-500/20 text-orange-400'
      case 'upsell': return 'bg-pink-500/20 text-pink-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'sms': return <MessageSquare className="w-4 h-4" />
      case 'wait': return <Clock className="w-4 h-4" />
      case 'webhook': return <Zap className="w-4 h-4" />
      case 'condition': return <Target className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const filteredTemplates = templates.filter(template =>
    selectedCategory === 'all' || template.category === selectedCategory
  )

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'lead-generation', name: 'Lead Generation' },
    { id: 'sales', name: 'Sales' },
    { id: 'onboarding', name: 'Onboarding' },
    { id: 'retention', name: 'Retention' },
    { id: 'upsell', name: 'Upsell/Cross-sell' }
  ]

  const tabs = [
    { id: 'templates', name: 'Templates', icon: Funnel },
    { id: 'create', name: 'Create Template', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
          <h1 className="text-3xl font-bold text-white mb-2">Funnel Templates</h1>
          <p className="text-gray-300">Create and manage automated marketing funnels</p>
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
                      <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Steps:</span>
                      <span className="text-white">{template.steps.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Usage:</span>
                      <span className="text-white">{template.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Conversion:</span>
                      <span className="text-green-400">{template.conversionRate.toFixed(1)}%</span>
                    </div>

                    {/* Step Preview */}
                    <div className="space-y-2">
                      {template.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 text-xs text-gray-400">
                          {getStepIcon(step.type)}
                          <span>{step.name}</span>
                          {step.delay && (
                            <span className="text-gray-500">({Math.floor(step.delay / 60)}h)</span>
                          )}
                        </div>
                      ))}
                      {template.steps.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{template.steps.length - 3} more steps
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black flex-1">
                        <Play className="w-4 h-4 mr-1" />
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

            {filteredTemplates.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Funnel className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No funnel templates found</h3>
                <p className="text-gray-400 mb-6">
                  {selectedCategory === 'all'
                    ? 'Create your first funnel template to get started'
                    : `No templates found in ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} category`
                  }
                </p>
                <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Template
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
                <Funnel className="w-5 h-5" />
                Create Funnel Template
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
                    placeholder="Lead Nurture Funnel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as FunnelTemplate['category'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="lead-generation">Lead Generation</option>
                    <option value="sales">Sales</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="retention">Retention</option>
                    <option value="upsell">Upsell/Cross-sell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[80px] resize-none"
                  placeholder="Describe what this funnel achieves..."
                />
              </div>

              {/* Funnel Steps */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Funnel Steps</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => addStep('email')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                    <Button onClick={() => addStep('sms')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      SMS
                    </Button>
                    <Button onClick={() => addStep('wait')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Clock className="w-4 h-4 mr-1" />
                      Wait
                    </Button>
                    <Button onClick={() => addStep('webhook')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Zap className="w-4 h-4 mr-1" />
                      Webhook
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {newTemplate.steps.map((step, index) => (
                    <div key={step.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStepIcon(step.type)}
                          <div>
                            <Input
                              value={step.name}
                              onChange={(e) => updateStep(index, { name: e.target.value })}
                              className="bg-gray-600 border-gray-500 text-white font-medium text-sm"
                              placeholder="Step name"
                            />
                            <div className="text-xs text-gray-400 mt-1 capitalize">{step.type}</div>
                          </div>
                        </div>

                        <Button
                          onClick={() => removeStep(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Step Configuration */}
                      <div className="space-y-3">
                        {step.type === 'wait' && (
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">
                              Delay (minutes)
                            </label>
                            <Input
                              type="number"
                              value={step.delay || 0}
                              onChange={(e) => updateStep(index, { delay: parseInt(e.target.value) })}
                              className="bg-gray-600 border-gray-500 text-white text-sm"
                              placeholder="1440"
                            />
                          </div>
                        )}

                        {(step.type === 'email' || step.type === 'sms') && (
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">
                              Content
                            </label>
                            <textarea
                              value={step.content || ''}
                              onChange={(e) => updateStep(index, { content: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm placeholder-gray-400 focus:border-[#00F5FF] min-h-[60px] resize-none"
                              placeholder="Enter message content..."
                            />
                          </div>
                        )}

                        {step.type === 'webhook' && (
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">
                              Webhook URL
                            </label>
                            <Input
                              value={step.config?.url || ''}
                              onChange={(e) => updateStep(index, { config: { ...step.config, url: e.target.value } })}
                              className="bg-gray-600 border-gray-500 text-white text-sm"
                              placeholder="https://your-api.com/webhook"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {newTemplate.steps.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Funnel className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No steps added yet. Click the buttons above to add funnel steps.</p>
                  </div>
                )}

                {/* Funnel Preview */}
                {newTemplate.steps.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Funnel Preview</h4>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {newTemplate.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#00F5FF] rounded-full flex items-center justify-center mb-2">
                              {getStepIcon(step.type)}
                            </div>
                            <div className="text-xs text-white text-center max-w-20 truncate">
                              {step.name}
                            </div>
                          </div>
                          {index < newTemplate.steps.length - 1 && (
                            <div className="w-8 h-0.5 bg-gray-500 mx-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <Button onClick={createTemplate} disabled={!newTemplate.name || newTemplate.steps.length === 0} className="bg-blue-600 hover:bg-blue-700">
                  <Funnel className="w-4 h-4 mr-2" />
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
                    <div className="text-white font-medium">Most Used Template</div>
                    <div className="text-gray-400 text-sm">Lead Nurture Funnel</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00F5FF]">2,847</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Average Conversion</div>
                    <div className="text-gray-400 text-sm">Across all templates</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">24.3%</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Active Funnels</div>
                    <div className="text-gray-400 text-sm">Currently running</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">156</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { category: 'Lead Generation', rate: 32.1, color: 'bg-blue-500' },
                  { category: 'Sales', rate: 28.7, color: 'bg-green-500' },
                  { category: 'Onboarding', rate: 45.2, color: 'bg-purple-500' },
                  { category: 'Retention', rate: 18.9, color: 'bg-orange-500' },
                  { category: 'Upsell', rate: 22.4, color: 'bg-pink-500' }
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-white text-sm">{item.category}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{item.rate}%</span>
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