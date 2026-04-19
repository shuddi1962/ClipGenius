'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Sidebar from '@/components/Sidebar'
import { Sparkles } from 'lucide-react'
import { dbService } from '@/lib/database'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // For demo purposes, always simulate authenticated user
        // In production, check actual auth tokens/sessions
        const mockUser = {
          id: 'user_1',
          name: 'Demo User',
          email: 'user@clipgenius.com',
          role: 'client' // Change to 'admin' to test admin dashboard
        }

        setUser(mockUser)

        // If user is admin, redirect to admin dashboard
        if (mockUser.role === 'admin' && !window.location.pathname.startsWith('/admin')) {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        // For demo, still show authenticated state
        setUser({
          id: 'user_demo',
          name: 'Demo User',
          email: 'demo@clipgenius.com',
          role: 'client'
        })
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={user?.role === 'admin' ? 'admin' : 'client'}
      />
      <main className="flex-1 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}