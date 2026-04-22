'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon,
  Wand2,
  Download,
  Share,
  Copy,
  Refresh,
  Sparkles,
  Palette,
  Maximize,
  Heart,
  Star
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  size: string
  created_at: string
}

export default function ImageAIPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'favorites'>('generate')
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Generation form
  const [generationForm, setGenerationForm] = useState({
    prompt: '',
    style: 'realistic' as 'realistic' | 'artistic' | 'cartoon' | 'minimal' | 'photorealistic',
    size: 'square' as 'square' | 'portrait' | 'landscape',
    count: 1
  })

  useEffect(() => {
    if (activeTab === 'gallery' || activeTab === 'favorites') {
      fetchImages()
    }
    loadFavorites()
  }, [activeTab])

  const fetchImages = async () => {
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
        .from('ai_generated_images')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Flatten the images array from all records
      const allImages = data?.flatMap(record =>
        record.images?.map((img: any) => ({
          ...img,
          recordId: record.id
        })) || []
      ) || []

      setGeneratedImages(allImages)
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('ai_image_favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites)
    localStorage.setItem('ai_image_favorites', JSON.stringify(newFavorites))
  }

  const generateImages = async () => {
    if (!generationForm.prompt.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generationForm)
      })

      if (!response.ok) {
        throw new Error('Failed to generate images')
      }

      const { images } = await response.json()

      // Add new images to the gallery
      setGeneratedImages(prev => [...images, ...prev])
      setActiveTab('gallery')

      // Reset form
      setGenerationForm(prev => ({
        ...prev,
        prompt: ''
      }))

    } catch (error) {
      console.error('Error generating images:', error)
      alert('Failed to generate images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Failed to download image')
    }
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  const toggleFavorite = (imageId: string) => {
    const newFavorites = favorites.includes(imageId)
      ? favorites.filter(id => id !== imageId)
      : [...favorites, imageId]

    saveFavorites(newFavorites)
  }

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'realistic': return '🎨'
      case 'artistic': return '🖼️'
      case 'cartoon': return '🎭'
      case 'minimal': return '⚪'
      case 'photorealistic': return '📸'
      default: return '🎨'
    }
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'square': return '1:1 Square'
      case 'portrait': return '2:3 Portrait'
      case 'landscape': return '3:2 Landscape'
      default: return size
    }
  }

  const filteredImages = activeTab === 'favorites'
    ? generatedImages.filter(img => favorites.includes(img.id))
    : generatedImages

  const tabs = [
    { id: 'generate', name: 'Generate', icon: Wand2 },
    { id: 'gallery', name: 'Gallery', icon: ImageIcon },
    { id: 'favorites', name: 'Favorites', icon: Heart }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Image Generation</h1>
          <p className="text-gray-300">Create stunning visuals for your marketing campaigns with AI</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Images
          </Button>
        </div>
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

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Generate AI Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe Your Image
                </label>
                <textarea
                  value={generationForm.prompt}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="A professional headshot of a young entrepreneur in a modern office, smiling at the camera, with natural lighting..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[120px] resize-none"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Be specific about style, lighting, colors, and composition for best results
                </p>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Art Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'realistic', label: 'Realistic', desc: 'Photorealistic images' },
                    { id: 'artistic', label: 'Artistic', desc: 'Creative artistic style' },
                    { id: 'cartoon', label: 'Cartoon', desc: 'Fun cartoon style' },
                    { id: 'minimal', label: 'Minimal', desc: 'Clean minimal design' },
                    { id: 'photorealistic', label: 'Photo', desc: 'Professional photography' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setGenerationForm(prev => ({ ...prev, style: style.id as any }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        generationForm.style === style.id
                          ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                          : 'border-gray-600 hover:border-[#00F5FF]/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{getStyleIcon(style.id)}</div>
                      <div className={`text-sm font-medium ${generationForm.style === style.id ? 'text-[#00F5FF]' : 'text-gray-300'}`}>
                        {style.label}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size and Count */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Size
                  </label>
                  <select
                    value={generationForm.size}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, size: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="square">Square (1:1) - Perfect for social media</option>
                    <option value="portrait">Portrait (2:3) - Great for stories</option>
                    <option value="landscape">Landscape (3:2) - Ideal for banners</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Images
                  </label>
                  <select
                    value={generationForm.count}
                    onChange={(e) => setGenerationForm(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value={1}>1 Image</option>
                    <option value={2}>2 Images</option>
                    <option value={3}>3 Images</option>
                    <option value={4}>4 Images</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={generateImages}
                  disabled={!generationForm.prompt.trim() || loading}
                  className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-8 py-3 text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Refresh className="w-5 h-5 mr-3 animate-spin" />
                      Generating Images...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-3" />
                      Generate {generationForm.count} Image{generationForm.count > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gray-700/50 rounded-lg">
                <h3 className="text-white font-medium mb-4">Preview Settings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Style:</span>
                    <div className="text-white">{generationForm.style}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <div className="text-white">{getSizeLabel(generationForm.size)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Count:</span>
                    <div className="text-white">{generationForm.count}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Credits:</span>
                    <div className="text-[#00F5FF]">{generationForm.count * 2} credits</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Tab */}
      {(activeTab === 'gallery' || activeTab === 'favorites') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {activeTab === 'favorites' ? 'Favorite Images' : 'Generated Images'}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Refresh className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        onClick={() => downloadImage(image.url, `ai-image-${image.id}.png`)}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => copyImageUrl(image.url)}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => toggleFavorite(image.id)}
                        size="sm"
                        className={`${
                          favorites.includes(image.id)
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-white/20 hover:bg-white/30'
                        } text-white`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(image.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {image.style}
                      </Badge>
                      <Badge className="bg-gray-500/20 text-gray-400">
                        {image.size}
                      </Badge>
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {image.prompt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(image.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {activeTab === 'favorites' ? 'No favorite images yet' : 'No images generated yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'favorites'
                  ? 'Images you mark as favorite will appear here'
                  : 'Generate your first AI images to see them here'
                }
              </p>
              {activeTab === 'gallery' && (
                <Button onClick={() => setActiveTab('generate')} className="bg-blue-600 hover:bg-blue-700">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Images
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}