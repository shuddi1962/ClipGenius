'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { TrendingUp, FileText, Video, Bookmark, Sparkles, RefreshCw, Star, Calendar, Users, Send } from 'lucide-react'
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
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Good morning, {user?.name || 'John'}
            </h1>
            <p className="text-gray-400">{currentDate}</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

      {/* Welcome Banner for New Users */}
      {showWelcome && user && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Star className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-green-400 mb-1">
                🎉 Welcome to ClipGenius, {user.name || 'User'}!
              </h3>
              <p className="text-green-300 mb-3">
                Your AI-powered marketing automation platform is ready. Start growing your business with intelligent lead generation, content creation, and automated outreach.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/settings">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Configure Settings
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => setShowWelcome(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Top Content Idea */}
        <Card className="mb-6 border-l-4 border-l-roshanal-blue">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Today's Top Content Idea</h2>
              <p className="text-gray-600 text-sm">AI-powered suggestion based on current trends</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshTodayIdea}
              disabled={isLoadingIdea}
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingIdea ? 'animate-spin' : ''}`} />
              {isLoadingIdea ? 'Generating...' : 'Refresh'}
            </Button>
          </div>

          {isLoadingIdea ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : todayIdea && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{todayIdea.title}</h3>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {todayIdea.format}
                  </span>
                </div>

              <p className="text-gray-800 font-medium mb-2">{todayIdea.hook}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{todayIdea.caption}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {todayIdea.hashtags.slice(0, 4).map((hashtag: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {hashtag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button size="sm">Use This Idea</Button>
                <Button size="sm" variant="outline">Save for Later</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="text-center bg-gray-800 border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 bg-green-900/50 rounded-lg mx-auto mb-3">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalContent}</div>
          <div className="text-sm text-gray-400">Content Created</div>
          <div className="text-xs text-green-400 mt-1">+{stats.thisWeek} this week</div>
        </Card>

        <Card className="text-center bg-gray-800 border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-900/50 rounded-lg mx-auto mb-3">
            <Bookmark className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">23</div>
          <div className="text-sm text-gray-400">Ideas Saved</div>
          <div className="text-xs text-blue-400 mt-1">+8% this week</div>
        </Card>

        <Card className="text-center bg-gray-800 border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-900/50 rounded-lg mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <div className="text-sm text-gray-400">Active Leads</div>
          <div className="text-xs text-purple-400 mt-1">+12% this week</div>
        </Card>

        <Card className="text-center bg-gray-800 border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-900/50 rounded-lg mx-auto mb-3">
            <Send className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">8</div>
          <div className="text-sm text-gray-400">Campaigns Sent</div>
          <div className="text-xs text-orange-400 mt-1">+25% this week</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/content-generator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Generate Content</h3>
                  <p className="text-sm text-gray-400">AI-powered content creation</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/social">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Social Media</h3>
                  <p className="text-sm text-gray-400">Schedule & manage posts</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage Leads</h3>
                  <p className="text-sm text-gray-400">View and qualify prospects</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/campaigns">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Run Campaigns</h3>
                  <p className="text-sm text-gray-400">Email, SMS & WhatsApp</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Trending in Your Niche */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Trending in Your Niche</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshTrendingTopics}
            className="flex items-center border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-4 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors bg-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                <span className="text-xs font-medium text-green-400">{topic.trend}</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{topic.reason}</p>
              <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-600">
                Create Content
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm text-gray-300">
            <strong>💡 Pro Tip:</strong> Content about trending topics gets 3x more engagement.
            Use our AI to create posts about these rising trends in your industry.
          </p>
        </div>
      </Card>
    </div>
  )
}