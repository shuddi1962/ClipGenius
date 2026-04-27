'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Code,
  Copy,
  Settings,
  Eye,
  BarChart3,
  TrendingUp,
  Share,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface ReviewWidget {
  id: string
  name: string
  type: 'badge' | 'carousel' | 'grid' | 'popup'
  theme: 'light' | 'dark' | 'auto'
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  size: 'small' | 'medium' | 'large'
  showRating: boolean
  showCount: boolean
  isActive: boolean
  embedCode: string
  created_at: string
}

export default function ReviewWidgetPage() {
  const [activeTab, setActiveTab] = useState<'widgets' | 'create' | 'analytics' | 'settings'>('widgets')
  const [widgets, setWidgets] = useState<ReviewWidget[]>([])
  const [loading, setLoading] = useState(true)

  // New widget form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newWidget, setNewWidget] = useState({
    name: '',
    type: 'badge' as ReviewWidget['type'],
    theme: 'light' as ReviewWidget['theme'],
    position: 'bottom-right' as ReviewWidget['position'],
    size: 'medium' as ReviewWidget['size'],
    showRating: true,
    showCount: true
  })

  useEffect(() => {
    if (activeTab === 'widgets' || activeTab === 'analytics') {
      fetchWidgets()
    }
  }, [activeTab])

  const fetchWidgets = async () => {
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
        .from('review_widgets')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWidgets(data || [])
    } catch (error) {
      console.error('Error fetching widgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWidget = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Generate embed code
      const widgetId = `widget_${Date.now()}`
      const embedCode = generateEmbedCode(widgetId, newWidget)

      const { error } = await insforge
        .from('review_widgets')
        .insert({
          workspace_id: workspace.id,
          name: newWidget.name,
          type: newWidget.type,
          theme: newWidget.theme,
          position: newWidget.position,
          size: newWidget.size,
          show_rating: newWidget.showRating,
          show_count: newWidget.showCount,
          is_active: true,
          embed_code: embedCode
        })

      if (error) throw error

      alert('Review widget created successfully!')
      setShowNewForm(false)
      setNewWidget({
        name: '',
        type: 'badge',
        theme: 'light',
        position: 'bottom-right',
        size: 'medium',
        showRating: true,
        showCount: true
      })
      fetchWidgets()
    } catch (error) {
      console.error('Error creating widget:', error)
      alert('Failed to create review widget')
    }
  }

  const generateEmbedCode = (widgetId: string, config: typeof newWidget): string => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `<script src="${baseUrl}/widgets/reviews.js"></script>
<div id="clipgenius-reviews-${widgetId}"
     data-type="${config.type}"
     data-theme="${config.theme}"
     data-position="${config.position}"
     data-size="${config.size}"
     data-show-rating="${config.showRating}"
     data-show-count="${config.showCount}">
</div>`
  }

  const copyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Embed code copied to clipboard!')
  }

  const updateWidgetStatus = async (widgetId: string, isActive: boolean) => {
    try {
      const { error } = await insforge
        .from('review_widgets')
        .update({ is_active: isActive })
        .eq('id', widgetId)

      if (error) throw error

      setWidgets(widgets.map(widget =>
        widget.id === widgetId ? { ...widget, isActive } : widget
      ))
    } catch (error) {
      console.error('Error updating widget:', error)
      alert('Failed to update widget status')
    }
  }

  const deleteWidget = async (widgetId: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) return

    try {
      const { error } = await insforge
        .from('review_widgets')
        .delete()
        .eq('id', widgetId)

      if (error) throw error

      setWidgets(widgets.filter(widget => widget.id !== widgetId))
    } catch (error) {
      console.error('Error deleting widget:', error)
      alert('Failed to delete widget')
    }
  }

  const getWidgetTypeIcon = (type: string) => {
    switch (type) {
      case 'badge': return <Badge className="w-4 h-4" />
      case 'carousel': return <Eye className="w-4 h-4" />
      case 'grid': return <Monitor className="w-4 h-4" />
      case 'popup': return <Smartphone className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const tabs = [
    { id: 'widgets', name: 'Widgets', icon: Star },
    { id: 'create', name: 'Create Widget', icon: Code },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Review Widgets</h1>
          <p className="text-gray-300">Create and manage review widgets for your website</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Code className="w-4 h-4 mr-2" />
          Create Widget
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Widgets Tab */}
      {activeTab === 'widgets' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{widget.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-blue-500/20 text-blue-400 capitalize">
                        {widget.type}
                      </Badge>
                      <Badge className={`${
                        widget.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {widget.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {getWidgetTypeIcon(widget.type)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Theme: <span className="text-white capitalize">{widget.theme}</span> |
                    Size: <span className="text-white capitalize">{widget.size}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Position: <span className="text-white capitalize">{widget.position.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-3 h-3" />
                    {widget.showRating ? 'Shows Rating' : 'Rating Hidden'}
                    {widget.showCount && ' | Shows Count'}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => copyEmbedCode(widget.embedCode)}
                      size="sm"
                      className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black flex-1"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                    <Button
                      onClick={() => updateWidgetStatus(widget.id, !widget.isActive)}
                      size="sm"
                      variant="outline"
                      className={`border-gray-600 ${widget.isActive ? 'text-red-400 hover:bg-red-600' : 'text-green-400 hover:bg-green-600'}`}
                    >
                      {widget.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      onClick={() => deleteWidget(widget.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {widgets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No review widgets yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first review widget to display customer testimonials on your website
              </p>
              <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Code className="w-4 h-4 mr-2" />
                Create Your First Widget
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Widget Tab */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Create Review Widget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Widget Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Widget Name
                </label>
                <Input
                  value={newWidget.name}
                  onChange={(e) => setNewWidget(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Homepage Review Badge"
                />
              </div>

              {/* Widget Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Widget Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'badge', label: 'Badge', desc: 'Simple rating badge', icon: Badge },
                    { id: 'carousel', label: 'Carousel', desc: 'Rotating reviews', icon: Eye },
                    { id: 'grid', label: 'Grid', desc: 'Review grid layout', icon: Monitor },
                    { id: 'popup', label: 'Popup', desc: 'Modal popup reviews', icon: Smartphone }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewWidget(prev => ({ ...prev, type: type.id as ReviewWidget['type'] }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        newWidget.type === type.id
                          ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                          : 'border-gray-600 hover:border-[#00F5FF]/50'
                      }`}
                    >
                      <type.icon className="w-6 h-6 mb-2 text-[#00F5FF]" />
                      <div className={`text-sm font-medium ${newWidget.type === type.id ? 'text-[#00F5FF]' : 'text-gray-300'}`}>
                        {type.label}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration Options */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={newWidget.theme}
                    onChange={(e) => setNewWidget(prev => ({ ...prev, theme: e.target.value as ReviewWidget['theme'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                    <option value="auto">Auto (follows site)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size
                  </label>
                  <select
                    value={newWidget.size}
                    onChange={(e) => setNewWidget(prev => ({ ...prev, size: e.target.value as ReviewWidget['size'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {newWidget.type === 'badge' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position
                    </label>
                    <select
                      value={newWidget.position}
                      onChange={(e) => setNewWidget(prev => ({ ...prev, position: e.target.value as ReviewWidget['position'] }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Display Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Display Options
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newWidget.showRating}
                      onChange={(e) => setNewWidget(prev => ({ ...prev, showRating: e.target.checked }))}
                      className="rounded border-gray-500 text-[#00F5FF] focus:ring-[#00F5FF]"
                    />
                    <label className="text-gray-300 text-sm">Show star rating</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newWidget.showCount}
                      onChange={(e) => setNewWidget(prev => ({ ...prev, showCount: e.target.checked }))}
                      className="rounded border-gray-500 text-[#00F5FF] focus:ring-[#00F5FF]"
                    />
                    <label className="text-gray-300 text-sm">Show review count</label>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preview
                </label>
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                    <div className="text-white font-medium">4.8 out of 5</div>
                    <div className="text-gray-400 text-sm">Based on 247 reviews</div>
                    <div className="mt-4 text-xs text-gray-500">
                      Widget Type: {newWidget.type} | Theme: {newWidget.theme} | Size: {newWidget.size}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('widgets')}
                >
                  Cancel
                </Button>
                <Button onClick={createWidget} disabled={!newWidget.name} className="bg-blue-600 hover:bg-blue-700">
                  <Code className="w-4 h-4 mr-2" />
                  Create Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Widget Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Total Views</div>
                    <div className="text-gray-400 text-sm">Widget impressions</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00F5FF]">12,847</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Click-through Rate</div>
                    <div className="text-gray-400 text-sm">Widget interactions</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">3.2%</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Review Requests</div>
                    <div className="text-gray-400 text-sm">From widget interactions</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">156</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Widget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Widget usage analytics</p>
                  <p className="text-sm mt-2">Shows which widgets perform best</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Widget Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Global Widget Code
                </label>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <code className="text-green-400 text-sm">
                    {`<script src="https://clipgenius.com/widgets/reviews.js"></script>`}
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Include this script once on your website, then use individual widget codes
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Theme
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Review Display Limit
                  </label>
                  <Input
                    type="number"
                    defaultValue="10"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Moderation Settings
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <label className="text-gray-300 text-sm">Auto-approve 5-star reviews</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <label className="text-gray-300 text-sm">Require email verification</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <label className="text-gray-300 text-sm">Enable review responses</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}