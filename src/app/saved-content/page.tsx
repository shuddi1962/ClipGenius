'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface SavedItem {
  id: string
  type: 'content' | 'video'
  title: string
  createdAt: string
  status: 'draft' | 'published'
  content?: {
    captions: string[]
    hashtags: string[]
    postIdeas: string[]
  }
  videoUrl?: string
}

export default function SavedContent() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [filter, setFilter] = useState<'all' | 'content' | 'video'>('all')

  // Mock data for now
  useEffect(() => {
    const mockItems: SavedItem[] = [
      {
        id: '1',
        type: 'content',
        title: 'Coffee Shop Marketing Content',
        createdAt: '2024-01-15',
        status: 'draft',
        content: {
          captions: ['Great coffee for great mornings! ☕'],
          hashtags: ['#Coffee', '#Morning'],
          postIdeas: ['Morning routine post']
        }
      },
      {
        id: '2',
        type: 'video',
        title: 'Product Promo Video',
        createdAt: '2024-01-14',
        status: 'published',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      }
    ]
    setSavedItems(mockItems)
  }, [])

  const filteredItems = savedItems.filter(item =>
    filter === 'all' || item.type === filter
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Content</h1>
          <p className="text-gray-600">Access your drafts and published content</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'content' ? 'primary' : 'outline'}
              onClick={() => setFilter('content')}
            >
              Content
            </Button>
            <Button
              variant={filter === 'video' ? 'primary' : 'outline'}
              onClick={() => setFilter('video')}
            >
              Videos
            </Button>
          </div>
        </div>

        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  item.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {item.type === 'content' && item.content && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Captions</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.content.captions[0]}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hashtags</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.content.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'video' && item.videoUrl && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Video Preview</h4>
                  <div className="aspect-video bg-gray-200 rounded">
                    <video
                      src={item.videoUrl}
                      className="w-full h-full rounded object-cover"
                      muted
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  {item.status === 'draft' ? 'Publish' : 'Share'}
                </Button>
                <Button size="sm" variant="outline">
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved content</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all'
                  ? 'Start generating content to see it here'
                  : `No ${filter} content saved yet`
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button as="a" href="/content-generator">
                  Generate Content
                </Button>
                <Button as="a" href="/video-generator" variant="secondary">
                  Create Video
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}