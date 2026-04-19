'use client'

import { useState, useEffect } from 'react'
import { Zap, Users, Star, TrendingUp, Brain, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface Lead {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  city: string | null
  country: string | null
  score: number | null
  tier: string | null
  status: string
  notes: string | null
  source: string
  created_at: string
}

export default function LeadQualificationPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [qualifying, setQualifying] = useState<string[]>([])
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    unqualified: 0,
    hot: 0,
    warm: 0,
    cold: 0
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
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
        .from('leads')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const leadsData = data || []
      setLeads(leadsData)

      // Calculate stats
      const qualified = leadsData.filter(l => l.score !== null && l.score > 0)
      const unqualified = leadsData.filter(l => l.score === null || l.score === 0)
      const hot = leadsData.filter(l => l.tier === 'hot')
      const warm = leadsData.filter(l => l.tier === 'warm')
      const cold = leadsData.filter(l => l.tier === 'cold')

      setStats({
        total: leadsData.length,
        qualified: qualified.length,
        unqualified: unqualified.length,
        hot: hot.length,
        warm: warm.length,
        cold: cold.length
      })
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const qualifyLeads = async (leadIds: string[]) => {
    setQualifying(leadIds)

    try {
      const response = await fetch('/api/leads/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds })
      })

      if (!response.ok) throw new Error('Qualification failed')

      const result = await response.json()

      // Update leads in state
      setLeads(leads.map(lead => {
        const qualified = result.qualified_leads?.find((q: any) => q.id === lead.id)
        if (qualified) {
          return {
            ...lead,
            score: qualified.score,
            tier: qualified.tier,
            notes: qualified.qualification_notes,
            status: qualified.score >= 50 ? 'qualified' : 'new'
          }
        }
        return lead
      }))

      // Update stats
      fetchLeads()
    } catch (error) {
      console.error('Error qualifying leads:', error)
      alert('Failed to qualify leads. Please try again.')
    } finally {
      setQualifying([])
    }
  }

  const qualifyAllUnqualified = async () => {
    const unqualifiedLeads = leads.filter(lead => !lead.score || lead.score === 0)
    if (unqualifiedLeads.length === 0) return

    await qualifyLeads(unqualifiedLeads.map(l => l.id))
  }

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'hot': return 'text-red-400 border-red-400/50 bg-red-400/10'
      case 'warm': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10'
      case 'cold': return 'text-blue-400 border-blue-400/50 bg-blue-400/10'
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10'
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score || score === 0) return 'text-gray-400'
    if (score >= 85) return 'text-red-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-blue-400'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Lead Qualification</h1>
        <p className="text-gray-300">Automatically score and categorize leads using advanced AI analysis</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#00F5FF]">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total Leads</div>
            </div>
            <Users className="w-8 h-8 text-[#00F5FF]" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.qualified}</div>
              <div className="text-gray-400 text-sm">Qualified</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.unqualified}</div>
              <div className="text-gray-400 text-sm">Unqualified</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-500">{stats.hot}</div>
              <div className="text-gray-400 text-sm">Hot Leads</div>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.warm}</div>
              <div className="text-gray-400 text-sm">Warm Leads</div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-500">{stats.cold}</div>
              <div className="text-gray-400 text-sm">Cold Leads</div>
            </div>
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={qualifyAllUnqualified}
          disabled={stats.unqualified === 0 || qualifying.length > 0}
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
        >
          <Zap className="w-5 h-5 mr-2" />
          {qualifying.length > 0 ? 'Qualifying...' : `Qualify ${stats.unqualified} Unqualified Leads`}
        </button>
        <button
          onClick={fetchLeads}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Leads List */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Lead Qualification Status</h2>
        </div>

        <div className="divide-y divide-gray-700/50">
          {leads.map(lead => (
            <div key={lead.id} className="p-6 hover:bg-gray-700/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-white">
                      {lead.first_name && lead.last_name
                        ? `${lead.first_name} ${lead.last_name}`
                        : lead.company || 'Unknown Lead'
                      }
                    </h3>
                    {lead.score && lead.score > 0 ? (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierColor(lead.tier)}`}>
                        {lead.tier?.toUpperCase()} • {lead.score}/100
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full text-xs font-medium border text-gray-400 border-gray-400/50 bg-gray-400/10">
                        UNQUALIFIED
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-400">Contact:</span>
                      <div className="mt-1">
                        {lead.email && <div>📧 {lead.email}</div>}
                        {lead.phone && <div>📞 {lead.phone}</div>}
                        {!lead.email && !lead.phone && <span className="text-gray-500">No contact info</span>}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400">Company:</span>
                      <div className="mt-1">
                        {lead.company || <span className="text-gray-500">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400">Source:</span>
                      <div className="mt-1 capitalize">{lead.source}</div>
                    </div>
                  </div>

                  {lead.notes && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">AI Analysis:</div>
                      <div className="text-sm text-gray-300">{lead.notes}</div>
                    </div>
                  )}
                </div>

                <div className="ml-6">
                  {(!lead.score || lead.score === 0) && !qualifying.includes(lead.id) && (
                    <button
                      onClick={() => qualifyLeads([lead.id])}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Qualify
                    </button>
                  )}

                  {qualifying.includes(lead.id) && (
                    <div className="flex items-center text-[#00F5FF]">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00F5FF] mr-2"></div>
                      Analyzing...
                    </div>
                  )}

                  {lead.score && lead.score > 0 && (
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {leads.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No leads found</h3>
              <p className="text-gray-400 mb-6">Start by scraping some leads to qualify them with AI</p>
              <a
                href="/dashboard/leads/scrape"
                className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Scrape Leads
              </a>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI Qualification Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-blue-300">
          <div>
            <h4 className="font-medium text-blue-400 mb-2">Scoring Algorithm</h4>
            <p className="text-sm">Our AI analyzes contact completeness, company data, source quality, and behavioral signals to assign scores from 0-100.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">Tier Classification</h4>
            <p className="text-sm">Hot (85+): Immediate follow-up • Warm (50-84): Nurture • Cold (0-49): Long-term monitoring</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-400 mb-2">Continuous Learning</h4>
            <p className="text-sm">The AI improves over time by learning from your conversion patterns and feedback.</p>
          </div>
        </div>
      </div>
    </div>
  )
}