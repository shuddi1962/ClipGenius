'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

interface AdCampaign {
  id: string
  name: string
  platform: 'Facebook' | 'Instagram' | 'Google' | 'TikTok'
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
  roas: number
}

export default function AdsReporting() {
  const [dateRange, setDateRange] = useState('last_30_days')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const campaigns: AdCampaign[] = [
    {
      id: '1',
      name: 'Summer Sale Campaign',
      platform: 'Facebook',
      status: 'active',
      budget: 5000,
      spent: 3250.75,
      impressions: 125000,
      clicks: 2500,
      conversions: 125,
      ctr: 2.0,
      cpc: 1.30,
      cpm: 26.01,
      roas: 3.8
    },
    {
      id: '2',
      name: 'Product Launch Ads',
      platform: 'Instagram',
      status: 'active',
      budget: 3000,
      spent: 2100.50,
      impressions: 89000,
      clicks: 1780,
      conversions: 89,
      ctr: 2.0,
      cpc: 1.18,
      cpm: 23.60,
      roas: 4.2
    },
    {
      id: '3',
      name: 'Brand Awareness',
      platform: 'Google',
      status: 'paused',
      budget: 2000,
      spent: 1200.25,
      impressions: 75000,
      clicks: 1125,
      conversions: 45,
      ctr: 1.5,
      cpc: 1.07,
      cpm: 16.00,
      roas: 2.9
    },
    {
      id: '4',
      name: 'TikTok Viral Challenge',
      platform: 'TikTok',
      status: 'completed',
      budget: 1500,
      spent: 1500.00,
      impressions: 200000,
      clicks: 6000,
      conversions: 180,
      ctr: 3.0,
      cpc: 0.25,
      cpm: 7.50,
      roas: 5.4
    }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesPlatform = platformFilter === 'all' || campaign.platform.toLowerCase() === platformFilter
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesPlatform && matchesStatus
  })

  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR = totalClicks / totalImpressions * 100 || 0
  const avgROAS = filteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / filteredCampaigns.length || 0

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook': return 'text-blue-500'
      case 'Instagram': return 'text-pink-500'
      case 'Google': return 'text-green-500'
      case 'TikTok': return 'text-black'
      default: return 'text-gray-500'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'paused': return 'secondary'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ads Reporting</h1>
          <p className="text-gray-400 mt-2">Monitor and analyze your advertising performance across platforms</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
                <option value="last_90_days">Last 90 days</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgCTR.toFixed(2)}%</div>
            <p className="text-xs text-gray-400">
              Average CTR
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Return on Ad Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgROAS.toFixed(1)}x</div>
            <p className="text-xs text-gray-400">
              Average ROAS
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Platform</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Impressions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Clicks</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">CTR</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{campaign.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${getPlatformColor(campaign.platform)}`}>
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadgeVariant(campaign.status)} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-white">${campaign.spent.toLocaleString()}</td>
                    <td className="py-4 px-4 text-white">{campaign.impressions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-white">{campaign.clicks.toLocaleString()}</td>
                    <td className="py-4 px-4 text-white">{campaign.ctr}%</td>
                    <td className="py-4 px-4 text-white">{campaign.roas}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No campaigns found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}