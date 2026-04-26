'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Send, Eye, Edit, Trash2, BarChart3, Clock, Users, CheckCircle } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'whatsapp' | 'sms' | 'voice'
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'
  scheduled_at: string | null
  completed_at: string | null
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    replied: number
  }
  created_at: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'email' | 'whatsapp' | 'sms' | 'voice'>('all')
  const [sending, setSending] = useState<string[]>([])

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
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
        .from('campaigns')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    filter === 'all' || campaign.type === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'scheduled': return 'bg-blue-500'
      case 'running': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'paused': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'running': return <Send className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'paused': return <Clock className="w-4 h-4" />
      default: return <Edit className="w-4 h-4" />
    }
  }

  const sendCampaign = async (campaignId: string, campaignType: string) => {
    setSending(prev => [...prev, campaignId])

    try {
      let endpoint = '/api/campaigns/send'
      if (campaignType === 'whatsapp') endpoint = '/api/campaigns/send-whatsapp'
      if (campaignType === 'sms') endpoint = '/api/campaigns/send-sms'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })

      if (!response.ok) throw new Error('Send failed')

      const result = await response.json()

      // Update campaign status in UI
      setCampaigns(campaigns.map(campaign =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: 'running',
              stats: {
                ...campaign.stats,
                sent: result.sent_count,
                delivered: result.sent_count - (result.failed_count || 0)
              }
            }
          : campaign
      ))

      const channelName = campaignType === 'whatsapp' ? 'WhatsApp' :
                         campaignType === 'sms' ? 'SMS' : 'email'
      alert(`${channelName} campaign sent to ${result.sent_count} leads!`)
    } catch (error) {
      console.error('Error sending campaign:', error)
      alert('Failed to send campaign. Please try again.')
    } finally {
      setSending(prev => prev.filter(id => id !== campaignId))
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
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-gray-300">Create and manage automated outreach campaigns</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex gap-4">
          {[
            { id: 'all', label: 'All Campaigns', count: campaigns.length },
            { id: 'email', label: 'Email', count: campaigns.filter(c => c.type === 'email').length },
            { id: 'whatsapp', label: 'WhatsApp', count: campaigns.filter(c => c.type === 'whatsapp').length },
            { id: 'sms', label: 'SMS', count: campaigns.filter(c => c.type === 'sms').length },
            { id: 'voice', label: 'Voice', count: campaigns.filter(c => c.type === 'voice').length }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === type.id
                  ? 'bg-[#00F5FF] text-black'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`}></div>
                    <span className="text-sm text-gray-400 capitalize">{campaign.status}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400 capitalize">{campaign.type}</span>
                  </div>
                </div>
                {getStatusIcon(campaign.status)}
              </div>

              {/* Stats */}
              {campaign.stats && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00F5FF]">{campaign.stats.sent}</div>
                    <div className="text-xs text-gray-400">Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{campaign.stats.opened}</div>
                    <div className="text-xs text-gray-400">Opened</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{campaign.stats.clicked}</div>
                    <div className="text-xs text-gray-400">Clicked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{campaign.stats.replied}</div>
                    <div className="text-xs text-gray-400">Replied</div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="text-sm text-gray-500 mb-4">
                {campaign.scheduled_at && (
                  <div>Scheduled: {new Date(campaign.scheduled_at).toLocaleDateString()}</div>
                )}
                {campaign.completed_at && (
                  <div>Completed: {new Date(campaign.completed_at).toLocaleDateString()}</div>
                )}
                <div>Created: {new Date(campaign.created_at).toLocaleDateString()}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                  <button
                    onClick={() => sendCampaign(campaign.id, campaign.type)}
                    disabled={sending.includes(campaign.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sending.includes(campaign.id) ? 'Sending...' : 'Send Now'}
                  </button>
                )}
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match your filter'}
          </h3>
          <p className="text-gray-400 mb-6">
            {campaigns.length === 0
              ? 'Create your first automated outreach campaign'
              : 'Try changing your filter to see more campaigns'
            }
          </p>
          {campaigns.length === 0 && (
            <Link
              href="/dashboard/campaigns/new"
              className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Create Your First Campaign
            </Link>
          )}
        </div>
      )}
    </div>
  )
}