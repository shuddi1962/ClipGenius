'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function ContentGenerator() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: '',
    products: '',
    targetAudience: '',
    brandVoice: '',
    keyMessage: '',
    platform: 'instagram',
    contentType: 'carousel',
    duration: '7',
    goals: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., Roshanal Infotech Limited"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select industry</option>
                    <option value="marine">Marine & Boat Equipment</option>
                    <option value="safety">Safety & Security</option>
                    <option value="technology">Technology Solutions</option>
                    <option value="energy">Power & Energy</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="food">Food & Beverage</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select business type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="service">Service Provider</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Boat owners, Fishermen, Businesses"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products/Services
                </label>
                <textarea
                  value={formData.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  placeholder="Describe your main products/services..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Brand & Content Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Voice
                  </label>
                  <select
                    value={formData.brandVoice}
                    onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select voice</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Message
                  </label>
                  <input
                    type="text"
                    value={formData.keyMessage}
                    onChange={(e) => handleInputChange('keyMessage', e.target.value)}
                    placeholder="e.g., Safety First, Always"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="all">All Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => handleInputChange('contentType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="carousel">Image Carousel</option>
                    <option value="video">Video Content</option>
                    <option value="mixed">Mixed Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Goals (Optional)
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="e.g., Increase brand awareness, drive sales, educate customers..."
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGenerate}
                  disabled={!formData.businessName || !formData.industry || !formData.products || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Generating Content Plan...' : 'Generate Content Plan'}
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {generatedContent && (
              <>
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 {formData.duration}-Day Content Calendar</h3>
                  <p className="text-gray-600 mb-4">
                    Complete social media strategy for {formData.businessName} targeting {formData.platform}
                  </p>

                  <div className="space-y-4">
                    {generatedContent.calendar?.map((day: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-indigo-600">
                            Day {day.day}: {day.theme}
                          </h4>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                            {day.platform}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Content Type</h5>
                            <p className="text-sm text-gray-600">{day.contentType}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Best Posting Time</h5>
                            <p className="text-sm text-gray-600">{day.postingTime}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Caption</h5>
                          <div className="p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                            <p className="text-gray-900 whitespace-pre-line">{day.caption}</p>
                          </div>
                        </div>

                        {day.voiceover && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">🎵 Voiceover Script</h5>
                            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                              <p className="text-gray-900 whitespace-pre-line">{day.voiceover}</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Hashtags</h5>
                          <div className="flex flex-wrap gap-2">
                            {day.hashtags?.map((hashtag: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {day.visualSuggestions && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">📸 Visual Suggestions</h5>
                            <p className="text-sm text-gray-600">{day.visualSuggestions}</p>
                          </div>
                        )}

                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">🎯 Call-to-Action</h5>
                          <p className="text-sm text-gray-600">{day.cta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {generatedContent.summary && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Content Strategy Summary</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">{generatedContent.summary.totalPosts}</div>
                          <div className="text-sm text-gray-600">Total Posts</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">{generatedContent.summary.educationalPosts}</div>
                          <div className="text-sm text-gray-600">Educational</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-2xl font-bold text-purple-600">{generatedContent.summary.promotionalPosts}</div>
                          <div className="text-sm text-gray-600">Promotional</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-2xl font-bold text-orange-600">{generatedContent.summary.interactivePosts}</div>
                          <div className="text-sm text-gray-600">Interactive</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Content Creation Guide</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tools Recommended:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li><strong>Canva:</strong> Free design tool for carousels and graphics</li>
                        <li><strong>CapCut:</strong> Free video editor for TikTok/Reels</li>
                        <li><strong>Buffer/Later:</strong> Social media scheduling</li>
                        <li><strong>Phone Camera:</strong> High-quality product photos</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Post consistently at optimal times</li>
                        <li>Use high-quality, well-lit photos</li>
                        <li>Include relevant hashtags (5-10 per post)</li>
                        <li>Always add clear call-to-actions</li>
                        <li>Engage with comments within 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="secondary">Save Content Plan</Button>
                  <Button variant="outline">Download as PDF</Button>
                  <Button variant="outline">Export to CSV</Button>
                  <Button variant="outline">Share Plan</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}