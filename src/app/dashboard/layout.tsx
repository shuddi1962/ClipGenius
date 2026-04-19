'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
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
        const currentUser = await dbService.getCurrentUser()
        setUser(currentUser)

        // If user is not admin but trying to access admin pages, redirect
        if (window.location.pathname.startsWith('/admin') && currentUser?.role !== 'admin') {
          router.push('/dashboard')
        }

        // If user is admin but accessing regular dashboard, redirect to admin
        if (window.location.pathname === '/dashboard' && currentUser?.role === 'admin') {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        router.push('/login')
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

  if (!user) {
    return null
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