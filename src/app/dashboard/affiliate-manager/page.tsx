'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Affiliate {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  commissionRate: number
  totalEarnings: number
  referrals: number
  joinedDate: string
}

export default function AffiliateManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')

  // Mock data - replace with real data from your backend
  const [affiliates] = useState<Affiliate[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      status: 'active',
      commissionRate: 10,
      totalEarnings: 2500.50,
      referrals: 45,
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'active',
      commissionRate: 15,
      totalEarnings: 1800.75,
      referrals: 32,
      joinedDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      status: 'pending',
      commissionRate: 12,
      totalEarnings: 0,
      referrals: 0,
      joinedDate: '2024-04-10'
    }
  ])

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalEarnings = affiliates.reduce((sum, affiliate) => sum + affiliate.totalEarnings, 0)
  const totalReferrals = affiliates.reduce((sum, affiliate) => sum + affiliate.referrals, 0)
  const activeAffiliates = affiliates.filter(a => a.status === 'active').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'pending': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Manager</h1>
          <p className="text-gray-400 mt-2">Manage your affiliate program and track performance</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Affiliate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Affiliates</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{affiliates.length}</div>
            <p className="text-xs text-gray-400">
              {activeAffiliates} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalReferrals}</div>
            <p className="text-xs text-gray-400">
              Across all affiliates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {affiliates.length > 0 ? (affiliates.reduce((sum, a) => sum + a.commissionRate, 0) / affiliates.length).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-gray-400">
              Average rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Affiliate List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search affiliates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive', 'pending'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Affiliate Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Affiliate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Commission</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Earnings</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Referrals</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white font-medium">{affiliate.name}</div>
                        <div className="text-gray-400 text-sm">{affiliate.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadgeVariant(affiliate.status)} className="capitalize">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(affiliate.status)}`}></div>
                        {affiliate.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-white">{affiliate.commissionRate}%</td>
                    <td className="py-4 px-4 text-white">${affiliate.totalEarnings.toFixed(2)}</td>
                    <td className="py-4 px-4 text-white">{affiliate.referrals}</td>
                    <td className="py-4 px-4 text-gray-400">{new Date(affiliate.joinedDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAffiliates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No affiliates found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}