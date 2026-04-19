'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { TrendingUp, FileText, Video, Bookmark, Sparkles, RefreshCw, Star, Calendar, Users, Send, Instagram, Phone, Building, Settings, Target, Workflow } from 'lucide-react'
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
              Welcome back, {user?.name || 'Demo User'}
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
        {/* Welcome Banner for New Users */}
        {showWelcome && user && (
          <Card className="mb-8 border-l-4 border-l-[#00F5FF] bg-gradient-to-r from-[#00F5FF]/10 to-[#FFB800]/10 border-[#00F5FF]/50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8 text-[#00F5FF]" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-bold text-[#00F5FF] mb-2">
                  🚀 Welcome to ClipGenius Pro!
                </h3>
                <p className="text-gray-300 mb-4">
                  Your AI-powered marketing automation platform is ready. Start growing your business with intelligent lead generation, content creation, and automated outreach.
                </p>
                <div className="flex gap-3">
                  <Link href="/dashboard/business">
                    <Button className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] hover:from-[#00F5FF]/80 hover:to-[#FFB800]/80">
                      Setup Business Profile
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setShowWelcome(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Skip for Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats Overview */}
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

        {/* AI Content Idea of the Day */}
        <Card className="mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🎯 AI Content Idea of the Day</h2>
              <p className="text-gray-400">Fresh content suggestion powered by AI</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTodayIdea}
              disabled={isLoadingIdea}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingIdea ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isLoadingIdea ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F5FF]"></div>
            </div>
          ) : todayIdea ? (
            <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 p-6 rounded-xl border border-gray-600/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{todayIdea.title}</h3>
                    <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] text-sm rounded-full border border-[#00F5FF]/30">
                      {todayIdea.format}
                    </span>
                  </div>
                  <p className="text-gray-300 text-lg mb-4">{todayIdea.hook}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{todayIdea.caption}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {todayIdea.hashtags?.slice(0, 5).map((hashtag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg">
                    {hashtag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] hover:from-[#00F5FF]/80 hover:to-[#FFB800]/80">
                  Use This Idea
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Save to Library
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Schedule Post
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
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

        {/* Main Feature Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 Marketing Automation Suite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content Creation */}
            <Link href="/dashboard/content-generator">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-[#00F5FF] bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-[#00F5FF]/5 hover:to-[#FFB800]/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F5FF] transition-colors">Content Generator</h3>
                  <p className="text-gray-400 mb-4">AI-powered content creation for blogs, social media, emails, and more</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">AI-Powered</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Social Media Management */}
            <Link href="/dashboard/social">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-[#FFB800] bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-[#FFB800]/5 hover:to-[#00F5FF]/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Instagram className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFB800] transition-colors">Social Media Hub</h3>
                  <p className="text-gray-400 mb-4">Schedule posts, manage multiple platforms, and track engagement</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Multi-Platform</span>
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded">Auto-Schedule</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Lead Management */}
            <Link href="/dashboard/leads">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-green-500/5 hover:to-blue-500/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Lead Intelligence</h3>
                  <p className="text-gray-400 mb-4">AI-powered lead generation, qualification, and management</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">AI Scoring</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Auto-Import</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Campaign Automation */}
            <Link href="/dashboard/campaigns">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-red-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-red-500/5 hover:to-orange-500/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Campaign Engine</h3>
                  <p className="text-gray-400 mb-4">Automated email, SMS, and WhatsApp campaigns with A/B testing</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Multi-Channel</span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">A/B Testing</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Voice AI Agent */}
            <Link href="/dashboard/voice">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-cyan-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-cyan-500/5 hover:to-blue-500/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Voice AI Agent</h3>
                  <p className="text-gray-400 mb-4">Automated phone calls with AI conversation and lead qualification</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">Conversational AI</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">24/7 Available</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Analytics & Insights */}
            <Link href="/dashboard/analytics">
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-yellow-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:from-yellow-500/5 hover:to-orange-500/5">
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Analytics Dashboard</h3>
                  <p className="text-gray-400 mb-4">Comprehensive insights into campaign performance and ROI</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Real-time</span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">ROI Tracking</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Bottom Section - Trending Topics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Topics */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">📈 Trending in Your Niche</h2>
                <p className="text-gray-400 text-sm">AI-powered trend analysis</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={refreshTrendingTopics}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/30 hover:border-[#00F5FF]/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-1">{topic.title}</h3>
                    <span className="text-xs font-medium text-[#00F5FF] bg-[#00F5FF]/10 px-2 py-1 rounded">
                      {topic.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{topic.reason}</p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 hover:from-[#00F5FF]/30 hover:to-[#FFB800]/30 border border-[#00F5FF]/30 text-white">
                    Create Content
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-[#00F5FF]/5 to-[#FFB800]/5 rounded-lg border border-[#00F5FF]/20">
              <p className="text-sm text-gray-300">
                <strong className="text-[#00F5FF]">💡 AI Insight:</strong> Content about trending topics gets 3x more engagement.
                Our AI analyzes millions of social signals to find rising trends in your industry.
              </p>
            </div>
          </Card>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
              <h2 className="text-xl font-bold text-white mb-6">⚡ Recent Activity</h2>
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

                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">Analytics updated</p>
                    <p className="text-xs text-gray-400">Campaign performance report</p>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
              </div>
            </Card>

            {/* Quick Settings */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
              <h2 className="text-xl font-bold text-white mb-6">⚙️ Quick Settings</h2>
              <div className="space-y-3">
                <Link href="/dashboard/business">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Building className="w-4 h-4 mr-3" />
                    Update Business Profile
                  </Button>
                </Link>

                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-3" />
                    Account Settings
                  </Button>
                </Link>

                <Link href="/dashboard/competitors">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Target className="w-4 h-4 mr-3" />
                    Competitor Analysis
                  </Button>
                </Link>

                <Link href="/dashboard/workflows">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Workflow className="w-4 h-4 mr-3" />
                    Automation Workflows
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
    </div>
  )
}