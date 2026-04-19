'use client'

import { useState } from 'react'
import { Video, Play, Download, Share, Wand2, Film, Music, Image as ImageIcon, Type, Palette } from 'lucide-react'

interface VideoProject {
  id: string
  title: string
  type: 'social' | 'promo' | 'tutorial' | 'story'
  status: 'draft' | 'rendering' | 'completed'
  duration: number
  thumbnail?: string
  created_at: string
}

export default function VideoStudioPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'projects' | 'templates'>('create')
  const [projects, setProjects] = useState<VideoProject[]>([
    {
      id: '1',
      title: 'Product Demo Reel',
      type: 'promo',
      status: 'completed',
      duration: 45,
      created_at: '2024-04-18T10:00:00Z'
    },
    {
      id: '2',
      title: 'Social Media Story',
      type: 'social',
      status: 'rendering',
      duration: 15,
      created_at: '2024-04-19T14:30:00Z'
    }
  ])

  const [newProject, setNewProject] = useState({
    title: '',
    type: 'social' as 'social' | 'promo' | 'tutorial' | 'story',
    script: '',
    style: 'modern'
  })

  const videoTypes = [
    { id: 'social', label: 'Social Media', icon: Video, description: 'Short, engaging clips for platforms' },
    { id: 'promo', label: 'Product Promo', icon: Film, description: 'Showcase your products or services' },
    { id: 'tutorial', label: 'Tutorial', icon: Play, description: 'Educational how-to content' },
    { id: 'story', label: 'Brand Story', icon: ImageIcon, description: 'Tell your company story' }
  ]

  const styles = [
    { id: 'modern', label: 'Modern & Clean', preview: '🎨' },
    { id: 'corporate', label: 'Corporate', preview: '🏢' },
    { id: 'creative', label: 'Creative & Artistic', preview: '🎭' },
    { id: 'minimal', label: 'Minimalist', preview: '⚪' }
  ]

  const generateVideo = () => {
    if (!newProject.title || !newProject.script) return

    const project: VideoProject = {
      id: `video_${Date.now()}`,
      title: newProject.title,
      type: newProject.type,
      status: 'rendering',
      duration: Math.floor(Math.random() * 60) + 15,
      created_at: new Date().toISOString()
    }

    setProjects(prev => [project, ...prev])
    setNewProject({ title: '', type: 'social', script: '', style: 'modern' })
    setActiveTab('projects')

    // Simulate rendering completion
    setTimeout(() => {
      setProjects(prev => prev.map(p =>
        p.id === project.id ? { ...p, status: 'completed' } : p
      ))
    }, 30000)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Video Studio</h1>
        <p className="text-gray-300">Create stunning videos with AI-powered script generation and automated editing</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {[
          { id: 'create', label: 'Create Video', icon: Wand2 },
          { id: 'projects', label: 'My Projects', icon: Video },
          { id: 'templates', label: 'Templates', icon: Palette }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'create' | 'projects' | 'templates')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Video Type */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Video Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {videoTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setNewProject(prev => ({ ...prev, type: type.id as 'social' | 'promo' | 'tutorial' | 'story' }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        newProject.type === type.id
                          ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                          : 'border-gray-600 hover:border-[#00F5FF]/50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        newProject.type === type.id ? 'text-[#00F5FF]' : 'text-gray-400'
                      }`} />
                      <div className="text-white font-medium text-sm">{type.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{type.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Project Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="My Amazing Product Video"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visual Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setNewProject(prev => ({ ...prev, style: style.id }))}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          newProject.style === style.id
                            ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                            : 'border-gray-600 hover:border-[#00F5FF]/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{style.preview}</div>
                        <div className={`text-sm font-medium ${
                          newProject.style === style.id ? 'text-[#00F5FF]' : 'text-gray-300'
                        }`}>
                          {style.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Script Input */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Video Script</h2>
                <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm flex items-center">
                  <Wand2 className="w-4 h-4 mr-1" />
                  Generate with AI
                </button>
              </div>

              <textarea
                value={newProject.script}
                onChange={(e) => setNewProject(prev => ({ ...prev, script: e.target.value }))}
                placeholder="Write your video script here, or use AI to generate one based on your content..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[120px] resize-none"
              />

              <div className="mt-4 flex gap-4">
                <button
                  onClick={generateVideo}
                  disabled={!newProject.title || !newProject.script}
                  className="flex-1 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Generate Video
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Video Preview</h2>

              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-400">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Video preview will appear here</p>
                  <p className="text-xs mt-2">Fill out the details to generate your video</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">~45 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resolution</span>
                  <span className="text-white">1080p HD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">MP4</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Automatic script-to-video conversion</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">AI voiceover generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Smart background music selection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Automated text animations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Custom branding options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Video Projects</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
            >
              Create New
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    {project.status === 'completed' ? (
                      <Video className="w-12 h-12 text-gray-400" />
                    ) : project.status === 'rendering' ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF] mx-auto mb-2"></div>
                        <div className="text-xs text-gray-400">Rendering...</div>
                      </div>
                    ) : (
                      <Video className="w-12 h-12 text-gray-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' ? 'bg-green-600 text-white' :
                        project.status === 'rendering' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-gray-400 text-xs capitalize">{project.type}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{project.duration}s</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      {project.status === 'completed' && (
                        <>
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                            <Play className="w-4 h-4 inline mr-1" />
                            Play
                          </button>
                          <button className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {project.status === 'rendering' && (
                        <div className="w-full text-center py-2 text-yellow-400 text-sm">
                          Processing... (~2-5 min)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No video projects yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first AI-generated video to get started
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Video Templates</h2>
            <p className="text-gray-400 mb-6">Choose from pre-designed templates to get started quickly</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Product Showcase', category: 'Business', duration: '30s', style: 'Modern' },
                { name: 'Brand Story', category: 'Marketing', duration: '60s', style: 'Cinematic' },
                { name: 'Tutorial Demo', category: 'Education', duration: '45s', style: 'Clean' },
                { name: 'Social Promo', category: 'Social Media', duration: '15s', style: 'Vibrant' },
                { name: 'Testimonial', category: 'Reviews', duration: '20s', style: 'Professional' },
                { name: 'Event Recap', category: 'Events', duration: '40s', style: 'Dynamic' }
              ].map((template, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 hover:border-[#00F5FF] transition-colors cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-3 flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <div className="text-sm text-gray-400 mb-2">{template.category}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{template.duration}</span>
                    <span>{template.style}</span>
                  </div>
                  <button className="w-full mt-3 bg-[#00F5FF] text-black py-2 px-4 rounded text-sm font-medium hover:bg-[#00F5FF]/80 transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}