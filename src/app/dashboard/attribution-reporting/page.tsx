'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowRight,
  MousePointer,
  Eye,
  ShoppingCart
} from 'lucide-react'

interface AttributionData {
  channel: string
  firstTouch: number
  lastTouch: number
  linear: number
  timeDecay: number
  conversions: number
  revenue: number
  color: string
}

interface ConversionPath {
  id: string
  path: string[]
  conversions: number
  revenue: number
  avgTime: number
}

export default function AttributionReporting() {
  const [timeRange, setTimeRange] = useState('last_30_days')
  const [attributionModel, setAttributionModel] = useState('last_touch')
  const [conversionType, setConversionType] = useState('all')

  // Mock attribution data
  const attributionData: AttributionData[] = [
    {
      channel: 'Paid Search',
      firstTouch: 25,
      lastTouch: 35,
      linear: 30,
      timeDecay: 32,
      conversions: 245,
      revenue: 73500,
      color: 'bg-blue-500'
    },
    {
      channel: 'Organic Search',
      firstTouch: 20,
      lastTouch: 15,
      linear: 18,
      timeDecay: 16,
      conversions: 134,
      revenue: 40200,
      color: 'bg-green-500'
    },
    {
      channel: 'Social Media',
      firstTouch: 15,
      lastTouch: 20,
      linear: 17,
      timeDecay: 18,
      conversions: 156,
      revenue: 46800,
      color: 'bg-purple-500'
    },
    {
      channel: 'Email Marketing',
      firstTouch: 12,
      lastTouch: 18,
      linear: 15,
      timeDecay: 16,
      conversions: 98,
      revenue: 29400,
      color: 'bg-orange-500'
    },
    {
      channel: 'Direct Traffic',
      firstTouch: 18,
      lastTouch: 8,
      linear: 13,
      timeDecay: 11,
      conversions: 67,
      revenue: 20100,
      color: 'bg-red-500'
    },
    {
      channel: 'Referral',
      firstTouch: 10,
      lastTouch: 4,
      linear: 7,
      timeDecay: 6,
      conversions: 34,
      revenue: 10200,
      color: 'bg-cyan-500'
    }
  ]

  // Mock conversion paths
  const conversionPaths: ConversionPath[] = [
    {
      id: '1',
      path: ['Organic Search', 'Paid Search', 'Email Marketing'],
      conversions: 45,
      revenue: 13500,
      avgTime: 12
    },
    {
      id: '2',
      path: ['Social Media', 'Direct Traffic'],
      conversions: 32,
      revenue: 9600,
      avgTime: 8
    },
    {
      id: '3',
      path: ['Paid Search', 'Social Media', 'Email Marketing'],
      conversions: 28,
      revenue: 8400,
      avgTime: 15
    },
    {
      id: '4',
      path: ['Referral', 'Organic Search'],
      conversions: 21,
      revenue: 6300,
      avgTime: 6
    },
    {
      id: '5',
      path: ['Direct Traffic', 'Email Marketing'],
      conversions: 18,
      revenue: 5400,
      avgTime: 10
    }
  ]

  const getModelValue = (data: AttributionData) => {
    switch (attributionModel) {
      case 'first_touch': return data.firstTouch
      case 'last_touch': return data.lastTouch
      case 'linear': return data.linear
      case 'time_decay': return data.timeDecay
      default: return data.lastTouch
    }
  }

  const totalConversions = attributionData.reduce((sum, data) => sum + data.conversions, 0)
  const totalRevenue = attributionData.reduce((sum, data) => sum + data.revenue, 0)

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'paid search': return <MousePointer className="w-4 h-4" />
      case 'organic search': return <Eye className="w-4 h-4" />
      case 'social media': return <Users className="w-4 h-4" />
      case 'email marketing': return <DollarSign className="w-4 h-4" />
      case 'direct traffic': return <Target className="w-4 h-4" />
      case 'referral': return <ArrowRight className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Attribution Reporting</h1>
          <p className="text-gray-400 mt-2">Analyze how different marketing channels contribute to conversions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
              >
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
                <option value="last_90_days">Last 90 days</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <select
                value={attributionModel}
                onChange={(e) => setAttributionModel(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
              >
                <option value="first_touch">First Touch</option>
                <option value="last_touch">Last Touch</option>
                <option value="linear">Linear</option>
                <option value="time_decay">Time Decay</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
              >
                <option value="all">All Conversions</option>
                <option value="leads">Leads</option>
                <option value="sales">Sales</option>
                <option value="signups">Sign-ups</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 mt-1">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-blue-400 font-medium">Attribution Model: {attributionModel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                <p className="text-blue-300 text-sm mt-1">
                  {attributionModel === 'first_touch' && 'Credits the first channel that brought the customer to your site.'}
                  {attributionModel === 'last_touch' && 'Credits the last channel before conversion.'}
                  {attributionModel === 'linear' && 'Distributes credit equally across all touchpoints.'}
                  {attributionModel === 'time_decay' && 'Gives more credit to recent interactions.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalConversions}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Attributed revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Conversion Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(totalRevenue / totalConversions).toFixed(0)}</div>
            <p className="text-xs text-gray-400">
              Per conversion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Top Channel</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">Paid Search</div>
            <p className="text-xs text-gray-400">
              {Math.round((attributionData[0].conversions / totalConversions) * 100)}% of conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Attribution */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Channel Attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attributionData.map((channel) => (
              <div key={channel.channel} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${channel.color}`}></div>
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.channel)}
                    <span className="text-white font-medium">{channel.channel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-gray-400">Attribution</div>
                    <div className="text-white font-semibold">{getModelValue(channel)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Conversions</div>
                    <div className="text-white font-semibold">{channel.conversions}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Revenue</div>
                    <div className="text-white font-semibold">${channel.revenue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="w-32">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${channel.color}`}
                      style={{ width: `${getModelValue(channel)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Paths */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Top Conversion Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionPaths.map((path) => (
              <div key={path.id} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {path.path.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {step}
                        </Badge>
                        {index < path.path.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-gray-400">Conversions</div>
                    <div className="text-white font-semibold">{path.conversions}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Revenue</div>
                    <div className="text-white font-semibold">${path.revenue.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Avg Time</div>
                    <div className="text-white font-semibold">{path.avgTime} days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}