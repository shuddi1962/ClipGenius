'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Search, Filter, Trash2, Copy, Edit, Eye, Calendar, FileText, Video, Zap, Bookmark, CheckSquare, Square, Download } from 'lucide-react'
import { dbService } from '@/lib/database'
import { toast } from 'sonner'

interface SavedItem {
  id: string
  type: 'idea' | 'post' | 'script' | 'plan'
  title: string
  createdAt: string
  status: 'draft' | 'ready' | 'published' | 'posted'
  content?: {
    captions?: string[]
    hashtags?: string[]
    postIdeas?: string[]
    imagePrompt?: string
  }
  script?: {
    title: string
    scenes: any[]
    duration: string
    platform: string
  }
  plan?: {
    days: number
    platform: string
    content: any[]
  }
  tags?: string[]
}

export default function SavedContent() {
  const [user, setUser] = useState<any>(null)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load user and saved items from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await dbService.getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          await loadSavedItems()
        } else {
          setSavedItems([])
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load saved content')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const loadSavedItems = async () => {
    if (!user) return

    try {
      const items = await dbService.getContentItems(user.id)
      setSavedItems(items.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        createdAt: item.created_at,
        status: item.status,
        content: item.metadata?.content,
        script: item.metadata?.script,
        plan: item.metadata?.plan
      })))
    } catch (error) {
      console.error('Error loading saved items:', error)
      toast.error('Failed to load saved items')
    }
        const sampleItems: SavedItem[] = [
          {
            id: '1',
            type: 'post',
            title: 'CCTV Security System Promotion',
            createdAt: new Date().toISOString(),
            status: 'ready',
            content: {
              captions: ['🏠 SECURE YOUR WORLD 🏠\n\nAdvanced CCTV solutions for homes & businesses from Roshanal Infotech.\n\n#CCTV #HomeSecurity'],
              hashtags: ['#CCTV', '#HomeSecurity', '#SecuritySystems', '#RoshanalInfotech'],
              imagePrompt: 'Modern CCTV camera installation in Port Harcourt business with professional technician'
            },
            tags: ['security', 'cctv', 'business']
          },
          {
            id: '2',
            type: 'idea',
            title: 'Trending: AI-Powered CCTV Analytics',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'draft',
            content: {
              captions: ['🤖 AI-powered CCTV systems are revolutionizing security! Detect suspicious behavior automatically with our Hikvision cameras.'],
              hashtags: ['#AI', '#CCTV', '#SmartSecurity', '#Hikvision'],
              imagePrompt: 'Futuristic CCTV analytics dashboard showing security alerts and AI detection'
            },
            tags: ['ai', 'trending', 'security']
          },
          {
            id: '3',
            type: 'script',
            title: 'Outboard Engine Product Demo',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            status: 'ready',
            script: {
              title: 'Suzuki Outboard Engine Demo',
              scenes: [
                { scene: 1, duration_seconds: 8, visual: 'Engine showcase with smooth camera movement', voiceover: 'Introducing the powerful Suzuki outboard engine', text_overlay: 'Suzuki 4-Stroke' },
                { scene: 2, duration_seconds: 6, visual: 'Engine in water demonstration', voiceover: 'Experience unmatched performance and reliability', text_overlay: 'Maximum Power' }
              ],
              duration: '30s',
              platform: 'Instagram Reels'
            },
            tags: ['marine', 'outboard', 'suzuki']
          },
          {
            id: '4',
            type: 'plan',
            title: '7-Day Marine Safety Campaign',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            status: 'published',
            plan: {
              days: 7,
              platform: 'Instagram',
              content: [
                { day: 1, title: 'Life Jackets Introduction', status: 'posted' },
                { day: 2, title: 'Safety Equipment Guide', status: 'posted' },
                { day: 3, title: 'Customer Safety Stories', status: 'posted' }
              ]
            },
            tags: ['campaign', 'marine', 'safety']
          }
        ]
        setSavedItems(sampleItems)
        localStorage.setItem('roshanal_saved_content', JSON.stringify(sampleItems))
      }
    } catch (error) {
      console.error('Error loading saved items:', error)
    }
  }

  const filteredItems = savedItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const success = await dbService.deleteContentItem(id)
      if (success) {
        setSavedItems(prev => prev.filter(item => item.id !== id))
        toast.success('Item deleted successfully')
      } else {
        toast.error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleBulkDelete = async () => {
    try {
      let successCount = 0
      for (const id of selectedItems) {
        const success = await dbService.deleteContentItem(id)
        if (success) successCount++
      }

      if (successCount > 0) {
        setSavedItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
        setSelectedItems([])
        toast.success(`Deleted ${successCount} items successfully`)
      } else {
        toast.error('Failed to delete items')
      }
    } catch (error) {
      console.error('Error bulk deleting items:', error)
      toast.error('Failed to delete items')
    }
  }

  const handleCopy = async (content: any, type: string) => {
    try {
      let textToCopy = ''

      if (type === 'post' && content.captions && content.captions[0]) {
        textToCopy = content.captions[0]
      } else if (type === 'idea' && content.captions && content.captions[0]) {
        textToCopy = content.captions[0]
      } else if (type === 'script' && content.title) {
        textToCopy = content.title
      }

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy)
        // Could add toast notification here
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(savedItems, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `roshanal_saved_content_${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'idea': return <Zap className="w-5 h-5 text-yellow-500" />
      case 'post': return <FileText className="w-5 h-5 text-blue-500" />
      case 'script': return <Video className="w-5 h-5 text-purple-500" />
      case 'plan': return <Calendar className="w-5 h-5 text-green-500" />
      default: return <Bookmark className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-blue-100 text-blue-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'posted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Saved Content</h1>
        <p className="text-gray-600">Manage your saved ideas, posts, scripts, and content plans</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            {selectedItems.length > 0 && (
              <Button variant="outline" onClick={handleBulkDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {[
            { key: 'all', label: 'All Items', count: savedItems.length },
            { key: 'idea', label: 'Ideas', count: savedItems.filter(i => i.type === 'idea').length },
            { key: 'post', label: 'Posts', count: savedItems.filter(i => i.type === 'post').length },
            { key: 'script', label: 'Scripts', count: savedItems.filter(i => i.type === 'script').length },
            { key: 'plan', label: 'Plans', count: savedItems.filter(i => i.type === 'plan').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                filter === key
                  ? 'bg-roshanal-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                Clear Selection
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved items found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `No items match "${searchQuery}"`
              : filter !== 'all'
                ? `No ${filter} items saved yet`
                : 'Start creating content to see it here!'
            }
          </p>
            <Button>Create Your First Content</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              {/* Header with checkbox and type icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className="mr-3 text-gray-400 hover:text-gray-600"
                  >
                    {selectedItems.includes(item.id) ? (
                      <CheckSquare className="w-5 h-5 text-roshanal-blue" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex items-center">
                    {getTypeIcon(item.type)}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title and Date */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()} • {item.type}
                </p>
              </div>

              {/* Content Preview based on type */}
              {item.type === 'post' && item.content && (
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {item.content.captions?.[0] || 'No caption available'}
                    </p>
                  </div>
                  {item.content.hashtags && item.content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.content.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {hashtag}
                        </span>
                      ))}
                      {item.content.hashtags.length > 3 && (
                        <span className="text-xs text-gray-500">+{item.content.hashtags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {item.type === 'idea' && item.content && (
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {item.content.captions?.[0] || 'No description available'}
                    </p>
                  </div>
                  {item.tags && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {item.type === 'script' && item.script && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.script.platform}</span>
                    <span className="text-gray-600">{item.script.duration}</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {item.script.scenes?.length || 0} scenes • Professional script
                  </div>
                </div>
              )}

              {item.type === 'plan' && item.plan && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.plan.days} days</span>
                    <span className="text-gray-600">{item.plan.platform}</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {item.plan.content?.length || 0} content pieces planned
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(item.content || item.script || item.plan, item.type)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <Card className="mt-8 bg-gradient-to-r from-roshanal-navy to-roshanal-blue text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Your Content Library</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{savedItems.length}</div>
              <div className="text-sm opacity-90">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{savedItems.filter(i => i.status === 'ready').length}</div>
              <div className="text-sm opacity-90">Ready to Post</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{savedItems.filter(i => i.status === 'published').length}</div>
              <div className="text-sm opacity-90">Published</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{savedItems.filter(i => i.type === 'plan').length}</div>
              <div className="text-sm opacity-90">Content Plans</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
