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
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00F5FF] via-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent">
          Welcome to ClipGenius
        </h1>
        <p className="text-gray-400 mt-2">Your AI-powered marketing automation platform</p>
      </div>

      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00F5FF] to-[#FFB800] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Dashboard Coming Soon</h3>
          <p className="text-gray-400 mb-6">We're building an amazing dashboard experience for you!</p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/content-generator">
              <Button className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] hover:from-[#00F5FF]/80 hover:to-[#FFB800]/80">
                Try Content Generator
              </Button>
            </Link>
            <Link href="/dashboard/leads">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Manage Leads
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
