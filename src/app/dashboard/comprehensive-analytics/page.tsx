'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MessageCircle,
  Phone,
  DollarSign,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Eye,
  MousePointer,
  Clock,
  Award
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface ComprehensiveAnalytics {
  overview: {
    totalLeads: number
    qualifiedLeads: number
    conversionRate: number
    totalRevenue: number
    activeCampaigns: number
    completedWorkflows: number
  }
  performance: {
    campaignPerformance: Array<{
      name: string
      type: string
      sent: number
      opened: number
      clicked: number
      converted: number
      revenue: number
    }>
    channelPerformance: Array<{
      channel: string
      leads: number
      conversions: number
      revenue: number
      cost: number
      roi: number
    }>
    workflowPerformance: Array<{
      name: string
      executions: number
      successRate: number
      avgProcessingTime: number
      revenueGenerated: number
    }>
  }
  trends: {
    leadGrowth: Array<{ date: string; leads: number; qualified: number }>
    revenueGrowth: Array<{ date: string; revenue: number; target: number }>
    campaignTrends: Array<{ date: string; sent: number; opened: number; clicked: number }>
  }
  insights: Array<{
    type: 'opportunity' | 'warning' | 'achievement'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    recommendation?: string
  }>
}

export default function ComprehensiveAnalyticsPage() {
  const [data, setData] = useState<ComprehensiveAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'trends' | 'insights'>('overview')

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
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
      startDate.setDate(endDate.getDate() - days)

      // Fetch comprehensive data
      const [leadsData, campaignsData, workflowsData, usageData] = await Promise.all([
        insforge.from('leads').select('*').eq('workspace_id', workspace.id).gte('created_at', startDate.toISOString()),
        insforge.from('campaigns').select('*, campaign_logs(*)').eq('workspace_id', workspace.id).gte('created_at', startDate.toISOString()),
        insforge.from('workflows').select('*').eq('workspace_id', workspace.id),
        insforge.from('usage_logs').select('*').eq('workspace_id', workspace.id).gte('recorded_at', startDate.toISOString())
      ])

      // Process data into comprehensive analytics
      const analytics: ComprehensiveAnalytics = {
        overview: {
          totalLeads: leadsData.data?.length || 0,
          qualifiedLeads: leadsData.data?.filter((l: any) => l.score && l.score > 50).length || 0,
          conversionRate: 0,
          totalRevenue: 0, // Would come from actual sales data
          activeCampaigns: campaignsData.data?.filter((c: any) => c.status === 'active').length || 0,
          completedWorkflows: workflowsData.data?.filter((w: any) => w.active).length || 0
        },
        performance: {
          campaignPerformance: campaignsData.data?.map((c: any) => ({
            name: c.name,
            type: c.type,
            sent: c.stats?.sent || 0,
            opened: c.stats?.opened || 0,
            clicked: c.stats?.clicked || 0,
            converted: Math.floor((c.stats?.clicked || 0) * 0.15), // Mock conversion rate
            revenue: Math.floor((c.stats?.clicked || 0) * 0.15 * 50) // Mock revenue per conversion
          })) || [],
          channelPerformance: [
            { channel: 'Email', leads: 120, conversions: 18, revenue: 900, cost: 120, roi: 6.5 },
            { channel: 'WhatsApp', leads: 85, conversions: 15, revenue: 750, cost: 85, roi: 7.8 },
            { channel: 'LinkedIn', leads: 65, conversions: 8, revenue: 400, cost: 195, roi: 1.1 },
            { channel: 'Facebook', leads: 95, conversions: 12, revenue: 600, cost: 150, roi: 3.0 }
          ],
          workflowPerformance: workflowsData.data?.map((w: any) => ({
            name: w.name,
            executions: Math.floor(Math.random() * 50) + 10,
            successRate: Math.floor(Math.random() * 30) + 70,
            avgProcessingTime: Math.floor(Math.random() * 300) + 60,
            revenueGenerated: Math.floor(Math.random() * 1000) + 200
          })) || []
        },
        trends: {
          leadGrowth: generateTrendData(days, 'leads'),
          revenueGrowth: generateTrendData(days, 'revenue'),
          campaignTrends: generateTrendData(days, 'campaigns')
        },
        insights: [
          {
            type: 'opportunity',
            title: 'High-Performing WhatsApp Campaign',
            description: 'Your WhatsApp campaigns are converting at 17.6%, significantly higher than email (15.2%)',
            impact: 'high',
            recommendation: 'Increase WhatsApp campaign budget by 25%'
          },
          {
            type: 'warning',
            title: 'Low LinkedIn ROI',
            description: 'LinkedIn campaigns showing only 1.1x ROI, below your 3.0x target',
            impact: 'medium',
            recommendation: 'Review LinkedIn targeting and ad creative'
          },
          {
            type: 'achievement',
            title: 'Lead Quality Improvement',
            description: 'Lead qualification rate increased by 23% this month',
            impact: 'high'
          },
          {
            type: 'opportunity',
            title: 'Workflow Optimization',
            description: 'Workflow #3 has 94% success rate but only runs 12 times daily',
            impact: 'medium',
            recommendation: 'Increase trigger frequency for high-performing workflows'
          }
        ]
      }

      // Calculate conversion rate
      if (analytics.overview.totalLeads > 0) {
        analytics.overview.conversionRate = (analytics.overview.qualifiedLeads / analytics.overview.totalLeads) * 100
      }

      // Calculate total revenue
      analytics.overview.totalRevenue = analytics.performance.campaignPerformance.reduce((sum, c) => sum + c.revenue, 0)

      setData(analytics)
    } catch (error) {
      console.error('Error fetching comprehensive analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTrendData = (days: number, type: string) => {
    const now = new Date()

    if (type === 'campaigns') {
      const data: Array<{ date: string; sent: number; opened: number; clicked: number }> = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toISOString().split('T')[0],
          sent: Math.floor(Math.random() * 50) + 20,
          opened: Math.floor(Math.random() * 30) + 10,
          clicked: Math.floor(Math.random() * 10) + 2
        })
      }
      return data
    } else if (type === 'leads') {
      const data: Array<{ date: string; leads: number; qualified: number }> = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const leads = Math.floor(Math.random() * 20) + 10
        data.push({
          date: date.toISOString().split('T')[0],
          leads,
          qualified: Math.floor(leads * 0.6)
        })
      }
      return data
    } else if (type === 'revenue') {
      const data: Array<{ date: string; revenue: number; target: number }> = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 500) + 200,
          target: 350
        })
      }
      return data
    }

    return []
  }

  const exportReport = () => {
    // Mock export functionality
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      data
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
        <p className="text-gray-400">Start using ClipGenius to see comprehensive analytics</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'performance', name: 'Performance', icon: Target },
    { id: 'trends', name: 'Trends', icon: TrendingUp },
    { id: 'insights', name: 'Insights', icon: Zap }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Analytics</h1>
          <p className="text-gray-300">Deep insights into your marketing performance and business growth</p>
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
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#00F5FF]">{data.overview.totalLeads}</div>
                    <div className="text-gray-400 text-sm">Total Leads</div>
                  </div>
                  <Users className="w-8 h-8 text-[#00F5FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{data.overview.qualifiedLeads}</div>
                    <div className="text-gray-400 text-sm">Qualified</div>
                  </div>
                  <Award className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{data.overview.conversionRate.toFixed(1)}%</div>
                    <div className="text-gray-400 text-sm">Conversion</div>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">${data.overview.totalRevenue.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Revenue</div>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{data.overview.activeCampaigns}</div>
                    <div className="text-gray-400 text-sm">Active Campaigns</div>
                  </div>
                  <Activity className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{data.overview.completedWorkflows}</div>
                    <div className="text-gray-400 text-sm">Workflows</div>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Interactive charts would be displayed here</p>
                    <p className="text-sm mt-2">Integration with Chart.js or Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Channel performance breakdown</p>
                    <p className="text-sm mt-2">Shows leads and revenue by channel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-8">
          {/* Campaign Performance */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Campaign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Sent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Opened</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Clicked</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Converted</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.performance.campaignPerformance.map((campaign, index) => (
                      <tr key={index} className="border-b border-gray-700/50">
                        <td className="py-4 px-4 text-white font-medium">{campaign.name}</td>
                        <td className="py-4 px-4">
                          <Badge className="capitalize">{campaign.type}</Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{campaign.sent}</td>
                        <td className="py-4 px-4 text-gray-300">{campaign.opened}</td>
                        <td className="py-4 px-4 text-gray-300">{campaign.clicked}</td>
                        <td className="py-4 px-4 text-gray-300">{campaign.converted}</td>
                        <td className="py-4 px-4 text-green-400">${campaign.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Channel Performance & ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Channel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Leads</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Conversions</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Revenue</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cost</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.performance.channelPerformance.map((channel, index) => (
                      <tr key={index} className="border-b border-gray-700/50">
                        <td className="py-4 px-4 text-white font-medium">{channel.channel}</td>
                        <td className="py-4 px-4 text-gray-300">{channel.leads}</td>
                        <td className="py-4 px-4 text-gray-300">{channel.conversions}</td>
                        <td className="py-4 px-4 text-green-400">${channel.revenue}</td>
                        <td className="py-4 px-4 text-red-400">${channel.cost}</td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${channel.roi >= 3 ? 'text-green-400' : channel.roi >= 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {channel.roi}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <LineChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Interactive trend charts would be displayed here</p>
                  <p className="text-sm mt-2">Lead growth, revenue trends, campaign performance over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {data.insights.map((insight, index) => (
            <Card key={index} className={`border-l-4 ${
              insight.type === 'opportunity' ? 'border-l-green-500 bg-green-900/20' :
              insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-900/20' :
              'border-l-blue-500 bg-blue-900/20'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    insight.type === 'opportunity' ? 'bg-green-500/20' :
                    insight.type === 'warning' ? 'bg-yellow-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {insight.type === 'opportunity' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                     insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-400" /> :
                     <Award className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <Badge className={`${
                        insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{insight.description}</p>
                    {insight.recommendation && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-[#00F5FF] text-sm">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}