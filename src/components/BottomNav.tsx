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
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Daily Ideas', href: '/daily-ideas', icon: Lightbulb },
  { name: 'Generator', href: '/content-generator', icon: PenTool },
  { name: 'Planner', href: '/content-planner', icon: Calendar },
  { name: 'Video', href: '/video-studio', icon: Video },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive ? 'text-[#0C1A36]' : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#0C1A36]' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium truncate ${
                isActive ? 'text-[#0C1A36]' : 'text-gray-500'
              }`}>
                {item.name === 'Content Generator' ? 'Generator' :
                 item.name === 'Content Planner' ? 'Planner' :
                 item.name === 'Video Studio' ? 'Video' : item.name}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Second row for remaining items */}
      <div className="flex justify-around items-center max-w-md mx-auto mt-1">
        {navigation.slice(5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive ? 'text-[#0C1A36]' : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#0C1A36]' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium truncate ${
                isActive ? 'text-[#0C1A36]' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}