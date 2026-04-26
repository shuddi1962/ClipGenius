'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageSquare,
  Plus,
  Search,
  Heart,
  Reply,
  TrendingUp,
  Clock,
  User,
  ThumbsUp,
  MessageCircle,
  Eye,
  Calendar,
  Filter,
  Star,
  Hash,
  Pin,
  Flag
} from 'lucide-react'

interface Community {
  id: string
  name: string
  description: string
  category: string
  members: number
  posts: number
  isPrivate: boolean
  createdAt: string
  moderator: string
  tags: string[]
  coverImage?: string
}

interface Post {
  id: string
  title: string
  content: string
  author: string
  communityId: string
  createdAt: string
  likes: number
  replies: number
  views: number
  isPinned: boolean
  isFeatured: boolean
  tags: string[]
  lastReply?: {
    author: string
    timestamp: string
  }
}

export default function Communities() {
  const [activeTab, setActiveTab] = useState<'overview' | 'communities' | 'posts'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)

  // Mock communities data
  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'Digital Marketing Hub',
      description: 'Discuss the latest trends, strategies, and best practices in digital marketing.',
      category: 'Marketing',
      members: 15420,
      posts: 2834,
      isPrivate: false,
      createdAt: '2024-01-15T10:00:00Z',
      moderator: 'Sarah Johnson',
      tags: ['marketing', 'digital', 'strategy']
    },
    {
      id: '2',
      name: 'Entrepreneur Support',
      description: 'A community for entrepreneurs to share experiences, seek advice, and network.',
      category: 'Business',
      members: 8920,
      posts: 1923,
      isPrivate: false,
      createdAt: '2024-02-01T14:30:00Z',
      moderator: 'Mike Chen',
      tags: ['entrepreneurship', 'business', 'networking']
    },
    {
      id: '3',
      name: 'Tech Innovators',
      description: 'Private community for technology enthusiasts and innovators.',
      category: 'Technology',
      members: 3420,
      posts: 876,
      isPrivate: true,
      createdAt: '2024-03-10T09:15:00Z',
      moderator: 'Emma Davis',
      tags: ['technology', 'innovation', 'tech']
    },
    {
      id: '4',
      name: 'Freelancer Community',
      description: 'Connect with fellow freelancers, share tips, and find collaboration opportunities.',
      category: 'Freelancing',
      members: 6750,
      posts: 1456,
      isPrivate: false,
      createdAt: '2024-01-20T16:45:00Z',
      moderator: 'Alex Rodriguez',
      tags: ['freelancing', 'remote work', 'gig economy']
    }
  ])

  // Mock posts data
  const [posts] = useState<Post[]>([
    {
      id: '1',
      title: 'How AI is changing the marketing landscape in 2024',
      content: 'With the rapid advancement of AI technologies, marketers are facing both opportunities and challenges...',
      author: 'Sarah Johnson',
      communityId: '1',
      createdAt: '2024-04-19T14:30:00Z',
      likes: 45,
      replies: 23,
      views: 892,
      isPinned: true,
      isFeatured: true,
      tags: ['AI', 'marketing', '2024'],
      lastReply: {
        author: 'Mike Chen',
        timestamp: '2024-04-19T16:45:00Z'
      }
    },
    {
      id: '2',
      title: 'Best practices for building a personal brand as a freelancer',
      content: 'Building a strong personal brand is crucial for freelancers. Here are some proven strategies...',
      author: 'Alex Rodriguez',
      communityId: '4',
      createdAt: '2024-04-19T11:20:00Z',
      likes: 32,
      replies: 18,
      views: 654,
      isPinned: false,
      isFeatured: false,
      tags: ['personal branding', 'freelancing', 'career'],
      lastReply: {
        author: 'Lisa Wang',
        timestamp: '2024-04-19T15:30:00Z'
      }
    },
    {
      id: '3',
      title: 'Scaling a SaaS business: Lessons learned',
      content: 'After 3 years of running a SaaS company, here are the key lessons I\'ve learned about scaling...',
      author: 'Emma Davis',
      communityId: '2',
      createdAt: '2024-04-18T13:15:00Z',
      likes: 67,
      replies: 34,
      views: 1205,
      isPinned: false,
      isFeatured: true,
      tags: ['SaaS', 'scaling', 'business growth'],
      lastReply: {
        author: 'David Kim',
        timestamp: '2024-04-19T12:00:00Z'
      }
    }
  ])

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredPosts = posts.filter(post => {
    if (selectedCommunity && post.communityId !== selectedCommunity) return false
    return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const getCommunityName = (id: string) => {
    return communities.find(c => c.id === id)?.name || 'Unknown Community'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const totalMembers = communities.reduce((sum, c) => sum + c.members, 0)
  const totalPosts = communities.reduce((sum, c) => sum + c.posts, 0)
  const activeCommunities = communities.filter(c => !c.isPrivate).length

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'communities', name: 'Communities', icon: Users },
    { id: 'posts', name: 'Recent Posts', icon: MessageSquare }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Communities</h1>
          <p className="text-gray-400 mt-2">Connect, share, and learn with like-minded professionals</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Communities</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{communities.length}</div>
            <p className="text-xs text-gray-400">
              {activeCommunities} public
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Members</CardTitle>
            <User className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMembers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Active participants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPosts.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Discussions created
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87%</div>
            <p className="text-xs text-gray-400">
              Member activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Search */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search communities and posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Communities */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Featured Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.slice(0, 2).map((community) => (
                <Card key={community.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{community.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{community.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {community.members.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {community.posts}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {community.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => {
                  const community = communities.find(c => c.id === post.communityId)
                  return (
                    <div key={post.id} className="flex items-start gap-3 p-3 border border-gray-700/50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{post.author}</span>
                          <span className="text-gray-400">in</span>
                          <Badge variant="outline" className="text-xs">
                            {community?.name}
                          </Badge>
                        </div>
                        <h4 className="text-white font-medium mb-1">{post.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Communities Tab */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search communities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{community.name}</h3>
                        {community.isPrivate && (
                          <Badge variant="secondary" className="text-xs">Private</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{community.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.members.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {community.posts}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {community.category}
                        </Badge>
                        {community.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
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
                <select
                  value={selectedCommunity || 'all'}
                  onChange={(e) => setSelectedCommunity(e.target.value === 'all' ? null : e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                >
                  <option value="all">All Communities</option>
                  {communities.map(community => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort By
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const community = communities.find(c => c.id === post.communityId)
              return (
                <Card key={post.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{post.author}</span>
                          <span className="text-gray-400">in</span>
                          <Badge variant="outline" className="text-xs">
                            {community?.name}
                          </Badge>
                          {post.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                          {post.isFeatured && <Star className="w-4 h-4 text-blue-400 fill-current" />}
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-400 cursor-pointer">
                          {post.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(post.createdAt)}
                            </span>
                            {post.lastReply && (
                              <span className="text-gray-400">
                                Last reply by {post.lastReply.author} {formatDate(post.lastReply.timestamp)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Flag className="w-4 h-4" />
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
        </div>
      )}

      {((activeTab === 'communities' && filteredCommunities.length === 0) ||
        (activeTab === 'posts' && filteredPosts.length === 0)) && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <div className="text-gray-400 text-lg mb-2">No content found</div>
          <div className="text-gray-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}