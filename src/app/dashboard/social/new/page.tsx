'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Calendar, Image, Video, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import { insforge } from '@/lib/insforge'

interface NewPostForm {
  platforms: string[]
  content: string
  media_urls: string[]
  scheduled_at: string
}

export default function NewSocialPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])

  const [formData, setFormData] = useState<NewPostForm>({
    platforms: [],
    content: '',
    media_urls: [],
    scheduled_at: ''
  })

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  const fetchConnectedAccounts = async () => {
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
        .from('connected_accounts')
        .select('*')
        .eq('workspace_id', workspace.id)

      if (error) throw error
      setConnectedAccounts(data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      connected: connectedAccounts.some(acc => acc.platform === 'facebook')
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      connected: connectedAccounts.some(acc => acc.platform === 'instagram')
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      connected: connectedAccounts.some(acc => acc.platform === 'linkedin')
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      connected: connectedAccounts.some(acc => acc.platform === 'twitter')
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      connected: connectedAccounts.some(acc => acc.platform === 'youtube')
    }
  ]

  const togglePlatform = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const addMediaUrl = () => {
    setFormData(prev => ({
      ...prev,
      media_urls: [...prev.media_urls, '']
    }))
  }

  const updateMediaUrl = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      media_urls: prev.media_urls.map((media, i) => i === index ? url : media)
    }))
  }

  const removeMediaUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media_urls: prev.media_urls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.platforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setLoading(true)

    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Create posts for each selected platform
      const postsToCreate = formData.platforms.map(platform => {
        // Find connected account for this platform
        const account = connectedAccounts.find(acc => acc.platform === platform)
        if (!account) {
          throw new Error(`No connected account found for ${platform}`)
        }

        return {
          workspace_id: workspace.id,
          platform,
          content: formData.content,
          media_urls: formData.media_urls.filter(url => url.trim()),
          scheduled_at: formData.scheduled_at || new Date().toISOString(),
          status: formData.scheduled_at ? 'scheduled' : 'draft',
          account_id: account.id
        }
      })

      const { error } = await insforge
        .from('scheduled_posts')
        .insert(postsToCreate)

      if (error) throw error

      router.push('/dashboard/social/scheduler')
    } catch (error) {
      console.error('Error creating posts:', error)
      alert('Failed to create posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/social/scheduler"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Social Post</h1>
            <p className="text-gray-300">Schedule content across multiple social platforms</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Platform Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Select Platforms</h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map(platform => {
              const Icon = platform.icon
              const isSelected = formData.platforms.includes(platform.id)

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  disabled={!platform.connected}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    isSelected
                      ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                      : platform.connected
                      ? 'border-gray-600 hover:border-[#00F5FF]/50'
                      : 'border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    platform.connected ? 'text-white' : 'text-gray-500'
                  }`} />
                  <div className="text-sm font-medium text-white">{platform.name}</div>
                  {!platform.connected && (
                    <div className="text-xs text-red-400 mt-1">Not connected</div>
                  )}
                </button>
              )
            })}
          </div>

          {formData.platforms.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                Select at least one platform. Make sure you have connected accounts for the platforms you want to post to.
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Post Content</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Post Text
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                placeholder="Write your post content here..."
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {formData.content.length}/280 characters
              </div>
            </div>

            {/* Media URLs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Media URLs (Optional)
                </label>
                <button
                  type="button"
                  onClick={addMediaUrl}
                  className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm flex items-center"
                >
                  <Image className="w-4 h-4 mr-1" />
                  Add Media
                </button>
              </div>

              {formData.media_urls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateMediaUrl(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaUrl(index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Scheduling */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule Post (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              />
              <div className="text-xs text-gray-400 mt-1">
                Leave empty to save as draft
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.content && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>

            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
              <div className="text-white mb-2">{formData.content}</div>
              {formData.media_urls.filter(url => url.trim()).length > 0 && (
                <div className="text-gray-400 text-sm">
                  📎 {formData.media_urls.filter(url => url.trim()).length} media attachment(s)
                </div>
              )}
              <div className="text-gray-500 text-xs mt-2">
                Posting to: {formData.platforms.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/social/scheduler"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || formData.platforms.length === 0 || !formData.content}
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Creating...' : formData.scheduled_at ? 'Schedule Posts' : 'Save Drafts'}
          </button>
        </div>
      </form>
    </div>
  )
}