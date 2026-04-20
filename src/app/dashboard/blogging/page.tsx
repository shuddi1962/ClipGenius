'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Filter,
  MoreHorizontal,
  Clock,
  BarChart3
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  status: 'draft' | 'published' | 'scheduled'
  category: string
  tags: string[]
  createdAt: string
  publishedAt: string | null
  views: number
  likes: number
  comments: number
}

export default function Blogging() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock blog posts
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: '10 Marketing Strategies That Drive Results in 2024',
      excerpt: 'Discover the latest marketing strategies that are proven to increase conversions and engagement.',
      content: 'Full blog content here...',
      author: 'Sarah Johnson',
      status: 'published',
      category: 'Marketing',
      tags: ['marketing', 'strategy', '2024'],
      createdAt: '2024-04-15T10:00:00Z',
      publishedAt: '2024-04-16T09:00:00Z',
      views: 2450,
      likes: 89,
      comments: 23
    },
    {
      id: '2',
      title: 'How AI is Revolutionizing Content Creation',
      excerpt: 'Explore how artificial intelligence is transforming the way we create and distribute content.',
      content: 'Full blog content here...',
      author: 'Mike Chen',
      status: 'published',
      category: 'Technology',
      tags: ['AI', 'content', 'automation'],
      createdAt: '2024-04-10T14:30:00Z',
      publishedAt: '2024-04-12T11:00:00Z',
      views: 1890,
      likes: 67,
      comments: 15
    },
    {
      id: '3',
      title: 'Building a Strong Brand Identity: A Complete Guide',
      excerpt: 'Learn the essential steps to create a compelling brand identity that resonates with your audience.',
      content: 'Full blog content here...',
      author: 'Emma Davis',
      status: 'draft',
      category: 'Branding',
      tags: ['branding', 'identity', 'guide'],
      createdAt: '2024-04-18T16:45:00Z',
      publishedAt: null,
      views: 0,
      likes: 0,
      comments: 0
    },
    {
      id: '4',
      title: 'SEO Best Practices for Local Businesses',
      excerpt: 'Optimize your local business website for search engines and attract more customers.',
      content: 'Full blog content here...',
      author: 'Alex Rodriguez',
      status: 'scheduled',
      category: 'SEO',
      tags: ['SEO', 'local', 'optimization'],
      createdAt: '2024-04-17T12:20:00Z',
      publishedAt: '2024-04-25T10:00:00Z',
      views: 0,
      likes: 0,
      comments: 0
    },
    {
      id: '5',
      title: 'Social Media Trends to Watch in 2024',
      excerpt: 'Stay ahead of the curve with these emerging social media trends and platforms.',
      content: 'Full blog content here...',
      author: 'Lisa Wang',
      status: 'published',
      category: 'Social Media',
      tags: ['social media', 'trends', '2024'],
      createdAt: '2024-04-08T09:15:00Z',
      publishedAt: '2024-04-09T08:30:00Z',
      views: 3120,
      likes: 124,
      comments: 38
    }
  ])

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(blogPosts.map(post => post.category)))

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'scheduled': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400'
      case 'draft': return 'text-gray-400'
      case 'scheduled': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const totalPosts = blogPosts.length
  const publishedPosts = blogPosts.filter(p => p.status === 'published').length
  const totalViews = blogPosts.reduce((sum, p) => sum + p.views, 0)
  const totalEngagement = blogPosts.reduce((sum, p) => sum + p.likes + p.comments, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blogging</h1>
          <p className="text-gray-400 mt-2">Create, manage, and publish engaging blog content</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPosts}</div>
            <p className="text-xs text-gray-400">
              {publishedPosts} published
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Across all posts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEngagement}</div>
            <p className="text-xs text-gray-400">
              Likes + comments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Views/Post</CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(totalViews / publishedPosts) || 0}</div>
            <p className="text-xs text-gray-400">
              For published posts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {(['all', 'published', 'draft', 'scheduled'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-700/50">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-700/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer">
                        {post.title}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(post.status)} className="capitalize">
                        {post.status}
                      </Badge>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(post.createdAt)}</span>
                      </div>
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className={`w-4 h-4 ${getStatusColor(post.status)}`} />
                          <span className={getStatusColor(post.status)}>
                            {post.status === 'scheduled' ? 'Scheduled' : 'Published'} {formatDate(post.publishedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {post.category}
                      </Badge>
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {post.status === 'published' && (
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">{post.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">👍 {post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">💬 {post.comments}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <div className="text-lg mb-2">No blog posts found</div>
              <div className="text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}