'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Clock,
  User,
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Play,
  Pause,
  Volume2
} from 'lucide-react'

interface Call {
  id: string
  caller: string
  recipient: string
  direction: 'inbound' | 'outbound'
  duration: number
  status: 'completed' | 'missed' | 'voicemail' | 'busy'
  outcome: 'sale' | 'follow_up' | 'no_answer' | 'not_interested' | 'qualified' | null
  timestamp: string
  recordingUrl: string | null
  notes: string
  campaign?: string
}

export default function CallReporting() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('last_7_days')

  // Mock call data
  const [calls] = useState<Call[]>([
    {
      id: '1',
      caller: '+1 (555) 123-4567',
      recipient: 'John Smith',
      direction: 'outbound',
      duration: 245,
      status: 'completed',
      outcome: 'sale',
      timestamp: '2024-04-19T14:30:00Z',
      recordingUrl: 'https://example.com/recording1.mp3',
      notes: 'Customer interested in premium plan',
      campaign: 'Q2 Sales Push'
    },
    {
      id: '2',
      caller: '+1 (555) 987-6543',
      recipient: 'Sarah Johnson',
      direction: 'inbound',
      duration: 180,
      status: 'completed',
      outcome: 'follow_up',
      timestamp: '2024-04-19T13:15:00Z',
      recordingUrl: 'https://example.com/recording2.mp3',
      notes: 'Requested more information about features',
      campaign: 'Lead Nurturing'
    },
    {
      id: '3',
      caller: '+1 (555) 456-7890',
      recipient: 'Mike Wilson',
      direction: 'outbound',
      duration: 0,
      status: 'no_answer',
      outcome: 'no_answer',
      timestamp: '2024-04-19T12:45:00Z',
      recordingUrl: null,
      notes: 'Left voicemail about new product launch',
      campaign: 'Product Launch'
    },
    {
      id: '4',
      caller: '+1 (555) 234-5678',
      recipient: 'Emma Davis',
      direction: 'inbound',
      duration: 95,
      status: 'completed',
      outcome: 'qualified',
      timestamp: '2024-04-19T11:20:00Z',
      recordingUrl: 'https://example.com/recording4.mp3',
      notes: 'Qualified lead for enterprise solution',
      campaign: 'Enterprise Outreach'
    },
    {
      id: '5',
      caller: '+1 (555) 345-6789',
      recipient: 'Alex Rodriguez',
      direction: 'outbound',
      duration: 0,
      status: 'busy',
      outcome: 'follow_up',
      timestamp: '2024-04-19T10:30:00Z',
      recordingUrl: null,
      notes: 'Will call back tomorrow',
      campaign: 'Follow-up Campaign'
    }
  ])

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.caller.includes(searchTerm) ||
                         call.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter
    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter
    return matchesSearch && matchesStatus && matchesOutcome
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="w-4 h-4 text-green-400" />
      case 'missed': return <PhoneOff className="w-4 h-4 text-red-400" />
      case 'voicemail': return <Volume2 className="w-4 h-4 text-yellow-400" />
      case 'busy': return <Phone className="w-4 h-4 text-orange-400" />
      case 'no_answer': return <PhoneOff className="w-4 h-4 text-gray-400" />
      default: return <Phone className="w-4 h-4" />
    }
  }

  const getOutcomeBadgeVariant = (outcome: string | null) => {
    switch (outcome) {
      case 'sale': return 'default'
      case 'qualified': return 'default'
      case 'follow_up': return 'secondary'
      case 'no_answer': return 'outline'
      case 'not_interested': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const totalCalls = calls.length
  const completedCalls = calls.filter(c => c.status === 'completed').length
  const totalDuration = calls.reduce((sum, c) => sum + c.duration, 0)
  const avgDuration = completedCalls > 0 ? Math.round(totalDuration / completedCalls) : 0
  const conversionRate = calls.filter(c => c.outcome === 'sale').length / totalCalls * 100

  const outcomes = Array.from(new Set(calls.map(c => c.outcome).filter(Boolean)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Call Reporting</h1>
          <p className="text-gray-400 mt-2">Monitor and analyze your call performance and outcomes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCalls}</div>
            <p className="text-xs text-gray-400">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completed Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedCalls}</div>
            <p className="text-xs text-gray-400">
              {Math.round((completedCalls / totalCalls) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatDuration(avgDuration)}</div>
            <p className="text-xs text-gray-400">
              Per completed call
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Calls resulting in sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search calls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_7_days">Last 7 days</option>
              <option value="last_30_days">Last 30 days</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="voicemail">Voicemail</option>
              <option value="busy">Busy</option>
              <option value="no_answer">No Answer</option>
            </select>

            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="all">All Outcomes</option>
              {outcomes.map(outcome => (
                <option key={outcome} value={outcome!}>
                  {outcome!.charAt(0).toUpperCase() + outcome!.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Calls List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Direction</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Outcome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Recording</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white font-medium">{call.recipient}</div>
                        <div className="text-gray-400 text-sm">{call.caller}</div>
                        {call.campaign && (
                          <div className="text-blue-400 text-xs mt-1">{call.campaign}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={call.direction === 'inbound' ? 'default' : 'secondary'} className="capitalize">
                        {call.direction}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-white">{formatDuration(call.duration)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(call.status)}
                        <span className="text-white capitalize">{call.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {call.outcome && (
                        <Badge variant={getOutcomeBadgeVariant(call.outcome)} className="capitalize">
                          {call.outcome.replace('_', ' ')}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">
                      {formatTimestamp(call.timestamp)}
                    </td>
                    <td className="py-4 px-4">
                      {call.recordingUrl ? (
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                      ) : (
                        <span className="text-gray-500 text-sm">No recording</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCalls.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No calls found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}