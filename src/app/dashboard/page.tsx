import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your marketing content and projects</p>
        </div>

        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Instagram Post</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Published</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Video Promo</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Draft</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/content-generator">
                <Button className="w-full justify-start">
                  📝 Generate Content
                </Button>
              </Link>
              <Link href="/video-generator">
                <Button variant="secondary" className="w-full justify-start">
                  🎥 Create Video
                </Button>
              </Link>
              <Link href="/saved-content">
                <Button variant="outline" className="w-full justify-start">
                  📁 View Saved Content
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Content Generated</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Videos Created</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drafts</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Content Generation Panel</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Select business type</option>
                <option>E-commerce</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g., Young professionals"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service
              </label>
              <input
                type="text"
                placeholder="Describe your product or service"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <Button>Generate Content</Button>
          </div>
        </Card>
      </div>
    </main>
  )
}