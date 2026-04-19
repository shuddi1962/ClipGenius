'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, BarChart3, Shield, Settings, Key, Activity } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface AdminStats {
  totalUsers: number
  totalWorkspaces: number
  totalRevenue: number
  activeSubscriptions: number
  totalLeads: number
  totalCampaigns: number
  apiUsage: any
  recentSignups: any[]
  systemHealth: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing' | 'api' | 'system'>('overview')

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats()
    }
  }, [activeTab])

  const fetchAdminStats = async () => {
    try {
      // This would require admin permissions in InsForge
      // For now, we'll show mock data
      const mockStats: AdminStats = {
        totalUsers: 1247,
        totalWorkspaces: 892,
        totalRevenue: 45680,
        activeSubscriptions: 456,
        totalLeads: 89456,
        totalCampaigns: 1247,
        apiUsage: {
          apify: 45600,
          sendgrid: 12340,
          twilio: 8900,
          claude: 5670
        },
        recentSignups: [
          { email: 'user1@example.com', plan: 'pro', date: '2024-04-19' },
          { email: 'user2@example.com', plan: 'starter', date: '2024-04-18' },
          { email: 'user3@example.com', plan: 'free', date: '2024-04-18' }
        ],
        systemHealth: {
          database: 'healthy',
          apis: 'healthy',
          storage: 'healthy',
          uptime: '99.9%'
        }
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Platform management and analytics</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'billing', label: 'Billing', icon: DollarSign },
          { id: 'api', label: 'API Keys', icon: Key },
          { id: 'system', label: 'System', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#00F5FF] text-[#00F5FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#00F5FF]">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Users</div>
                </div>
                <Users className="w-8 h-8 text-[#00F5FF]" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">{stats.totalWorkspaces.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Workspaces</div>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Revenue</div>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{stats.activeSubscriptions}</div>
                  <div className="text-gray-400 text-sm">Active Subs</div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{stats.totalLeads.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Leads</div>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-400">{stats.totalCampaigns.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Campaigns</div>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* API Usage */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Usage This Month</h3>
              <div className="space-y-3">
                {Object.entries(stats.apiUsage).map(([api, usage]) => (
                  <div key={api} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{api}</span>
                    <span className="text-[#00F5FF] font-semibold">{usage.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Signups */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Signups</h3>
              <div className="space-y-3">
                {stats.recentSignups.map((signup, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm">{signup.email}</div>
                      <div className="text-gray-400 text-xs">{signup.date}</div>
                    </div>
                    <div className="text-[#00F5FF] text-sm capitalize">{signup.plan}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(stats.systemHealth).map(([service, status]) => (
                <div key={service} className="text-center">
                  <div className={`inline-block w-3 h-3 rounded-full mb-2 ${
                    status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-white font-medium capitalize">{service}</div>
                  <div className="text-gray-400 text-sm">{status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
          <p className="text-gray-400">User management features would be implemented here</p>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Billing & Subscriptions</h3>
          <p className="text-gray-400">Billing management and subscription features would be implemented here</p>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">API Key Management</h3>
          <p className="text-gray-400">API key management for third-party integrations would be implemented here</p>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Administration</h3>
          <p className="text-gray-400">System monitoring and administration features would be implemented here</p>
        </div>
      )}
    </div>
  )
}