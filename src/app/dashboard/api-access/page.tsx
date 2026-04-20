'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Download,
  ExternalLink,
  Shield,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react'

interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'inactive' | 'expired'
  permissions: string[]
  usage: {
    requests: number
    limit: number
    resetDate: string
  }
}

export default function APIAccess() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')

  // Mock data
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'cg_live_1234567890abcdef',
      createdAt: '2024-01-15T10:00:00Z',
      lastUsed: '2024-04-19T12:30:00Z',
      status: 'active',
      permissions: ['read', 'write', 'delete'],
      usage: {
        requests: 15420,
        limit: 100000,
        resetDate: '2024-05-01T00:00:00Z'
      }
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'cg_dev_abcdef1234567890',
      createdAt: '2024-03-01T14:20:00Z',
      lastUsed: '2024-04-18T16:45:00Z',
      status: 'active',
      permissions: ['read', 'write'],
      usage: {
        requests: 2340,
        limit: 10000,
        resetDate: '2024-05-01T00:00:00Z'
      }
    },
    {
      id: '3',
      name: 'Legacy Integration',
      key: 'cg_legacy_0987654321fedcba',
      createdAt: '2023-11-10T09:15:00Z',
      lastUsed: '2024-04-15T11:20:00Z',
      status: 'inactive',
      permissions: ['read'],
      usage: {
        requests: 5670,
        limit: 50000,
        resetDate: '2024-05-01T00:00:00Z'
      }
    }
  ])

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const generateNewKey = () => {
    if (!newKeyName.trim() || newKeyName.length < 3 || apiKeys.some(k => k.name.toLowerCase() === newKeyName.toLowerCase())) return

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `cg_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      status: 'active',
      permissions: ['read'],
      usage: {
        requests: 0,
        limit: 10000,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }

    setApiKeys(prev => [newKey, ...prev])
    setNewKeyName('')
  }

  const revokeKey = (id: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, status: 'inactive' as const } : key
    ))
  }

  const regenerateKey = (id: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id
        ? {
            ...key,
            key: `cg_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString()
          }
        : key
    ))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'expired': return 'destructive'
      default: return 'secondary'
    }
  }

  const totalRequests = apiKeys.reduce((sum, key) => sum + key.usage.requests, 0)
  const activeKeys = apiKeys.filter(key => key.status === 'active').length
  const totalLimits = apiKeys.reduce((sum, key) => sum + key.usage.limit, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Access</h1>
          <p className="text-gray-400 mt-2">Manage your API keys and monitor usage</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            API Docs
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Developer Portal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeKeys}</div>
            <p className="text-xs text-gray-400">
              Of {apiKeys.length} total keys
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
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
            <CardTitle className="text-sm font-medium text-gray-400">Usage Rate</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalLimits > 0 ? Math.round((totalRequests / totalLimits) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-400">
              Of monthly limit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">245ms</div>
            <p className="text-xs text-gray-400">
              API response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Key */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create New API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter key name (e.g., Production API)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={generateNewKey}
              disabled={!newKeyName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            New keys will have read-only permissions by default. You can modify permissions after creation.
          </p>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                    <Badge variant={getStatusBadgeVariant(apiKey.status)} className="capitalize">
                      {apiKey.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                    <span>Last used: {apiKey.lastUsed === 'Never' ? 'Never' : new Date(apiKey.lastUsed).toLocaleString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {apiKey.permissions.map(permission => (
                      <Badge key={permission} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => regenerateKey(apiKey.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  {apiKey.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeKey(apiKey.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* API Key Display */}
              <div className="bg-gray-900 rounded p-3 font-mono text-sm mb-3">
                {showKeys[apiKey.id] ? (
                  <span className="text-green-400">{apiKey.key}</span>
                ) : (
                  <span className="text-gray-500">••••••••••••••••••••••••••••••••</span>
                )}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{apiKey.usage.requests.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Requests this month</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{apiKey.usage.limit.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Monthly limit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {Math.round((apiKey.usage.requests / apiKey.usage.limit) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Usage rate</div>
                </div>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No API keys found. Create your first key to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-white font-medium">Getting Started</div>
              <div className="text-sm text-gray-400">Authentication & basics</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-white font-medium">Endpoints</div>
              <div className="text-sm text-gray-400">API reference</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-white font-medium">Examples</div>
              <div className="text-sm text-gray-400">Code samples</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🆘</div>
              <div className="text-white font-medium">Support</div>
              <div className="text-sm text-gray-400">Get help</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}