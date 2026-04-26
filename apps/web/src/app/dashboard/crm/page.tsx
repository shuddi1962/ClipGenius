'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
  UserCheck,
  Clock,
  MapPin,
  Building,
  Activity,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: 'lead' | 'prospect' | 'customer' | 'inactive'
  source: string
  tags: string[]
  lastActivity: string
  createdAt: string
  avatar?: string
}

interface Deal {
  id: string
  name: string
  contactId: string
  contactName: string
  value: number
  currency: string
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expectedCloseDate: string
  owner: string
  createdAt: string
  updatedAt: string
}

interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  title: string
  description: string
  contactId: string
  contactName: string
  dueDate?: string
  completed: boolean
  createdAt: string
  createdBy: string
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'deals' | 'activities'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'lead' | 'prospect' | 'customer' | 'inactive'>('all')

  // Mock contacts data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      position: 'CTO',
      status: 'customer',
      source: 'Website',
      tags: ['enterprise', 'tech', 'decision-maker'],
      lastActivity: '2024-04-19T14:30:00Z',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@startupxyz.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      position: 'CEO',
      status: 'prospect',
      source: 'LinkedIn',
      tags: ['startup', 'founder', 'high-potential'],
      lastActivity: '2024-04-18T11:20:00Z',
      createdAt: '2024-03-10T14:45:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@globalmfg.com',
      phone: '+1 (555) 456-7890',
      company: 'Global Manufacturing Ltd',
      position: 'VP Sales',
      status: 'lead',
      source: 'Trade Show',
      tags: ['manufacturing', 'sales', 'cold-lead'],
      lastActivity: '2024-04-17T09:15:00Z',
      createdAt: '2024-04-01T16:30:00Z'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@greenenergy.com',
      phone: '+1 (555) 234-5678',
      company: 'GreenEnergy Inc',
      position: 'Marketing Director',
      status: 'customer',
      source: 'Referral',
      tags: ['energy', 'marketing', 'referral'],
      lastActivity: '2024-04-19T08:45:00Z',
      createdAt: '2024-02-20T12:15:00Z'
    }
  ])

  // Mock deals data
  const [deals] = useState<Deal[]>([
    {
      id: '1',
      name: 'Enterprise Software License',
      contactId: '1',
      contactName: 'John Smith',
      value: 50000,
      currency: 'USD',
      stage: 'negotiation',
      probability: 75,
      expectedCloseDate: '2024-05-15',
      owner: 'Sarah Johnson',
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-04-19T14:30:00Z'
    },
    {
      id: '2',
      name: 'Marketing Consultation',
      contactId: '2',
      contactName: 'Sarah Johnson',
      value: 15000,
      currency: 'USD',
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2024-04-30',
      owner: 'Mike Chen',
      createdAt: '2024-03-15T14:20:00Z',
      updatedAt: '2024-04-18T11:20:00Z'
    },
    {
      id: '3',
      name: 'Custom Development Project',
      contactId: '3',
      contactName: 'Mike Chen',
      value: 75000,
      currency: 'USD',
      stage: 'prospecting',
      probability: 30,
      expectedCloseDate: '2024-06-01',
      owner: 'Emma Davis',
      createdAt: '2024-04-01T16:30:00Z',
      updatedAt: '2024-04-17T09:15:00Z'
    },
    {
      id: '4',
      name: 'Annual Support Contract',
      contactId: '4',
      contactName: 'Emma Davis',
      value: 25000,
      currency: 'USD',
      stage: 'closed_won',
      probability: 100,
      expectedCloseDate: '2024-04-10',
      owner: 'Sarah Johnson',
      createdAt: '2024-02-20T12:15:00Z',
      updatedAt: '2024-04-10T15:45:00Z'
    }
  ])

  // Mock activities data
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'call',
      title: 'Follow-up call with John Smith',
      description: 'Discussed enterprise requirements and pricing options',
      contactId: '1',
      contactName: 'John Smith',
      dueDate: '2024-04-20',
      completed: false,
      createdAt: '2024-04-19T14:30:00Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'email',
      title: 'Sent proposal to Sarah Johnson',
      description: 'Comprehensive marketing consultation proposal with pricing',
      contactId: '2',
      contactName: 'Sarah Johnson',
      completed: true,
      createdAt: '2024-04-18T11:20:00Z',
      createdBy: 'Mike Chen'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Discovery meeting with Mike Chen',
      description: 'Initial requirements gathering and project scoping',
      contactId: '3',
      contactName: 'Mike Chen',
      dueDate: '2024-04-25',
      completed: false,
      createdAt: '2024-04-17T09:15:00Z',
      createdBy: 'Emma Davis'
    }
  ])

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { id: 'deals', name: 'Deals', icon: Target },
    { id: 'activities', name: 'Activities', icon: Activity }
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'lead': return 'outline'
      case 'prospect': return 'secondary'
      case 'customer': return 'default'
      case 'inactive': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-gray-500'
      case 'qualification': return 'bg-blue-500'
      case 'proposal': return 'bg-yellow-500'
      case 'negotiation': return 'bg-orange-500'
      case 'closed_won': return 'bg-green-500'
      case 'closed_lost': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'meeting': return <Users className="w-4 h-4" />
      case 'note': return <MessageSquare className="w-4 h-4" />
      case 'task': return <CheckCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const totalContacts = contacts.length
  const activeContacts = contacts.filter(c => c.status === 'customer').length
  const totalDeals = deals.length
  const wonDeals = deals.filter(d => d.stage === 'closed_won').length
  const pipelineValue = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + d.value, 0)
  const conversionRate = totalContacts > 0 ? Math.round((activeContacts / totalContacts) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CRM</h1>
          <p className="text-gray-400 mt-2">Manage your customer relationships and sales pipeline</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalContacts}</div>
            <p className="text-xs text-gray-400">
              {activeContacts} active customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Deals</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalDeals}</div>
            <p className="text-xs text-gray-400">
              {wonDeals} closed won
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${pipelineValue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Open opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{conversionRate}%</div>
            <p className="text-xs text-gray-400">
              Lead to customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-700/50 rounded-lg">
                    <div className={`mt-1 ${activity.completed ? 'text-green-400' : 'text-gray-400'}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{activity.title}</span>
                        {activity.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="text-gray-400 text-sm mb-1">{activity.contactName}</div>
                      <div className="text-gray-500 text-xs">
                        {formatDate(activity.createdAt)}
                        {activity.dueDate && ` • Due: ${formatDate(activity.dueDate)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Overview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'].map((stage) => {
                  const stageDeals = deals.filter(d => d.stage === stage)
                  const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0)
                  const stageCount = stageDeals.length

                  return (
                    <div key={stage} className="flex items-center justify-between p-3 border border-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium capitalize">
                          {stage.replace('_', ' ')}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {stageCount} deals • {formatCurrency(stageValue, 'USD')}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`}></div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['all', 'lead', 'prospect', 'customer', 'inactive'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                          <p className="text-gray-400 text-sm">{contact.position} at {contact.company}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(contact.status)} className="capitalize">
                          {contact.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {contact.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Source: {contact.source}</span>
                        <span>Last activity: {formatDate(contact.lastActivity)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Deal Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Contact</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Stage</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Value</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Probability</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Close Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Owner</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{deal.name}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{deal.contactName}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStageColor(deal.stage)}`}></div>
                          <Badge variant="outline" className="capitalize">
                            {deal.stage.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">
                        {formatCurrency(deal.value, deal.currency)}
                      </td>
                      <td className="py-4 px-6 text-gray-300">{deal.probability}%</td>
                      <td className="py-4 px-6 text-gray-300">{formatDate(deal.expectedCloseDate)}</td>
                      <td className="py-4 px-6 text-gray-300">{deal.owner}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Activities</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                          <p className="text-gray-400 text-sm">{activity.contactName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                          <Badge variant={activity.completed ? 'default' : 'secondary'}>
                            {activity.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-3">{activity.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Created by {activity.createdBy}</span>
                        <span>{formatDate(activity.createdAt)}</span>
                        {activity.dueDate && (
                          <span className="text-orange-400">Due: {formatDate(activity.dueDate)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {!activity.completed && (
                        <Button variant="outline" size="sm" className="border-green-600 text-green-400 hover:bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}