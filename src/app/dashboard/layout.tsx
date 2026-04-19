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
    // Show a demo dashboard for development/testing
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole="client"
        />
        <main className="flex-1 transition-all duration-300">
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00F5FF] to-[#FFB800] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Welcome to ClipGenius</h1>
                <p className="text-gray-400 mb-6">Your AI-powered marketing automation platform</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] hover:from-[#00F5FF]/80 hover:to-[#FFB800]/80">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
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