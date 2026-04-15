'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Lightbulb,
  PenTool,
  Calendar,
  Video,
  Package,
  Bookmark,
  Settings,
  Zap
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Daily Ideas', href: '/daily-ideas', icon: Lightbulb },
  { name: 'Content Generator', href: '/content-generator', icon: PenTool },
  { name: 'Content Planner', href: '/content-planner', icon: Calendar },
  { name: 'Video Studio', href: '/video-studio', icon: Video },
  { name: 'Products', href: '/products', icon: Package },
   { name: 'Saved', href: '/saved-content', icon: Bookmark },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0C1A36] to-[#1641C4] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0C1A36] leading-tight">Roshanal</h1>
            <p className="text-xs text-gray-500">Infotech</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0C1A36] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2026 Roshanal Infotech</p>
          <p>Port Harcourt, Nigeria</p>
        </div>
      </div>
    </div>
  )
}