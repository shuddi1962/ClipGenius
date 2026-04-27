'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Play, Pause, Edit, Trash2, GitBranch, Clock, Mail, MessageCircle, Phone } from 'lucide-react'
import insforge from '@/lib/insforge'

interface Workflow {
  id: string
  name: string
  description: string
  trigger_type: string
  trigger_config: any
  steps_json: any[]
  active: boolean
  created_at: string
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
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
        .from('workflows')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorkflows(data || [])
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflow = async (workflowId: string, active: boolean) => {
    try {
      const { error } = await insforge
        .from('workflows')
        .update({ active })
        .eq('id', workflowId)

      if (error) throw error

      setWorkflows(workflows.map(w =>
        w.id === workflowId ? { ...w, active } : w
      ))
    } catch (error) {
      console.error('Error updating workflow:', error)
    }
  }

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const { error } = await insforge
        .from('workflows')
        .delete()
        .eq('id', workflowId)

      if (error) throw error

      setWorkflows(workflows.filter(w => w.id !== workflowId))
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'lead_added': return Plus
      case 'campaign_sent': return Mail
      case 'email_opened': return Mail
      case 'manual': return Play
      default: return Clock
    }
  }

  const getTriggerLabel = (triggerType: string) => {
    switch (triggerType) {
      case 'lead_added': return 'New Lead Added'
      case 'campaign_sent': return 'Campaign Sent'
      case 'email_opened': return 'Email Opened'
      case 'manual': return 'Manual Trigger'
      default: return triggerType
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Automation Workflows</h1>
          <p className="text-gray-300">Create automated sequences and drip campaigns</p>
        </div>
        <Link
          href="/dashboard/workflows/new"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Workflow
        </Link>
      </div>

      {/* Workflows Grid */}
      {workflows.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(workflow => {
            const TriggerIcon = getTriggerIcon(workflow.trigger_type)
            return (
              <div
                key={workflow.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{workflow.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${workflow.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-sm text-gray-400">{workflow.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <GitBranch className="w-6 h-6 text-[#00F5FF]" />
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">{workflow.description}</p>

                {/* Trigger */}
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <TriggerIcon className="w-4 h-4 mr-2 text-[#00F5FF]" />
                    <span className="font-medium">Trigger:</span>
                    <span className="ml-2">{getTriggerLabel(workflow.trigger_type)}</span>
                  </div>
                </div>

                {/* Steps Count */}
                <div className="text-sm text-gray-400 mb-4">
                  {workflow.steps_json?.length || 0} automation step{workflow.steps_json?.length !== 1 ? 's' : ''}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWorkflow(workflow.id, !workflow.active)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                      workflow.active
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {workflow.active ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {workflow.active ? 'Pause' : 'Activate'}
                  </button>
                  <Link
                    href={`/dashboard/workflows/${workflow.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <GitBranch className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No workflows yet</h3>
          <p className="text-gray-400 mb-6">
            Create automated sequences for lead nurturing, follow-ups, and drip campaigns
          </p>
          <Link
            href="/dashboard/workflows/new"
            className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Workflow
          </Link>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Workflow Examples</h3>
        <div className="grid md:grid-cols-3 gap-6 text-blue-300">
          <div>
            <h4 className="font-medium text-blue-400 mb-2">📧 Lead Nurture</h4>
            <p className="text-sm">Send welcome email → 3-day follow-up → Product demo</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">📱 Re-engagement</h4>
            <p className="text-sm">If no response in 7 days → WhatsApp → SMS → Call</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">🎯 Qualification</h4>
            <p className="text-sm">New lead → Qualify → Hot: Immediate call, Warm: Nurture sequence</p>
          </div>
        </div>
      </div>
    </div>
  )
}