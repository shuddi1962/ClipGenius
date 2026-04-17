import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Roshanal Smart Marketing & Content Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate AI-powered marketing content, videos, and designs to boost your business growth
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/dashboard" className="block">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-white mb-2">Dashboard</h3>
              <p className="text-gray-300">View your recent content and manage projects</p>
            </div>
          </Link>

          <Link href="/content-generator" className="block">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-white mb-2">Content Generator</h3>
              <p className="text-gray-300">Generate captions, hashtags, and post ideas</p>
            </div>
          </Link>

          <Link href="/video-generator" className="block">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-white mb-2">Video Generator</h3>
              <p className="text-gray-300">Create promotional videos with AI</p>
            </div>
          </Link>

          <Link href="/saved-content" className="block">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-white mb-2">Saved Content</h3>
              <p className="text-gray-300">Access your drafts and generated content</p>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}