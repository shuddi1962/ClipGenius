'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { RefreshCw, Search, Copy, Save, Video, ExternalLink, TrendingUp } from 'lucide-react'

interface DailyIdea {
  title: string
  format: string
  hook: string
  caption: string
  hashtags: string[]
  image_prompt: string
  why_trending: string
}

export default function DailyIdeas() {
  const [ideas, setIdeas] = useState<DailyIdea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [customTopic, setCustomTopic] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Load daily ideas on component mount
  useEffect(() => {
    loadDailyIdeas()
  }, [])

  const loadDailyIdeas = async (searchTopic?: string) => {
    setIsLoading(true)
    try {
      const searchQueries = searchTopic ? [searchTopic] : [
        "CCTV security systems trends Nigeria 2026",
        "outboard engine marine accessories Port Harcourt",
        "solar installation Nigeria demand",
        "boat safety equipment Niger Delta"
      ]

      // Mock API response for now - replace with actual Tavily + OpenRouter calls
      const mockIdeas: DailyIdea[] = [
        {
          title: "AI-Powered CCTV Analytics Revolution",
          format: "Instagram Carousel",
          hook: "Your CCTV just got smarter! 🤖",
          caption: "The future of security is here! AI-powered CCTV systems can now:\n\n🧠 Detect suspicious behavior automatically\n📊 Provide real-time analytics\n🚨 Send instant alerts to your phone\n💰 Reduce false alarms by 90%\n\nUpgrade your Port Harcourt business security with Hikvision AI cameras. Professional installation included!\n\n#AI #CCTV #SecurityTech #PortHarcourt",
          hashtags: ["#AI", "#CCTV", "#SecurityTech", "#SmartSecurity", "#Hikvision"],
          image_prompt: "Modern office with Hikvision AI CCTV cameras displaying analytics on screen, security personnel monitoring, futuristic tech interface, Port Harcourt business district",
          why_trending: "AI-powered CCTV systems are seeing 300% adoption growth in Nigerian businesses due to advanced analytics and cost savings"
        },
        {
          title: "Solar Independence for Port Harcourt Homes",
          format: "Facebook Static Post",
          hook: "Cut your electricity bill by 70%! ☀️",
          caption: "Tired of NEPA bills? Go solar with Roshanal Infotech!\n\nOur complete solar packages include:\n✅ High-efficiency panels\n✅ Battery storage\n✅ Inverter systems\n✅ Professional installation\n✅ 25-year warranty\n\nInvest once, save forever! Government incentives available.\n\nDM 'SOLAR' for a free site assessment.\n\n#SolarPower #CleanEnergy #PortHarcourt #RenewableEnergy",
          hashtags: ["#SolarPower", "#CleanEnergy", "#RenewableEnergy", "#SustainableLiving"],
          image_prompt: "Beautiful Port Harcourt home with solar panels on roof, happy family outdoors, significant electricity bill savings graphic overlay, clean energy theme",
          why_trending: "Solar adoption in Nigeria has increased 250% due to rising electricity costs and government incentives"
        },
        {
          title: "Boat Safety: Life Jackets That Save Lives",
          format: "WhatsApp Status",
          hook: "Your family's safety depends on it! 🛟",
          caption: "⚠️ MARINE SAFETY ALERT ⚠️\n\nDid you know? 80% of boating accidents happen to those without proper safety gear.\n\nOur Coast Guard-approved life jackets feature:\n• Reflective strips for visibility\n• Quick-release buckles\n• Buoyant foam construction\n• Available in all sizes\n\nProtect your loved ones on the water. Quality equipment from Roshanal Infotech.\n\n#BoatSafety #LifeJacket #MarineSafety",
          hashtags: ["#BoatSafety", "#LifeJacket", "#MarineSafety", "#WaterSafety"],
          image_prompt: "Family on boat wearing bright orange life jackets, calm river scene, safety equipment displayed, Niger Delta waterway background",
          why_trending: "New maritime safety regulations in Niger Delta have increased demand for certified safety equipment by 180%"
        },
        {
          title: "Smart Home Security Evolution",
          format: "TikTok Video",
          hook: "Lock your door from anywhere! 🔐✨",
          caption: "Gone are the days of worrying about your home security! Our smart door locks feature:\n\n🔐 Biometric fingerprint access\n📱 Remote unlocking via app\n📹 Integrated camera\n🚨 Instant alerts\n🎯 Anti-tamper technology\n\nPerfect for Port Harcourt homes and businesses. Easy installation!\n\n#SmartHome #Security #Biometric #PortHarcourt",
          hashtags: ["#SmartHome", "#Security", "#Biometric", "#HomeAutomation"],
          image_prompt: "Modern Port Harcourt home entrance with smart door lock, person unlocking with fingerprint on phone, security app interface, family safely entering",
          why_trending: "Smart home security market in Nigeria growing 400% as urbanization increases security concerns"
        },
        {
          title: "Outboard Engine Maintenance Tips",
          format: "LinkedIn Article",
          hook: "Keep your engine running smoothly! 🏃‍♂️",
          caption: "📈 MARINE ENGINE MAINTENANCE GUIDE 📈\n\nExtend the life of your outboard engine with these expert tips:\n\n🔧 Regular oil changes every 50 hours\n⚡ Clean fuel filters monthly\n🌊 Flush with fresh water after saltwater use\n🔍 Annual professional servicing\n⚙️ Winter storage preparation\n\nWe service Suzuki, Yamaha, and all major brands. Professional marine technicians in Port Harcourt.\n\n#MarineMaintenance #OutboardEngine #BoatCare #PortHarcourt",
          hashtags: ["#MarineMaintenance", "#OutboardEngine", "#BoatCare", "#MarineTech"],
          image_prompt: "Professional technician servicing outboard engine on boat, maintenance tools organized, Port Harcourt marina background, clean and organized workspace",
          why_trending: "Nigerian boat owners are increasingly seeking professional maintenance services due to engine reliability concerns"
        }
      ]

      setIdeas(mockIdeas)
      setLastUpdated(new Date().toLocaleString())
    } catch (error) {
      console.error('Error loading daily ideas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomSearch = () => {
    if (customTopic.trim()) {
      loadDailyIdeas(customTopic.trim())
      setCustomTopic('')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Daily Content Intelligence</h1>
        <p className="text-gray-600">AI-powered content ideas based on trending topics in your industry</p>

        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>
        )}
      </div>

      {/* Search Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Search for specific topic ideas (e.g., 'solar panels Nigeria')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSearch()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCustomSearch} disabled={!customTopic.trim()}>
              <Search className="w-4 h-4 mr-2" />
              Search Topic
            </Button>
            <Button variant="outline" onClick={() => loadDailyIdeas()}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Ideas
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 How it works:</strong> We search trending topics in your industry using web intelligence,
            then generate tailored content ideas using AI. Each idea includes captions, hashtags, and visual concepts.
          </p>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ideas Grid */}
      {!isLoading && ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{idea.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-roshanal-blue text-white text-xs rounded-full">
                      {idea.format}
                    </span>
                    <span className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">🎯 Hook:</p>
                <p className="text-sm text-gray-700 italic">"{idea.hook}"</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">📝 Caption:</p>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                  {idea.caption.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < idea.caption.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">🏷️ Hashtags:</p>
                <div className="flex flex-wrap gap-1">
                  {idea.hashtags.map((hashtag, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">📊 Why Trending:</p>
                <p className="text-sm text-gray-600 italic">"{idea.why_trending}"</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">🎨 Image Brief:</p>
                <p className="text-sm text-gray-600 line-clamp-2">{idea.image_prompt}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(idea.caption)}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(idea.hashtags.join(' '))}>
                  # Copy
                </Button>
                <Button size="sm" variant="outline">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>

              <div className="flex gap-2 mt-2">
                <Button size="sm">
                  <Video className="w-4 h-4 mr-1" />
                  Make Video
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Canva
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && ideas.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Ideas Found</h3>
          <p className="text-gray-600 mb-4">Try searching for a specific topic or refresh to get new ideas.</p>
          <Button onClick={() => loadDailyIdeas()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Load Ideas
          </Button>
        </Card>
      )}
    </div>
  )
}