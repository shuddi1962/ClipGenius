'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Mail, MessageCircle, Phone, Eye, MousePointer, DollarSign, Calendar } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface AnalyticsData {
  totalLeads: number
  qualifiedLeads: number
  conversionRate: number
  campaignsSent: number
  emailOpens: number
  emailClicks: number
  whatsappSent: number
  smsSent: number
  voiceCalls: number
  totalRevenue: number
  recentActivity: any[]
  topPerformingCampaigns: any[]
  leadSources: any[]
  monthlyGrowth: any[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      startDate.setDate(endDate.getDate() - days)

      // Fetch leads
      const { data: leads } = await insforge
        .from('leads')
        .select('*')
        .eq('workspace_id', workspace.id)
        .gte('created_at', startDate.toISOString())

      // Fetch campaigns
      const { data: campaigns } = await insforge
        .from('campaigns')
        .select('*, campaign_logs(*)')
        .eq('workspace_id', workspace.id)
        .gte('created_at', startDate.toISOString())

      // Fetch usage logs
      const { data: usageLogs } = await insforge
        .from('usage_logs')
        .select('*')
        .eq('workspace_id', workspace.id)
        .gte('recorded_at', startDate.toISOString())

      // Process data
      const analyticsData: AnalyticsData = {
        totalLeads: leads?.length || 0,
        qualifiedLeads: leads?.filter(l => l.score && l.score > 50).length || 0,
        conversionRate: 0,
        campaignsSent: campaigns?.length || 0,
        emailOpens: campaigns?.reduce((sum, c) => sum + (c.stats?.opened || 0), 0) || 0,
        emailClicks: campaigns?.reduce((sum, c) => sum + (c.stats?.clicked || 0), 0) || 0,
        whatsappSent: campaigns?.filter(c => c.type === 'whatsapp').reduce((sum, c) => sum + (c.stats?.sent || 0), 0) || 0,
        smsSent: campaigns?.filter(c => c.type === 'sms').reduce((sum, c) => sum + (c.stats?.sent || 0), 0) || 0,
        voiceCalls: 0, // Would come from call logs
        totalRevenue: 0, // Would come from subscriptions/payments
        recentActivity: [],
        topPerformingCampaigns: [],
        leadSources: [],
        monthlyGrowth: []
      }

      // Calculate conversion rate
      if (analyticsData.totalLeads > 0) {
        analyticsData.conversionRate = (analyticsData.qualifiedLeads / analyticsData.totalLeads) * 100
      }

      // Process lead sources
      const sourceCounts: { [key: string]: number } = {}
      leads?.forEach(lead => {
        sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
      })
      analyticsData.leadSources = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
        percentage: (count / analyticsData.totalLeads) * 100
      }))

      // Process top campaigns
      analyticsData.topPerformingCampaigns = campaigns
        ?.filter(c => c.stats?.sent > 0)
        .sort((a, b) => (b.stats?.opened || 0) - (a.stats?.opened || 0))
        .slice(0, 5)
        .map(c => ({
          name: c.name,
          type: c.type,
          sent: c.stats?.sent || 0,
          opened: c.stats?.opened || 0,
          clicked: c.stats?.clicked || 0,
          openRate: c.stats?.sent ? ((c.stats.opened || 0) / c.stats.sent) * 100 : 0
        })) || []

      // Recent activity (last 10 items)
      const activities = [
        ...(leads?.slice(-5).map(l => ({
          type: 'lead',
          description: `New lead: ${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Unknown lead',
          timestamp: l.created_at,
          icon: Users
        })) || []),
        ...(campaigns?.slice(-5).map(c => ({
          type: 'campaign',
          description: `Campaign sent: ${c.name}`,
          timestamp: c.created_at,
          icon: c.type === 'email' ? Mail : c.type === 'whatsapp' ? MessageCircle : Phone
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

      analyticsData.recentActivity = activities

      setData(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No data available</h3>
        <p className="text-gray-400">Start using ClipGenius to see your analytics</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300">Track your marketing performance and growth</p>
        </div>

        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#00F5FF]">{data.totalLeads}</div>
              <div className="text-gray-400 text-sm">Total Leads</div>
            </div>
            <Users className="w-8 h-8 text-[#00F5FF]" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{data.qualifiedLeads}</div>
              <div className="text-gray-400 text-sm">Qualified</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{data.conversionRate.toFixed(1)}%</div>
              <div className="text-gray-400 text-sm">Conversion</div>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-400">{data.campaignsSent}</div>
              <div className="text-gray-400 text-sm">Campaigns</div>
            </div>
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{data.emailOpens}</div>
              <div className="text-gray-400 text-sm">Email Opens</div>
            </div>
            <Eye className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-400">{data.emailClicks}</div>
              <div className="text-gray-400 text-sm">Email Clicks</div>
            </div>
            <MousePointer className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Lead Sources */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {data.leadSources.map(source => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#00F5FF] rounded-full"></div>
                  <span className="text-gray-300 capitalize">{source.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{source.count}</span>
                  <span className="text-gray-400 text-sm">({source.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
            {data.leadSources.length === 0 && (
              <p className="text-gray-400 text-center py-4">No lead sources yet</p>
            )}
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Campaigns</h3>
          <div className="space-y-3">
            {data.topPerformingCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium">{campaign.name}</div>
                  <div className="text-gray-400 text-sm capitalize">{campaign.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#00F5FF] font-semibold">{campaign.openRate.toFixed(1)}%</div>
                  <div className="text-gray-400 text-sm">{campaign.opened}/{campaign.sent} opened</div>
                </div>
              </div>
            ))}
            {data.topPerformingCampaigns.length === 0 && (
              <p className="text-gray-400 text-center py-4">No campaigns sent yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recentActivity.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#00F5FF]" />
                </div>
                <div className="flex-1">
                  <div className="text-white">{activity.description}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })}
          {data.recentActivity.length === 0 && (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}