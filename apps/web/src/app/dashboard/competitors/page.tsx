'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, TrendingUp, Users, MessageSquare, Eye, BarChart3, Target } from 'lucide-react'
import insforge from '@/lib/insforge'

interface Competitor {
  id: string
  name: string
  website: string
  social_handles: any
  last_scanned: string | null
  analysis_json: any
  active: boolean
  created_at: string
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState<string | null>(null)

  useEffect(() => {
    fetchCompetitors()
  }, [])

  const fetchCompetitors = async () => {
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
        .from('competitors')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompetitors(data || [])
    } catch (error) {
      console.error('Error fetching competitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const scanCompetitor = async (competitorId: string) => {
    setScanning(competitorId)

    try {
      const response = await fetch('/api/competitors/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId })
      })

      if (!response.ok) throw new Error('Scan failed')

      const result = await response.json()

      // Update competitor with new analysis
      setCompetitors(competitors.map(comp =>
        comp.id === competitorId ? {
          ...comp,
          last_scanned: new Date().toISOString(),
          analysis_json: result.analysis
        } : comp
      ))

      alert('Competitor analysis completed!')
    } catch (error) {
      console.error('Error scanning competitor:', error)
      alert('Failed to scan competitor. Please try again.')
    } finally {
      setScanning(null)
    }
  }

  const toggleCompetitor = async (competitorId: string, active: boolean) => {
    try {
      const { error } = await insforge
        .from('competitors')
        .update({ active })
        .eq('id', competitorId)

      if (error) throw error

      setCompetitors(competitors.map(comp =>
        comp.id === competitorId ? { ...comp, active } : comp
      ))
    } catch (error) {
      console.error('Error updating competitor:', error)
    }
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Competitor Intelligence</h1>
          <p className="text-gray-300">Monitor rivals and discover growth opportunities</p>
        </div>
        <Link
          href="/dashboard/competitors/add"
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Competitor
        </Link>
      </div>

      {/* Competitors Grid */}
      {competitors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map(competitor => (
            <div
              key={competitor.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{competitor.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${competitor.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-sm text-gray-400">{competitor.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <Target className="w-6 h-6 text-[#00F5FF]" />
              </div>

              {/* Website */}
              <div className="text-gray-300 text-sm mb-3">
                <strong>Website:</strong> {competitor.website}
              </div>

              {/* Social Handles */}
              {competitor.social_handles && Object.keys(competitor.social_handles).length > 0 && (
                <div className="text-gray-300 text-sm mb-3">
                  <strong>Social:</strong> {Object.keys(competitor.social_handles).join(', ')}
                </div>
              )}

              {/* Last Scanned */}
              <div className="text-gray-400 text-sm mb-4">
                Last scanned: {competitor.last_scanned
                  ? new Date(competitor.last_scanned).toLocaleDateString()
                  : 'Never'
                }
              </div>

              {/* Analysis Summary */}
              {competitor.analysis_json && (
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Posts/Week</div>
                      <div className="text-white font-semibold">
                        {competitor.analysis_json.posting_frequency || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Top Hashtags</div>
                      <div className="text-white font-semibold">
                        {competitor.analysis_json.top_hashtags?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => scanCompetitor(competitor.id)}
                  disabled={scanning === competitor.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {scanning === competitor.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1" />
                      Analyze
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleCompetitor(competitor.id, !competitor.active)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    competitor.active
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {competitor.active ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No competitors added yet</h3>
          <p className="text-gray-400 mb-6">
            Add competitors to monitor their strategies and discover content opportunities
          </p>
          <Link
            href="/dashboard/competitors/add"
            className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Your First Competitor
          </Link>
        </div>
      )}

      {/* Insights Section */}
      {competitors.length > 0 && (
        <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Intelligence Insights</h3>
          <div className="grid md:grid-cols-3 gap-6 text-blue-300">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">📈 Content Gaps</h4>
              <p className="text-sm">Find topics your competitors cover that you don't</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">🏷️ Hashtag Strategy</h4>
              <p className="text-sm">Discover trending hashtags in your industry</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">📊 Posting Patterns</h4>
              <p className="text-sm">Learn optimal posting times and frequencies</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}