'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components.ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  Target,
  BarChart3,
  CheckSquare
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface SmartList {
  id: string
  name: string
  description: string
  filters: ListFilter[]
  memberCount: number
  lastUpdated: string
  isActive: boolean
}

interface ListFilter {
  id: string
  field: 'email' | 'name' | 'company' | 'score' | 'source' | 'status' | 'tags' | 'created_at'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'
  value: string | number | string[]
}

interface BulkAction {
  id: string
  name: string
  type: 'email' | 'sms' | 'tag' | 'status' | 'delete' | 'export'
  config: any
  appliedTo: string[] // list IDs
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
}

export default function SmartListsPage() {
  const [activeTab, setActiveTab] = useState<'lists' | 'create' | 'bulk-actions' | 'analytics'>('lists')
  const [lists, setLists] = useState<SmartList[]>([])
  const [bulkActions, setBulkActions] = useState<BulkAction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // New list form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    filters: [] as ListFilter[]
  })

  // Bulk action form
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [bulkAction, setBulkAction] = useState({
    name: '',
    type: 'email' as BulkAction['type'],
    config: {},
    targetLists: [] as string[]
  })

  useEffect(() => {
    if (activeTab === 'lists' || activeTab === 'bulk-actions' || activeTab === 'analytics') {
      fetchData()
    }
  }, [activeTab])

  const fetchData = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      if (activeTab === 'lists' || activeTab === 'analytics') {
        const { data, error } = await insforge
          .from('smart_lists')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setLists(data || [])
      }

      if (activeTab === 'bulk-actions') {
        const { data, error } = await insforge
          .from('bulk_actions')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBulkActions(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createList = async () => {
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
        .from('smart_lists')
        .insert({
          workspace_id: workspace.id,
          name: newList.name,
          description: newList.description,
          filters: newList.filters,
          member_count: 0,
          is_active: true
        })

      if (error) throw error

      alert('Smart list created successfully!')
      setShowNewForm(false)
      setNewList({
        name: '',
        description: '',
        filters: []
      })
      fetchData()
    } catch (error) {
      console.error('Error creating list:', error)
      alert('Failed to create smart list')
    }
  }

  const createBulkAction = async () => {
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
        .from('bulk_actions')
        .insert({
          workspace_id: workspace.id,
          name: bulkAction.name,
          type: bulkAction.type,
          config: bulkAction.config,
          applied_to: bulkAction.targetLists,
          status: 'pending'
        })

      if (error) throw error

      alert('Bulk action created successfully!')
      setShowBulkForm(false)
      setBulkAction({
        name: '',
        type: 'email',
        config: {},
        targetLists: []
      })
      fetchData()
    } catch (error) {
      console.error('Error creating bulk action:', error)
      alert('Failed to create bulk action')
    }
  }

  const deleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this smart list?')) return

    try {
      const { error } = await insforge
        .from('smart_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error

      setLists(lists.filter(list => list.id !== listId))
    } catch (error) {
      console.error('Error deleting list:', error)
      alert('Failed to delete smart list')
    }
  }

  const addFilter = (field: ListFilter['field']) => {
    const newFilter: ListFilter = {
      id: `filter_${Date.now()}`,
      field,
      operator: 'equals',
      value: ''
    }

    setNewList(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }))
  }

  const updateFilter = (index: number, updates: Partial<ListFilter>) => {
    setNewList(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) =>
        i === index ? { ...filter, ...updates } : filter
      )
    }))
  }

  const removeFilter = (index: number) => {
    setNewList(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const toggleListSelection = (listId: string) => {
    setBulkAction(prev => ({
      ...prev,
      targetLists: prev.targetLists.includes(listId)
        ? prev.targetLists.filter(id => id !== listId)
        : [...prev.targetLists, listId]
    }))
  }

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'email': return 'Email'
      case 'name': return 'Name'
      case 'company': return 'Company'
      case 'score': return 'Lead Score'
      case 'source': return 'Source'
      case 'status': return 'Status'
      case 'tags': return 'Tags'
      case 'created_at': return 'Created Date'
      default: return field
    }
  }

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'equals': return 'Equals'
      case 'contains': return 'Contains'
      case 'greater_than': return 'Greater Than'
      case 'less_than': return 'Less Than'
      case 'between': return 'Between'
      case 'in': return 'In'
      default: return operator
    }
  }

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'lists', name: 'Smart Lists', icon: Users },
    { id: 'create', name: 'Create List', icon: Plus },
    { id: 'bulk-actions', name: 'Bulk Actions', icon: CheckSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

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
          <h1 className="text-3xl font-bold text-white mb-2">Smart Lists & Bulk Actions</h1>
          <p className="text-gray-300">Create dynamic lists and perform bulk operations on your contacts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Smart List
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Lists Tab */}
      {activeTab === 'lists' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search smart lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Lists Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <Card key={list.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{list.name}</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{list.description}</p>
                    </div>
                    <Badge className={list.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {list.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Members:</span>
                      <span className="text-white font-medium">{list.memberCount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Filters:</span>
                      <span className="text-white font-medium">{list.filters.length}</span>
                    </div>

                    <div className="text-sm text-gray-400">
                      Updated {new Date(list.lastUpdated).toLocaleDateString()}
                    </div>

                    {/* Filter Preview */}
                    {list.filters.length > 0 && (
                      <div className="space-y-1">
                        {list.filters.slice(0, 2).map((filter, index) => (
                          <div key={filter.id} className="text-xs text-gray-500 bg-gray-700/50 rounded px-2 py-1">
                            {getFieldLabel(filter.field)} {getOperatorLabel(filter.operator)} {String(filter.value)}
                          </div>
                        ))}
                        {list.filters.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{list.filters.length - 2} more filters
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black flex-1">
                        <Users className="w-4 h-4 mr-1" />
                        View Members
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => deleteList(list.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLists.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No smart lists yet</h3>
                <p className="text-gray-400 mb-6">
                  Create dynamic lists based on contact properties and behaviors
                </p>
                <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First List
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create List Tab */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Create Smart List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* List Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    List Name
                  </label>
                  <Input
                    value={newList.name}
                    onChange={(e) => setNewList(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="High-Value Leads"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Input
                    value={newList.description}
                    onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Contacts with score > 80"
                  />
                </div>
              </div>

              {/* Filters */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => addFilter('score')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Score
                    </Button>
                    <Button onClick={() => addFilter('email')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Email
                    </Button>
                    <Button onClick={() => addFilter('company')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Company
                    </Button>
                    <Button onClick={() => addFilter('source')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Source
                    </Button>
                    <Button onClick={() => addFilter('tags')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Tags
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {newList.filters.map((filter, index) => (
                    <div key={filter.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <select
                            value={filter.field}
                            onChange={(e) => updateFilter(index, { field: e.target.value as ListFilter['field'] })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-[#00F5FF]"
                          >
                            <option value="email">Email</option>
                            <option value="name">Name</option>
                            <option value="company">Company</option>
                            <option value="score">Lead Score</option>
                            <option value="source">Source</option>
                            <option value="status">Status</option>
                            <option value="tags">Tags</option>
                            <option value="created_at">Created Date</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <select
                            value={filter.operator}
                            onChange={(e) => updateFilter(index, { operator: e.target.value as ListFilter['operator'] })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-[#00F5FF]"
                          >
                            <option value="equals">Equals</option>
                            <option value="contains">Contains</option>
                            <option value="greater_than">Greater Than</option>
                            <option value="less_than">Less Than</option>
                            <option value="between">Between</option>
                            <option value="in">In</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <Input
                            value={String(filter.value)}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="bg-gray-600 border-gray-500 text-white"
                            placeholder="Filter value"
                          />
                        </div>

                        <Button
                          onClick={() => removeFilter(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {newList.filters.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No filters added yet. Click the buttons above to add filtering criteria.</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('lists')}
                >
                  Cancel
                </Button>
                <Button onClick={createList} disabled={!newList.name || newList.filters.length === 0} className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Create Smart List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Actions Tab */}
      {activeTab === 'bulk-actions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Bulk Actions</h2>
            <Button onClick={() => setShowBulkForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <CheckSquare className="w-4 h-4 mr-2" />
              New Bulk Action
            </Button>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {bulkActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{action.name}</div>
                      <div className="text-gray-400 text-sm capitalize">{action.type} Action</div>
                      <div className="text-gray-400 text-sm">Applied to {action.appliedTo.length} lists</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${
                        action.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        action.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                        action.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {action.status}
                      </Badge>
                      <div className="text-gray-400 text-sm">{new Date(action.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}

                {bulkActions.length === 0 && (
                  <div className="text-center py-12">
                    <CheckSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No bulk actions yet</h3>
                    <p className="text-gray-400">
                      Create bulk actions to perform operations on multiple contacts at once
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">List Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Total Lists</div>
                    <div className="text-gray-400 text-sm">Active smart lists</div>
                  </div>
                  <div className="text-2xl font-bold text-[#00F5FF]">{lists.length}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Average List Size</div>
                    <div className="text-gray-400 text-sm">Contacts per list</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {lists.length > 0 ? Math.round(lists.reduce((sum, list) => sum + list.memberCount, 0) / lists.length) : 0}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Bulk Actions</div>
                    <div className="text-gray-400 text-sm">Completed this month</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {bulkActions.filter(a => a.status === 'completed').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Contact Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Contact segmentation chart</p>
                  <p className="text-sm mt-2">Shows how contacts are distributed across lists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New List Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Create Smart List</CardTitle>
            </CardHeader>
            <CardContent>
              {/* The create form is already implemented above in the Create List tab */}
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Use the "Create List" tab to build your smart list with filters.</p>
                <Button onClick={() => { setShowNewForm(false); setActiveTab('create'); }} className="bg-blue-600 hover:bg-blue-700">
                  Go to Create List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white">Create Bulk Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action Name
                </label>
                <Input
                  value={bulkAction.name}
                  onChange={(e) => setBulkAction(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Send Welcome Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Action Type
                </label>
                <select
                  value={bulkAction.type}
                  onChange={(e) => setBulkAction(prev => ({ ...prev, type: e.target.value as BulkAction['type'] }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="email">Send Email</option>
                  <option value="sms">Send SMS</option>
                  <option value="tag">Add Tag</option>
                  <option value="status">Update Status</option>
                  <option value="export">Export Data</option>
                </select>
              </div>

              {/* Target Lists */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apply to Lists
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {lists.map((list) => (
                    <div key={list.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={bulkAction.targetLists.includes(list.id)}
                        onChange={() => toggleListSelection(list.id)}
                        className="rounded border-gray-500 text-[#00F5FF] focus:ring-[#00F5FF]"
                      />
                      <label className="text-gray-300 text-sm">{list.name}</label>
                      <span className="text-gray-500 text-xs">({list.memberCount} members)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowBulkForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createBulkAction} disabled={!bulkAction.name || bulkAction.targetLists.length === 0} className="bg-blue-600 hover:bg-blue-700">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Create Bulk Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}