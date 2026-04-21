'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Facebook,
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
  Link,
  Eye,
  ThumbsUp,
  MessageCircle,
  Send,
  Zap
} from 'lucide-react'

interface FacebookPage {
  id: string
  name: string
  category: string
  followers: number
  likes: number
  connected: boolean
  lastPost: string
  avatar?: string
}

interface FacebookPost {
  id: string
  content: string
  type: 'text' | 'image' | 'video' | 'link'
  likes: number
  comments: number
  shares: number
  reach: number
  engagement: number
  postedAt: string
  status: 'published' | 'scheduled' | 'draft'
  scheduledFor?: string
}

interface FacebookAd {
  id: string
  name: string
  campaign: string
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
}

export default function FacebookIntegration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'ads' | 'analytics' | 'settings'>('overview')
  const [connected, setConnected] = useState(true)

  // Mock Facebook pages data
  const [pages] = useState<FacebookPage[]>([
    {
      id: '1',
      name: 'ClipGenius Marketing',
      category: 'Business Service',
      followers: 15420,
      likes: 12850,
      connected: true,
      lastPost: '2024-04-19T14:30:00Z'
    },
    {
      id: '2',
      name: 'Tech Innovations Hub',
      category: 'Technology',
      followers: 8900,
      likes: 7650,
      connected: true,
      lastPost: '2024-04-18T11:20:00Z'
    }
  ])

  // Mock Facebook posts data
  const [posts] = useState<FacebookPost[]>([
    {
      id: '1',
      content: '🚀 Exciting news! We\'ve just launched our new AI-powered marketing tools. Check them out and revolutionize your marketing strategy! #AI #Marketing #Innovation',
      type: 'text',
      likes: 245,
      comments: 67,
      shares: 34,
      reach: 15420,
      engagement: 346,
      postedAt: '2024-04-19T14:30:00Z',
      status: 'published'
    },
    {
      id: '2',
      content: 'Behind the scenes: Our team working on the next generation of marketing automation. What features would you love to see? 💡',
      type: 'image',
      likes: 189,
      comments: 43,
      shares: 28,
      reach: 12850,
      engagement: 260,
      postedAt: '2024-04-18T11:20:00Z',
      status: 'published'
    },
    {
      id: '3',
      content: '📅 Join us next week for our free webinar on "Mastering Social Media Marketing in 2024". Limited spots available!',
      type: 'link',
      likes: 156,
      comments: 29,
      shares: 45,
      reach: 9870,
      engagement: 230,
      postedAt: '2024-04-17T09:15:00Z',
      status: 'published'
    },
    {
      id: '4',
      content: '🎥 Product demo video coming soon! Stay tuned for an exclusive look at our latest features.',
      type: 'video',
      likes: 312,
      comments: 89,
      shares: 67,
      reach: 18750,
      engagement: 468,
      postedAt: '2024-04-20T10:00:00Z',
      status: 'scheduled',
      scheduledFor: '2024-04-20T10:00:00Z'
    }
  ])

  // Mock Facebook ads data
  const [ads] = useState<FacebookAd[]>([
    {
      id: '1',
      name: 'Q1 Product Launch Boost',
      campaign: 'Product Launch Campaign',
      status: 'active',
      budget: 5000,
      spent: 2850.75,
      impressions: 125000,
      clicks: 2500,
      ctr: 2.0,
      cpc: 1.14,
      conversions: 125
    },
    {
      id: '2',
      name: 'Lead Generation Campaign',
      campaign: 'B2B Lead Generation',
      status: 'active',
      budget: 3000,
      spent: 1890.50,
      impressions: 89000,
      clicks: 1780,
      ctr: 2.0,
      cpc: 1.06,
      conversions: 89
    },
    {
      id: '3',
      name: 'Brand Awareness Q1',
      campaign: 'Brand Awareness',
      status: 'completed',
      budget: 2000,
      spent: 2000.00,
      impressions: 150000,
      clicks: 2250,
      ctr: 1.5,
      cpc: 0.89,
      conversions: 68
    }
  ])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'posts', name: 'Posts', icon: MessageSquare },
    { id: 'ads', name: 'Ads', icon: TrendingUp },
    { id: 'analytics', icon: BarChart3, name: 'Analytics' },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0)
  const totalReach = posts.reduce((sum, post) => sum + post.reach, 0)
  const totalEngagement = posts.reduce((sum, post) => sum + post.engagement, 0)

  const adSpend = ads.reduce((sum, ad) => sum + ad.spent, 0)
  const adImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const adClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const adConversions = ads.reduce((sum, ad) => sum + ad.conversions, 0)
  const avgCTR = adClicks / adImpressions * 100 || 0

  const connectFacebook = () => {
    // Mock Facebook OAuth connection
    setConnected(true)
  }

  const createPost = () => {
    // Mock post creation
    console.log('Create new Facebook post')
  }

  const createAd = () => {
    // Mock ad creation
    console.log('Create new Facebook ad')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'link': return <Link className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getAdStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'paused': return 'text-yellow-400'
      case 'completed': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  if (!connected) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Facebook Integration</h1>
            <p className="text-gray-400 mt-2">Connect your Facebook pages to manage posts, ads, and analytics</p>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Facebook className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Facebook</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Connect your Facebook Business account to manage pages, create posts, run ads, and track performance analytics.
            </p>
            <Button
              onClick={connectFacebook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <Facebook className="w-5 h-5 mr-2" />
              Connect Facebook Account
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
          <h1 className="text-3xl font-bold text-white">Facebook Integration</h1>
          <p className="text-gray-400 mt-2">Manage Facebook pages, posts, ads, and analytics</p>
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalReach)}</div>
            <p className="text-xs text-gray-400">
              Across all posts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalEngagement)}</div>
            <p className="text-xs text-gray-400">
              Likes + comments + shares
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ad Spend</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${adSpend.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ad CTR</CardTitle>
            <Zap className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgCTR.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Average click-through rate
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
          {/* Connected Pages */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Connected Facebook Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border border-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{page.name}</div>
                        <div className="text-gray-400 text-sm">{page.followers.toLocaleString()} followers</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Connected
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 border border-gray-700/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        {getPostTypeIcon(post.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
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
            <h2 className="text-xl font-semibold text-white">Facebook Posts</h2>
            <Button onClick={createPost} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        {getPostTypeIcon(post.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {post.type}
                        </Badge>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>

                      <p className="text-white mb-4">{post.content}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{formatNumber(post.likes)}</div>
                          <div className="text-sm text-gray-400">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{formatNumber(post.comments)}</div>
                          <div className="text-sm text-gray-400">Comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{formatNumber(post.shares)}</div>
                          <div className="text-sm text-gray-400">Shares</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{formatNumber(post.reach)}</div>
                          <div className="text-sm text-gray-400">Reach</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Posted {formatDate(post.postedAt)}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            Boost
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Ads Tab */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Facebook Ads</h2>
            <Button onClick={createAd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Ad Name</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Budget</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Spent</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Impressions</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Clicks</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">CTR</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-white font-medium">{ad.name}</div>
                            <div className="text-gray-400 text-sm">{ad.campaign}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={
                            ad.status === 'active' ? 'default' :
                            ad.status === 'paused' ? 'secondary' :
                            'outline'
                          } className="capitalize">
                            {ad.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-white">${ad.budget.toLocaleString()}</td>
                        <td className="py-4 px-6 text-white">${ad.spent.toLocaleString()}</td>
                        <td className="py-4 px-6 text-white">{ad.impressions.toLocaleString()}</td>
                        <td className="py-4 px-6 text-white">{ad.clicks.toLocaleString()}</td>
                        <td className="py-4 px-6 text-white">{ad.ctr}%</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className={ad.status === 'active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}>
                              {ad.status === 'active' ? 'Pause' : 'Resume'}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              Analytics
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Page Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {pages.reduce((sum, page) => sum + page.likes, 0).toLocaleString()}
                </div>
                <div className="text-green-400 text-sm">+12% this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {pages.reduce((sum, page) => sum + page.followers, 0).toLocaleString()}
                </div>
                <div className="text-green-400 text-sm">+8% this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">4.2%</div>
                <div className="text-green-400 text-sm">Above industry average</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white mb-1">468 engagements</div>
                <div className="text-gray-400 text-sm">Product demo video</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance by Post Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['video', 'image', 'text', 'link'].map((type) => {
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

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Facebook Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4">Connected Pages</h3>
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{page.name}</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Auto-Publishing Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Auto-publish to all connected pages</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" />
                    <span className="text-gray-300">Require approval for posts with links</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-600" defaultChecked />
                    <span className="text-gray-300">Send notifications for post performance</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">API Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">App ID</label>
                    <Input
                      type="password"
                      placeholder="Facebook App ID"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">App Secret</label>
                    <Input
                      type="password"
                      placeholder="Facebook App Secret"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
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