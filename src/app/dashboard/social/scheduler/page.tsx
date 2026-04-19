'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Calendar, Clock, Facebook, Instagram, Linkedin, Twitter, Youtube, Send, Eye, Edit } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface ScheduledPost {
  id: string
  platform: string
  content: string
  media_urls: string[]
  scheduled_at: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  published_at?: string
  created_at: string
}

export default function SocialSchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'published'>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('scheduled_posts')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('scheduled_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true
    return post.status === filter
  })

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook
      case 'instagram': return Instagram
      case 'linkedin': return Linkedin
      case 'twitter': return Twitter
      case 'youtube': return Youtube
      default: return Send
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'text-blue-500'
      case 'instagram': return 'text-pink-500'
      case 'linkedin': return 'text-blue-700'
      case 'twitter': return 'text-black'
      case 'youtube': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'scheduled': return 'bg-blue-500'
      case 'published': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Social Media Scheduler</h1>
          <p className="text-gray-300">Schedule and automate posts across all your social platforms</p>
        </div>
        <Link
          href="/dashboard/social/new"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex gap-4">
          {[
            { id: 'all', label: 'All Posts', count: posts.length },
            { id: 'scheduled', label: 'Scheduled', count: posts.filter(p => p.status === 'scheduled').length },
            { id: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === type.id
                  ? 'bg-[#00F5FF] text-black'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => {
            const PlatformIcon = getPlatformIcon(post.platform)
            return (
              <div
                key={post.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <PlatformIcon className={`w-6 h-6 mr-3 ${getPlatformColor(post.platform)}`} />
                    <div>
                      <div className="font-semibold text-white capitalize">{post.platform}</div>
                      <div className={`inline-block px-2 py-1 text-xs rounded-full border mt-1 ${
                        post.status === 'published' ? 'border-green-500 text-green-400' :
                        post.status === 'scheduled' ? 'border-blue-500 text-blue-400' :
                        'border-gray-500 text-gray-400'
                      }`}>
                        {post.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {post.content}
                  </p>
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      📎 {post.media_urls.length} media file{post.media_urls.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Scheduling Info */}
                <div className="text-sm text-gray-500">
                  {post.status === 'scheduled' && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Scheduled: {new Date(post.scheduled_at).toLocaleString()}
                    </div>
                  )}
                  {post.status === 'published' && post.published_at && (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Published: {new Date(post.published_at).toLocaleString()}
                    </div>
                  )}
                  <div className="mt-1">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {posts.length === 0 ? 'No posts scheduled yet' : 'No posts match your filter'}
          </h3>
          <p className="text-gray-400 mb-6">
            {posts.length === 0
              ? 'Create your first social media post to get started'
              : 'Try changing your filter to see more posts'
            }
          </p>
          {posts.length === 0 && (
            <Link
              href="/dashboard/social/new"
              className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Create Your First Post
            </Link>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {posts.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#00F5FF] mb-2">{posts.length}</div>
            <div className="text-gray-400">Total Posts</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {posts.filter(p => p.status === 'scheduled').length}
            </div>
            <div className="text-gray-400">Scheduled</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {posts.filter(p => p.status === 'published').length}
            </div>
            <div className="text-gray-400">Published</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {posts.filter(p => p.platform === 'instagram').length}
            </div>
            <div className="text-gray-400">Instagram Posts</div>
          </div>
        </div>
      )}
    </div>
  )
}