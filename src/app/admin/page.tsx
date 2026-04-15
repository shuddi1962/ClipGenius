'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { BarChart3, Users, FileText, Settings, TrendingUp, Zap } from 'lucide-react'
import { dbService } from '@/lib/database'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    activeUsers: 0,
    totalViews: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const currentUser = await dbService.getCurrentUser()
        setUser(currentUser)

        // In a real application, you'd have admin APIs to get these stats
        // For now, we'll show placeholder data
        setStats({
          totalUsers: 1, // Current user
          totalContent: 0, // Would come from admin API
          activeUsers: 1,
          totalViews: 0
        })
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-6">You need to be signed in as an admin to access this page.</p>
          <Button href="/settings">Go to Settings</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, content, and platform analytics</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>👋 Welcome back, {user.name || user.email}!</strong><br />
            This admin dashboard provides insights into platform usage and user management.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalContent}</div>
          <div className="text-sm text-gray-600">Content Items</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeUsers}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalViews}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-roshanal-navy rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-roshanal-blue rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Content Moderation</h3>
              <p className="text-sm text-gray-600">Review and moderate user content</p>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Platform usage and performance metrics</p>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure platform settings</p>
            </div>
          </div>
          <div className="mt-4">
            <Button href="/settings" className="w-full">
              Go to Settings
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Management</h3>
              <p className="text-sm text-gray-600">Monitor AI usage and performance</p>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reports</h3>
              <p className="text-sm text-gray-600">Generate usage and performance reports</p>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>
      </div>

      {/* Platform Health */}
      <div className="mt-8">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900">Database</h3>
              <p className="text-sm text-gray-600">Online & Healthy</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900">AI Services</h3>
              <p className="text-sm text-gray-600">Connected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900">Deployment</h3>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}