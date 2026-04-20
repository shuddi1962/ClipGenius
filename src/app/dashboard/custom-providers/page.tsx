'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  Key,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database
} from 'lucide-react'

interface CustomProvider {
  id: string
  name: string
  type: 'api' | 'webhook' | 'integration' | 'custom'
  status: 'active' | 'inactive' | 'error' | 'configuring'
  endpoint: string
  apiKey?: string
  headers: Record<string, string>
  rateLimit: number
  timeout: number
  retryAttempts: number
  lastUsed: string
  successRate: number
  errorCount: number
  createdAt: string
  description: string
}

export default function CustomProviders() {
  const [providers, setProviders] = useState<CustomProvider[]>([
    {
      id: '1',
      name: 'Stripe Payment Gateway',
      type: 'api',
      status: 'active',
      endpoint: 'https://api.stripe.com/v1',
      apiKey: 'sk_test_...',
      headers: {
        'Authorization': 'Bearer sk_test_...',
        'Content-Type': 'application/json'
      },
      rateLimit: 100,
      timeout: 30000,
      retryAttempts: 3,
      lastUsed: '2024-04-19T14:30:00Z',
      successRate: 98.5,
      errorCount: 2,
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Payment processing integration for subscriptions and transactions'
    },
    {
      id: '2',
      name: 'SendGrid Email Service',
      type: 'api',
      status: 'active',
      endpoint: 'https://api.sendgrid.com/v3',
      apiKey: 'SG.xxx',
      headers: {
        'Authorization': 'Bearer SG.xxx',
        'Content-Type': 'application/json'
      },
      rateLimit: 600,
      timeout: 10000,
      retryAttempts: 2,
      lastUsed: '2024-04-19T13:15:00Z',
      successRate: 99.2,
      errorCount: 1,
      createdAt: '2024-02-01T09:30:00Z',
      description: 'Email delivery service for marketing campaigns and notifications'
    },
    {
      id: '3',
      name: 'Slack Webhook',
      type: 'webhook',
      status: 'inactive',
      endpoint: 'https://hooks.slack.com/services/...',
      headers: {
        'Content-Type': 'application/json'
      },
      rateLimit: 1,
      timeout: 5000,
      retryAttempts: 1,
      lastUsed: '2024-04-18T16:45:00Z',
      successRate: 95.0,
      errorCount: 5,
      createdAt: '2024-03-10T14:20:00Z',
      description: 'Slack integration for team notifications and alerts'
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<CustomProvider | null>(null)
  const [formData, setFormData] = useState<Partial<CustomProvider>>({
    name: '',
    type: 'api',
    endpoint: '',
    headers: {},
    rateLimit: 100,
    timeout: 30000,
    retryAttempts: 3,
    description: ''
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'inactive': return <Pause className="w-4 h-4 text-gray-400" />
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      case 'configuring': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'error': return 'destructive'
      case 'configuring': return 'outline'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="w-4 h-4" />
      case 'webhook': return <Zap className="w-4 h-4" />
      case 'integration': return <Database className="w-4 h-4" />
      case 'custom': return <Settings className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const handleCreateProvider = () => {
    const newProvider: CustomProvider = {
      id: Date.now().toString(),
      name: formData.name || 'New Provider',
      type: formData.type || 'api',
      status: 'configuring',
      endpoint: formData.endpoint || '',
      headers: formData.headers || {},
      rateLimit: formData.rateLimit || 100,
      timeout: formData.timeout || 30000,
      retryAttempts: formData.retryAttempts || 3,
      lastUsed: 'Never',
      successRate: 0,
      errorCount: 0,
      createdAt: new Date().toISOString(),
      description: formData.description || ''
    }

    setProviders(prev => [newProvider, ...prev])
    setShowCreateForm(false)
    setFormData({
      name: '',
      type: 'api',
      endpoint: '',
      headers: {},
      rateLimit: 100,
      timeout: 30000,
      retryAttempts: 3,
      description: ''
    })
  }

  const handleUpdateProvider = (provider: CustomProvider) => {
    setProviders(prev => prev.map(p =>
      p.id === provider.id ? provider : p
    ))
    setEditingProvider(null)
  }

  const handleDeleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id))
  }

  const toggleProviderStatus = (id: string) => {
    setProviders(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ))
  }

  const testProvider = (id: string) => {
    // Mock testing functionality
    setProviders(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: 'active', lastUsed: new Date().toISOString() }
        : p
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const activeProviders = providers.filter(p => p.status === 'active').length
  const totalRequests = providers.reduce((sum, p) => sum + (p.successRate > 0 ? Math.round(p.successRate * 10) : 0), 0)
  const avgSuccessRate = providers.length > 0
    ? providers.reduce((sum, p) => sum + p.successRate, 0) / providers.length
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Custom Providers</h1>
          <p className="text-gray-400 mt-2">Manage and configure third-party integrations and custom API providers</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Providers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeProviders}</div>
            <p className="text-xs text-gray-400">
              Of {providers.length} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
            <Zap className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Average across providers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Error Count</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {providers.reduce((sum, p) => sum + p.errorCount, 0)}
            </div>
            <p className="text-xs text-gray-400">
              Total errors this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingProvider) && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingProvider ? 'Edit Provider' : 'Create New Provider'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Provider Name</label>
                <Input
                  value={editingProvider?.name || formData.name || ''}
                  onChange={(e) => editingProvider
                    ? setEditingProvider({...editingProvider, name: e.target.value})
                    : setFormData({...formData, name: e.target.value})
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={editingProvider?.type || formData.type || 'api'}
                  onChange={(e) => editingProvider
                    ? setEditingProvider({...editingProvider, type: e.target.value as any})
                    : setFormData({...formData, type: e.target.value as any})
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="api">API</option>
                  <option value="webhook">Webhook</option>
                  <option value="integration">Integration</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint URL</label>
              <Input
                value={editingProvider?.endpoint || formData.endpoint || ''}
                onChange={(e) => editingProvider
                  ? setEditingProvider({...editingProvider, endpoint: e.target.value})
                  : setFormData({...formData, endpoint: e.target.value})
                }
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://api.example.com/v1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Input
                value={editingProvider?.description || formData.description || ''}
                onChange={(e) => editingProvider
                  ? setEditingProvider({...editingProvider, description: e.target.value})
                  : setFormData({...formData, description: e.target.value})
                }
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Brief description of this provider"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rate Limit</label>
                <Input
                  type="number"
                  value={editingProvider?.rateLimit || formData.rateLimit || 100}
                  onChange={(e) => editingProvider
                    ? setEditingProvider({...editingProvider, rateLimit: parseInt(e.target.value)})
                    : setFormData({...formData, rateLimit: parseInt(e.target.value)})
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timeout (ms)</label>
                <Input
                  type="number"
                  value={editingProvider?.timeout || formData.timeout || 30000}
                  onChange={(e) => editingProvider
                    ? setEditingProvider({...editingProvider, timeout: parseInt(e.target.value)})
                    : setFormData({...formData, timeout: parseInt(e.target.value)})
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Retry Attempts</label>
                <Input
                  type="number"
                  value={editingProvider?.retryAttempts || formData.retryAttempts || 3}
                  onChange={(e) => editingProvider
                    ? setEditingProvider({...editingProvider, retryAttempts: parseInt(e.target.value)})
                    : setFormData({...formData, retryAttempts: parseInt(e.target.value)})
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => editingProvider ? handleUpdateProvider(editingProvider) : handleCreateProvider()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingProvider ? 'Update Provider' : 'Create Provider'}
              </Button>
              <Button
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingProvider(null)
                  setFormData({
                    name: '',
                    type: 'api',
                    endpoint: '',
                    headers: {},
                    rateLimit: 100,
                    timeout: 30000,
                    retryAttempts: 3,
                    description: ''
                  })
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      {getTypeIcon(provider.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {provider.type}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(provider.status)} className="capitalize">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(provider.status)}
                            <span>{provider.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{provider.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-sm">Endpoint</div>
                      <div className="text-white font-mono text-sm truncate">{provider.endpoint}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Last Used</div>
                      <div className="text-white text-sm">
                        {provider.lastUsed === 'Never' ? 'Never' : formatDate(provider.lastUsed)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Success Rate</div>
                      <div className="text-white text-sm">{provider.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Errors</div>
                      <div className="text-white text-sm">{provider.errorCount}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Rate Limit: {provider.rateLimit}/min</span>
                    <span>Timeout: {provider.timeout}ms</span>
                    <span>Retries: {provider.retryAttempts}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 ml-4">
                  <Button
                    onClick={() => testProvider(provider.id)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => toggleProviderStatus(provider.id)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {provider.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setEditingProvider(provider)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteProvider(provider.id)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:text-red-400 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <div className="text-gray-400 text-lg mb-2">No custom providers configured</div>
          <div className="text-gray-500">Add your first provider to start integrating with external services</div>
        </div>
      )}
    </div>
  )
}