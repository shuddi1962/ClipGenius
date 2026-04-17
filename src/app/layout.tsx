import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roshanal Smart Marketing & Content Generator',
  description: 'AI-powered marketing content and video generator for businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}