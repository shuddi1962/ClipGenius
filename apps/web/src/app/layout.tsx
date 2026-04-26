import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClipGenius - AI Marketing Automation Platform',
  description: 'The AI that grows your business while you sleep. Scrape leads, qualify prospects, send campaigns, post content, and close deals — all automated.',
  keywords: 'AI marketing, lead generation, automation, social media, email marketing, business growth',
  openGraph: {
    title: 'ClipGenius - AI Marketing Automation Platform',
    description: 'The AI that grows your business while you sleep',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if we're on a dashboard/admin page that needs the sidebar
  const isDashboardPage = typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/dashboard') ||
     window.location.pathname.startsWith('/admin'))

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`bg-[#050A18] text-white min-h-screen`}>
        {isDashboardPage ? (
          <DashboardLayout>{children}</DashboardLayout>
        ) : (
          children
        )}
      </body>
    </html>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-[#050A18]">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}