'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import { Users, DollarSign, BarChart3, Shield, CreditCard, Activity } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface AdminStats {
  totalUsers: number
  totalWorkspaces: number
  totalRevenue: number
  activeSubscriptions: number
  totalLeads: number
  totalCampaigns: number
  apiUsage: Record<string, number>
  recentSignups: any[]
  systemHealth: Record<string, string>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Admin Control Center
              </h1>
              <p className="text-gray-400 text-sm mt-1">System management and platform oversight</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">All Systems Operational</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Quick Admin Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">{stats?.totalUsers.toLocaleString() || '0'}</div>
                <div className="text-sm text-gray-400">Total Users</div>
                <div className="text-xs text-blue-300 mt-1">+12% this month</div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">{stats?.activeSubscriptions || 0}</div>
                <div className="text-sm text-gray-400">Active Subscriptions</div>
                <div className="text-xs text-green-300 mt-1">92% retention</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">${stats?.totalRevenue.toLocaleString() || '0'}</div>
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="text-xs text-yellow-300 mt-1">+15% vs last month</div>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">99.9%</div>
                <div className="text-sm text-gray-400">System Uptime</div>
                <div className="text-xs text-red-300 mt-1">Last 30 days</div>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-red-500 bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
              <div className="p-6">
                <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">User Management</h3>
                <p className="text-gray-400 mb-4">Manage all users, roles, and permissions</p>
                <div className="flex items-center text-sm">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Admin Only</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/billing">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
              <div className="p-6">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Billing & Revenue</h3>
                <p className="text-gray-400 mb-4">Monitor subscriptions, payments, and financial metrics</p>
                <div className="flex items-center text-sm">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Financial</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/api-keys">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
              <div className="p-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">API Management</h3>
                <p className="text-gray-400 mb-4">Configure third-party integrations and API keys</p>
                <div className="flex items-center text-sm">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Integration</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/system">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500 bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
              <div className="p-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">System Health</h3>
                <p className="text-gray-400 mb-4">Monitor platform performance and system status</p>
                <div className="flex items-center text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Monitoring</span>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <div className="p-6">
              <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Platform Analytics</h3>
              <p className="text-gray-400 mb-4">Comprehensive platform usage and performance metrics</p>
              <div className="flex items-center text-sm">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Coming Soon</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <div className="p-6">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audit Logs</h3>
              <p className="text-gray-400 mb-4">Track all platform activities and user actions</p>
              <div className="flex items-center text-sm">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">Security</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
