'use client'

import { useState } from 'react'
import { Sparkles, FileText, Copy, Download, RefreshCw, Wand2, Target, Users, TrendingUp, Mail } from 'lucide-react'

interface GeneratedContent {
  id: string
  type: 'post' | 'email' | 'ad' | 'bio'
  content: string
  title?: string
  hashtags?: string[]
  tone: string
  platform?: string
  created_at: string
}

export default function ContentGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<'post' | 'email' | 'ad' | 'bio'>('post')
  const [platform, setPlatform] = useState<string>('instagram')
  const [tone, setTone] = useState('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])

  const contentTypes = [
    { id: 'post', label: 'Social Media Post', icon: FileText, description: 'Engaging posts for social platforms' },
    { id: 'email', label: 'Email Campaign', icon: Mail, description: 'Professional email content' },
    { id: 'ad', label: 'Ad Copy', icon: Target, description: 'Compelling advertising copy' },
    { id: 'bio', label: 'Profile Bio', icon: Users, description: 'Professional profile descriptions' }
  ]

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'text-pink-400' },
    { id: 'linkedin', name: 'LinkedIn', color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter/X', color: 'text-black' },
    { id: 'facebook', name: 'Facebook', color: 'text-blue-500' },
    { id: 'tiktok', name: 'TikTok', color: 'text-black' }
  ]

  const tones = [
    { id: 'professional', label: 'Professional', description: 'Formal business tone' },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
    { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and excited' },
    { id: 'humorous', label: 'Humorous', description: 'Fun and witty' }
  ]

  const generateContent = async () => {
    if (!prompt.trim()) return

    setGenerating(true)

    // Mock content generation - in real app, call AI API
    setTimeout(() => {
      const mockContent: GeneratedContent = {
        id: `content_${Date.now()}`,
        type: contentType,
        content: generateMockContent(),
        title: contentType === 'email' ? 'Welcome to Our Service' : undefined,
        hashtags: contentType === 'post' ? ['#business', '#growth', '#success'] : undefined,
        tone,
        platform: contentType === 'post' ? platform : undefined,
        created_at: new Date().toISOString()
      }

      setGeneratedContent(prev => [mockContent, ...prev])
      setGenerating(false)
    }, 2000)
  }

  const generateMockContent = () => {
    const templates = {
      post: `🚀 Exciting news! We're revolutionizing the way businesses connect with their customers through AI-powered automation.

Our latest update includes enhanced lead qualification and personalized outreach capabilities that can boost your conversion rates by up to 300%.

What are you waiting for? Transform your business today! 💪

#BusinessGrowth #AI #Automation #Success`,
      email: `Subject: Transform Your Business with AI-Powered Marketing

Dear [Name],

I hope this email finds you well. I'm reaching out because I noticed you're interested in growing your business through innovative marketing solutions.

At ClipGenius, we specialize in AI-powered marketing automation that can help you:
• Generate 5x more qualified leads
• Automate your entire sales funnel
• Personalize every customer interaction
• Scale your business 24/7

Would you be available for a quick 15-minute call next week to discuss how we can help your business grow?

Best regards,
[Your Name]
Marketing Director
ClipGenius`,
      ad: `STOP Struggling with Lead Generation!

Tired of manual outreach and poor conversion rates?

Discover ClipGenius - The AI Marketing Platform That Works While You Sleep!

✅ Automated lead generation
✅ AI-powered qualification
✅ Multi-channel campaigns
✅ Real-time analytics

Join 10,000+ businesses already growing with ClipGenius!

Get started today - Free 14-day trial!`,
      bio: `🚀 Marketing Innovator | AI Enthusiast | Business Growth Expert

Helping businesses scale with intelligent automation and data-driven strategies. Passionate about leveraging AI to create meaningful customer experiences and drive sustainable growth.

📈 300% average conversion increase
🤖 AI-powered marketing automation
🌟 Trusted by 10,000+ businesses

DM to learn how we can transform your business!`
    }

    return templates[contentType] || templates.post
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add toast notification here
  }

  const downloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${content.type}-${content.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Content Generator</h1>
        <p className="text-gray-300">Create engaging content powered by advanced AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Panel */}
        <div className="space-y-6">
          {/* Content Type Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Content Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map(type => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id as 'post' | 'email' | 'ad' | 'bio')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      contentType === type.id
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-gray-600 hover:border-[#00F5FF]/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      contentType === type.id ? 'text-[#00F5FF]' : 'text-gray-400'
                    }`} />
                    <div className="text-white font-medium text-sm">{type.label}</div>
                    <div className="text-gray-400 text-xs mt-1">{type.description}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Platform Selection (for posts) */}
          {contentType === 'post' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Target Platform</h2>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      platform === p.id
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-gray-600 hover:border-[#00F5FF]/50'
                    }`}
                  >
                    <div className={`text-sm font-medium ${platform === p.id ? 'text-[#00F5FF]' : 'text-gray-300'}`}>
                      {p.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tone Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Content Tone</h2>
            <div className="grid grid-cols-2 gap-3">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    tone === t.id
                      ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                      : 'border-gray-600 hover:border-[#00F5FF]/50'
                  }`}
                >
                  <div className={`text-sm font-medium ${tone === t.id ? 'text-[#00F5FF]' : 'text-gray-300'}`}>
                    {t.label}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Content Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI to create. Be specific about your goals, target audience, key messages, and desired outcome..."
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[120px] resize-none"
            />

            {/* Target Audience */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Small business owners, Tech professionals, Marketing managers"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={!prompt.trim() || generating}
              className="w-full mt-4 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Content</h2>

            {generatedContent.length === 0 ? (
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
                <p className="text-gray-400">Fill out the details on the left and click "Generate with AI" to create amazing content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedContent.map(content => (
                  <div key={content.id} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          content.type === 'post' ? 'bg-blue-500' :
                          content.type === 'email' ? 'bg-green-500' :
                          content.type === 'ad' ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="text-white font-medium capitalize">{content.type}</span>
                        {content.platform && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300">{content.platform}</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(content.content)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadContent(content)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title (for emails) */}
                    {content.title && (
                      <h3 className="text-[#00F5FF] font-semibold mb-2">{content.title}</h3>
                    )}

                    {/* Content */}
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                      {content.content}
                    </div>

                    {/* Hashtags */}
                    {content.hashtags && content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-[#00F5FF] text-sm">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-500">
                      Generated {new Date(content.created_at).toLocaleString()} • {content.tone} tone
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Usage This Month</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00F5FF]">47</div>
                <div className="text-gray-400 text-sm">Content Pieces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">12</div>
                <div className="text-gray-400 text-sm">Credits Left</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Limit</span>
                <span className="text-white">59 / 100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] h-2 rounded-full" style={{ width: '59%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}