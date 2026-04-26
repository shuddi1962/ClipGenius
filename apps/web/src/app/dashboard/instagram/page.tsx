'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Instagram,
  Plus,
  Settings,
  BarChart3,
  Users,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Calendar,
  Image,
  Video,
  Hash,
  Eye,
  ThumbsUp,
  MessageCircle,
  Send,
  Zap,
  Camera,
  Play,
  Pause,
  Target,
  Search
} from 'lucide-react'

interface InstagramAccount {
  id: string
  username: string
  accountType: 'personal' | 'business' | 'creator'
  followers: number
  following: number
  posts: number
  connected: boolean
  avatar?: string
}

interface InstagramPost {
  id: string
  type: 'image' | 'video' | 'carousel' | 'reel' | 'story'
  content: string
  mediaUrls: string[]
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  impressions: number
  engagement: number
  postedAt: string
  hashtags: string[]
  status: 'published' | 'scheduled' | 'draft'
  scheduledFor?: string
}

interface InstagramStory {
  id: string
  type: 'image' | 'video'
  mediaUrl: string
  expiresAt: string
  views: number
  replies: number
  createdAt: string
}

interface HashtagPerformance {
  hashtag: string
  posts: number
  reach: number
  engagement: number
  trend: 'up' | 'down' | 'stable'
}

