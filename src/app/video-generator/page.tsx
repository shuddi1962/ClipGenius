'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function VideoGenerator() {
  const [script, setScript] = useState('')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script || undefined,
          prompt: prompt || undefined,
          style,
          duration: 30,
        }),
      })
      const data = await response.json()
      setGeneratedVideo(data.videoUrl)
    } catch (error) {
      console.error('Error generating video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Video Generator</h1>
          <p className="text-gray-600">Create promotional videos with AI-powered Kie.ai</p>
        </div>

        <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Video Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Script (Optional)
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter your video script or leave empty to use prompt"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Prompt (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want the video to show"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select style</option>
                  <option value="promo">Promotional</option>
                  <option value="luxury">Luxury</option>
                  <option value="bold">Bold</option>
                  <option value="minimal">Minimal</option>
                  <option value="vibrant">Vibrant</option>
                </select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!style || isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating Video...' : 'Generate Video'}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            {generatedVideo && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Video</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary">Save as Draft</Button>
                  <Button variant="outline">Download</Button>
                  <Button variant="outline">Share</Button>
                </div>
              </Card>
            )}

            {!generatedVideo && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <p className="text-gray-600">Your generated video will appear here</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}