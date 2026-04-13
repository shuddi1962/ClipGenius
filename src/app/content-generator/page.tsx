'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function ContentGenerator() {
  const [businessType, setBusinessType] = useState('')
  const [product, setProduct] = useState('')
  const [audience, setAudience] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType,
          product,
          audience,
        }),
      })
      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
          <p className="text-gray-600">Generate marketing content, captions, and post ideas</p>
        </div>

        <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select business type</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="food">Food & Beverage</option>
                  <option value="retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product/Service
                </label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g., Premium coffee beans"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Coffee lovers aged 25-45"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!businessType || !product || !audience || isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            {generatedContent && (
              <>
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Captions</h3>
                  <div className="space-y-3">
                    {generatedContent.captions?.map((caption: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                        <p className="text-gray-900">{caption}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags?.map((hashtag: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Ideas</h3>
                  <div className="space-y-3">
                    {generatedContent.postIdeas?.map((idea: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <p className="text-gray-900">{idea}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="secondary">Save as Draft</Button>
                  <Button variant="outline">Download</Button>
                  <Button variant="outline">Share</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}