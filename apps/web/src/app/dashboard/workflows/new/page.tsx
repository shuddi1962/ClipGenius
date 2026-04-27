'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, GitBranch, Clock, Mail, MessageCircle, Phone, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import insforge from '@/lib/insforge'

interface WorkflowStep {
  id: string
  type: 'email' | 'whatsapp' | 'sms' | 'voice' | 'wait' | 'condition'
  config: any
  position: { x: number; y: number }
}

interface WorkflowForm {
  name: string
  description: string
  trigger_type: string
  trigger_config: any
  steps: WorkflowStep[]
}

export default function NewWorkflowPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [leadLists, setLeadLists] = useState<any[]>([])

  const [formData, setFormData] = useState<WorkflowForm>({
    name: '',
    description: '',
    trigger_type: 'lead_added',
    trigger_config: {},
    steps: []
  })

  useEffect(() => {
    fetchData()
  }, [])

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

      // Fetch templates
      const { data: templatesData } = await insforge
        .from('templates')
        .select('*')
        .eq('workspace_id', workspace.id)

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

  const testWorkflow = async () => {
    try {
      // Create a mock workflow for testing
      const testWorkflow = {
        name: `${formData.name} (Test)`,
        description: formData.description,
        trigger_type: formData.trigger_type,
        trigger_config: formData.trigger_config,
        steps_json: formData.steps,
        active: false
      }

      // Save test workflow temporarily
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data: savedWorkflow, error } = await insforge
        .from('workflows')
        .insert({
          ...testWorkflow,
          workspace_id: workspace.id
        })
        .select()
        .single()

      if (error) throw error

      // Execute the test workflow
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: savedWorkflow.id,
          triggerType: formData.trigger_type,
          eventData: {
            leadId: 'test_lead_123',
            leadEmail: 'test@example.com',
            leadName: 'Test User',
            score: 75
          }
        })
      })

      if (!response.ok) {
        throw new Error('Workflow execution failed')
      }

      const result = await response.json()

      // Clean up test workflow
      await insforge
        .from('workflows')
        .delete()
        .eq('id', savedWorkflow.id)

      alert(`Workflow test completed! ${result.results[0]?.stepsExecuted || 0} steps executed successfully.`)

    } catch (error) {
      console.error('Error testing workflow:', error)
      alert('Workflow test failed. Check the console for details.')
    }
  }

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      config: getDefaultConfig(type),
      position: { x: 100 + (formData.steps.length * 200), y: 100 }
    }

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const getDefaultConfig = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'email':
      case 'whatsapp':
      case 'sms':
        return { template_id: '', lead_list_id: '' }
      case 'voice':
        return { agent_id: '', lead_id: '' }
      case 'wait':
        return { duration: 1, unit: 'days' }
      case 'condition':
        return { field: 'score', operator: '>', value: '50', true_step: '', false_step: '' }
      default:
        return {}
    }
  }

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
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

      // Create workflow
      const { data: workflow, error } = await insforge
        .from('workflows')
        .insert({
          workspace_id: workspace.id,
          name: formData.name,
          description: formData.description,
          trigger_type: formData.trigger_type,
          trigger_config: formData.trigger_config,
          steps_json: formData.steps,
          active: false
        })
        .select()
        .single()

      if (error) throw error

      router.push('/dashboard/workflows')
    } catch (error) {
      console.error('Error creating workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  const stepTypes = [
    { type: 'email' as const, label: 'Send Email', icon: Mail, color: 'bg-blue-600' },
    { type: 'whatsapp' as const, label: 'Send WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
    { type: 'sms' as const, label: 'Send SMS', icon: MessageCircle, color: 'bg-purple-600' },
    { type: 'voice' as const, label: 'Make Call', icon: Phone, color: 'bg-red-600' },
    { type: 'wait' as const, label: 'Wait', icon: Clock, color: 'bg-yellow-600' },
    { type: 'condition' as const, label: 'Condition', icon: GitBranch, color: 'bg-orange-600' }
  ]

  const triggerTypes = [
    { value: 'lead_added', label: 'When a new lead is added' },
    { value: 'campaign_sent', label: 'When a campaign is sent' },
    { value: 'email_opened', label: 'When an email is opened' },
    { value: 'manual', label: 'Manual trigger' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/workflows"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Workflow</h1>
            <p className="text-gray-300">Build automated sequences and drip campaigns</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Workflow Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                placeholder="Lead Nurture Sequence"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trigger Event
              </label>
              <select
                value={formData.trigger_type}
                onChange={(e) => setFormData(prev => ({ ...prev, trigger_type: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              >
                {triggerTypes.map(trigger => (
                  <option key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              placeholder="Describe what this workflow does..."
            />
          </div>
        </div>

        {/* Visual Builder */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Workflow Builder</h2>
            <div className="text-sm text-gray-400">
              {formData.steps.length} step{formData.steps.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Step Palette */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stepTypes.map(stepType => {
              const Icon = stepType.icon
              return (
                <button
                  key={stepType.type}
                  type="button"
                  onClick={() => addStep(stepType.type)}
                  className={`p-4 border-2 border-gray-600 rounded-lg text-center hover:border-[#00F5FF] transition-colors group`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-[#00F5FF]" />
                  <div className="text-sm font-medium text-white">{stepType.label}</div>
                </button>
              )
            })}
          </div>

          {/* Visual Canvas */}
          <div className="bg-gray-900/50 border border-gray-600 rounded-lg min-h-[400px] p-6 relative">
            {formData.steps.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Add your first step to start building the workflow</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-[#00F5FF] text-black rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Step Card */}
                    <div className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {step.type === 'email' && <Mail className="w-5 h-5 text-blue-400" />}
                          {step.type === 'whatsapp' && <MessageCircle className="w-5 h-5 text-green-400" />}
                          {step.type === 'sms' && <MessageCircle className="w-5 h-5 text-purple-400" />}
                          {step.type === 'voice' && <Phone className="w-5 h-5 text-red-400" />}
                          {step.type === 'wait' && <Clock className="w-5 h-5 text-yellow-400" />}
                          {step.type === 'condition' && <GitBranch className="w-5 h-5 text-orange-400" />}
                          <span className="font-medium text-white capitalize">{step.type}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStep(step.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Step Configuration */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {step.type === 'email' || step.type === 'whatsapp' || step.type === 'sms' ? (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Template
                              </label>
                              <select
                                value={step.config.template_id}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, template_id: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              >
                                <option value="">Select template...</option>
                                {templates
                                  .filter(t => t.channel === step.type || (step.type === 'whatsapp' && t.channel === 'whatsapp') || (step.type === 'sms' && t.channel === 'sms'))
                                  .map(template => (
                                    <option key={template.id} value={template.id}>
                                      {template.name}
                                    </option>
                                  ))
                                }
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Lead List
                              </label>
                              <select
                                value={step.config.lead_list_id}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, lead_list_id: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              >
                                <option value="">Select lead list...</option>
                                {leadLists.map(list => (
                                  <option key={list.id} value={list.id}>
                                    {list.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : step.type === 'voice' ? (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Voice Agent
                            </label>
                            <select
                              value={step.config.agent_id}
                              onChange={(e) => updateStep(step.id, {
                                config: { ...step.config, agent_id: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                            >
                              <option value="">Select voice agent...</option>
                              {/* Voice agents would be loaded here */}
                            </select>
                          </div>
                        ) : step.type === 'wait' ? (
                          <div className="md:col-span-2 flex gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Duration
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={step.config.duration}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, duration: parseInt(e.target.value) }
                                })}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Unit
                              </label>
                              <select
                                value={step.config.unit}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, unit: e.target.value }
                                })}
                                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                              </select>
                            </div>
                          </div>
                        ) : step.type === 'condition' ? (
                          <div className="md:col-span-2 grid grid-cols-4 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Field
                              </label>
                              <select
                                value={step.config.field}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, field: e.target.value }
                                })}
                                className="w-full px-2 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              >
                                <option value="score">Score</option>
                                <option value="tier">Tier</option>
                                <option value="status">Status</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Operator
                              </label>
                              <select
                                value={step.config.operator}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, operator: e.target.value }
                                })}
                                className="w-full px-2 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              >
                                <option value=">">Greater than</option>
                                <option value="<">Less than</option>
                                <option value="=">Equals</option>
                                <option value="!=">Not equals</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Value
                              </label>
                              <input
                                type="text"
                                value={step.config.value}
                                onChange={(e) => updateStep(step.id, {
                                  config: { ...step.config, value: e.target.value }
                                })}
                                className="w-full px-2 py-2 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:border-[#00F5FF]"
                              />
                            </div>
                            <div className="flex items-end">
                              <span className="text-xs text-gray-400">Then branch</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < formData.steps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/workflows"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={testWorkflow}
            disabled={!formData.name || formData.steps.length === 0}
            className="px-6 py-3 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 flex items-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Test Workflow
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name || formData.steps.length === 0}
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </form>
    </div>
  )
}