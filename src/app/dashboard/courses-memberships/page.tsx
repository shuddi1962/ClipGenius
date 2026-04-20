'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Play,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Filter,
  Star,
  CheckCircle,
  UserCheck
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  price: number
  currency: string
  duration: number // in hours
  lessons: number
  students: number
  rating: number
  reviews: number
  status: 'draft' | 'published' | 'archived'
  level: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  updatedAt: string
  thumbnail: string
}

interface Membership {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly' | 'lifetime'
  features: string[]
  members: number
  status: 'active' | 'inactive'
  createdAt: string
}

export default function CoursesMemberships() {
  const [activeTab, setActiveTab] = useState<'courses' | 'memberships'>('courses')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')

  // Mock courses data
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete Digital Marketing Mastery',
      description: 'Learn everything about digital marketing from SEO to social media marketing.',
      instructor: 'Sarah Johnson',
      category: 'Marketing',
      price: 299,
      currency: 'USD',
      duration: 40,
      lessons: 120,
      students: 2450,
      rating: 4.8,
      reviews: 892,
      status: 'published',
      level: 'intermediate',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-04-10T14:30:00Z',
      thumbnail: '/course1.jpg'
    },
    {
      id: '2',
      title: 'Advanced React Development',
      description: 'Master React.js with advanced concepts, hooks, and modern development practices.',
      instructor: 'Mike Chen',
      category: 'Technology',
      price: 199,
      currency: 'USD',
      duration: 25,
      lessons: 85,
      students: 1800,
      rating: 4.9,
      reviews: 654,
      status: 'published',
      level: 'advanced',
      createdAt: '2024-02-01T09:30:00Z',
      updatedAt: '2024-04-08T11:15:00Z',
      thumbnail: '/course2.jpg'
    },
    {
      id: '3',
      title: 'Business Strategy Fundamentals',
      description: 'Learn essential business strategy concepts for entrepreneurs and managers.',
      instructor: 'Emma Davis',
      category: 'Business',
      price: 149,
      currency: 'USD',
      duration: 15,
      lessons: 45,
      students: 0,
      rating: 0,
      reviews: 0,
      status: 'draft',
      level: 'beginner',
      createdAt: '2024-04-15T16:45:00Z',
      updatedAt: '2024-04-15T16:45:00Z',
      thumbnail: '/course3.jpg'
    }
  ])

  // Mock memberships data
  const [memberships] = useState<Membership[]>([
    {
      id: '1',
      name: 'Premium Marketing Suite',
      description: 'Full access to all marketing courses, templates, and community.',
      price: 49,
      currency: 'USD',
      billingCycle: 'monthly',
      features: [
        'All marketing courses',
        'Downloadable templates',
        'Community access',
        'Monthly webinars',
        'Priority support'
      ],
      members: 1250,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Developer Pro',
      description: 'Comprehensive programming education with lifetime access.',
      price: 299,
      currency: 'USD',
      billingCycle: 'yearly',
      features: [
        'All programming courses',
        'Code reviews',
        'Project templates',
        'Career guidance',
        'Certification included'
      ],
      members: 850,
      status: 'active',
      createdAt: '2024-02-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Entrepreneur Elite',
      description: 'Everything you need to start and grow your business.',
      price: 999,
      currency: 'USD',
      billingCycle: 'lifetime',
      features: [
        'All business courses',
        '1-on-1 mentoring',
        'Business plan templates',
        'Investor networking',
        'VIP community access'
      ],
      members: 320,
      status: 'active',
      createdAt: '2024-03-01T00:00:00Z'
    }
  ])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const tabs = [
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'memberships', name: 'Memberships', icon: Users }
  ]

  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.students), 0) +
                      memberships.reduce((sum, membership) => {
                        let multiplier = 1
                        if (membership.billingCycle === 'yearly') multiplier = 12
                        else if (membership.billingCycle === 'lifetime') multiplier = 1 // Assume lifetime value
                        return sum + (membership.price * membership.members * multiplier)
                      }, 0)

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0) +
                       memberships.reduce((sum, membership) => sum + membership.members, 0)

  const avgRating = courses.filter(c => c.rating > 0).reduce((sum, course) => sum + course.rating, 0) /
                    courses.filter(c => c.rating > 0).length || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Courses & Memberships</h1>
          <p className="text-gray-400 mt-2">Create and manage educational content and membership programs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'courses' ? 'Create Course' : 'Create Membership'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +15% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Active learners
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-gray-400">
              Course quality
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Published Content</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {courses.filter(c => c.status === 'published').length + memberships.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-gray-400">
              Live courses & memberships
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

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <>
          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
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
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-0">
                  {/* Course Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">by {course.instructor}</p>
                      </div>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                        {course.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>

                    {course.status === 'published' && (
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{course.students} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-300">{course.rating} ({course.reviews})</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">
                        ${course.price}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Memberships Tab */}
      {activeTab === 'memberships' && (
        <div className="space-y-6">
          {memberships.map((membership) => (
            <Card key={membership.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{membership.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {membership.billingCycle}
                          </Badge>
                          <Badge variant={membership.status === 'active' ? 'default' : 'secondary'}>
                            {membership.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4">{membership.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">
                          ${membership.price}
                          <span className="text-sm text-gray-400 ml-1">
                            /{membership.billingCycle === 'lifetime' ? 'lifetime' : membership.billingCycle.slice(0, -2)}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">Price</div>
                      </div>

                      <div>
                        <div className="text-2xl font-bold text-white mb-1">{membership.members}</div>
                        <div className="text-gray-400 text-sm">Active members</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Features included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {membership.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Manage Members
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {((activeTab === 'courses' && filteredCourses.length === 0) ||
        (activeTab === 'memberships' && memberships.length === 0)) && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <div className="text-gray-400 text-lg mb-2">No {activeTab} found</div>
          <div className="text-gray-500">Create your first {activeTab.slice(0, -1)} to get started</div>
        </div>
      )}
    </div>
  )
}