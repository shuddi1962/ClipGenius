'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Send,
  UserPlus,
  UserMinus,
  Archive,
  Flag,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost' | 'archived'
  score: number
  last_contact?: string
  next_followup?: string
  notes?: string
}

interface ManualAction {
  id: string
  lead_id: string
  action_type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'followup' | 'qualification'
  description: string
  outcome?: string
  scheduled_date?: string
  completed_date?: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}

export default function ManualActionsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [actions, setActions] = useState<ManualAction[]>([])
  const [showActionForm, setShowActionForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // New action form
  const [newAction, setNewAction] = useState({
    action_type: 'call' as ManualAction['action_type'],
    description: '',
    outcome: '',
    scheduled_date: '',
    completed_date: ''
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    if (selectedLead) {
      fetchLeadActions(selectedLead.id)
    }
  }, [selectedLead])

  const fetchLeads = async () => {
    try {
      const { data, error } = await insforge
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeadActions = async (leadId: string) => {
    try {
      const { data, error } = await insforge
        .from('lead_actions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setActions(data || [])
    } catch (error) {
      console.error('Error fetching lead actions:', error)
    }
  }

  const createAction = async () => {
    if (!selectedLead) return

    try {
      const { error } = await insforge
        .from('lead_actions')
        .insert({
          lead_id: selectedLead.id,
          action_type: newAction.action_type,
          description: newAction.description,
          outcome: newAction.outcome || null,
          scheduled_date: newAction.scheduled_date || null,
          completed_date: newAction.completed_date || null,
          status: 'pending'
        })

      if (error) throw error

      // Reset form and refresh actions
      setNewAction({
        action_type: 'call',
        description: '',
        outcome: '',
        scheduled_date: '',
        completed_date: ''
      })
      setShowActionForm(false)
      fetchLeadActions(selectedLead.id)
    } catch (error) {
      console.error('Error creating action:', error)
    }
  }

  const updateActionStatus = async (actionId: string, status: ManualAction['status']) => {
    try {
      const updateData: any = { status }
      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString()
      }

      const { error } = await insforge
        .from('lead_actions')
        .update(updateData)
        .eq('id', actionId)

      if (error) throw error

      if (selectedLead) {
        fetchLeadActions(selectedLead.id)
      }
    } catch (error) {
      console.error('Error updating action:', error)
    }
  }

  const getActionIcon = (type: ManualAction['action_type']) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'meeting': return Users
      case 'note': return MessageSquare
      case 'status_change': return Flag
      case 'followup': return Calendar
      case 'qualification': return Star
      default: return MessageSquare
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'qualified': return 'bg-green-500'
      case 'proposal': return 'bg-purple-500'
      case 'negotiation': return 'bg-orange-500'
      case 'closed_won': return 'bg-emerald-500'
      case 'closed_lost': return 'bg-red-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getActionStatusColor = (status: ManualAction['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manual Lead Actions</h1>
        <p className="text-gray-400">Process leads manually with calls, emails, meetings, and follow-ups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Leads ({leads.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedLead?.id === lead.id
                        ? 'bg-[#00F5FF]/20 border border-[#00F5FF]/50'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium truncate">{lead.name}</h4>
                      <Badge className={`${getStatusColor(lead.status)} text-white text-xs`}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{lead.email}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Score: {lead.score}
                      </span>
                      {lead.next_followup && (
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.next_followup).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No leads found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-2">
          {selectedLead ? (
            <div className="space-y-6">
              {/* Lead Details */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{selectedLead.name}</span>
                    <Badge className={`${getStatusColor(selectedLead.status)} text-white`}>
                      {selectedLead.status.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white">{selectedLead.email}</p>
                    </div>
                    {selectedLead.phone && (
                      <div>
                        <label className="text-sm text-gray-400">Phone</label>
                        <p className="text-white">{selectedLead.phone}</p>
                      </div>
                    )}
                    {selectedLead.company && (
                      <div>
                        <label className="text-sm text-gray-400">Company</label>
                        <p className="text-white">{selectedLead.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-400">Lead Score</label>
                      <p className="text-white font-semibold">{selectedLead.score}/100</p>
                    </div>
                  </div>
                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm text-gray-400">Notes</label>
                      <p className="text-white">{selectedLead.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions History */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Actions ({actions.length})
                    </span>
                    <Button
                      onClick={() => setShowActionForm(true)}
                      className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-gray-900"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Action
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showActionForm && (
                    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-white font-semibold mb-3">Add New Action</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Action Type</label>
                          <Select
                            value={newAction.action_type}
                            onValueChange={(value: ManualAction['action_type']) =>
                              setNewAction(prev => ({ ...prev, action_type: value }))
                            }
                          >
                            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="call">Phone Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="status_change">Status Change</SelectItem>
                              <SelectItem value="followup">Follow-up</SelectItem>
                              <SelectItem value="qualification">Qualification</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Scheduled Date (Optional)</label>
                          <Input
                            type="datetime-local"
                            value={newAction.scheduled_date}
                            onChange={(e) => setNewAction(prev => ({ ...prev, scheduled_date: e.target.value }))}
                            className="bg-gray-600 border-gray-500 text-white"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-1">Description</label>
                        <Textarea
                          value={newAction.description}
                          onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the action..."
                          className="bg-gray-600 border-gray-500 text-white"
                          rows={3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-1">Outcome (Optional)</label>
                        <Textarea
                          value={newAction.outcome}
                          onChange={(e) => setNewAction(prev => ({ ...prev, outcome: e.target.value }))}
                          placeholder="What was the result of this action..."
                          className="bg-gray-600 border-gray-500 text-white"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={createAction}
                          className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-gray-900"
                          disabled={!newAction.description.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Create Action
                        </Button>
                        <Button
                          onClick={() => setShowActionForm(false)}
                          variant="outline"
                          className="border-gray-500 text-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {actions.map((action) => {
                      const IconComponent = getActionIcon(action.action_type)
                      return (
                        <div key={action.id} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-600 rounded-lg">
                                <IconComponent className="w-4 h-4 text-[#00F5FF]" />
                              </div>
                              <div>
                                <h4 className="text-white font-medium capitalize">
                                  {action.action_type.replace('_', ' ')}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {new Date(action.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getActionStatusColor(action.status)} text-white text-xs`}>
                                {action.status}
                              </Badge>
                              {action.status === 'pending' && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => updateActionStatus(action.id, 'completed')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => updateActionStatus(action.id, 'cancelled')}
                                    variant="outline"
                                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 mb-2">{action.description}</p>
                          {action.outcome && (
                            <p className="text-green-400 text-sm mb-2">
                              <strong>Outcome:</strong> {action.outcome}
                            </p>
                          )}
                          {action.scheduled_date && (
                            <p className="text-yellow-400 text-sm">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Scheduled: {new Date(action.scheduled_date).toLocaleString()}
                            </p>
                          )}
                          {action.completed_date && (
                            <p className="text-blue-400 text-sm">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Completed: {new Date(action.completed_date).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )
                    })}
                    {actions.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No actions recorded for this lead</p>
                        <p className="text-sm">Add your first manual action above</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Lead</h3>
                  <p>Choose a lead from the list to view and manage manual actions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}