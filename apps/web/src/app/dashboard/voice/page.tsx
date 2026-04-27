'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Phone, Mic, Settings, Play, Pause, Trash2 } from 'lucide-react'
import insforge from '@/lib/insforge'

interface VoiceAgent {
  id: string
  name: string
  personality: string
  voice_id: string
  language: string
  goal: string
  faq_json: any
  active: boolean
  created_at: string
}

export default function VoiceAgentsPage() {
  const [agents, setAgents] = useState<VoiceAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
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
        .from('voice_agents')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error('Error fetching voice agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = async (agentId: string, active: boolean) => {
    try {
      const { error } = await insforge
        .from('voice_agents')
        .update({ active })
        .eq('id', agentId)

      if (error) throw error

      setAgents(agents.map(agent =>
        agent.id === agentId ? { ...agent, active } : agent
      ))
    } catch (error) {
      console.error('Error updating agent:', error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this voice agent?')) return

    try {
      const { error } = await insforge
        .from('voice_agents')
        .delete()
        .eq('id', agentId)

      if (error) throw error

      setAgents(agents.filter(agent => agent.id !== agentId))
    } catch (error) {
      console.error('Error deleting agent:', error)
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
          <h1 className="text-3xl font-bold text-white mb-2">Voice Agents</h1>
          <p className="text-gray-300">AI-powered phone agents that handle customer calls automatically</p>
        </div>
        <Link
          href="/dashboard/voice/new"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Agent
        </Link>
      </div>

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-sm text-gray-400">{agent.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <Phone className="w-6 h-6 text-[#00F5FF]" />
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-300">
                  <strong>Personality:</strong> {agent.personality}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Voice:</strong> {agent.voice_id}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Language:</strong> {agent.language.toUpperCase()}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Goal:</strong> {agent.goal}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAgent(agent.id, !agent.active)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                    agent.active
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {agent.active ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {agent.active ? 'Pause' : 'Activate'}
                </button>
                <Link
                  href={`/dashboard/voice/${agent.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => deleteAgent(agent.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No voice agents yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first AI voice agent to handle customer calls automatically
          </p>
          <Link
            href="/dashboard/voice/new"
            className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Agent
          </Link>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">How Voice Agents Work</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-blue-300">
          <div>
            <h4 className="font-medium text-blue-400 mb-2">🎯 Goal-Oriented</h4>
            <p>Each agent has a specific goal like "Schedule appointments" or "Qualify leads"</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">🧠 AI-Powered</h4>
            <p>Uses advanced AI to understand context and respond naturally to customer questions</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">📞 Phone Integration</h4>
            <p>Connects to your phone number and handles calls 24/7 with human-like conversation</p>
          </div>
        </div>
      </div>
    </div>
  )
}