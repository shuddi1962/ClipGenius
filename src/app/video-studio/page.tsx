'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Play, Pause, Volume2, VolumeX, Download, Share, Copy, Save, Zap, Film, Music, Type } from 'lucide-react'

interface Scene {
  scene: number
  duration_seconds: number
  visual: string
  voiceover: string
  text_overlay: string
}

interface VideoScript {
  title: string
  duration: string
  hook: string
  scenes: Scene[]
  cta: string
  caption: string
  hashtags: string[]
  music_mood: string
}

export default function VideoStudio() {
  const [videoType, setVideoType] = useState('product_demo')
  const [platform, setPlatform] = useState('instagram_reels')
  const [product, setProduct] = useState('')
  const [energyLevel, setEnergyLevel] = useState('energetic_bold')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null)
  const [currentScene, setCurrentScene] = useState(0)

  const videoTypes = [
    { value: 'product_demo', label: 'Product Demo', description: 'Showcase product features and benefits' },
    { value: 'how_to_tutorial', label: 'How-To Tutorial', description: 'Step-by-step instructional content' },
    { value: 'customer_testimonial', label: 'Customer Testimonial', description: 'Client success stories and reviews' },
    { value: 'brand_story', label: 'Brand Story', description: 'Company narrative and values' },
    { value: 'promo_offer', label: 'Promo/Offer', description: 'Limited-time deals and promotions' },
    { value: 'educational', label: 'Educational', description: 'Industry knowledge and tips' }
  ]

  const platforms = [
    { value: 'instagram_reels', label: 'Instagram Reels', duration: '30s/60s', icon: '📸' },
    { value: 'tiktok', label: 'TikTok', duration: '60s', icon: '🎵' },
    { value: 'youtube_shorts', label: 'YouTube Shorts', duration: '60s', icon: '📺' },
    { value: 'whatsapp_status', label: 'WhatsApp Status', duration: '30s', icon: '💬' }
  ]

  const energyLevels = [
    { value: 'calm_professional', label: 'Calm & Professional', description: 'Corporate, trustworthy tone' },
    { value: 'energetic_bold', label: 'Energetic & Bold', description: 'Dynamic, attention-grabbing' },
    { value: 'storytelling', label: 'Storytelling', description: 'Narrative, emotional connection' }
  ]

  const generateVideoScript = async () => {
    setIsGenerating(true)
    try {
      // Mock AI-generated video script - replace with actual API call
      const mockScript: VideoScript = {
        title: `${product} - Professional ${videoTypes.find(t => t.value === videoType)?.label}`,
        duration: platforms.find(p => p.value === platform)?.duration || '30s',
        hook: generateHook(videoType, product),
        scenes: generateScenes(videoType, product, platform),
        cta: generateCTA(videoType, product),
        caption: generateCaption(videoType, product),
        hashtags: generateHashtags(videoType, product),
        music_mood: energyLevels.find(e => e.value === energyLevel)?.description || 'Energetic corporate'
      }

      setGeneratedScript(mockScript)
    } catch (error) {
      console.error('Error generating video script:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateHook = (type: string, product: string): string => {
    const hooks = {
      product_demo: `✨ Discover the power of ${product}! ✨`,
      how_to_tutorial: `🚀 Master ${product} in seconds!`,
      customer_testimonial: `"${product} changed everything for me!"`,
      brand_story: `Behind the scenes: The ${product} revolution`,
      promo_offer: `⚡ FLASH SALE: ${product} at unbeatable prices!`,
      educational: `Did you know? ${product} secrets revealed!`
    }
    return hooks[type as keyof typeof hooks] || `Experience ${product} like never before!`
  }

  const generateScenes = (type: string, product: string, platform: string): Scene[] => {
    const baseDuration = platform.includes('whatsapp') ? 5 : platform.includes('tiktok') || platform.includes('youtube') ? 8 : 6

    const sceneTemplates = {
      product_demo: [
        { visual: `Close-up shot of ${product} with smooth camera movement`, voiceover: `Introducing the revolutionary ${product} - designed for excellence`, text_overlay: product },
        { visual: `Product in use demonstration with satisfied user`, voiceover: `Experience unmatched performance and reliability`, text_overlay: 'Premium Quality' },
        { visual: `Feature highlights with graphics and effects`, voiceover: `Advanced features that set it apart from the competition`, text_overlay: 'Key Features' },
        { visual: `Customer testimonial with product in background`, voiceover: `Trusted by professionals worldwide`, text_overlay: 'Customer Approved' }
      ],
      how_to_tutorial: [
        { visual: `Step-by-step process demonstration`, voiceover: `Follow these simple steps to master ${product}`, text_overlay: 'Step 1' },
        { visual: `Common mistakes and how to avoid them`, voiceover: `Avoid these common pitfalls for best results`, text_overlay: 'Pro Tips' },
        { visual: `Before and after comparison`, voiceover: `See the transformation in action`, text_overlay: 'Before → After' },
        { visual: `Expert tips and advanced techniques`, voiceover: `Take your skills to the next level`, text_overlay: 'Expert Advice' }
      ],
      customer_testimonial: [
        { visual: `Happy customer using ${product} in real environment`, voiceover: `Hear directly from our satisfied customers`, text_overlay: 'Real Stories' },
        { visual: `Product benefits demonstration`, voiceover: `See how ${product} solves real problems`, text_overlay: 'Real Results' },
        { visual: `Customer journey and transformation`, voiceover: `From challenge to solution with ${product}`, text_overlay: 'Customer Journey' },
        { visual: `Call to action with social proof`, voiceover: `Join thousands of satisfied customers`, text_overlay: 'Join Today' }
      ]
    }

    const scenes = sceneTemplates[type as keyof typeof sceneTemplates] || sceneTemplates.product_demo
    return scenes.map((scene, index) => ({
      scene: index + 1,
      duration_seconds: baseDuration,
      ...scene
    }))
  }

  const generateCTA = (type: string, product: string): string => {
    const ctas = {
      product_demo: `Ready to experience ${product}? DM "DEMO" for a free trial! Visit roshanalinfotech.com`,
      how_to_tutorial: `Want the complete guide? DM "GUIDE" for exclusive tips! #LearnWithRoshanal`,
      customer_testimonial: `Ready for your success story? DM "START" today! #RoshanalSuccess`,
      brand_story: `Be part of our story! DM "JOIN" to learn more. #RoshanalFamily`,
      promo_offer: `⏰ Limited time offer! DM "OFFER" now before it's gone! #FlashSale`,
      educational: `Want to learn more? DM "LEARN" for exclusive insights! #RoshanalKnowledge`
    }
    return ctas[type as keyof typeof ctas] || `DM us today about ${product}! #RoshanalInfotech`
  }

  const generateCaption = (type: string, product: string): string => {
    const captions = {
      product_demo: `🚀 Just discovered the incredible ${product} from @roshanalinfotech! This game-changing solution delivers unmatched performance and reliability. Perfect for professionals who demand excellence.\n\n✨ Key Features:\n• Premium quality construction\n• Advanced technology\n• Reliable performance\n• Expert support\n\nReady to upgrade? DM "DEMO" for exclusive insights!\n\n#${product.replace(/\s+/g, '')} #RoshanalInfotech #ProfessionalEquipment #QualityMatters`,
      how_to_tutorial: `🎯 Master ${product} with this quick tutorial! Whether you're a beginner or looking to improve your skills, these expert tips will transform your approach.\n\n📋 What you'll learn:\n• Essential techniques\n• Common mistakes to avoid\n• Pro-level strategies\n• Time-saving shortcuts\n\nSave this post and DM "TUTORIAL" for the complete guide!\n\n#${product.replace(/\s+/g, '')} #HowTo #Tutorial #ExpertTips #RoshanalInfotech`,
      customer_testimonial: `🌟 Real results from real customers! "${product} exceeded all my expectations. The quality and performance are outstanding!" - Happy Customer\n\nAt Roshanal Infotech, we don't just sell products - we deliver solutions that transform businesses.\n\nReady for your success story? DM "QUOTE" for a personalized consultation!\n\n#CustomerSuccess #Testimonial #RoshanalInfotech #${product.replace(/\s+/g, '')} #QualityService`
    }
    return captions[type as keyof typeof captions] || `Discover the power of ${product} with Roshanal Infotech! #RoshanalInfotech #${product.replace(/\s+/g, '')}`
  }

  const generateHashtags = (type: string, product: string): string[] => {
    const baseHashtags = ['#RoshanalInfotech', '#PortHarcourt', '#QualityService', '#ProfessionalEquipment']
    const productHashtags = [`#${product.replace(/\s+/g, '')}`]

    const typeHashtags = {
      product_demo: ['#ProductDemo', '#Innovation', '#Technology', '#PremiumQuality'],
      how_to_tutorial: ['#Tutorial', '#HowTo', '#Learn', '#ExpertTips', '#Education'],
      customer_testimonial: ['#Testimonial', '#CustomerSuccess', '#HappyCustomers', '#RealResults'],
      brand_story: ['#BrandStory', '#CompanyCulture', '#BehindTheScenes', '#OurStory'],
      promo_offer: ['#FlashSale', '#LimitedTime', '#SpecialOffer', '#Deal'],
      educational: ['#Education', '#Knowledge', '#IndustryInsights', '#LearnSomethingNew']
    }

    return [...baseHashtags, ...productHashtags, ...(typeHashtags[type as keyof typeof typeHashtags] || [])].slice(0, 10)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roshanal-navy mb-2">Video Script Studio</h1>
        <p className="text-gray-600">Create engaging UGC video ads with professional scripts and scene breakdowns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Script Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">🎬 Video Script Generator</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Video Type
                </label>
                <div className="space-y-2">
                  {videoTypes.map((type) => (
                    <label key={type.value} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        value={type.value}
                        checked={videoType === type.value}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Platform & Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  >
                    {platforms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.icon} {p.label} ({p.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level
                  </label>
                  <select
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  >
                    {energyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Topic
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g., CCTV Security System, Outboard Engine, Solar Panels"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roshanal-blue focus:border-roshanal-blue"
                  />
                </div>

                <Button
                  onClick={generateVideoScript}
                  disabled={!product || isGenerating}
                  className="w-full bg-roshanal-navy hover:bg-roshanal-blue"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4 mr-2" />
                      Generate Video Script
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Generated Script Display */}
          {generatedScript && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{generatedScript.title}</h2>
                  <p className="text-gray-600">Duration: {generatedScript.duration} • Music: {generatedScript.music_mood}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </Button>
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save Script
                  </Button>
                </div>
              </div>

              {/* Hook */}
              <div className="mb-6 p-4 bg-gradient-to-r from-roshanal-blue to-roshanal-navy text-white rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Opening Hook (First 3 seconds)</h3>
                <p className="text-lg italic">"{generatedScript.hook}"</p>
              </div>

              {/* Scenes Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎬 Scene Breakdown</h3>
                <div className="space-y-4">
                  {generatedScript.scenes.map((scene, index) => (
                    <div key={scene.scene} className={`p-4 border rounded-lg ${currentScene === index ? 'border-roshanal-blue bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-roshanal-blue text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {scene.scene}
                          </span>
                          <span className="text-sm font-medium text-gray-500">{scene.duration_seconds}s</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setCurrentScene(index)}>
                            {currentScene === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">📹 Visual Description</h4>
                          <p className="text-sm text-gray-700">{scene.visual}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">🎙️ Voiceover</h4>
                          <p className="text-sm text-gray-700 italic">"{scene.voiceover}"</p>
                        </div>
                      </div>

                      {scene.text_overlay && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">📝 Text Overlay</h4>
                          <div className="inline-block px-3 py-2 bg-roshanal-navy text-white rounded-lg font-medium">
                            {scene.text_overlay}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA & Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📣 Call-to-Action</h3>
                  <p className="text-gray-700">{generatedScript.cta}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Social Caption</h3>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                    {generatedScript.caption}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {generatedScript.hashtags.slice(0, 6).map((hashtag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export Script
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Script
                </Button>
                <Button variant="outline">
                  <Type className="w-4 h-4 mr-2" />
                  Add to Planner
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Tips & Resources Panel */}
        <div>
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Video Creation Tips</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🎬 Shooting Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use good lighting - natural light best</li>
                  <li>• Keep phone steady or use tripod</li>
                  <li>• Record in landscape mode</li>
                  <li>• Speak clearly and with energy</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">🎵 Audio & Music</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use copyright-free music</li>
                  <li>• Record voiceover in quiet space</li>
                  <li>• Match music to video energy</li>
                  <li>• Add background music last</li>
                </ul>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">✨ Editing Software</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• CapCut (free, mobile/desktop)</li>
                  <li>• InShot (mobile editing)</li>
                  <li>• DaVinci Resolve (advanced)</li>
                  <li>• Adobe Premiere (professional)</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Success Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Avg. Engagement Rate</span>
                <span className="text-lg font-bold text-green-600">8.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">View Completion</span>
                <span className="text-lg font-bold text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Click-Through Rate</span>
                <span className="text-lg font-bold text-purple-600">4.2%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Based on Roshanal's video performance data
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}