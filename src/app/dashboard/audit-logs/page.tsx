'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'warning' | 'error'
  category: 'authentication' | 'data' | 'system' | 'security' | 'user'
}

const DATE_RANGE_OPTIONS = [
  { value: 'last_hour', label: 'Last Hour' },
  { value: 'last_24_hours', label: 'Last 24 Hours' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' }
]

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('last_7_days')
  const [userFilter, setUserFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-04-19T14:30:00Z',
      user: 'john.doe@company.com',
      action: 'User Login',
      resource: 'Authentication',
      details: 'Successful login from web application',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      category: 'authentication'
    },
    {
      id: '2',
      timestamp: '2024-04-19T14:25:00Z',
      user: 'admin@company.com',
      action: 'User Created',
      resource: 'User Management',
      details: 'Created new user account for jane.smith@company.com',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'success',
      category: 'user'
    },
    {
      id: '3',
      timestamp: '2024-04-19T14:20:00Z',
      user: 'system',
      action: 'Data Export',
      resource: 'Lead Database',
      details: 'Exported 1,250 leads to CSV format',
      ipAddress: '10.0.0.1',
      userAgent: 'ClipGenius API v2.0',
      status: 'success',
      category: 'data'
    },
    {
      id: '4',
      timestamp: '2024-04-19T14:15:00Z',
      user: 'jane.smith@company.com',
      action: 'Failed Login',
      resource: 'Authentication',
      details: 'Invalid password attempt',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      status: 'error',
      category: 'authentication'
    },
    {
      id: '5',
      timestamp: '2024-04-19T14:10:00Z',
      user: 'mike.wilson@company.com',
      action: 'Settings Updated',
      resource: 'Account Settings',
      details: 'Updated notification preferences',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      category: 'user'
    },
    {
      id: '6',
      timestamp: '2024-04-19T14:05:00Z',
      user: 'system',
      action: 'Security Alert',
      resource: 'Firewall',
      details: 'Blocked suspicious login attempt from unknown IP',
      ipAddress: '203.0.113.1',
      userAgent: 'Unknown',
      status: 'warning',
      category: 'security'
    }
  ]

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = userFilter === 'all' || log.user === userFilter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    return matchesSearch && matchesUser && matchesAction && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Info className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <LogIn className="w-4 h-4" />
      case 'data': return <FileText className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'user': return <User className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <LogIn className="w-4 h-4" />
    if (action.includes('Created')) return <Plus className="w-4 h-4" />
    if (action.includes('Updated')) return <Edit className="w-4 h-4" />
    if (action.includes('Deleted')) return <Trash2 className="w-4 h-4" />
    if (action.includes('Export')) return <Download className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user)))
  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="text-gray-400 mt-2">Monitor system activity, user actions, and security events</p>
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
            <p className="text-xs text-gray-400">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {auditLogs.filter(log => log.status === 'success').length}
            </div>
            <p className="text-xs text-gray-400">
              {Math.round((auditLogs.filter(log => log.status === 'success').length / auditLogs.length) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {auditLogs.filter(log => log.status === 'warning').length}
            </div>
            <p className="text-xs text-gray-400">
              Security alerts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {auditLogs.filter(log => log.status === 'error').length}
            </div>
            <p className="text-xs text-gray-400">
              Failed operations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filter Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {DATE_RANGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Resource</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Details</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(log.action)}
                        <span className="text-white text-sm">{log.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {log.resource}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <span className="text-gray-300 text-sm truncate block" title={log.details}>
                        {log.details}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadgeVariant(log.status)} className="capitalize">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(log.status)}
                          <span>{log.status}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 text-sm font-mono">{log.ipAddress}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}