'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Download,
  Calendar,
  User,
  Database,
  Bell,
  Settings,
  AlertCircle
} from 'lucide-react'

interface ComplianceCheck {
  id: string
  name: string
  category: 'gdpr' | 'ccpa' | 'hipaa' | 'security' | 'data_privacy'
  status: 'compliant' | 'warning' | 'non_compliant'
  lastChecked: string
  nextCheck: string
  description: string
  actionRequired: string | null
}

interface DataRequest {
  id: string
  type: 'access' | 'deletion' | 'portability' | 'rectification'
  user: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  requestedAt: string
  completedAt: string | null
  notes: string
}

export default function Compliance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'requests' | 'settings'>('overview')

  // Mock compliance checks
  const [complianceChecks] = useState<ComplianceCheck[]>([
    {
      id: '1',
      name: 'GDPR Data Processing',
      category: 'gdpr',
      status: 'compliant',
      lastChecked: '2024-04-15T10:00:00Z',
      nextCheck: '2024-05-15T10:00:00Z',
      description: 'Regular audit of data processing activities and consent management',
      actionRequired: null
    },
    {
      id: '2',
      name: 'CCPA Privacy Rights',
      category: 'ccpa',
      status: 'warning',
      lastChecked: '2024-04-10T14:30:00Z',
      nextCheck: '2024-04-25T14:30:00Z',
      description: 'Verification of CCPA compliance for California residents',
      actionRequired: 'Update privacy notice language'
    },
    {
      id: '3',
      name: 'Data Encryption',
      category: 'security',
      status: 'compliant',
      lastChecked: '2024-04-12T09:15:00Z',
      nextCheck: '2024-05-12T09:15:00Z',
      description: 'Encryption standards for data at rest and in transit',
      actionRequired: null
    },
    {
      id: '4',
      name: 'Cookie Consent',
      category: 'gdpr',
      status: 'non_compliant',
      lastChecked: '2024-04-08T16:45:00Z',
      nextCheck: '2024-04-20T16:45:00Z',
      description: 'Cookie consent mechanism and tracking compliance',
      actionRequired: 'Implement proper cookie consent banner'
    },
    {
      id: '5',
      name: 'Data Retention Policy',
      category: 'data_privacy',
      status: 'compliant',
      lastChecked: '2024-04-05T11:20:00Z',
      nextCheck: '2024-05-05T11:20:00Z',
      description: 'Data retention and deletion policies implementation',
      actionRequired: null
    }
  ])

  // Mock data requests
  const [dataRequests] = useState<DataRequest[]>([
    {
      id: '1',
      type: 'access',
      user: 'john.doe@example.com',
      status: 'completed',
      requestedAt: '2024-04-10T09:00:00Z',
      completedAt: '2024-04-12T14:30:00Z',
      notes: 'Provided data export containing user profile and activity logs'
    },
    {
      id: '2',
      type: 'deletion',
      user: 'jane.smith@example.com',
      status: 'in_progress',
      requestedAt: '2024-04-15T11:15:00Z',
      completedAt: null,
      notes: 'Data deletion request under review'
    },
    {
      id: '3',
      type: 'portability',
      user: 'mike.wilson@example.com',
      status: 'pending',
      requestedAt: '2024-04-18T16:20:00Z',
      completedAt: null,
      notes: 'Awaiting user verification'
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'non_compliant': return <XCircle className="w-5 h-5 text-red-400" />
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'compliant': return 'default'
      case 'warning': return 'secondary'
      case 'non_compliant': return 'destructive'
      default: return 'outline'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gdpr': return 'text-blue-400'
      case 'ccpa': return 'text-purple-400'
      case 'hipaa': return 'text-red-400'
      case 'security': return 'text-green-400'
      case 'data_privacy': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getRequestStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'pending': return 'outline'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const compliantChecks = complianceChecks.filter(c => c.status === 'compliant').length
  const warningChecks = complianceChecks.filter(c => c.status === 'warning').length
  const nonCompliantChecks = complianceChecks.filter(c => c.status === 'non_compliant').length
  const pendingRequests = dataRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'checks', name: 'Compliance Checks', icon: CheckCircle },
    { id: 'requests', name: 'Data Requests', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Compliance</h1>
          <p className="text-gray-400 mt-2">Manage regulatory compliance and data privacy requirements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
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
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Compliant</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{compliantChecks}</div>
                <p className="text-xs text-gray-400">
                  {Math.round((compliantChecks / complianceChecks.length) * 100)}% compliance rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Warnings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{warningChecks}</div>
                <p className="text-xs text-gray-400">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Non-Compliant</CardTitle>
                <XCircle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{nonCompliantChecks}</div>
                <p className="text-xs text-gray-400">
                  Action required
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{pendingRequests}</div>
                <p className="text-xs text-gray-400">
                  Data requests
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Compliance Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border border-gray-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">GDPR Audit Completed</div>
                    <div className="text-gray-400 text-sm">All data processing activities are compliant</div>
                    <div className="text-gray-500 text-xs mt-1">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-gray-700/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Cookie Consent Update Required</div>
                    <div className="text-gray-400 text-sm">Current implementation needs GDPR compliance updates</div>
                    <div className="text-gray-500 text-xs mt-1">1 day ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-gray-700/50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">Data Access Request Processed</div>
                    <div className="text-gray-400 text-sm">User data export completed for john.doe@example.com</div>
                    <div className="text-gray-500 text-xs mt-1">3 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Checks Tab */}
      {activeTab === 'checks' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Compliance Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-4 p-4 border border-gray-700/50 rounded-lg">
                  <div className="mt-1">
                    {getStatusIcon(check.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{check.name}</h3>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(check.category)} border-current`}>
                        {check.category.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(check.status)} className="capitalize">
                        {check.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{check.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                      <div>Last checked: {formatDate(check.lastChecked)}</div>
                      <div>Next check: {formatDate(check.nextCheck)}</div>
                    </div>

                    {check.actionRequired && (
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <div>
                            <div className="text-yellow-400 font-medium">Action Required</div>
                            <div className="text-yellow-300 text-sm">{check.actionRequired}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Run Check
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Requests Tab */}
      {activeTab === 'requests' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Data Subject Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataRequests.map((request) => (
                <div key={request.id} className="p-4 border border-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {request.type}
                      </Badge>
                      <Badge variant={getRequestStatusBadgeVariant(request.status)} className="capitalize">
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      Requested: {formatDate(request.requestedAt)}
                      {request.completedAt && ` • Completed: ${formatDate(request.completedAt)}`}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-white font-medium">{request.user}</div>
                    <div className="text-gray-400 text-sm mt-1">{request.notes}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                    {request.status !== 'completed' && (
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Process Request
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Automated Compliance Checks</div>
                  <div className="text-gray-400 text-sm">Run compliance audits automatically</div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Data Retention Policies</div>
                  <div className="text-gray-400 text-sm">Configure how long different types of data are retained</div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Privacy Policy Templates</div>
                  <div className="text-gray-400 text-sm">Generate compliant privacy policies</div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  View Templates
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Compliance Notifications</div>
                  <div className="text-gray-400 text-sm">Configure alerts for compliance issues</div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Setup Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}