export default function InstagramIntegration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'stories' | 'analytics' | 'hashtags' | 'settings'>('overview')
  const [connected, setConnected] = useState(true)

  // Mock Instagram accounts data
  const [accounts] = useState<InstagramAccount[]>([
    {
      id: '1',
      username: 'clipgenius_official',
      accountType: 'business',
      followers: 45670,
      following: 1234,
      posts: 892,
      connected: true
    },
    {
      id: '2',
      username: 'tech_innovations_ig',
      accountType: 'creator',
      followers: 28340,
      following: 567,
      posts: 445,
      connected: true
    }
  ])

  // Mock Instagram posts data
  const [posts] = useState<InstagramPost[]>([
    {
      id: '1',
      type: 'carousel',
      content: '🚀 Transform your marketing with AI-powered automation! From lead generation to customer engagement, we\'ve got you covered. #AI #Marketing #Automation #BusinessGrowth',
      mediaUrls: ['/carousel1.jpg', '/carousel2.jpg', '/carousel3.jpg'],
      likes: 1247,
      comments: 89,
      shares: 45,
      saves: 234,
      reach: 45670,
      impressions: 89230,
      engagement: 1615,
      postedAt: '2024-04-20T14:30:00Z',
      hashtags: ['AI', 'Marketing', 'Automation', 'BusinessGrowth'],
      status: 'published'
    },
    {
      id: '2',
      type: 'reel',
      content: '✨ Watch how our AI transforms boring content into engaging posts! #ContentCreation #AI #SocialMedia #MarketingTips',
      mediaUrls: ['/reel1.mp4'],
      likes: 2156,
      comments: 156,
      shares: 89,
      saves: 445,
      reach: 78340,
      impressions: 145670,
      engagement: 2746,
      postedAt: '2024-04-19T16:45:00Z',
      hashtags: ['ContentCreation', 'AI', 'SocialMedia', 'MarketingTips'],
      status: 'published'
    },
    {
      id: '3',
      type: 'image',
      content: 'Behind the scenes: Our team brainstorming the next big feature! What would you love to see? 💡 #TeamWork #Innovation #Startups',
      mediaUrls: ['/post1.jpg'],
      likes: 892,
      comments: 67,
      shares: 23,
      saves: 156,
      reach: 23450,
      impressions: 45670,
      engagement: 1138,
      postedAt: '2024-04-18T11:20:00Z',
      hashtags: ['TeamWork', 'Innovation', 'Startups'],
      status: 'published'
    },
    {
      id: '4',
      type: 'story',
      content: '📸 Sneak peek of our upcoming product launch! Stay tuned... #ComingSoon #ProductLaunch #Exciting',
      mediaUrls: ['/story1.jpg'],
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      reach: 34560,
      impressions: 56780,
      engagement: 0,
      postedAt: '2024-04-21T09:00:00Z',
      hashtags: ['ComingSoon', 'ProductLaunch', 'Exciting'],
      status: 'scheduled',
      scheduledFor: '2024-04-21T09:00:00Z'
    }
  ])

  // Mock Instagram stories data
  const [stories] = useState<InstagramStory[]>([
    {
      id: '1',
      type: 'image',
      mediaUrl: '/story1.jpg',
      expiresAt: '2024-04-22T14:30:00Z',
      views: 3456,
      replies: 23,
      createdAt: '2024-04-20T14:30:00Z'
    },
    {
      id: '2',
      type: 'video',
      mediaUrl: '/story2.mp4',
      expiresAt: '2024-04-22T16:45:00Z',
      views: 5678,
      replies: 45,
      createdAt: '2024-04-20T16:45:00Z'
    }
  ])

  // Mock hashtag performance data
  const [hashtags] = useState<HashtagPerformance[]>([
    { hashtag: '#AI', posts: 45, reach: 125000, engagement: 8900, trend: 'up' },
    { hashtag: '#Marketing', posts: 67, reach: 98700, engagement: 12300, trend: 'up' },
    { hashtag: '#BusinessGrowth', posts: 23, reach: 45600, engagement: 3400, trend: 'stable' },
    { hashtag: '#SocialMedia', posts: 89, reach: 156000, engagement: 15600, trend: 'up' },
    { hashtag: '#ContentCreation', posts: 34, reach: 67800, engagement: 7800, trend: 'down' }
  ])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'posts', name: 'Posts', icon: MessageSquare },
    { id: 'stories', name: 'Stories', icon: Camera },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'hashtags', name: 'Hashtags', icon: Hash },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0)
  const totalPosts = posts.filter(p => p.status === 'published').length
  const totalReach = posts.reduce((sum, post) => sum + post.reach, 0)
  const totalEngagement = posts.reduce((sum, post) => sum + post.engagement, 0)
  const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach * 100) : 0

  const connectInstagram = () => {
    // Mock Instagram OAuth connection
    setConnected(true)
  }

  const createPost = () => {
    // Mock post creation
    console.log('Create new Instagram post')
  }

  const createStory = () => {
    // Mock story creation
    console.log('Create new Instagram story')
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'carousel': return <Image className="w-4 h-4" />
      case 'reel': return <Play className="w-4 h-4" />
      case 'story': return <Camera className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>
    }
  }

  if (!connected) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Instagram Integration</h1>
            <p className="text-gray-400 mt-2">Connect your Instagram Business accounts to manage posts, stories, and analytics</p>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Instagram className="w-16 h-16 mx-auto mb-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Instagram</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Connect your Instagram Business or Creator account to schedule posts, manage stories, track analytics, and monitor hashtag performance.
            </p>
            <Button
              onClick={connectInstagram}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Connect Instagram Account
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Instagram Integration</h1>
          <p className="text-gray-400 mt-2">Manage Instagram posts, stories, analytics, and hashtag performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Connected
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalFollowers)}</div>
            <p className="text-xs text-gray-400">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Published Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPosts}</div>
            <p className="text-xs text-gray-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalReach)}</div>
            <p className="text-xs text-gray-400">
              Audience impressions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgEngagementRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Likes + comments + shares
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
                ? 'bg-pink-600 text-white shadow-lg'
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
          {/* Connected Accounts */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Connected Instagram Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-8 h-8 text-pink-400" />
                      <div>
                        <div className="text-white font-medium">@{account.username}</div>
                        <div className="text-gray-400 text-sm">
                          {formatNumber(account.followers)} followers • {account.posts} posts
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize text-pink-400 border-pink-400">
                      {account.accountType}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Posts & Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 border border-gray-700/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        {getPostTypeIcon(post.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {post.type}
                        </Badge>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-white mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(post.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {formatNumber(post.comments)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(post.reach)}
                        </span>
                        <span>{formatDate(post.postedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Instagram Posts</h2>
            <Button onClick={createPost} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  {/* Post Preview */}
                  <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    {post.type === 'carousel' ? (
                      <div className="text-white text-center">
                        <Image className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Carousel</div>
                      </div>
                    ) : post.type === 'reel' ? (
                      <div className="text-white text-center">
                        <Play className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Reel</div>
                      </div>
                    ) : post.type === 'video' ? (
                      <div className="text-white text-center">
                        <Video className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Video</div>
                      </div>
                    ) : (
                      <div className="text-white text-center">
                        <Image className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Image</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {post.type}
                      </Badge>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>

                    <p className="text-white text-sm line-clamp-3">{post.content}</p>

                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.slice(0, 3).map(hashtag => (
                          <Badge key={hashtag} variant="secondary" className="text-xs">
                            #{hashtag}
                          </Badge>
                        ))}
                        {post.hashtags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.hashtags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">{formatNumber(post.likes)}</div>
                        <div className="text-gray-400">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{formatNumber(post.comments)}</div>
                        <div className="text-gray-400">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{formatNumber(post.reach)}</div>
                        <div className="text-gray-400">Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{formatNumber(post.engagement)}</div>
                        <div className="text-gray-400">Engagement</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                      <span>Posted {formatDate(post.postedAt)}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6">
                          Boost
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6">
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Instagram Stories</h2>
            <Button onClick={createStory} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Story
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="aspect-[9/16] bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center relative">
                    {story.type === 'video' ? (
                      <div className="text-white text-center">
                        <Play className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Video Story</div>
                      </div>
                    ) : (
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Image Story</div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs capitalize">
                        {story.type} Story
                      </Badge>
                      <span className="text-xs text-gray-400">Expires in 24h</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">{formatNumber(story.views)}</div>
                        <div className="text-gray-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{story.replies}</div>
                        <div className="text-gray-400">Replies</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Created {formatDate(story.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Audience Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">+12.5%</div>
                <div className="text-green-400 text-sm">New followers this month</div>
                <div className="text-gray-400 text-xs mt-2">Compared to last month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1">Reels</div>
                <div className="text-green-400 text-sm">Highest engagement rate</div>
                <div className="text-gray-400 text-xs mt-2">2.4x more engagement than posts</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Best Posting Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1">7:00 PM</div>
                <div className="text-green-400 text-sm">Peak engagement time</div>
                <div className="text-gray-400 text-xs mt-2">45% higher reach</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Content Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['reel', 'carousel', 'image', 'video'].map((type) => {
                  const typePosts = posts.filter(p => p.type === type)
                  const avgEngagement = typePosts.length > 0
                    ? typePosts.reduce((sum, p) => sum + p.engagement, 0) / typePosts.length
                    : 0

                  return (
                    <div key={type} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPostTypeIcon(type)}
                        <span className="text-white capitalize">{type} Posts</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{avgEngagement.toFixed(0)} avg engagement</div>
                        <div className="text-gray-400 text-sm">{typePosts.length} posts</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hashtags Tab */}
      {activeTab === 'hashtags' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Hashtag Performance</h2>
            <div className="flex gap-3">
              <Input
                placeholder="Search hashtags..."
                className="bg-gray-700 border-gray-600 text-white w-64"
              />
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Search className="w-4 h-4 mr-2" />
                Discover
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hashtags.map((hashtag) => (
              <Card key={hashtag.hashtag} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium text-lg">{hashtag.hashtag}</span>
                    </div>
                    {getTrendIcon(hashtag.trend)}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">Posts</div>
                        <div className="text-white font-semibold">{hashtag.posts}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Reach</div>
                        <div className="text-white font-semibold">{formatNumber(hashtag.reach)}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm">Engagement</div>
                      <div className="text-white font-semibold">{formatNumber(hashtag.engagement)}</div>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="text-sm">
                        <span className="text-gray-400">Avg engagement per post: </span>
                        <span className="text-white font-medium">
                          {(hashtag.engagement / hashtag.posts).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Instagram Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <span className="text-white">@{account.username}</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Posting Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Auto-post to all connected accounts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Add location tags to posts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" />
                    <span className="text-gray-300">Automatically add relevant hashtags</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Send notifications for post performance</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Story Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Highlight top-performing stories</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" />
                    <span className="text-gray-300">Auto-archive expired stories</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">API Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instagram App ID</label>
                    <Input
                      type="password"
                      placeholder="Instagram App ID"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Access Token</label>
                    <Input
                      type="password"
                      placeholder="Instagram Access Token"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Update API Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}