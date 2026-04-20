'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  User,
  Bot,
  Plus,
  Settings,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Save
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export default function ConversationsWith() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Marketing Strategy Discussion',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Can you help me develop a marketing strategy for my SaaS product?',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Absolutely! I\'d be happy to help you develop a comprehensive marketing strategy for your SaaS product. To create an effective strategy, I need to understand more about your product, target audience, and current situation.\n\nCould you tell me:\n1. What does your SaaS product do?\n2. Who is your target audience?\n3. What are your current marketing channels?\n4. What are your main competitors?\n5. What are your business goals?',
          timestamp: new Date(Date.now() - 3540000)
        }
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3540000)
    }
  ])

  const [activeConversation, setActiveConversation] = useState<string>('1')
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations])

  const currentConversation = conversations.find(c => c.id === activeConversation)

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    // Add user message
    setConversations(prev => prev.map(conv =>
      conv.id === activeConversation
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            title: conv.messages.length === 0 ? newMessage.slice(0, 50) + '...' : conv.title
          }
        : conv
    ))

    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      }

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, aiMessage],
              updatedAt: new Date()
            }
          : conv
      ))

      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    // Mock AI responses based on input
    const responses = [
      "That's an excellent question! Let me break this down for you step by step...",
      "Based on what you've shared, I recommend focusing on these key areas...",
      "Great point! Here's how you can implement that strategy...",
      "I understand your concern. Let me suggest some practical solutions...",
      "That's a common challenge. Here's what has worked for similar businesses...",
      "Perfect! Let me help you develop a comprehensive approach to this...",
      "Interesting perspective! Let me share some industry insights on this topic...",
      "Absolutely, I can help you with that. Here's what you need to know..."
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return `${randomResponse}\n\nBased on your question about "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}", here's my detailed analysis:\n\n1. **Current Situation**: Understanding where you stand is crucial\n2. **Strategic Recommendations**: Specific actions you can take\n3. **Implementation Timeline**: How to approach this systematically\n4. **Success Metrics**: How to measure your progress\n\nWould you like me to elaborate on any of these points, or do you have additional details to share?`
  }

  const startNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setConversations(prev => [newConv, ...prev])
    setActiveConversation(newConv.id)
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConversation === id && conversations.length > 1) {
      setActiveConversation(conversations.find(c => c.id !== id)?.id || '')
    }
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy message: ', err)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 h-screen flex gap-6">
      {/* Sidebar - Conversations List */}
      <div className="w-80 flex flex-col">
        <Card className="bg-gray-800/50 border-gray-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Conversations</CardTitle>
              <Button
                onClick={startNewConversation}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversation === conversation.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm truncate">
                    {conversation.title}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {conversation.messages.length} messages • {formatTime(conversation.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="bg-gray-800/50 border-gray-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  {currentConversation?.title || 'Select a conversation'}
                </CardTitle>
                <div className="text-gray-400 text-sm mt-1">
                  AI-powered conversations for business insights
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteConversation(activeConversation)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-3xl ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600">
                        <div className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {message.role === 'assistant' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-400 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything about your business..."
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <div>
                  Press Enter to send • AI responses are generated for educational purposes
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    GPT-4 Powered
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Business Focus
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}