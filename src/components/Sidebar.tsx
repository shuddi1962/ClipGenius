'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  BarChart3,
  FileText,
  Video,
  Users,
  Settings,
  Zap,
  Target,
  MessageSquare,
  Phone,
  Instagram,
  Calendar,
  Database,
  Shield,
  CreditCard,
  Activity,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Building,
  Search,
  Bot,
  Workflow,
  PieChart,
  ShoppingBag,
  TrendingUp,
  Eye,
  Mail,
  Send,
  Smartphone
} from 'lucide-react'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<'client' | 'admin'>('client')

  // Mock user role detection - in real app, get from auth context
  useEffect(() => {
    // This would normally come from your auth context
    const mockRole = pathname.includes('/admin') ? 'admin' : 'client'
    setUserRole(mockRole)
  }, [pathname])

  const clientNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & insights' },
    { name: 'Business Profile', href: '/dashboard/business', icon: Building, description: 'Company details & products' },

    // Lead Management Section
    { name: 'Lead Scraping', href: '/dashboard/leads/scrape', icon: Search, description: 'Import from multiple sources' },
    { name: 'Lead Management', href: '/dashboard/leads', icon: Users, description: 'View & manage all leads' },
    { name: 'AI Qualification', href: '/dashboard/leads/qualify', icon: Zap, description: 'Score leads automatically' },

    // Outreach Section
    { name: 'Email Campaigns', href: '/dashboard/campaigns/email', icon: Mail, description: 'Create & send email campaigns' },
    { name: 'WhatsApp Campaigns', href: '/dashboard/campaigns/whatsapp', icon: MessageSquare, description: 'WhatsApp automation' },
    { name: 'SMS Campaigns', href: '/dashboard/campaigns/sms', icon: Smartphone, description: 'SMS marketing campaigns' },
    { name: 'Voice Agent', href: '/dashboard/voice-agent', icon: Phone, description: 'AI phone call automation' },

    // Content Section
    { name: 'Content Generator', href: '/dashboard/content', icon: FileText, description: 'AI content creation' },
    { name: 'Video Studio', href: '/dashboard/video-studio', icon: Video, description: 'AI video script generation' },
    { name: 'Social Scheduler', href: '/dashboard/scheduler', icon: Calendar, description: 'Schedule social media posts' },

    // Intelligence Section
    { name: 'Competitor Analysis', href: '/dashboard/competitors', icon: Eye, description: 'Monitor competitors' },
    { name: 'AI Agents', href: '/dashboard/agents', icon: Bot, description: 'Configure AI assistants' },
    { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow, description: 'Automation workflows' },

    // Business Tools
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag, description: 'Manage product catalog' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart, description: 'Performance metrics' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account & preferences' }
  ]

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: BarChart3, description: 'System overview' },
    { name: 'User Management', href: '/admin/users', icon: Users, description: 'Manage all users' },
    { name: 'API Keys', href: '/admin/api-keys', icon: Shield, description: 'Manage third-party APIs' },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, description: 'Billing & subscriptions' },
    { name: 'Content Moderation', href: '/admin/content', icon: FileText, description: 'Review user content' },
    { name: 'System Settings', href: '/admin/settings', icon: Settings, description: 'Platform configuration' },
    { name: 'Audit Logs', href: '/admin/logs', icon: Activity, description: 'System activity logs' },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp, description: 'Platform analytics' }
  ]

  const navigation = userRole === 'admin' ? adminNavigation : clientNavigation

  // Group navigation items for better organization
  const getGroupedNavigation = () => {
    if (userRole === 'admin') return [adminNavigation]

    // Group client navigation into logical sections
    const leadSection = navigation.filter(item =>
      ['Lead Scraping', 'Lead Management', 'AI Qualification'].includes(item.name)
    )
    const outreachSection = navigation.filter(item =>
      ['Email Campaigns', 'WhatsApp Campaigns', 'SMS Campaigns', 'Voice Agent'].includes(item.name)
    )
    const contentSection = navigation.filter(item =>
      ['Content Generator', 'Video Studio', 'Social Scheduler'].includes(item.name)
    )
    const intelligenceSection = navigation.filter(item =>
      ['Competitor Analysis', 'AI Agents', 'Workflows'].includes(item.name)
    )
    const businessSection = navigation.filter(item =>
      ['Business Profile', 'Products', 'Analytics', 'Settings'].includes(item.name)
    )
    const overviewSection = navigation.filter(item =>
      ['Dashboard'].includes(item.name)
    )

    return [overviewSection, leadSection, outreachSection, contentSection, intelligenceSection, businessSection]
  }

  const groupedNavigation = getGroupedNavigation()

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} bg-gray-900 border-r border-gray-700 transition-all duration-300 flex flex-col h-screen overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ClipGenius
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-4">
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userRole === 'admin' ? 'Admin User' : 'John Smith'}
                </p>
                <p className="text-xs text-gray-400 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {groupedNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {!isCollapsed && group.length > 0 && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {groupIndex === 0 && userRole === 'client' && 'Overview'}
                  {groupIndex === 1 && userRole === 'client' && 'Lead Management'}
                  {groupIndex === 2 && userRole === 'client' && 'Outreach'}
                  {groupIndex === 3 && userRole === 'client' && 'Content'}
                  {groupIndex === 4 && userRole === 'client' && 'Intelligence'}
                  {groupIndex === 5 && userRole === 'client' && 'Business'}
                  {groupIndex === 0 && userRole === 'admin' && 'Administration'}
                </h3>
              </div>
            )}

            {group.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-gray-400 truncate">{item.description}</div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>v2.0.0</span>
                <span>ClipGenius</span>
              </div>
            </div>
            <button className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm">
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center space-y-2">
            <button className="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}