'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, Plus, Settings, Play, Pause, Trash2, MessageSquare, Phone, Mail, Zap } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface AIAgent {
  id: string
  name: string
  type: 'voice' | 'chat' | 'email' | 'analysis'
  status: 'active' | 'inactive' | 'training'
  description: string
  capabilities: string[]
  created_at: string
  last_used?: string
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    // Mock data for demonstration - in real app, fetch from database
    const mockAgents: AIAgent[] = [
      {
        id: '1',
        name: 'Customer Support Agent',
        type: 'chat',
        status: 'active',
        description: 'Handles customer inquiries and support tickets',
        capabilities: ['Text analysis', 'Sentiment detection', 'Automated responses'],
        created_at: '2024-04-15T10:00:00Z',
        last_used: '2024-04-19T14:30:00Z'
      },
      {
        id: '2',
        name: 'Lead Qualification Agent',
        type: 'analysis',
        status: 'active',
        description: 'Analyzes and scores incoming leads',
        capabilities: ['Lead scoring', 'Company research', 'Intent analysis'],
        created_at: '2024-04-10T09:00:00Z',
        last_used: '2024-04-19T16:45:00Z'
      },
      {
        id: '3',
        name: 'Content Writer Agent',
        type: 'email',
        status: 'inactive',
        description: 'Generates personalized email content',
        capabilities: ['Copywriting', 'Personalization', 'A/B testing'],
        created_at: '2024-04-12T11:00:00Z'
      },
      {
        id: '4',
        name: 'Voice Assistant Agent',
        type: 'voice',
        status: 'training',
        description: 'Handles phone calls and voice interactions',
        capabilities: ['Speech recognition', 'Natural language', 'Call routing'],
        created_at: '2024-04-18T13:00:00Z'
      }
    ]

    setAgents(mockAgents)
    setLoading(false)
  }

  const toggleAgent = async (agentId: string, status: 'active' | 'inactive') => {
    setAgents(agents.map(agent =>
      agent.id === agentId ? { ...agent, status } : agent
    ))
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this AI agent?')) return

    setAgents(agents.filter(agent => agent.id !== agentId))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return Phone
      case 'chat': return MessageSquare
      case 'email': return Mail
      case 'analysis': return Zap
      default: return Bot
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voice': return 'text-pink-400'
      case 'chat': return 'text-blue-400'
      case 'email': return 'text-green-400'
      case 'analysis': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'training': return 'bg-yellow-500'
      default: return 'bg-gray-500'
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
          <p className="text-gray-300">Configure and manage your AI assistants for automated tasks</p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Agent
        </Link>
      </div>

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => {
            const TypeIcon = getTypeIcon(agent.type)
            return (
              <div
                key={agent.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{agent.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className={`text-sm capitalize ${getTypeColor(agent.type)}`}>
                        {agent.type}
                      </span>
                    </div>
                  </div>
                  <Bot className="w-6 h-6 text-[#00F5FF]" />
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">{agent.description}</p>

                {/* Capabilities */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Capabilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="text-sm text-gray-400 mb-4">
                  {agent.last_used ? (
                    <div>Last used: {new Date(agent.last_used).toLocaleDateString()}</div>
                  ) : (
                    <div>Never used</div>
                  )}
                  <div>Created: {new Date(agent.created_at).toLocaleDateString()}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {agent.status === 'training' ? (
                    <div className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Training...
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleAgent(agent.id, agent.status === 'active' ? 'inactive' : 'active')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                        agent.status === 'active'
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {agent.status === 'active' ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {agent.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  )}
                  <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id)}
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
          <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No AI agents yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first AI agent to automate tasks and enhance your workflows
          </p>
          <Link
            href="/dashboard/agents/new"
            className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Agent
          </Link>
        </div>
      )}

      {/* Agent Types Info */}
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Agent Types</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-pink-400 mt-0.5" />
              <div>
                <div className="text-white font-medium">Voice Agents</div>
                <div className="text-gray-400 text-sm">Handle phone calls, qualify leads, schedule appointments</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-white font-medium">Chat Agents</div>
                <div className="text-gray-400 text-sm">Customer support, lead qualification, FAQ handling</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <div className="text-white font-medium">Email Agents</div>
                <div className="text-gray-400 text-sm">Content generation, personalization, A/B testing</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <div className="text-white font-medium">Analysis Agents</div>
                <div className="text-gray-400 text-sm">Data analysis, insights, recommendations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Natural Language Processing</span>
              <div className="w-16 bg-green-600 rounded-full h-2"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Context Understanding</span>
              <div className="w-16 bg-green-600 rounded-full h-2"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Personalization</span>
              <div className="w-16 bg-blue-600 rounded-full h-2"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Multi-language Support</span>
              <div className="w-16 bg-yellow-600 rounded-full h-2"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Real-time Learning</span>
              <div className="w-16 bg-purple-600 rounded-full h-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}