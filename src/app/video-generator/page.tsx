'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Video, Play, Download, Share, Wand2, Settings, Clock } from 'lucide-react'

export default function VideoGenerator() {
  const [formData, setFormData] = useState({
    script: '',
    prompt: '',
    style: 'promo',
    duration: '30',
    platform: 'instagram'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setGeneratedVideo(data.videoUrl || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4')
    } catch (error) {
      console.error('Error generating video:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const videoStyles = [
    { id: 'promo', name: 'Promotional', description: 'Sales-focused with strong CTAs' },
    { id: 'luxury', name: 'Luxury', description: 'Elegant and sophisticated' },
    { id: 'bold', name: 'Bold', description: 'High-energy and dynamic' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
    { id: 'vibrant', name: 'Vibrant', description: 'Colorful and energetic' }
  ]

  const platforms = [
    { id: 'instagram', name: 'Instagram Reels', size: '9:16', duration: '15-90s' },
    { id: 'tiktok', name: 'TikTok', size: '9:16', duration: '15-180s' },
    { id: 'youtube', name: 'YouTube Shorts', size: '9:16', duration: '15-60s' },
    { id: 'facebook', name: 'Facebook Video', size: '16:9', duration: '30-300s' },
    { id: 'linkedin', name: 'LinkedIn Video', size: '16:9', duration: '30-600s' }
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Video Generator</h1>
        <p className="text-gray-600">Create professional videos with AI-powered scripting and editing</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Generation Form */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Your Video</h2>
            <p className="text-gray-600 text-sm">Fill in the details to generate your AI video</p>
          </div>

          <div className="space-y-6">
            {/* Script Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Script (Optional)
              </label>
              <textarea
                value={formData.script}
                onChange={(e) => handleInputChange('script', e.target.value)}
                placeholder="Enter your video script, or leave empty to use AI prompt..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">AI will generate a script if you leave this empty</p>
            </div>

            {/* AI Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Prompt (Optional)
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="Describe what you want the video to show..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleInputChange('platform', platform.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      formData.platform === platform.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{platform.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {platform.size} • {platform.duration}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleInputChange('style', style.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      formData.style === style.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">2 minutes</option>
              </select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!formData.script && !formData.prompt)}
              className="w-full"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Video...
                </div>
              ) : (
                <div className="flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Video
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Video Preview */}
        <div className="space-y-6">
          {generatedVideo ? (
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Generated Video</h2>
                <p className="text-gray-600 text-sm">Your AI-generated video is ready!</p>
              </div>

              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full h-full object-cover"
                  poster="/video-placeholder.jpg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Video Generated Yet</h3>
                <p className="text-gray-500 mb-6">
                  Fill out the form and click "Generate Video" to create your AI-powered promotional video
                </p>

                {/* Video Specs */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Video Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Platform:</span>
                      <span className="ml-2 font-medium">
                        {platforms.find(p => p.id === formData.platform)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Style:</span>
                      <span className="ml-2 font-medium">
                        {videoStyles.find(s => s.id === formData.style)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 font-medium">{formData.duration}s</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Script:</span>
                      <span className="ml-2 font-medium">
                        {formData.script ? 'Provided' : 'AI Generated'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tips Card */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start">
              <Settings className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pro Tips for Better Videos</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Be specific in your prompt for better results</li>
                  <li>• Include your brand colors and style preferences</li>
                  <li>• Test different durations for optimal engagement</li>
                  <li>• Use trending topics and current events</li>
                  <li>• Include clear calls-to-action in your script</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}