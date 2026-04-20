'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Star,
  Download,
  ExternalLink,
  Filter,
  Grid,
  List,
  Zap,
  Shield,
  MessageSquare,
  Database,
  Mail,
  Phone,
  Globe,
  ShoppingCart,
  BarChart3
} from 'lucide-react'

interface App {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviews: number
  downloads: number
  price: 'free' | 'paid' | 'freemium'
  icon: React.ComponentType<any>
  featured: boolean
  installed: boolean
  developer: string
  tags: string[]
}

export default function AppMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'All Apps', count: 24 },
    { id: 'marketing', name: 'Marketing', count: 8 },
    { id: 'sales', name: 'Sales', count: 6 },
    { id: 'communication', name: 'Communication', count: 4 },
    { id: 'analytics', name: 'Analytics', count: 3 },
    { id: 'productivity', name: 'Productivity', count: 3 }
  ]

  const apps: App[] = [
    {
      id: '1',
      name: 'Advanced Email Builder',
      description: 'Create stunning email campaigns with drag-and-drop editor and AI content generation.',
      category: 'marketing',
      rating: 4.8,
      reviews: 1247,
      downloads: 15420,
      price: 'freemium',
      icon: Mail,
      featured: true,
      installed: false,
      developer: 'ClipGenius Team',
      tags: ['email', 'marketing', 'ai']
    },
    {
      id: '2',
      name: 'CRM Integration Hub',
      description: 'Connect with popular CRM platforms like Salesforce, HubSpot, and Pipedrive.',
      category: 'sales',
      rating: 4.6,
      reviews: 892,
      downloads: 12340,
      price: 'paid',
      icon: Database,
      featured: true,
      installed: true,
      developer: 'SalesPro Inc',
      tags: ['crm', 'integration', 'sales']
    },
    {
      id: '3',
      name: 'Social Media Scheduler',
      description: 'Schedule and automate your social media posts across all platforms.',
      category: 'marketing',
      rating: 4.9,
      reviews: 2156,
      downloads: 25670,
      price: 'free',
      icon: MessageSquare,
      featured: false,
      installed: true,
      developer: 'SocialBoost',
      tags: ['social', 'automation', 'scheduling']
    },
    {
      id: '4',
      name: 'Advanced Analytics Dashboard',
      description: 'Comprehensive analytics and reporting for all your marketing efforts.',
      category: 'analytics',
      rating: 4.7,
      reviews: 634,
      downloads: 8920,
      price: 'paid',
      icon: BarChart3,
      featured: false,
      installed: false,
      developer: 'DataViz Pro',
      tags: ['analytics', 'reporting', 'dashboard']
    },
    {
      id: '5',
      name: 'WhatsApp Business API',
      description: 'Send automated messages and connect with customers via WhatsApp.',
      category: 'communication',
      rating: 4.5,
      reviews: 567,
      downloads: 7840,
      price: 'paid',
      icon: Phone,
      featured: false,
      installed: false,
      developer: 'CommTech Solutions',
      tags: ['whatsapp', 'messaging', 'api']
    },
    {
      id: '6',
      name: 'E-commerce Integration',
      description: 'Connect with Shopify, WooCommerce, and other e-commerce platforms.',
      category: 'productivity',
      rating: 4.4,
      reviews: 423,
      downloads: 6120,
      price: 'freemium',
      icon: ShoppingCart,
      featured: false,
      installed: false,
      developer: 'ShopConnect',
      tags: ['ecommerce', 'integration', 'sales']
    }
  ]

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredApps = apps.filter(app => app.featured)
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free': return 'bg-green-500'
      case 'paid': return 'bg-blue-500'
      case 'freemium': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const AppCard = ({ app, isListView = false }: { app: App; isListView?: boolean }) => (
    <Card className={`bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-200 ${isListView ? 'flex flex-row' : ''}`}>
      <CardContent className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className={`flex ${isListView ? 'items-center space-x-4' : 'flex-col space-y-4'}`}>
          {/* Icon and Basic Info */}
          <div className={`flex ${isListView ? 'items-center space-x-4' : 'flex-col items-center space-y-3'}`}>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <app.icon className="w-6 h-6 text-white" />
              </div>
              {app.featured && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-current" />
                </div>
              )}
            </div>

            <div className={`${isListView ? 'flex-1' : 'text-center'}`}>
              <h3 className="text-lg font-semibold text-white">{app.name}</h3>
              <p className="text-sm text-gray-400 mb-2">by {app.developer}</p>

              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">{app.rating}</span>
                  <span className="text-sm text-gray-500">({app.reviews})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{app.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-3">
                <Badge variant="outline" className={`text-xs ${getPriceColor(app.price)} text-white border-current`}>
                  {app.price.charAt(0).toUpperCase() + app.price.slice(1)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {app.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={`${isListView ? 'flex-1' : ''}`}>
            <p className={`text-gray-300 text-sm ${isListView ? 'line-clamp-2' : 'text-center line-clamp-3'}`}>
              {app.description}
            </p>

            {/* Tags */}
            <div className={`flex flex-wrap gap-1 mt-3 ${isListView ? '' : 'justify-center'}`}>
              {app.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex ${isListView ? 'flex-col space-y-2' : 'flex-col space-y-2 mt-4'}`}>
            {app.installed ? (
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10" disabled>
                <Shield className="w-4 h-4 mr-2" />
                Installed
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
            )}

            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">App Marketplace</h1>
          <p className="text-gray-400 mt-2">Discover and install powerful integrations to supercharge your workflow</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Featured Apps */}
      {selectedCategory === 'all' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Featured Apps
          </h2>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {featuredApps.map(app => (
              <AppCard key={app.id} app={app} isListView={viewMode === 'list'} />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {selectedCategoryData?.name || 'All Apps'} ({filteredApps.length} apps)
        </h2>
      </div>

      {/* Apps Grid/List */}
      {filteredApps.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} isListView={viewMode === 'list'} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No apps found</div>
          <div className="text-gray-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}