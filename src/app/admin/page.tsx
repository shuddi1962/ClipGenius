'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import { Users, DollarSign, BarChart3, Shield, CreditCard, Activity, FileText, Send, Instagram, Phone } from 'lucide-react'
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
        {/* Platform Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">{stats?.totalUsers.toLocaleString() || '1,247'}</div>
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
                <div className="text-3xl font-bold text-green-400 mb-1">892</div>
                <div className="text-sm text-gray-400">Active Workspaces</div>
                <div className="text-xs text-green-300 mt-1">+8% this month</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">$45,680</div>
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

        {/* System Health & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">API Services</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Database</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 text-sm">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">AI Services</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-yellow-400 text-sm">Degraded</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Storage</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 text-sm">85% capacity</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              API Usage Today
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Apify</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-[#00F5FF] text-sm font-medium">45.6K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">SendGrid</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-[#00F5FF] text-sm font-medium">12.3K</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Claude AI</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-[#00F5FF] text-sm font-medium">8.9K</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <h3 className="text-lg font-bold text-white mb-4">📋 Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">API Key regenerated</p>
                  <p className="text-xs text-gray-400">Twilio integration - Security update</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">User account suspended</p>
                  <p className="text-xs text-gray-400">Violation of terms - user@spam.com</p>
                  <p className="text-xs text-gray-500">12 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Payment processed</p>
                  <p className="text-xs text-gray-400">$299 Enterprise plan - TechCorp Ltd</p>
                  <p className="text-xs text-gray-500">18 minutes ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Control Panel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">⚙️ Administrative Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </div>

        {/* User Feature Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">👥 User Feature Access</h2>
          <p className="text-gray-400 mb-6">As an admin, you have access to all user features plus administrative controls</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/content-generator">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Content Generator</h3>
                  <p className="text-gray-400 text-sm">AI-powered content creation</p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/leads">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">Lead Management</h3>
                  <p className="text-gray-400 text-sm">AI-powered lead qualification</p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/campaigns">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-red-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">Campaign Engine</h3>
                  <p className="text-gray-400 text-sm">Multi-channel campaigns</p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">Analytics</h3>
                  <p className="text-gray-400 text-sm">Performance insights</p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/social">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-pink-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-pink-400 transition-colors">Social Media</h3>
                  <p className="text-gray-400 text-sm">Multi-platform management</p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/voice">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-cyan-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <div className="p-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">Voice AI</h3>
                  <p className="text-gray-400 text-sm">Conversational AI calls</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
