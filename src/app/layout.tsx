import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Roshanal Infotech - Smart Marketing & Content Generator',
  description: 'AI-powered marketing content and video generator for Roshanal Infotech Limited',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-manrope">
        <div className="flex h-full bg-gray-50">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64">
              <Sidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  )
}