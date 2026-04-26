'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Users, Phone, Mail, Building, MapPin, ExternalLink, Zap } from 'lucide-react'
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
  score: number
  tier: 'hot' | 'warm' | 'cold'
  status: 'new' | 'qualified' | 'contacted' | 'responded' | 'converted' | 'lost'
  notes: string | null
  source: string
  created_at: string
}

const statusColors = {
  new: 'bg-blue-500',
  qualified: 'bg-green-500',
  contacted: 'bg-yellow-500',
  responded: 'bg-purple-500',
  converted: 'bg-emerald-500',
  lost: 'bg-red-500'
}

const tierColors = {
  hot: 'text-red-400 border-red-400',
  warm: 'text-yellow-400 border-yellow-400',
  cold: 'text-blue-400 border-blue-400'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const [qualifying, setQualifying] = useState<string[]>([])

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

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      (lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (lead.phone?.includes(searchTerm) ?? false)

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const kanbanColumns = {
    new: filteredLeads.filter(l => l.status === 'new'),
    qualified: filteredLeads.filter(l => l.status === 'qualified'),
    contacted: filteredLeads.filter(l => l.status === 'contacted'),
    responded: filteredLeads.filter(l => l.status === 'responded'),
    converted: filteredLeads.filter(l => l.status === 'converted'),
    lost: filteredLeads.filter(l => l.status === 'lost')
  }

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const { error } = await insforge
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ))
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const qualifyLead = async (leadId: string) => {
    setQualifying(prev => [...prev, leadId])

    try {
      const response = await fetch('/api/leads/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: [leadId] })
      })

      if (!response.ok) throw new Error('Qualification failed')

      const result = await response.json()

      if (result.qualified_leads?.[0]) {
        const qualified = result.qualified_leads[0]
        setLeads(leads.map(lead =>
          lead.id === leadId ? {
            ...lead,
            score: qualified.score,
            tier: qualified.tier,
            notes: qualified.qualification_notes
          } : lead
        ))
      }
    } catch (error) {
      console.error('Error qualifying lead:', error)
    } finally {
      setQualifying(prev => prev.filter(id => id !== leadId))
    }
  }

  const qualifyUnqualifiedLeads = async () => {
    const unqualifiedLeads = filteredLeads.filter(lead => !lead.score)
    if (unqualifiedLeads.length === 0) return

    setQualifying(unqualifiedLeads.map(l => l.id))

    try {
      const response = await fetch('/api/leads/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: unqualifiedLeads.map(l => l.id) })
      })

      if (!response.ok) throw new Error('Bulk qualification failed')

      const result = await response.json()

      if (result.qualified_leads) {
        setLeads(leads.map(lead => {
          const qualified = result.qualified_leads.find((q: any) => q.id === lead.id)
          return qualified ? {
            ...lead,
            score: qualified.score,
            tier: qualified.tier,
            notes: qualified.qualification_notes
          } : lead
        }))
      }
    } catch (error) {
      console.error('Error bulk qualifying leads:', error)
    } finally {
      setQualifying([])
    }
  }

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {lead.first_name && lead.last_name
              ? `${lead.first_name} ${lead.last_name}`
              : lead.company || 'Unknown Lead'
            }
          </h3>
          <div className={`inline-block px-2 py-1 text-xs rounded-full border mt-1 ${tierColors[lead.tier]}`}>
            {lead.tier.toUpperCase()} • {lead.score}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-gray-400 uppercase">
            {lead.source}
          </div>
          {!lead.score && (
            <button
              onClick={() => qualifyLead(lead.id)}
              disabled={qualifying.includes(lead.id)}
              className="px-3 py-1 bg-[#00F5FF] text-black text-xs rounded hover:bg-[#00F5FF]/80 disabled:opacity-50"
            >
              {qualifying.includes(lead.id) ? '...' : 'Qualify'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        {lead.company && (
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2 text-gray-400" />
            {lead.company}
          </div>
        )}
        {lead.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {lead.email}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {lead.phone}
          </div>
        )}
        {lead.city && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {lead.city}{lead.country && `, ${lead.country}`}
          </div>
        )}
      </div>

      {lead.notes && (
        <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
          {lead.notes}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        {new Date(lead.created_at).toLocaleDateString()}
      </div>
    </div>
  )

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
          <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
          <p className="text-gray-300">{leads.length} total leads</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/dashboard/leads/scrape"
            className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Scrape Leads
          </Link>

          {filteredLeads.some(lead => !lead.score) && (
            <button
              onClick={qualifyUnqualifiedLeads}
              disabled={qualifying.length > 0}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center disabled:opacity-50"
            >
              <Zap className="w-5 h-5 mr-2" />
              {qualifying.length > 0 ? 'Qualifying...' : 'Qualify All'}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 ${viewMode === 'kanban' ? 'bg-[#00F5FF] text-black' : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 ${viewMode === 'table' ? 'bg-[#00F5FF] text-black' : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Object.entries(kanbanColumns).map(([status, columnLeads]) => (
            <div key={status} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white capitalize">{status}</h3>
                <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {columnLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragEnd={() => {
                      // Handle drag to different status
                      const newStatus = status as Lead['status']
                      if (lead.status !== newStatus) {
                        updateLeadStatus(lead.id, newStatus)
                      }
                    }}
                  >
                    <LeadCard lead={lead} />
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No leads</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-900/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {lead.first_name && lead.last_name
                          ? `${lead.first_name} ${lead.last_name}`
                          : 'Unknown'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {lead.email && <div>{lead.email}</div>}
                        {lead.phone && <div>{lead.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{lead.company || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-block px-2 py-1 text-xs rounded-full border ${tierColors[lead.tier]}`}>
                        {lead.tier} • {lead.score}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className="text-sm bg-transparent border border-gray-600 rounded px-2 py-1 text-gray-300 focus:border-[#00F5FF]"
                      >
                        <option value="new">New</option>
                        <option value="qualified">Qualified</option>
                        <option value="contacted">Contacted</option>
                        <option value="responded">Responded</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 capitalize">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-[#00F5FF] hover:text-[#00F5FF]/80 text-sm">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No leads found</h3>
              <p className="text-gray-400 mb-4">
                {leads.length === 0 ? 'Start by scraping some leads' : 'Try adjusting your filters'}
              </p>
              {leads.length === 0 && (
                <Link
                  href="/dashboard/leads/scrape"
                  className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Scrape Your First Leads
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}