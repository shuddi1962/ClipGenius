'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Search,
  Eye,
  Download,
  Star,
  Users,
  ShoppingBag,
  Briefcase,
  Heart,
  Coffee,
  Camera,
  Palette,
  Code,
  Zap,
  Filter
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface WebsiteTemplate {
  id: string
  name: string
  description: string
  category: string
  preview_image: string
  features: string[]
  technologies: string[]
  downloads_count: number
  likes_count: number
  is_premium: boolean
  created_at: string
  demo_url?: string
}

export default function WebsiteTemplatesPage() {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<WebsiteTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'downloads'>('popular')

  const categories = [
    { id: 'all', name: 'All Templates', icon: Globe },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'portfolio', name: 'Portfolio', icon: Camera },
    { id: 'blog', name: 'Blog', icon: Coffee },
    { id: 'landing', name: 'Landing Page', icon: Zap },
    { id: 'restaurant', name: 'Restaurant', icon: Heart },
    { id: 'creative', name: 'Creative', icon: Palette }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterAndSortTemplates()
  }, [templates, searchQuery, selectedCategory, sortBy])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await insforge
        .from('website_templates')
        .select('*')
        .order('downloads_count', { ascending: false })

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

  const filterAndSortTemplates = () => {
    let filtered = templates

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes_count - a.likes_count
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'downloads':
          return b.downloads_count - a.downloads_count
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }

  const downloadTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return

      // In a real implementation, this would download the template files
      // For now, we'll just update the download count
      const { error } = await insforge
        .from('website_templates')
        .update({ downloads_count: template.downloads_count + 1 })
        .eq('id', templateId)

      if (error) throw error

      setTemplates(prev => prev.map(t =>
        t.id === templateId ? { ...t, downloads_count: t.downloads_count + 1 } : t
      ))

      // Show download success message
      alert('Template downloaded successfully!')
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Failed to download template')
    }
  }

  const likeTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return

      const { error } = await insforge
        .from('website_templates')
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

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Globe
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
        <h1 className="text-3xl font-bold text-white">Website Templates</h1>
        <p className="text-gray-400">Browse and download pre-built website templates</p>
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
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#00F5FF]"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category)
          return (
            <Card key={template.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors overflow-hidden">
              {/* Template Preview Image */}
              <div className="aspect-video bg-gray-700 relative overflow-hidden">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                {template.is_premium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 text-black">Premium</Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 text-[#00F5FF]" />
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.id === template.category)?.name || template.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.technologies.map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs border-gray-500">
                        <Code className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {template.downloads_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {template.likes_count}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-600"
                    onClick={() => likeTemplate(template.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-gray-900"
                    onClick={() => downloadTemplate(template.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400">Try adjusting your search or category filters</p>
        </div>
      )}

      {/* Template Details Modal */}
      <div className="hidden">
        {/* This would be shown when clicking preview */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Template Details</h2>
              <Button variant="ghost">✕</Button>
            </div>
            {/* Template details would go here */}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data for development
const mockTemplates: WebsiteTemplate[] = [
  {
    id: '1',
    name: 'Modern Business Template',
    description: 'Clean and professional business website template perfect for startups and small businesses.',
    category: 'business',
    preview_image: '/templates/business-preview.jpg',
    features: ['Responsive Design', 'Contact Forms', 'SEO Optimized', 'Fast Loading'],
    technologies: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    downloads_count: 1250,
    likes_count: 890,
    is_premium: false,
    created_at: '2024-01-15T00:00:00Z',
    demo_url: 'https://demo.example.com/business'
  },
  {
    id: '2',
    name: 'E-commerce Store',
    description: 'Complete e-commerce solution with shopping cart, payment integration, and admin dashboard.',
    category: 'ecommerce',
    preview_image: '/templates/ecommerce-preview.jpg',
    features: ['Shopping Cart', 'Payment Gateway', 'Inventory Management', 'Order Tracking'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    downloads_count: 980,
    likes_count: 756,
    is_premium: true,
    created_at: '2024-01-20T00:00:00Z',
    demo_url: 'https://demo.example.com/store'
  },
  {
    id: '3',
    name: 'Creative Portfolio',
    description: 'Showcase your work with this stunning portfolio template featuring smooth animations and galleries.',
    category: 'portfolio',
    preview_image: '/templates/portfolio-preview.jpg',
    features: ['Image Gallery', 'Smooth Animations', 'Project Showcase', 'Contact Integration'],
    technologies: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    downloads_count: 1450,
    likes_count: 1234,
    is_premium: false,
    created_at: '2024-01-10T00:00:00Z',
    demo_url: 'https://demo.example.com/portfolio'
  },
  {
    id: '4',
    name: 'Restaurant Website',
    description: 'Beautiful restaurant website with menu display, reservations, and online ordering.',
    category: 'restaurant',
    preview_image: '/templates/restaurant-preview.jpg',
    features: ['Menu Display', 'Online Reservations', 'Food Photos', 'Location Map'],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    downloads_count: 678,
    likes_count: 543,
    is_premium: false,
    created_at: '2024-01-25T00:00:00Z',
    demo_url: 'https://demo.example.com/restaurant'
  }
]