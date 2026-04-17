import type { Metadata } from 'next'
import './globals.css'

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
      <body className="antialiased font-['Cabinet_Grotesk'] bg-[#050A18] text-white">
        {children}
      </body>
    </html>
  )
}