'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Mic, MessageSquare, Target } from 'lucide-react'
import Link from 'next/link'
import insforge from '@/lib/insforge'

interface AgentForm {
  name: string
  personality: string
  voice_id: string
  language: string
  goal: string
  faq_answers: { question: string; answer: string }[]
}

export default function NewVoiceAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<AgentForm>({
    name: '',
    personality: 'professional',
    voice_id: 'default-male',
    language: 'en',
    goal: '',
    faq_answers: [
      { question: 'What services do you offer?', answer: 'We offer comprehensive business solutions including marketing automation, lead generation, and customer outreach.' },
      { question: 'What are your business hours?', answer: 'We are available Monday through Friday, 9 AM to 6 PM in your local timezone.' },
      { question: 'How can I contact you?', answer: 'You can reach us by phone at any time, or send us an email and we will respond within 24 hours.' }
    ]
  })

  const personalities = [
    { id: 'professional', name: 'Professional', description: 'Formal, business-oriented tone' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic and excited' },
    { id: 'calm', name: 'Calm', description: 'Soothing and reassuring' }
  ]

  const voices = [
    { id: 'default-male', name: 'Male (Professional)', language: 'en' },
    { id: 'default-female', name: 'Female (Professional)', language: 'en' },
    { id: 'warm-male', name: 'Male (Warm)', language: 'en' },
    { id: 'warm-female', name: 'Female (Warm)', language: 'en' }
  ]

  const goals = [
    'Qualify leads and schedule appointments',
    'Provide customer support and answer questions',
    'Conduct surveys and gather feedback',
    'Handle appointment reminders and confirmations',
    'Promote special offers and generate sales'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Create voice agent
      const { data: agent, error } = await insforge
        .from('voice_agents')
        .insert({
          workspace_id: workspace.id,
          name: formData.name,
          personality: formData.personality,
          voice_id: formData.voice_id,
          language: formData.language,
          goal: formData.goal,
          faq_json: formData.faq_answers,
          active: false
        })
        .select()
        .single()

      if (error) throw error

      router.push('/dashboard/voice')
    } catch (error) {
      console.error('Error creating voice agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq_answers: [...prev.faq_answers, { question: '', answer: '' }]
    }))
  }

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faq_answers: prev.faq_answers.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    }))
  }

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faq_answers: prev.faq_answers.filter((_, i) => i !== index)
    }))
  }

  const generateAnswer = async (index: number) => {
    const faq = formData.faq_answers[index]
    if (!faq.question.trim()) return

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          prompt: `Generate a helpful, ${formData.personality} answer for this customer service question: "${faq.question}". The answer should be relevant to a business that offers ${formData.goal.toLowerCase()}. Keep it concise and professional.`
        })
      })

      if (!response.ok) throw new Error('Failed to generate answer')

      const result = await response.json()

      updateFaq(index, 'answer', result.content)
    } catch (error) {
      console.error('Error generating answer:', error)
      // Keep existing answer or show error
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/voice"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Voice Agent</h1>
            <p className="text-gray-300">Set up an AI agent to handle phone calls automatically</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Agent Configuration</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                placeholder="Customer Support Agent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Personality
              </label>
              <select
                value={formData.personality}
                onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              >
                {personalities.map(personality => (
                  <option key={personality.id} value={personality.id}>
                    {personality.name} - {personality.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voice
              </label>
              <select
                value={formData.voice_id}
                onChange={(e) => setFormData(prev => ({ ...prev, voice_id: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              >
                {voices.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent Goal
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              required
            >
              <option value="">Select a goal...</option>
              {goals.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Training */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Training Data</h2>
            <button
              type="button"
              onClick={addFaq}
              className="bg-[#00F5FF] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00F5FF]/80 transition-colors"
            >
              Add FAQ
            </button>
          </div>

          <p className="text-gray-300 mb-6">
            Train your agent with common questions and answers. The AI will use this knowledge to respond to callers.
          </p>

          <div className="space-y-4">
            {formData.faq_answers.map((faq, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Question
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                        placeholder="What is your return policy?"
                      />
                      <button
                        type="button"
                        onClick={() => generateAnswer(index)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center"
                        title="Generate answer with AI"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      disabled={formData.faq_answers.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="We offer a 30-day return policy for all items..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/voice"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.goal}
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}