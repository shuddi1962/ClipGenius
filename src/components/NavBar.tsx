import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Roshanal
          </Link>
          <div className="flex space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/content-generator" className="text-gray-600 hover:text-gray-900">
              Content
            </Link>
            <Link href="/video-generator" className="text-gray-600 hover:text-gray-900">
              Video
            </Link>
            <Link href="/saved-content" className="text-gray-600 hover:text-gray-900">
              Saved
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}