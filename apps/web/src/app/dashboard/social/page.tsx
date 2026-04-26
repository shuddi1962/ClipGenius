'use client'

import { useState, useEffect } from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Link, Unlink, Settings } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface ConnectedAccount {
  id: string
  platform: string
  account_name: string
  account_id?: string
  connected_at: string
  status: 'connected' | 'expired' | 'error'
}

export default function SocialConnectionsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('connected_accounts')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('connected_at', { ascending: false })

      if (error) throw error
      setAccounts(data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Connect Facebook Pages for automated posting',
      api: 'Meta Graph API',
      features: ['Page Posts', 'Stories', 'Events']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      description: 'Automate Instagram posts and stories',
      api: 'Meta Graph API',
      features: ['Feed Posts', 'Stories', 'Reels']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Professional networking and content sharing',
      api: 'LinkedIn API',
      features: ['Company Posts', 'Articles', 'Events']
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      description: 'Real-time content and engagement',
      api: 'Twitter API v2',
      features: ['Tweets', 'Threads', 'Spaces']
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      description: 'Video content and channel management',
      api: 'YouTube Data API',
      features: ['Video Upload', 'Playlists', 'Live Streams']
    }
  ]

  const connectPlatform = async (platformId: string) => {
    setConnecting(platformId)

    try {
      // This would typically redirect to OAuth flow
      // For now, simulate connection
      alert(`OAuth connection for ${platformId} would start here. In production, this redirects to the platform's OAuth flow.`)

      // Simulate successful connection
      setTimeout(() => {
        fetchAccounts() // Refresh accounts
        setConnecting(null)
      }, 2000)

    } catch (error) {
      console.error('Connection error:', error)
      setConnecting(null)
    }
  }

  const disconnectPlatform = async (accountId: string) => {
    try {
      const { error } = await insforge
        .from('connected_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error

      setAccounts(accounts.filter(account => account.id !== accountId))
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  const getAccountForPlatform = (platformId: string) => {
    return accounts.find(account => account.platform === platformId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Media Connections</h1>
        <p className="text-gray-300">Connect your social accounts to enable automated posting and scheduling</p>
      </div>

      {/* Connection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map(platform => {
          const Icon = platform.icon
          const connectedAccount = getAccountForPlatform(platform.id)
          const isConnecting = connecting === platform.id

          return (
            <div
              key={platform.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {connectedAccount && (
                  <div className="flex items-center text-green-400">
                    <Link className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{platform.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{platform.description}</p>

                {connectedAccount && (
                  <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-300">
                      <strong>Account:</strong> {connectedAccount.account_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Connected {new Date(connectedAccount.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  <strong>API:</strong> {platform.api}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  <strong>Features:</strong> {platform.features.join(', ')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {connectedAccount ? (
                  <>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </button>
                    <button
                      onClick={() => disconnectPlatform(connectedAccount.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => connectPlatform(platform.id)}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Setup Instructions</h3>
        <div className="space-y-4 text-blue-300">
          <div>
            <h4 className="font-medium text-blue-400 mb-1">1. Create Developer Accounts</h4>
            <p className="text-sm">Register apps on each platform's developer console (Meta, LinkedIn, Twitter, YouTube)</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-1">2. Configure OAuth</h4>
            <p className="text-sm">Set up OAuth 2.0 flows with proper redirect URIs and required permissions</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-1">3. Store API Keys</h4>
            <p className="text-sm">Securely store API keys and access tokens in InsForge.dev Vault</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-1">4. Test Connections</h4>
            <p className="text-sm">Verify API access and posting permissions before going live</p>
          </div>
        </div>
      </div>
    </div>
  )
}