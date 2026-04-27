'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Plus,
  Settings,
  RefreshCw,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Eye,
  Send,
  Inbox,
  Archive,
  Star,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface EmailAccount {
  id: string
  provider: 'gmail' | 'outlook'
  email: string
  display_name: string
  status: 'connected' | 'connecting' | 'error' | 'disconnected'
  last_sync: string | null
  sync_frequency: number // minutes
  is_active: boolean
  settings: {
    auto_sync: boolean
    sync_labels: string[]
    archive_after_sync: boolean
  }
}

interface EmailMessage {
  id: string
  account_id: string
  message_id: string
  subject: string
  sender: string
  recipient: string
  body: string
  received_at: string
  is_read: boolean
  labels: string[]
  thread_id?: string
}

export default function EmailIntegrationPage() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'inbox' | 'settings' | 'analytics'>('accounts')
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [showAddAccount, setShowAddAccount] = useState(false)

  // Add account form
  const [newAccount, setNewAccount] = useState({
    provider: 'gmail' as 'gmail' | 'outlook',
    email: '',
    display_name: ''
  })

  useEffect(() => {
    loadEmailAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount && activeTab === 'inbox') {
      loadMessages(selectedAccount)
    }
  }, [selectedAccount, activeTab])

  const loadEmailAccounts = async () => {
    try {
      const { data, error } = await insforge
        .from('email_accounts')
        .select('*')
        .eq('user_id', 'user_1')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAccounts(data || [])
    } catch (error) {
      console.error('Error loading email accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (accountId: string) => {
    try {
      const { data, error } = await insforge
        .from('email_messages')
        .select('*')
        .eq('account_id', accountId)
        .order('received_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const connectAccount = async () => {
    if (!newAccount.email || !newAccount.display_name) return

    try {
      const accountData = {
        user_id: 'user_1',
        provider: newAccount.provider,
        email: newAccount.email,
        display_name: newAccount.display_name,
        status: 'connecting',
        sync_frequency: 15, // 15 minutes
        is_active: true,
        settings: {
          auto_sync: true,
          sync_labels: ['INBOX'],
          archive_after_sync: false
        }
      }

      const { error } = await insforge
        .from('email_accounts')
        .insert(accountData)

      if (error) throw error

      alert(`Connecting to ${newAccount.provider}... Please check your email for authorization.`)
      setShowAddAccount(false)
      setNewAccount({
        provider: 'gmail',
        email: '',
        display_name: ''
      })
      loadEmailAccounts()
    } catch (error) {
      console.error('Error connecting account:', error)
      alert('Failed to connect email account')
    }
  }

  const syncAccount = async (accountId: string) => {
    try {
      // Simulate sync process
      const { error } = await insforge
        .from('email_accounts')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', accountId)

      if (error) throw error

      // Reload messages if this account is selected
      if (selectedAccount === accountId) {
        loadMessages(accountId)
      }

      loadEmailAccounts()
    } catch (error) {
      console.error('Error syncing account:', error)
    }
  }

  const toggleAccountStatus = async (accountId: string, isActive: boolean) => {
    try {
      const { error } = await insforge
        .from('email_accounts')
        .update({ is_active: !isActive })
        .eq('id', accountId)

      if (error) throw error
      loadEmailAccounts()
    } catch (error) {
      console.error('Error updating account status:', error)
    }
  }

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this email account? All synced emails will be removed.')) return

    try {
      const { error } = await insforge
        .from('email_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error
      setAccounts(accounts.filter(account => account.id !== accountId))
      if (selectedAccount === accountId) {
        setSelectedAccount(null)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete email account')
    }
  }

  const markMessageAsRead = async (messageId: string, isRead: boolean) => {
    try {
      const { error } = await insforge
        .from('email_messages')
        .update({ is_read: !isRead })
        .eq('id', messageId)

      if (error) throw error

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, is_read: !isRead } : msg
      ))
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const getStatusIcon = (status: EmailAccount['status']) => {
    switch (status) {
      case 'connected':
        return <Check className="w-4 h-4 text-green-400" />
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'disconnected':
        return <X className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: EmailAccount['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-400'
      case 'connecting':
        return 'bg-blue-500/20 text-blue-400'
      case 'error':
        return 'bg-red-500/20 text-red-400'
      case 'disconnected':
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const tabs = [
    { id: 'accounts', name: 'Accounts', icon: Mail },
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  const sampleMessages = [
    {
      id: 'msg_1',
      account_id: 'account_1',
      message_id: 'gmail_msg_1',
      subject: 'Welcome to ClipGenius!',
      sender: 'support@clipgenius.com',
      recipient: 'user@example.com',
      body: 'Thank you for signing up...',
      received_at: new Date(Date.now() - 3600000).toISOString(),
      is_read: false,
      labels: ['INBOX', 'IMPORTANT']
    },
    {
      id: 'msg_2',
      account_id: 'account_1',
      message_id: 'gmail_msg_2',
      subject: 'Your weekly analytics report',
      sender: 'analytics@clipgenius.com',
      recipient: 'user@example.com',
      body: 'Here are your weekly analytics...',
      received_at: new Date(Date.now() - 7200000).toISOString(),
      is_read: true,
      labels: ['INBOX']
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Integration</h1>
          <p className="text-gray-300">Connect and sync your email accounts</p>
        </div>
        <Button onClick={() => setShowAddAccount(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          {/* Accounts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        {account.display_name}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{account.email}</p>
                      <Badge className={`mt-2 ${getStatusColor(account.status)}`}>
                        {getStatusIcon(account.status)}
                        <span className="ml-1 capitalize">{account.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Provider:</span>
                      <span className="text-white capitalize">{account.provider}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Sync:</span>
                      <span className="text-white">
                        {account.last_sync ? new Date(account.last_sync).toLocaleString() : 'Never'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Auto Sync:</span>
                      <span className={`text-${account.settings.auto_sync ? 'green' : 'red'}-400`}>
                        {account.settings.auto_sync ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => syncAccount(account.id)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync
                      </Button>

                      <Button
                        onClick={() => toggleAccountStatus(account.id, account.is_active)}
                        size="sm"
                        variant={account.is_active ? "destructive" : "default"}
                        className={account.is_active ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        {account.is_active ? 'Disable' : 'Enable'}
                      </Button>

                      <Button
                        onClick={() => deleteAccount(account.id)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sample Accounts */}
            {accounts.length === 0 && (
              <div className="col-span-full">
                <h3 className="text-xl font-semibold text-white mb-4">Sample Email Accounts</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: 'sample_1',
                      provider: 'gmail',
                      email: 'user@gmail.com',
                      display_name: 'Personal Gmail',
                      status: 'connected',
                      last_sync: new Date().toISOString(),
                      is_active: true
                    },
                    {
                      id: 'sample_2',
                      provider: 'outlook',
                      email: 'user@outlook.com',
                      display_name: 'Work Outlook',
                      status: 'connected',
                      last_sync: new Date(Date.now() - 3600000).toISOString(),
                      is_active: true
                    }
                  ].map((account) => (
                    <Card key={account.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          {account.display_name}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">{account.email}</p>
                        <Badge className={`mt-2 ${getStatusColor(account.status as any)}`}>
                          {getStatusIcon(account.status as any)}
                          <span className="ml-1 capitalize">{account.status}</span>
                        </Badge>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Provider:</span>
                            <span className="text-white capitalize">{account.provider}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Sync:</span>
                            <span className="text-white">
                              {new Date(account.last_sync!).toLocaleString()}
                            </span>
                          </div>

                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white w-full">
                            <Plus className="w-4 h-4 mr-1" />
                            Connect Account
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          {/* Account Selector */}
          {accounts.length > 0 && (
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <label className="text-white font-medium">Select Account:</label>
                  <select
                    value={selectedAccount || ''}
                    onChange={(e) => setSelectedAccount(e.target.value || null)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="">Select an account...</option>
                    {accounts.filter(acc => acc.status === 'connected').map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.display_name} ({account.email})
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages List */}
          {selectedAccount ? (
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <Card key={message.id} className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors ${
                    !message.is_read ? 'border-l-4 border-l-blue-500' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-medium ${message.is_read ? 'text-gray-300' : 'text-white'}`}>
                              {message.subject}
                            </h3>
                            {!message.is_read && (
                              <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                            )}
                          </div>

                          <div className="text-sm text-gray-400 mb-2">
                            From: {message.sender} • {new Date(message.received_at).toLocaleString()}
                          </div>

                          <div className={`text-sm ${message.is_read ? 'text-gray-400' : 'text-gray-300'} line-clamp-2`}>
                            {message.body}
                          </div>

                          {message.labels.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.labels.map((label) => (
                                <Badge key={label} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => markMessageAsRead(message.id, message.is_read)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Inbox className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No messages found</h3>
                    <p className="text-gray-400">
                      {accounts.length === 0
                        ? 'Connect an email account to start syncing messages.'
                        : 'No messages in this account yet.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-8 text-center">
                <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select an Email Account</h3>
                <p className="text-gray-400">
                  Choose an email account from the dropdown above to view your messages.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Integration Settings</CardTitle>
              <p className="text-gray-400">Configure your email sync preferences</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Sync Frequency
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]">
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto Archive After Sync
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Labels to Sync
                </label>
                <Input
                  value="INBOX,IMPORTANT"
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Comma-separated label names"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Total Synced Emails</div>
                    <div className="text-gray-400 text-sm">Across all accounts</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">2,847</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Unread Messages</div>
                    <div className="text-gray-400 text-sm">Requiring attention</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">23</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Connected Accounts</div>
                    <div className="text-gray-400 text-sm">Active integrations</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{accounts.filter(acc => acc.status === 'connected').length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Sync Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-white text-sm">{account.display_name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">
                        {account.last_sync ? 'Synced' : 'Never synced'}
                      </span>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Connect Email Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Provider
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewAccount(prev => ({ ...prev, provider: 'gmail' }))}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      newAccount.provider === 'gmail'
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <Mail className="w-6 h-6 mx-auto mb-2 text-red-400" />
                      <div className="text-white font-medium">Gmail</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setNewAccount(prev => ({ ...prev, provider: 'outlook' }))}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      newAccount.provider === 'outlook'
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <Mail className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-white font-medium">Outlook</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <Input
                  value={newAccount.display_name}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, display_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Personal Gmail"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-blue-400 font-medium mb-1">Authorization Required</div>
                    <div className="text-gray-300">
                      You'll be redirected to {newAccount.provider === 'gmail' ? 'Google' : 'Microsoft'} to authorize access to your email account.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowAddAccount(false)}
                >
                  Cancel
                </Button>
                <Button onClick={connectAccount} disabled={!newAccount.email || !newAccount.display_name} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Connect Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}