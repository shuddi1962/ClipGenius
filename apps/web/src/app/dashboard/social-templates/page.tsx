'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Search,
  Copy,
  Edit,
  Heart,
  Share2,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  Target,
  Users,
  TrendingUp
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface SocialTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  tags: string[]
  image_url?: string
  likes_count: number
  uses_count: number
  created_at: string
  is_premium: boolean
}

export default function SocialTemplatesPage() {
  const [templates, setTemplates] = useState<SocialTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<SocialTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<SocialTemplate | null>(null)

  const categories = [
    'all', 'business', 'lifestyle', 'education', 'entertainment',
    'food', 'travel', 'fitness', 'technology', 'marketing'
  ]

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Grid },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory, selectedPlatform])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await insforge
        .from('social_templates')
        .select('*')
        .order('likes_count', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      // Fallback to mock data
      setTemplates(mockTemplates)
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(template => template.platform === selectedPlatform)
    }

    setFilteredTemplates(filtered)
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const likeTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return

      const { error } = await insforge
        .from('social_templates')
        .update({ likes_count: template.likes_count + 1 })
        .eq('id', templateId)

      if (error) throw error

      setTemplates(prev => prev.map(t =>
        t.id === templateId ? { ...t, likes_count: t.likes_count + 1 } : t
      ))
    } catch (error) {
      console.error('Error liking template:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram
      case 'facebook': return Facebook
      case 'twitter': return Twitter
      case 'linkedin': return Linkedin
      default: return Instagram
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-pink-500'
      case 'facebook': return 'text-blue-600'
      case 'twitter': return 'text-blue-400'
      case 'linkedin': return 'text-blue-700'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Social Media Templates</h1>
        <p className="text-gray-400">Browse and use pre-built social media post templates</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#00F5FF]"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Filter */}
        <div className="flex gap-2">
          {platforms.map(platform => {
            const IconComponent = platform.icon
            return (
              <Button
                key={platform.id}
                variant={selectedPlatform === platform.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform.id)}
                className={selectedPlatform === platform.id ? "bg-[#00F5FF] text-gray-900" : "border-gray-600"}
              >
                <IconComponent className="w-4 h-4" />
              </Button>
            )
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-600 rounded">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? "bg-[#00F5FF] text-gray-900" : ""}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? "bg-[#00F5FF] text-gray-900" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const PlatformIcon = getPlatformIcon(template.platform)
            return (
              <Card key={template.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon className={`w-5 h-5 ${getPlatformColor(template.platform)}`} />
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    {template.is_premium && (
                      <Badge className="bg-yellow-500 text-black text-xs">Premium</Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{template.description}</p>

                  {/* Template Preview */}
                  <div className="bg-gray-900 rounded p-3 mb-4">
                    <p className="text-white text-sm line-clamp-4">{template.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {template.likes_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {template.uses_count}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => likeTemplate(template.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(template.content)}
                        className="text-gray-400 hover:text-green-400"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredTemplates.map((template) => {
            const PlatformIcon = getPlatformIcon(template.platform)
            return (
              <Card key={template.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <PlatformIcon className={`w-6 h-6 mt-1 ${getPlatformColor(template.platform)}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{template.name}</h3>
                          <p className="text-gray-400 text-sm">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.category}</Badge>
                          {template.is_premium && (
                            <Badge className="bg-yellow-500 text-black">Premium</Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-900 rounded p-4 mb-4">
                        <p className="text-white">{template.content}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Heart className="w-4 h-4" />
                            {template.likes_count}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Users className="w-4 h-4" />
                            {template.uses_count}
                          </div>
                          <div className="flex gap-1">
                            {template.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => likeTemplate(template.id)}>
                            <Heart className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button size="sm" onClick={() => copyToClipboard(template.content)} className="bg-[#00F5FF] text-gray-900">
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <Textarea
                value={selectedTemplate.content}
                readOnly
                className="bg-gray-900 border-gray-600 text-white min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button onClick={() => copyToClipboard(selectedTemplate.content)} className="bg-[#00F5FF] text-gray-900">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Mock data for development
const mockTemplates: SocialTemplate[] = [
  {
    id: '1',
    name: 'Business Growth Post',
    description: 'Perfect for showcasing business achievements',
    content: '🚀 Excited to share that our company has grown by 200% this year! Thank you to our amazing team and loyal customers for making this possible. Here\'s to continued growth and success! #BusinessGrowth #Success #Entrepreneurship',
    category: 'business',
    platform: 'linkedin',
    tags: ['business', 'growth', 'success', 'entrepreneurship'],
    likes_count: 125,
    uses_count: 89,
    created_at: '2024-01-15T00:00:00Z',
    is_premium: false
  },
  {
    id: '2',
    name: 'Product Launch Teaser',
    description: 'Build excitement for upcoming product launches',
    content: '✨ Something amazing is coming soon... Stay tuned for our biggest product launch yet! The wait will be worth it. #ProductLaunch #Innovation #ComingSoon',
    category: 'marketing',
    platform: 'instagram',
    tags: ['product', 'launch', 'innovation', 'marketing'],
    likes_count: 98,
    uses_count: 67,
    created_at: '2024-01-20T00:00:00Z',
    is_premium: false
  },
  {
    id: '3',
    name: 'Educational Content',
    description: 'Share valuable knowledge with your audience',
    content: '💡 Did you know? Consistent learning is the key to personal and professional growth. Here are 5 books that transformed my perspective on leadership. What\'s the last book that impacted you? #Learning #Leadership #PersonalDevelopment',
    category: 'education',
    platform: 'linkedin',
    tags: ['learning', 'leadership', 'books', 'education'],
    likes_count: 156,
    uses_count: 134,
    created_at: '2024-01-10T00:00:00Z',
    is_premium: true
  }
]