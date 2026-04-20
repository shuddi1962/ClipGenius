'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  Target,
  Filter,
  MoreHorizontal
} from 'lucide-react'

interface Company {
  id: string
  name: string
  industry: string
  website: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  size: string
  revenue: string
  status: 'active' | 'inactive' | 'prospect'
  contacts: number
  deals: number
  lastActivity: string
  createdAt: string
  description: string
  tags: string[]
}

export default function CompanyObject() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all')
  const [industryFilter, setIndustryFilter] = useState('all')

  // Mock company data
  const [companies] = useState<Company[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      industry: 'Technology',
      website: 'https://techcorp.com',
      phone: '+1 (555) 123-4567',
      email: 'info@techcorp.com',
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      size: '201-500',
      revenue: '$50M - $100M',
      status: 'active',
      contacts: 15,
      deals: 8,
      lastActivity: '2024-04-19T10:30:00Z',
      createdAt: '2024-01-15T09:00:00Z',
      description: 'Leading technology solutions provider specializing in enterprise software.',
      tags: ['enterprise', 'software', 'cloud']
    },
    {
      id: '2',
      name: 'GreenEnergy Inc',
      industry: 'Energy',
      website: 'https://greenenergy.com',
      phone: '+1 (555) 987-6543',
      email: 'contact@greenenergy.com',
      address: {
        street: '456 Eco Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'USA'
      },
      size: '51-200',
      revenue: '$10M - $50M',
      status: 'active',
      contacts: 8,
      deals: 3,
      lastActivity: '2024-04-18T14:20:00Z',
      createdAt: '2024-02-01T11:30:00Z',
      description: 'Sustainable energy solutions for residential and commercial clients.',
      tags: ['renewable', 'sustainability', 'energy']
    },
    {
      id: '3',
      name: 'StartupXYZ',
      industry: 'Technology',
      website: 'https://startupxyz.com',
      phone: '+1 (555) 456-7890',
      email: 'hello@startupxyz.com',
      address: {
        street: '789 Innovation Blvd',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      size: '11-50',
      revenue: '$1M - $10M',
      status: 'prospect',
      contacts: 3,
      deals: 0,
      lastActivity: '2024-04-17T16:45:00Z',
      createdAt: '2024-03-10T13:15:00Z',
      description: 'Fast-growing startup developing AI-powered analytics tools.',
      tags: ['startup', 'AI', 'analytics']
    },
    {
      id: '4',
      name: 'Global Manufacturing Ltd',
      industry: 'Manufacturing',
      website: 'https://globalmfg.com',
      phone: '+1 (555) 234-5678',
      email: 'sales@globalmfg.com',
      address: {
        street: '321 Industrial Park',
        city: 'Detroit',
        state: 'MI',
        zipCode: '48201',
        country: 'USA'
      },
      size: '1001-5000',
      revenue: '$500M+',
      status: 'active',
      contacts: 25,
      deals: 12,
      lastActivity: '2024-04-19T08:15:00Z',
      createdAt: '2023-11-20T10:45:00Z',
      description: 'Global manufacturing company with operations in 15 countries.',
      tags: ['manufacturing', 'global', 'industrial']
    },
    {
      id: '5',
      name: 'RetailMax Corp',
      industry: 'Retail',
      website: 'https://retailmax.com',
      phone: '+1 (555) 345-6789',
      email: 'info@retailmax.com',
      address: {
        street: '654 Commerce Drive',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      size: '501-1000',
      revenue: '$100M - $500M',
      status: 'inactive',
      contacts: 12,
      deals: 5,
      lastActivity: '2024-03-15T12:30:00Z',
      createdAt: '2023-08-05T14:20:00Z',
      description: 'Major retail chain with 200+ stores nationwide.',
      tags: ['retail', 'consumer', 'stores']
    }
  ])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter
    return matchesSearch && matchesStatus && matchesIndustry
  })

  const industries = Array.from(new Set(companies.map(c => c.industry)))

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'prospect': return 'outline'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const totalCompanies = companies.length
  const activeCompanies = companies.filter(c => c.status === 'active').length
  const totalContacts = companies.reduce((sum, c) => sum + c.contacts, 0)
  const totalDeals = companies.reduce((sum, c) => sum + c.deals, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Company Objects</h1>
          <p className="text-gray-400 mt-2">Manage and track company profiles and relationships</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCompanies}</div>
            <p className="text-xs text-gray-400">
              {activeCompanies} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalContacts}</div>
            <p className="text-xs text-gray-400">
              Across all companies
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalDeals}</div>
            <p className="text-xs text-gray-400">
              Open opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Company Size</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">201-500</div>
            <p className="text-xs text-gray-400">
              Employee count
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {(['all', 'active', 'inactive', 'prospect'] as const).map((status) => (
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

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {company.industry}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(company.status)} className="capitalize">
                          {company.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                        {company.website.replace('https://', '')}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{company.address.city}, {company.address.state}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-sm">Company Size</div>
                      <div className="text-white font-medium">{company.size} employees</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Revenue</div>
                      <div className="text-white font-medium">{company.revenue}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Contacts</div>
                      <div className="text-white font-medium">{company.contacts}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Active Deals</div>
                      <div className="text-white font-medium">{company.deals}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-gray-400 text-sm">
                      Last activity: {formatLastActivity(company.lastActivity)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Created: {formatDate(company.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {company.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <div className="text-gray-400 text-lg mb-2">No companies found</div>
          <div className="text-gray-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}