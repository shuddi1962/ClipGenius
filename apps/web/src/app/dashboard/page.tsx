'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { TrendingUp, FileText, Video, Bookmark, Sparkles, RefreshCw, Star, Calendar, Users, Send, Instagram, Phone, Building, Settings, Target, Workflow, Activity, BarChart3 } from 'lucide-react'
import { useSettings } from '@/lib/hooks'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import { dbService } from '@/lib/database'

export default function Dashboard() {
  const { settings, loading: settingsLoading } = useSettings()
  const [user, setUser] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [stats, setStats] = useState({
    totalContent: 0,
    thisWeek: 0,
    aiGenerations: 0
  })
  const [todayIdea, setTodayIdea] = useState<any>(null)
  const [trendingTopics, setTrendingTopics] = useState<any[]>([])
  const [isLoadingIdea, setIsLoadingIdea] = useState(true)

  // Check user and show welcome message
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await dbService.getCurrentUser()
      setUser(currentUser)

      // Show welcome message for new users (created within last 24 hours)
      if (currentUser) {
        const userCreated = new Date(currentUser.created_at)
        const now = new Date()
        const hoursSinceCreation = (now.getTime() - userCreated.getTime()) / (1000 * 60 * 60)

        if (hoursSinceCreation < 24) {
          setShowWelcome(true)
          // Auto-hide after 10 seconds
          setTimeout(() => setShowWelcome(false), 10000)
        }

        // Load user stats
        try {
          const contentItems = await dbService.getContentItems(currentUser.id)
          const thisWeek = contentItems.filter(item => {
            const itemDate = new Date(item.created_at)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return itemDate >= weekAgo
          }).length

          setStats({
            totalContent: contentItems.length,
            thisWeek,
            aiGenerations: contentItems.length // Approximation
          })
        } catch (error) {
          console.error('Error loading stats:', error)
        }
      }
    }

    checkUser()
  }, [])

  // Generate today's top content idea
  useEffect(() => {
    const generateTodayIdea = async () => {
      if (!settings || settingsLoading) return

      try {
        const aiService = new AIService(settings)
        const prompt = `Generate a trending social media content idea for Roshanal Infotech. Focus on one of our products/services: ${settings.products}. Make it specific to ${settings.location} and ${settings.targetAudience}. Include:
- Title (catchy and specific)
- Format (Instagram Carousel, Reels, Post, Story, etc.)
- Hook (first 5-10 seconds attention grabber)
- Full caption with emojis and call-to-action
- 5 relevant hashtags
- Image prompt for visuals
- Why this topic is trending now

Response format: JSON object with keys: title, format, hook, caption, hashtags (array), image_prompt, why_trending`

        const response = await aiService.generate({ prompt })
        const idea = JSON.parse(response)
        setTodayIdea(idea)
      } catch (error) {
        console.error('Error generating today\'s idea:', error)
        // Fallback to mock data
        setTodayIdea({
          title: "Smart CCTV Installation for Port Harcourt Businesses",
          format: "Instagram Carousel",
          hook: "Protect your business 24/7 with Hikvision CCTV systems! 🏢",
          caption: "Investing in security shouldn't be complicated. Our professional CCTV installation includes:\n\n✅ Hikvision 4K cameras with night vision\n✅ Mobile app access from anywhere\n✅ 24/7 monitoring capabilities\n✅ Expert setup and training\n\nSecure your Port Harcourt business today! Call 08109522432\n\n#CCTV #BusinessSecurity #PortHarcourt #RoshanalInfotech",
          hashtags: ["#CCTV", "#BusinessSecurity", "#PortHarcourt", "#Hikvision", "#SecuritySystems"],
          image_prompt: "Modern office building with Hikvision CCTV cameras installed, professional installation in progress, Port Harcourt cityscape in background, security and trust theme",
          why_trending: "Small businesses in Port Harcourt are increasingly investing in professional CCTV systems due to rising security concerns"
        })
      } finally {
        setIsLoadingIdea(false)
      }
    }

    generateTodayIdea()
  }, [settings, settingsLoading])

  // Get trending topics
  useEffect(() => {
    const getTrendingTopics = async () => {
      if (!settings || settingsLoading) return

      try {
        const aiService = new AIService(settings)
        const searchResults = await aiService.search(`trending topics in ${settings.niche} ${settings.location} 2026`)

        // Process search results into trending topics
        const topics = searchResults.slice(0, 3).map((result, index) => ({
          title: result.title.length > 50 ? result.title.substring(0, 50) + '...' : result.title,
          trend: `📈 Rising ${35 + index * 10}%`,
          reason: result.content.length > 100 ? result.content.substring(0, 100) + '...' : result.content
        }))

        setTrendingTopics(topics)
      } catch (error) {
        console.error('Error fetching trending topics:', error)
        // Fallback to mock data
        setTrendingTopics([
          {
            title: "Solar Power Adoption in Nigeria",
            trend: "📈 Rising 45%",
            reason: "Government incentives and rising electricity costs"
          },
          {
            title: "Smart Door Locks Market",
            trend: "📈 Rising 32%",
            reason: "Increasing demand for home automation in urban areas"
          },
          {
            title: "Boat Safety Regulations",
            trend: "📈 Rising 28%",
            reason: "New maritime safety laws in Niger Delta region"
          }
        ])
      }
    }

    getTrendingTopics()
  }, [settings, settingsLoading])

  const refreshTodayIdea = async () => {
    if (!settings) return

    setIsLoadingIdea(true)
    try {
      const aiService = new AIService(settings)
      const prompt = `Generate a different trending social media content idea for Roshanal Infotech. Focus on a different product/service than the previous one. Products: ${settings.products}. Make it specific to ${settings.location} and ${settings.targetAudience}.

Response format: JSON object with keys: title, format, hook, caption, hashtags (array), image_prompt, why_trending`

      const response = await aiService.generate({ prompt })
      const idea = JSON.parse(response)
      setTodayIdea(idea)
      toast.success('New content idea generated!')
    } catch (error) {
      console.error('Error refreshing idea:', error)
      toast.error('Failed to generate new idea. Please try again.')
    } finally {
      setIsLoadingIdea(false)
    }
  }

  const refreshTrendingTopics = async () => {
    if (!settings) return

    try {
      const aiService = new AIService(settings)
      const searchResults = await aiService.search(`latest trending topics in ${settings.niche} ${settings.location} ${new Date().getFullYear()}`)

      const topics = searchResults.slice(0, 3).map((result, index) => ({
        title: result.title.length > 50 ? result.title.substring(0, 50) + '...' : result.title,
        trend: `📈 Rising ${35 + index * 10}%`,
        reason: result.content.length > 100 ? result.content.substring(0, 100) + '...' : result.content
      }))

      setTrendingTopics(topics)
      toast.success('Trending topics updated!')
    } catch (error) {
      console.error('Error refreshing topics:', error)
      toast.error('Failed to refresh trending topics.')
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00F5FF] via-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-gray-400">{currentDate}</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.totalContent}</div>
              <div className="text-sm text-gray-400">Content Created</div>
              <div className="text-xs text-blue-300 mt-1">+{stats.thisWeek} this week</div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">156</div>
              <div className="text-sm text-gray-400">Active Leads</div>
              <div className="text-xs text-green-300 mt-1">+12 qualified</div>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
              <div className="text-sm text-gray-400">Campaigns Sent</div>
              <div className="text-xs text-purple-300 mt-1">92% open rate</div>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-1">23</div>
              <div className="text-sm text-gray-400">Ideas Saved</div>
              <div className="text-xs text-orange-300 mt-1">Ready to use</div>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">New lead qualified</p>
                <p className="text-xs text-gray-400">Sarah Johnson - Hot lead</p>
              </div>
              <span className="text-xs text-gray-500">2m ago</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Send className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Campaign sent</p>
                <p className="text-xs text-gray-400">Welcome Series - 45 recipients</p>
              </div>
              <span className="text-xs text-gray-500">15m ago</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Content generated</p>
                <p className="text-xs text-gray-400">Social media post - 3 variants</p>
              </div>
              <span className="text-xs text-gray-500">1h ago</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/content-generator">
              <Button className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" variant="outline">
                <FileText className="w-4 h-4 mr-3" />
                Generate Content
              </Button>
            </Link>

            <Link href="/dashboard/social">
              <Button className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" variant="outline">
                <Instagram className="w-4 h-4 mr-3" />
                Social Media Hub
              </Button>
            </Link>

            <Link href="/dashboard/leads">
              <Button className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" variant="outline">
                <Users className="w-4 h-4 mr-3" />
                Manage Leads
              </Button>
            </Link>

            <Link href="/dashboard/campaigns">
              <Button className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" variant="outline">
                <Send className="w-4 h-4 mr-3" />
                Run Campaigns
              </Button>
            </Link>

            <Link href="/dashboard/analytics">
              <Button className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" variant="outline">
                <TrendingUp className="w-4 h-4 mr-3" />
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Performance Overview
          </h3>
          <div className="h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <div className="text-gray-400 text-sm">Growth Chart</div>
              <div className="text-xs text-gray-500">Interactive analytics coming soon</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">📈 Trending Topics</h3>
          <Button size="sm" variant="outline" onClick={refreshTrendingTopics} className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/30 hover:border-[#00F5FF]/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white text-sm">{topic.title}</h4>
                <span className="text-xs font-medium text-[#00F5FF] bg-[#00F5FF]/10 px-2 py-1 rounded">
                  {topic.trend}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{topic.reason}</p>
              <Button size="sm" className="w-full bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 hover:from-[#00F5FF]/30 hover:to-[#FFB800]/30 text-white">
                Create Content
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
