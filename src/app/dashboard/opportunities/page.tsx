'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Move
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface Opportunity {
  id: string
  title: string
  description: string
  value: number
  currency: string
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expected_close_date: string
  lead_id?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

interface PipelineStage {
  id: string
  name: string
  order: number
  color: string
}

const defaultStages: PipelineStage[] = [
  { id: 'prospecting', name: 'Prospecting', order: 1, color: 'bg-blue-500' },
  { id: 'qualification', name: 'Qualification', order: 2, color: 'bg-yellow-500' },
  { id: 'proposal', name: 'Proposal', order: 3, color: 'bg-purple-500' },
  { id: 'negotiation', name: 'Negotiation', order: 4, color: 'bg-orange-500' },
  { id: 'closed_won', name: 'Closed Won', order: 5, color: 'bg-green-500' },
  { id: 'closed_lost', name: 'Closed Lost', order: 6, color: 'bg-red-500' }
]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [stages] = useState<PipelineStage[]>(defaultStages)
  const [draggedOpportunity, setDraggedOpportunity] = useState<Opportunity | null>(null)

  // New opportunity form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    value: 0,
    currency: 'USD',
    stage: 'prospecting' as Opportunity['stage'],
    probability: 25,
    expected_close_date: '',
    lead_id: ''
  })

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
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
        .from('opportunities')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOpportunities(data || [])
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const createOpportunity = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { error } = await insforge
        .from('opportunities')
        .insert({
          workspace_id: workspace.id,
          ...newOpportunity,
          assigned_to: userData.user.id
        })

      if (error) throw error

      alert('Opportunity created successfully!')
      setShowNewForm(false)
      setNewOpportunity({
        title: '',
        description: '',
        value: 0,
        currency: 'USD',
        stage: 'prospecting',
        probability: 25,
        expected_close_date: '',
        lead_id: ''
      })
      fetchOpportunities()
    } catch (error) {
      console.error('Error creating opportunity:', error)
      alert('Failed to create opportunity')
    }
  }

  const updateOpportunityStage = async (opportunityId: string, newStage: Opportunity['stage']) => {
    try {
      const { error } = await insforge
        .from('opportunities')
        .update({
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', opportunityId)

      if (error) throw error

      setOpportunities(opportunities.map(opp =>
        opp.id === opportunityId ? { ...opp, stage: newStage } : opp
      ))
    } catch (error) {
      console.error('Error updating opportunity:', error)
      alert('Failed to update opportunity stage')
    }
  }

  const deleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return

    try {
      const { error } = await insforge
        .from('opportunities')
        .delete()
        .eq('id', opportunityId)

      if (error) throw error

      setOpportunities(opportunities.filter(opp => opp.id !== opportunityId))
    } catch (error) {
      console.error('Error deleting opportunity:', error)
      alert('Failed to delete opportunity')
    }
  }

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    setDraggedOpportunity(opportunity)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStage: Opportunity['stage']) => {
    e.preventDefault()
    if (!draggedOpportunity || draggedOpportunity.stage === newStage) return

    await updateOpportunityStage(draggedOpportunity.id, newStage)
    setDraggedOpportunity(null)
  }

  const getStageColor = (stage: string) => {
    const stageConfig = stages.find(s => s.id === stage)
    return stageConfig?.color || 'bg-gray-500'
  }

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage)
  }

  const getTotalValue = () => {
    return opportunities.reduce((sum, opp) => sum + opp.value, 0)
  }

  const getWeightedValue = () => {
    return opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0)
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
          <h1 className="text-3xl font-bold text-white mb-2">Opportunities & Pipeline</h1>
          <p className="text-gray-300">Manage your sales pipeline and track opportunities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Pipeline Analytics
          </Button>
          <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#00F5FF]">{opportunities.length}</div>
                <div className="text-gray-400 text-sm">Total Opportunities</div>
              </div>
              <Target className="w-8 h-8 text-[#00F5FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">${getTotalValue().toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Value</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">${getWeightedValue().toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Weighted Value</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {opportunities.filter(o => o.stage === 'closed_won').length}
                </div>
                <div className="text-gray-400 text-sm">Closed Won</div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id as Opportunity['stage'])}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <CardTitle className="text-white text-lg capitalize">{stage.name}</CardTitle>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {getOpportunitiesByStage(stage.id).length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {getOpportunitiesByStage(stage.id).map((opportunity) => (
                  <div
                    key={opportunity.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opportunity)}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 cursor-move hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{opportunity.title}</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 p-1"
                          onClick={() => deleteOpportunity(opportunity.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {opportunity.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="text-green-400 font-medium">
                        ${opportunity.value.toLocaleString()} {opportunity.currency}
                      </div>
                      <div className="text-blue-400">
                        {opportunity.probability}% win
                      </div>
                    </div>

                    {opportunity.expected_close_date && (
                      <div className="mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(opportunity.expected_close_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}

                {getOpportunitiesByStage(stage.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No opportunities in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* New Opportunity Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Create New Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Opportunity Title
                  </label>
                  <Input
                    value={newOpportunity.title}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="New Client Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Value
                  </label>
                  <Input
                    type="number"
                    value={newOpportunity.value}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[100px] resize-none"
                  placeholder="Describe the opportunity..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stage
                  </label>
                  <select
                    value={newOpportunity.stage}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, stage: e.target.value as Opportunity['stage'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Win Probability (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newOpportunity.probability}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expected Close Date
                  </label>
                  <Input
                    type="date"
                    value={newOpportunity.expected_close_date}
                    onChange={(e) => setNewOpportunity(prev => ({ ...prev, expected_close_date: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createOpportunity} disabled={!newOpportunity.title} className="bg-blue-600 hover:bg-blue-700">
                  <Target className="w-4 h-4 mr-2" />
                  Create Opportunity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}