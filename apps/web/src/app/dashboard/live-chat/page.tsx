'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  Users,
  Settings,
  BarChart3,
  Clock,
  User,
  Bot,
  Phone,
  Mail,
  Globe,
  Zap,
  Eye,
  Download
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface ChatMessage {
  id: string
  session_id: string
  sender: 'user' | 'agent' | 'system'
  content: string
  timestamp: string
  sender_name?: string
  sender_avatar?: string
}

interface ChatSession {
  id: string
  customerName: string
  customerEmail?: string
  status: 'active' | 'waiting' | 'closed'
  startedAt: string
  lastMessageAt: string
  messageCount: number
  assignedAgent?: string
}

export default function LiveChatPage() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'settings' | 'analytics'>('conversations')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchChatSessions()
    }
  }, [activeTab])

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession)
      // Set up polling for new messages
      const interval = setInterval(() => fetchMessages(selectedSession), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatSessions = async () => {
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
        .from('chat_sessions')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('last_message_at', { ascending: false })

      if (error) throw error
      setChatSessions(data || [])
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await insforge
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return

    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const messageData = {
        session_id: selectedSession,
        sender: 'agent' as const,
        content: newMessage,
        timestamp: new Date().toISOString(),
        sender_name: 'Support Agent' // Could be dynamic based on user
      }

      const { error } = await insforge
        .from('chat_messages')
        .insert(messageData)

      if (error) throw error

      setMessages(prev => [...prev, { ...messageData, id: Date.now().toString() }])
      setNewMessage('')

      // Update session last message time
      await insforge
        .from('chat_sessions')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedSession)

    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const updateSessionStatus = async (sessionId: string, status: ChatSession['status']) => {
    try {
      const { error } = await insforge
        .from('chat_sessions')
        .update({ status })
        .eq('id', sessionId)

      if (error) throw error

      setChatSessions(sessions =>
        sessions.map(session =>
          session.id === sessionId ? { ...session, status } : session
        )
      )
    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'waiting': return 'bg-yellow-500/20 text-yellow-400'
      case 'closed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const tabs = [
    { id: 'conversations', name: 'Conversations', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
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
          <h1 className="text-3xl font-bold text-white mb-2">Live Chat</h1>
          <p className="text-gray-300">Real-time customer support and engagement</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Chat Logs
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Chat Settings
          </Button>
        </div>
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

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Sessions List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Active Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedSession === session.id
                        ? 'bg-[#00F5FF]/20 border border-[#00F5FF]/50'
                        : 'bg-gray-700/50 hover:bg-gray-700/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{session.customerName}</div>
                          <div className="text-gray-400 text-xs">
                            {new Date(session.lastMessageAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {session.messageCount} messages
                    </div>
                  </div>
                ))}

                {chatSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active conversations</p>
                    <p className="text-sm mt-2">Conversations will appear here when customers connect</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {chatSessions.find(s => s.id === selectedSession)?.customerName}
                        </div>
                        <div className="text-gray-400 text-sm">Live Chat</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateSessionStatus(selectedSession, 'closed')}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        End Chat
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gray-700 text-white'
                            : 'bg-[#00F5FF] text-black'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-gray-400' : 'text-black/70'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="flex-shrink-0 p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Conversation</h3>
                  <p>Choose a chat session from the list to start responding</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Chat Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Total Conversations</div>
                    <div className="text-gray-400 text-sm">This month</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00F5FF]">{chatSessions.length}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Average Response Time</div>
                    <div className="text-gray-400 text-sm">Minutes</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">2.3</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Customer Satisfaction</div>
                    <div className="text-gray-400 text-sm">Rating</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">4.7/5</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Chat Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chat activity chart</p>
                  <p className="text-sm mt-2">Shows conversation volume over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Chat Widget Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Widget Embed Code
                </label>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <code className="text-green-400 text-sm">
                    {`<script src="https://clipgenius.com/widgets/chat.js"></script>
<div id="clipgenius-chat" data-workspace-id="YOUR_WORKSPACE_ID"></div>`}
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Add this code to your website to enable live chat
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chat Availability
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]">
                    <option value="always">Always Online</option>
                    <option value="business-hours">Business Hours Only</option>
                    <option value="manual">Manual Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto-Assignment
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]">
                    <option value="round-robin">Round Robin</option>
                    <option value="least-busy">Least Busy Agent</option>
                    <option value="manual">Manual Assignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Welcome Message
                </label>
                <Input
                  defaultValue="Hi there! How can we help you today?"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offline Message
                </label>
                <Input
                  defaultValue="We're currently offline. Leave us a message and we'll get back to you soon!"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}