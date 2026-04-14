'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Calendar, Plus, Edit, Trash2, Copy, Play, Save, RefreshCw } from 'lucide-react'

interface ContentItem {
  id: string
  day: number
  title: string
  format: string
  platform: string
  status: 'empty' | 'draft' | 'ready' | 'scheduled' | 'posted'
  caption?: string
  hashtags?: string[]
  imagePrompt?: string
  voiceover?: string
}

export default function ContentPlanner() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [currentWeek, setCurrentWeek] = useState(1)
  const [contentPlan, setContentPlan] = useState<ContentItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Initialize empty content plan
  useEffect(() => {
    const days = viewMode === 'week' ? 7 : 30
    const plan: ContentItem[] = []

    for (let i = 1; i <= days; i++) {
      plan.push({
        id: `day-${i}`,
        day: i,
        title: '',
        format: '',
        platform: 'Instagram',
        status: 'empty'
      })
    }

    setContentPlan(plan)
  }, [viewMode])

  const generateContentPlan = async () => {
    setIsGenerating(true)
    try {
      // Mock AI-generated content plan - replace with actual API call
      const mockPlan: ContentItem[] = [
        {
          id: 'day-1',
          day: 1,
          title: 'Marine Safety Essentials',
          format: 'Instagram Carousel',
          platform: 'Instagram',
          status: 'ready',
          caption: '🌊 MARINE SAFETY STARTS HERE 🌊\n\nYour safety is our priority at Roshanal Infotech! We provide top-quality life jackets and safety equipment.\n\n#MarineSafety #BoatSafety',
          hashtags: ['#MarineSafety', '#BoatSafety', '#LifeJacket'],
          imagePrompt: 'Professional photos of life jackets and marine safety equipment on boats',
          voiceover: 'Safety first when you\'re on the water! Choose Roshanal for reliable marine safety equipment.'
        },
        {
          id: 'day-2',
          day: 2,
          title: 'CCTV Security Solutions',
          format: 'Facebook Static Post',
          platform: 'Facebook',
          status: 'ready',
          caption: '🏠 SECURE YOUR WORLD 🏠\n\nAdvanced CCTV solutions for homes & businesses from Roshanal Infotech.\n\n#CCTV #HomeSecurity',
          hashtags: ['#CCTV', '#HomeSecurity', '#SecuritySystems'],
          imagePrompt: 'Modern CCTV camera installation in Port Harcourt business',
          voiceover: 'Protect what matters most with our advanced security systems.'
        },
        {
          id: 'day-3',
          day: 3,
          title: 'Solar Power Independence',
          format: 'TikTok Video',
          platform: 'TikTok',
          status: 'ready',
          caption: '☀️ POWER YOUR FUTURE ☀️\n\nGo solar with Roshanal Infotech! Reduce electricity bills by 70%.\n\n#SolarPower #CleanEnergy',
          hashtags: ['#SolarPower', '#CleanEnergy', '#RenewableEnergy'],
          imagePrompt: 'Solar panel installation on Port Harcourt rooftop',
          voiceover: 'Cut your electricity bills and go green with our solar solutions!'
        },
        {
          id: 'day-4',
          day: 4,
          title: 'Boat Engine Maintenance',
          format: 'LinkedIn Article',
          platform: 'LinkedIn',
          status: 'draft',
          caption: '🔧 MARINE ENGINE MAINTENANCE GUIDE 🔧\n\nKeep your outboard engine running smoothly with expert tips.\n\n#MarineMaintenance',
          hashtags: ['#MarineMaintenance', '#OutboardEngine', '#BoatCare']
        },
        {
          id: 'day-5',
          day: 5,
          title: 'Smart Door Locks',
          format: 'Instagram Story',
          platform: 'Instagram',
          status: 'ready',
          caption: '🔐 SECURE YOUR HOME 🔐\n\nBiometric smart locks from Roshanal Infotech.\n\n#SmartHome #Security',
          hashtags: ['#SmartHome', '#Security', '#Biometric']
        },
        {
          id: 'day-6',
          day: 6,
          title: 'Customer Success Story',
          format: 'WhatsApp Status',
          platform: 'WhatsApp',
          status: 'scheduled',
          caption: '🌟 HAPPY CUSTOMER ALERT 🌟\n\n"Thank you Roshanal for the excellent solar installation!"\n\n#CustomerSuccess'
        },
        {
          id: 'day-7',
          day: 7,
          title: 'Special Promotion',
          format: 'Facebook Carousel',
          platform: 'Facebook',
          status: 'ready',
          caption: '🔥 LIMITED TIME OFFER 🔥\n\n20% off CCTV systems this weekend!\n\n#SpecialOffer #CCTV',
          hashtags: ['#SpecialOffer', '#CCTV', '#Deal']
        }
      ]

      // Update the content plan with generated items
      setContentPlan(prev => prev.map(item => {
        const generated = mockPlan.find(g => g.day === item.day)
        return generated || item
      }))

    } catch (error) {
      console.error('Error generating content plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-100 text-gray-600'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      case 'posted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return '📸'
      case 'Facebook': return '👥'
      case 'TikTok': return '🎵'
      case 'LinkedIn': return '💼'
      case 'WhatsApp': return '💬'
      default: return '📱'
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Content Planner</h1>
        <p className="text-gray-600">Plan and schedule your content calendar</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            onClick={() => setViewMode('week')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Week View
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Month View
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={generateContentPlan}
            disabled={isGenerating}
            className="bg-roshanal-navy hover:bg-roshanal-blue"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Full Plan
              </>
            )}
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>

      {/* Content Calendar */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {viewMode === 'week' ? '7-Day Content Plan' : '30-Day Content Plan'}
          </h2>
          <p className="text-gray-600">
            Click on any day to edit content, drag ideas from Daily Ideas, or use AI generation
          </p>
        </div>

        <div className={`grid gap-4 ${viewMode === 'week' ? 'grid-cols-1 md:grid-cols-7' : 'grid-cols-2 md:grid-cols-5 lg:grid-cols-10'}`}>
          {contentPlan.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                item.status === 'empty' ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white'
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Day {item.day}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {item.title ? (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-1">{getPlatformIcon(item.platform)}</span>
                    <span className="truncate">{item.format}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</h3>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs">Add Content</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Content Detail Panel */}
      {selectedItem && (
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Day {selectedItem.day} - {selectedItem.title || 'New Content'}
            </h2>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Title</label>
                <input
                  type="text"
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem({...selectedItem, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={selectedItem.platform}
                  onChange={(e) => setSelectedItem({...selectedItem, platform: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={selectedItem.format}
                  onChange={(e) => setSelectedItem({...selectedItem, format: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                >
                  <option value="">Select format</option>
                  <option value="Static Post">Static Post</option>
                  <option value="Carousel">Carousel</option>
                  <option value="Video">Video</option>
                  <option value="Story">Story</option>
                  <option value="Reel">Reel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedItem.status}
                  onChange={(e) => setSelectedItem({...selectedItem, status: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                >
                  <option value="empty">Empty</option>
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="posted">Posted</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={selectedItem.caption || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, caption: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  placeholder="Enter your caption..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <textarea
                  value={selectedItem.hashtags?.join(' ') || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, hashtags: e.target.value.split(' ')})}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  placeholder="#hashtag1 #hashtag2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Prompt</label>
                <textarea
                  value={selectedItem.imagePrompt || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, imagePrompt: e.target.value})}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  placeholder="Describe the visual content..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}