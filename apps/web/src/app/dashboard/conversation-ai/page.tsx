'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  Send,
  User,
  Brain,
  Zap,
  MessageSquare,
  Settings,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react'

interface AIModel {
  id: string
  name: string
  provider: string
  capabilities: string[]
  maxTokens: number
  costPerToken: number
}

interface ConversationMode {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  systemPrompt: string
}

export default function ConversationAI() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [selectedMode, setSelectedMode] = useState('general')
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    model?: string
    tokens?: number
  }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const models: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      capabilities: ['text', 'code', 'analysis'],
      maxTokens: 8192,
      costPerToken: 0.03
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'Anthropic',
      capabilities: ['text', 'analysis', 'creative'],
      maxTokens: 100000,
      costPerToken: 0.015
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      capabilities: ['text', 'multimodal', 'analysis'],
      maxTokens: 32768,
      costPerToken: 0.001
    }
  ]

  const conversationModes: ConversationMode[] = [
    {
      id: 'general',
      name: 'General Assistant',
      description: 'Helpful AI assistant for any topic',
      icon: MessageSquare,
      systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and engaging responses to user queries.'
    },
    {
      id: 'business',
      name: 'Business Advisor',
      description: 'Expert advice on business strategy and operations',
      icon: Brain,
      systemPrompt: 'You are an experienced business consultant. Provide strategic advice, market insights, and practical recommendations for business growth and operations.'
    },
    {
      id: 'creative',
      name: 'Creative Assistant',
      description: 'Help with creative writing and ideation',
      icon: Sparkles,
      systemPrompt: 'You are a creative writing assistant. Help users with storytelling, copywriting, content creation, and innovative ideas.'
    },
    {
      id: 'technical',
      name: 'Technical Expert',
      description: 'Code review, debugging, and technical guidance',
      icon: Zap,
      systemPrompt: 'You are a senior software engineer. Provide technical guidance, code reviews, debugging help, and best practices for software development.'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, selectedMode)
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date(),
        model: selectedModel,
        tokens: Math.floor(aiResponse.length / 4) // Rough token estimation
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string, mode: string): string => {
    const modeData = conversationModes.find(m => m.id === mode)
    const baseResponses = {
      general: [
        `I understand you're asking about "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}". Let me provide a comprehensive answer.`,
        "That's an interesting question! Based on my knowledge, here's what I can tell you:",
        "Great question! Let me break this down for you step by step:"
      ],
      business: [
        `From a business perspective, "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}" presents both opportunities and challenges.`,
        "In business terms, this is about strategic positioning and market dynamics.",
        "Let me analyze this from an entrepreneurial viewpoint:"
      ],
      creative: [
        `Creatively speaking, "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}" opens up fascinating possibilities.`,
        "Let's approach this with creative thinking and innovative solutions:",
        "From a creative standpoint, this could be developed in several compelling ways:"
      ],
      technical: [
        `Technically, "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}" involves several implementation considerations.`,
        "From a software engineering perspective, here's the technical breakdown:",
        "Let me provide the technical details and implementation guidance:"
      ]
    }

    const responses = baseResponses[mode as keyof typeof baseResponses] || baseResponses.general
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return `${randomResponse}\n\n${getModeSpecificContent(userInput, mode)}\n\nIs there anything specific you'd like me to elaborate on or clarify?`
  }

  const getModeSpecificContent = (input: string, mode: string): string => {
    switch (mode) {
      case 'business':
        return `• **Market Analysis**: Current trends and competitive landscape\n• **Strategic Recommendations**: Actionable steps for implementation\n• **ROI Considerations**: Potential returns and resource requirements\n• **Risk Assessment**: Potential challenges and mitigation strategies\n• **Timeline & Milestones**: Realistic implementation schedule`

      case 'creative':
        return `• **Concept Development**: Brainstorming and ideation techniques\n• **Narrative Structure**: How to build compelling stories or campaigns\n• **Visual Elements**: Design and presentation considerations\n• **Audience Engagement**: Ways to connect emotionally with your audience\n• **Innovation Techniques**: Fresh approaches and unique perspectives`

      case 'technical':
        return `• **Architecture Overview**: System design and component interactions\n• **Implementation Details**: Code structure and best practices\n• **Performance Considerations**: Optimization and scalability factors\n• **Security Measures**: Data protection and access controls\n• **Testing Strategy**: Quality assurance and validation approaches`

      default:
        return `• **Key Insights**: Important information and context\n• **Practical Applications**: How this applies to real-world scenarios\n• **Best Practices**: Recommended approaches and methodologies\n• **Common Pitfalls**: What to avoid and potential challenges\n• **Next Steps**: Actionable recommendations for moving forward`
    }
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy message: ', err)
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Mock voice recognition
    if (!isListening) {
      setTimeout(() => {
        setNewMessage("I'd like to know more about AI implementation strategies")
        setIsListening(false)
      }, 2000)
    }
  }

  const toggleTextToSpeech = () => {
    setIsSpeaking(!isSpeaking)
    // Mock TTS functionality
  }

  const regenerateResponse = (messageId: string) => {
    // Mock regeneration
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex > 0 && messages[messageIndex - 1]) {
      const userMessage = messages[messageIndex - 1]
      const newResponse = generateAIResponse(userMessage.content, selectedMode)

      setMessages(prev => prev.map((msg, index) =>
        index === messageIndex
          ? { ...msg, content: newResponse, timestamp: new Date() }
          : msg
      ))
    }
  }

  const selectedModelData = models.find(m => m.id === selectedModel)
  const selectedModeData = conversationModes.find(m => m.id === selectedMode)

  return (
    <div className="p-6 h-screen flex gap-6">
      {/* Settings Sidebar */}
      <div className="w-80 flex flex-col">
        <Card className="bg-gray-800/50 border-gray-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">AI Model</label>
              <div className="space-y-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedModel === model.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm opacity-80">{model.provider}</div>
                    <div className="flex gap-1 mt-2">
                      {model.capabilities.map(cap => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Conversation Mode</label>
              <div className="space-y-2">
                {conversationModes.map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMode === mode.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <mode.icon className="w-4 h-4" />
                      <div className="font-medium">{mode.name}</div>
                    </div>
                    <div className="text-sm opacity-80 mt-1">{mode.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Info */}
            {selectedModelData && (
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Selected Model Details</div>
                <div className="space-y-1 text-sm">
                  <div>Max Tokens: {selectedModelData.maxTokens.toLocaleString()}</div>
                  <div>Cost: ${selectedModelData.costPerToken}/1K tokens</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="bg-gray-800/50 border-gray-700 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {selectedModeData?.icon && <selectedModeData.icon className="w-5 h-5" />}
                  {selectedModeData?.name}
                </CardTitle>
                <div className="text-gray-400 text-sm mt-1">
                  Powered by {selectedModelData?.name} • {messages.length} messages
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleTextToSpeech}
                  variant="outline"
                  size="sm"
                  className={`border-gray-600 ${isSpeaking ? 'text-green-400' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={toggleVoiceInput}
                  variant="outline"
                  size="sm"
                  className={`border-gray-600 ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <div className="text-gray-400 text-lg mb-2">Start a conversation</div>
                  <div className="text-gray-500 text-sm">Ask me anything in {selectedModeData?.name.toLowerCase()} mode</div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-3 max-w-3xl ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
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
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          {message.model && <span>{message.model}</span>}
                          {message.tokens && <span>• {message.tokens} tokens</span>}
                          <span>• {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => regenerateResponse(message.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
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
                          </div>
                        )}
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
                      <span className="text-gray-400 text-sm">{selectedModelData?.name} is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {isListening && (
                <div className="flex gap-3 justify-center">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-red-400 animate-pulse" />
                      <span className="text-red-400">Listening... Speak now</span>
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
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Ask me anything in ${selectedModeData?.name.toLowerCase()} mode...`}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                  disabled={isTyping || isListening}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isTyping || isListening}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <div>
                  Press Enter to send • Shift+Enter for new line
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedModelData?.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedModeData?.name}
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