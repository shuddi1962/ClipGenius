'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  FileText,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Save,
  Settings,
  Target,
  TrendingUp,
  BarChart3,
  Lightbulb,
  PenTool,
  Image,
  Video,
  MessageSquare
} from 'lucide-react'

interface ContentSuggestion {
  id: string
  type: 'blog' | 'social' | 'email' | 'ad' | 'video'
  title: string
  content: string
  keywords: string[]
  score: number
  estimatedEngagement: number
  generatedAt: string
}

interface ContentTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: React.ComponentType<any>
}

export default function ContentAI() {
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize' | 'analyze' | 'templates'>('generate')
  const [contentType, setContentType] = useState('blog')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [suggestions] = useState<ContentSuggestion[]>([
    {
      id: '1',
      type: 'blog',
      title: 'The Future of AI in Business: Trends to Watch',
      content: 'Artificial Intelligence is revolutionizing the business landscape...',
      keywords: ['AI', 'business', 'automation', 'future'],
      score: 92,
      estimatedEngagement: 85,
      generatedAt: '2024-04-19T10:30:00Z'
    },
    {
      id: '2',
      type: 'social',
      title: '🚀 AI is transforming how we work! Here are 5 ways...',
      content: 'From automated customer service to predictive analytics...',
      keywords: ['AI', 'productivity', 'automation', 'work'],
      score: 88,
      estimatedEngagement: 92,
      generatedAt: '2024-04-19T09:15:00Z'
    },
    {
      id: '3',
      type: 'email',
      title: 'Your Guide to AI-Powered Marketing Success',
      content: 'Dear valued customer, Discover how AI can supercharge your marketing efforts...',
      keywords: ['AI', 'marketing', 'automation', 'ROI'],
      score: 95,
      estimatedEngagement: 78,
      generatedAt: '2024-04-19T08:45:00Z'
    }
  ])

  const templates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Blog Post',
      category: 'Written',
      description: 'Comprehensive blog articles with SEO optimization',
      icon: FileText
    },
    {
      id: '2',
      name: 'Social Media Post',
      category: 'Social',
      description: 'Engaging posts for platforms like LinkedIn, Twitter, Facebook',
      icon: MessageSquare
    },
    {
      id: '3',
      name: 'Email Newsletter',
      category: 'Marketing',
      description: 'Professional email campaigns and newsletters',
      icon: PenTool
    },
    {
      id: '4',
      name: 'Video Script',
      category: 'Video',
      description: 'Scripts for promotional and educational videos',
      icon: Video
    },
    {
      id: '5',
      name: 'Ad Copy',
      category: 'Marketing',
      description: 'Compelling copy for paid advertisements',
      icon: Target
    },
    {
      id: '6',
      name: 'Product Description',
      category: 'E-commerce',
      description: 'Detailed product descriptions and features',
      icon: ShoppingCart
    }
  ]

  const generateContent = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = `Here's your AI-generated ${contentType} content about "${topic}":

${topic} is revolutionizing the way businesses operate in today's digital landscape. With the power of artificial intelligence and cutting-edge technology, companies are discovering new ways to streamline processes, enhance customer experiences, and drive unprecedented growth.

Key insights include:
• Improved efficiency through automation
• Enhanced decision-making with data analytics
• Better customer engagement and satisfaction
• Competitive advantages in the market

The future looks bright as more organizations embrace these transformative technologies. Stay ahead of the curve by implementing AI-driven solutions that will position your business for long-term success.

${keywords.split(',').map((kw, i) => `${i + 1}. ${kw.trim()}: Implementation strategies and best practices`).join('\n')}

Contact us today to learn how we can help you leverage AI for your business success.`

      setGeneratedContent(mockContent)
      setIsGenerating(false)
    }, 2000)
  }

  const optimizeContent = (content: string) => {
    // Mock optimization suggestions
    return content.replace(/\b(is|are|was|were)\b/g, (match) => match.toUpperCase())
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const tabs = [
    { id: 'generate', name: 'Generate', icon: Wand2 },
    { id: 'optimize', name: 'Optimize', icon: TrendingUp },
    { id: 'analyze', name: 'Analyze', icon: BarChart3 },
    { id: 'templates', name: 'Templates', icon: FileText }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content AI</h1>
          <p className="text-gray-400 mt-2">AI-powered content creation, optimization, and analysis</p>
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

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="blog">Blog Post</option>
                  <option value="social">Social Media Post</option>
                  <option value="email">Email Campaign</option>
                  <option value="ad">Ad Copy</option>
                  <option value="video">Video Script</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                <Input
                  placeholder="Enter your content topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Keywords</label>
                <Input
                  placeholder="Enter keywords separated by commas..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={generateContent}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                      {generatedContent}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedContent(optimizeContent(generatedContent))}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <div className="text-lg mb-2">AI Content Generator</div>
                  <div className="text-sm">Fill in the details and click Generate to create AI-powered content</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimize Tab */}
      {activeTab === 'optimize' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Content Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Paste your content to optimize</label>
                <textarea
                  className="w-full h-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                  placeholder="Enter the content you want to optimize..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-white font-medium">SEO Optimization</div>
                  <div className="text-gray-400 text-sm">Improve search rankings</div>
                </div>

                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-white font-medium">Engagement Boost</div>
                  <div className="text-gray-400 text-sm">Increase reader interaction</div>
                </div>

                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-white font-medium">Conversion Focus</div>
                  <div className="text-gray-400 text-sm">Drive action and results</div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Optimize Content
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyze Tab */}
      {activeTab === 'analyze' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Content Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">87%</div>
                <p className="text-xs text-gray-400">
                  Above average quality
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">SEO Score</CardTitle>
                <Target className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">92%</div>
                <p className="text-xs text-gray-400">
                  Excellent optimization
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">High</div>
                <p className="text-xs text-gray-400">
                  85% engagement rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border border-gray-700/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{suggestion.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {suggestion.type}
                          </Badge>
                          <span className="text-gray-400 text-sm">Score: {suggestion.score}%</span>
                          <span className="text-gray-400 text-sm">Engagement: {suggestion.estimatedEngagement}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Use Suggestion
                      </Button>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {suggestion.content}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {suggestion.keywords.map(keyword => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <template.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                  <Badge variant="outline" className="text-xs mb-3">
                    {template.category}
                  </Badge>

                  <p className="text-gray-400 text-sm mb-4">
                    {template.description}
                  </p>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}