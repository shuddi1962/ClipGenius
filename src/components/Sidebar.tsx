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
  Crown,
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
  Smartphone,
  Sparkles,
  Globe,
  Cpu,
  Layers,
  Rocket,
  DollarSign,
  Wand2,
  BookOpen,
  Brain,
  Key,
  UserCheck,
  CheckSquare,
  Image,
  Split,
  Star
} from 'lucide-react'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  userRole?: 'client' | 'admin'
}

export default function Sidebar({ isCollapsed = false, onToggle, userRole: propUserRole }: SidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<'client' | 'admin'>('client')

  // Get user role from props or fallback to pathname detection
  useEffect(() => {
    if (propUserRole) {
      setUserRole(propUserRole)
    } else {
      // Fallback to pathname detection for backward compatibility
      const mockRole = pathname.includes('/admin') ? 'admin' : 'client'
      setUserRole(mockRole)
    }
  }, [propUserRole, pathname])

  const clientNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & insights', color: 'text-blue-400' },
    { name: 'Business Profile', href: '/dashboard/business', icon: Building, description: 'Company details & products', color: 'text-purple-400' },

    // Lead Management Section
    { name: 'Lead Scraping', href: '/dashboard/leads/scrape', icon: Search, description: 'Import from multiple sources', color: 'text-green-400' },
    { name: 'Lead Management', href: '/dashboard/leads', icon: Users, description: 'View & manage all leads', color: 'text-cyan-400' },
    { name: 'AI Qualification', href: '/dashboard/leads/qualify', icon: Zap, description: 'Score leads automatically', color: 'text-yellow-400' },

    // Outreach Section
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Send, description: 'Email, WhatsApp & SMS campaigns', color: 'text-red-400' },
    { name: 'Voice Agent', href: '/dashboard/voice', icon: Phone, description: 'AI phone call automation', color: 'text-pink-400' },
    { name: 'Forms & Surveys', href: '/dashboard/forms', icon: FileText, description: 'Create lead capture forms', color: 'text-amber-400' },
    { name: 'Opportunities', href: '/dashboard/opportunities', icon: Target, description: 'Sales pipeline management', color: 'text-emerald-400' },

    // Content Section
    { name: 'Blogging', href: '/dashboard/blogging', icon: FileText, description: 'Create and manage blog posts', color: 'text-emerald-400' },
    { name: 'Content AI', href: '/dashboard/content-ai', icon: Sparkles, description: 'AI-powered content creation', color: 'text-violet-400' },
    { name: 'Content Generator', href: '/dashboard/content-generator', icon: Wand2, description: 'AI content creation', color: 'text-indigo-400' },
    { name: 'Website Builder', href: '/dashboard/website-builder', icon: Globe, description: 'Drag-and-drop website creation', color: 'text-green-400' },
    { name: 'Courses & Memberships', href: '/dashboard/courses-memberships', icon: BookOpen, description: 'Learning management system', color: 'text-blue-400' },
    { name: 'Email Builder', href: '/dashboard/email-builder', icon: Mail, description: 'Create email campaigns', color: 'text-cyan-400' },
    { name: 'Video Studio', href: '/dashboard/video-studio', icon: Video, description: 'AI video script generation', color: 'text-orange-400' },
    { name: 'Social Media', href: '/dashboard/social', icon: Instagram, description: 'Social posting & scheduling', color: 'text-rose-400' },
    { name: 'Image AI', href: '/dashboard/image-ai', icon: Image, description: 'AI image generation', color: 'text-lime-400' },
    { name: 'Split Testing', href: '/dashboard/split-testing', icon: Split, description: 'A/B testing for campaigns', color: 'text-fuchsia-400' },
    { name: 'Reputation', href: '/dashboard/reputation', icon: Star, description: 'Reviews & reputation management', color: 'text-yellow-400' },

    // Intelligence Section
    { name: 'Conversation AI', href: '/dashboard/conversation-ai', icon: Brain, description: 'Advanced AI conversations', color: 'text-purple-400' },
    { name: 'Conversations with', href: '/dashboard/conversations-with', icon: MessageSquare, description: 'AI-powered conversations', color: 'text-cyan-400' },
    { name: 'Competitor Analysis', href: '/dashboard/competitors', icon: Target, description: 'Monitor competitors', color: 'text-emerald-400' },
    { name: 'AI Agents', href: '/dashboard/agents', icon: Bot, description: 'Configure AI assistants', color: 'text-violet-400' },
    { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow, description: 'Automation workflows', color: 'text-teal-400' },
    { name: 'Task Management', href: '/dashboard/tasks', icon: CheckSquare, description: 'Project task tracking', color: 'text-orange-400' },
    { name: 'Live Chat', href: '/dashboard/live-chat', icon: MessageSquare, description: 'Real-time customer support', color: 'text-purple-400' },
    { name: 'Scheduling', href: '/dashboard/scheduling', icon: Calendar, description: 'Online appointment booking', color: 'text-cyan-400' },
    { name: 'Email Integration', href: '/dashboard/email-integration', icon: Mail, description: 'Gmail & Outlook sync', color: 'text-blue-400' },

    // Business Tools
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, description: 'Payment processing & invoicing', color: 'text-green-400' },
    { name: 'API Access', href: '/dashboard/api-access', icon: Key, description: 'Manage API keys and docs', color: 'text-cyan-400' },
    { name: 'Ads Reporting', href: '/dashboard/ads-reporting', icon: BarChart3, description: 'Monitor ad performance', color: 'text-blue-400' },
    { name: 'Affiliate Manager', href: '/dashboard/affiliate-manager', icon: DollarSign, description: 'Manage affiliate program', color: 'text-green-400' },
    { name: 'App Marketplace', href: '/dashboard/app-marketplace', icon: Zap, description: 'Browse and install apps', color: 'text-yellow-400' },
    { name: 'Attribution Reporting', href: '/dashboard/attribution-reporting', icon: TrendingUp, description: 'Analyze conversion attribution', color: 'text-indigo-400' },
    { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: Database, description: 'View system activity logs', color: 'text-orange-400' },
    { name: 'Call Reporting', href: '/dashboard/call-reporting', icon: Phone, description: 'Monitor call performance', color: 'text-pink-400' },
    { name: 'Communities', href: '/dashboard/communities', icon: Users, description: 'Community forums and discussions', color: 'text-emerald-400' },
    { name: 'Company Object', href: '/dashboard/company-object', icon: Building, description: 'Manage company profiles', color: 'text-teal-400' },
    { name: 'Compliance', href: '/dashboard/compliance', icon: Shield, description: 'Manage regulatory compliance', color: 'text-red-400' },
    { name: 'CRM', href: '/dashboard/crm', icon: UserCheck, description: 'Customer relationship management', color: 'text-rose-400' },
    { name: 'Custom Providers', href: '/dashboard/custom-providers', icon: Settings, description: 'Configure integrations', color: 'text-violet-400' },
    { name: 'Document Management', href: '/dashboard/document-management', icon: FileText, description: 'Organize and share documents', color: 'text-sky-400' },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag, description: 'Manage product catalog', color: 'text-amber-400' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, description: 'Account & preferences', color: 'text-slate-400' },
    { name: 'Pricing Tiers', href: '/dashboard/pricing-tiers', icon: Crown, description: 'View subscription plans', color: 'text-yellow-400' }
  ]

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, description: 'System overview', color: 'text-blue-400' },
    { name: 'User Management', href: '/admin/users', icon: Users, description: 'Manage all users', color: 'text-green-400' },
    { name: 'API Management', href: '/admin/api-keys', icon: Shield, description: 'Third-party API keys', color: 'text-purple-400' },
    { name: 'Billing', href: '/admin/billing', icon: CreditCard, description: 'Subscriptions & payments', color: 'text-green-400' },
    { name: 'Content Moderation', href: '/admin/content', icon: FileText, description: 'Review user content', color: 'text-red-400' },
    { name: 'System Health', href: '/admin/system', icon: Activity, description: 'Platform monitoring', color: 'text-cyan-400' },
    { name: 'Audit Logs', href: '/admin/logs', icon: Database, description: 'Activity tracking', color: 'text-orange-400' }
  ]

  const navigation = userRole === 'admin' ? adminNavigation : clientNavigation

  // Group navigation items for better organization
  const getGroupedNavigation = () => {
    if (userRole === 'admin') return [adminNavigation]

    // Group client navigation into logical sections
    const overviewSection = navigation.filter(item =>
      ['Dashboard', 'Business Profile'].includes(item.name)
    )
    const leadSection = navigation.filter(item =>
      ['Lead Scraping', 'Lead Management', 'AI Qualification'].includes(item.name)
    )
    const outreachSection = navigation.filter(item =>
      ['Campaigns', 'Voice Agent', 'Forms & Surveys', 'Opportunities'].includes(item.name)
    )
    const contentSection = navigation.filter(item =>
      ['Blogging', 'Content AI', 'Content Generator', 'Courses & Memberships', 'Email Builder', 'Video Studio', 'Social Media', 'Image AI', 'Split Testing', 'Reputation'].includes(item.name)
    )
    const intelligenceSection = navigation.filter(item =>
      ['Conversation AI', 'Conversations with', 'Competitor Analysis', 'AI Agents', 'Workflows', 'Task Management', 'Live Chat', 'Scheduling'].includes(item.name)
    )
    const businessSection = navigation.filter(item =>
      ['API Access', 'Ads Reporting', 'Affiliate Manager', 'App Marketplace', 'Attribution Reporting', 'Audit Logs', 'Call Reporting', 'Communities', 'Company Object', 'Compliance', 'CRM', 'Custom Providers', 'Document Management', 'Products', 'Payments', 'Analytics', 'Settings'].includes(item.name)
    )

    return [overviewSection, leadSection, outreachSection, contentSection, intelligenceSection, businessSection]
  }

  const groupedNavigation = getGroupedNavigation()

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-700/50 transition-all duration-300 flex flex-col h-screen overflow-hidden shadow-2xl backdrop-blur-xl`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] via-[#FFB800] to-[#FF6B6B] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#00F5FF] via-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent">
                  ClipGenius
                </span>
                <div className="text-xs text-gray-400 font-medium">AI Marketing Platform</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] via-[#FFB800] to-[#FF6B6B] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 text-gray-400 hover:text-white backdrop-blur-sm"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-6">
            <div className="flex items-center space-x-4 px-4 py-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userRole === 'admin' ? 'System Admin' : 'John Smith'}
                </p>
                <p className="text-xs text-gray-400 capitalize font-medium">
                  {userRole === 'admin' ? 'Administrator' : 'Marketing Director'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {groupedNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            {!isCollapsed && group.length > 0 && (
              <div className="px-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-80">
                  {groupIndex === 0 && userRole === 'client' && 'Overview'}
                  {groupIndex === 1 && userRole === 'client' && 'Lead Management'}
                  {groupIndex === 2 && userRole === 'client' && 'Outreach'}
                  {groupIndex === 3 && userRole === 'client' && 'Content Creation'}
                  {groupIndex === 4 && userRole === 'client' && 'AI Intelligence'}
                  {groupIndex === 5 && userRole === 'client' && 'Business Tools'}
                  {groupIndex === 0 && userRole === 'admin' && 'System Administration'}
                </h3>
              </div>
            )}

            {group.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg shadow-[#00F5FF]/10 border border-[#00F5FF]/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#00F5FF] to-[#FFB800] rounded-r-full"></div>
                  )}

                  {/* Icon with dynamic color */}
                  <div className={`relative ${isCollapsed ? '' : 'mr-4'} flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${
                      isActive
                        ? 'text-white'
                        : item.color || 'text-gray-400 group-hover:text-white'
                    } transition-colors duration-200`} />
                    {isActive && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 rounded-lg blur-sm"></div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors duration-200">
                        {item.description}
                      </div>
                    </div>
                  )}

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00F5FF]/10 to-[#FFB800]/10'
                      : 'bg-gray-700/30'
                  }`}></div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700/30 flex-shrink-0">
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-600/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Version</span>
                <span className="text-[#00F5FF] font-bold">2.0.0</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="text-green-400 font-bold flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  Online
                </span>
              </div>
            </div>
            <button className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm border border-transparent hover:border-red-500/30">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <button className="p-3 text-gray-400 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-200">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}