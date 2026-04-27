'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Plus,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share,
  Mail,
  Phone,
  Globe,
  Settings,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface Review {
  id: string
  customerName: string
  customerEmail: string
  rating: number
  title: string
  content: string
  source: 'manual' | 'google' | 'yelp' | 'facebook' | 'widget'
  status: 'pending' | 'approved' | 'rejected'
  isPublic: boolean
  created_at: string
  response?: string
  responseDate?: string
}

interface ReviewRequest {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceType: string
  status: 'sent' | 'responded' | 'completed'
  sentDate: string
  responseDate?: string
  reviewUrl?: string
}

export default function ReputationPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'requests' | 'analytics' | 'settings'>('reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Analytics data
  const [analytics, setAnalytics] = useState({
    averageRating: 4.8,
    totalReviews: 1247,
    reviewSources: {
      google: 45,
      yelp: 23,
      facebook: 18,
      manual: 14
    },
    responseRate: 89,
    positiveReviews: 1123,
    negativeReviews: 15
  })

  useEffect(() => {
    if (activeTab === 'reviews' || activeTab === 'requests') {
      fetchData()
    }
  }, [activeTab])

  const fetchData = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      if (activeTab === 'reviews') {
        const { data, error } = await insforge
          .from('reviews')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setReviews(data || [])
      } else if (activeTab === 'requests') {
        const { data, error } = await insforge
          .from('review_requests')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('sent_date', { ascending: false })

        if (error) throw error
        setRequests(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReviewStatus = async (reviewId: string, status: Review['status']) => {
    try {
      const { error } = await insforge
        .from('reviews')
        .update({ status })
        .eq('id', reviewId)

      if (error) throw error

      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      ))
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to update review status')
    }
  }

  const respondToReview = async (reviewId: string, response: string) => {
    try {
      const { error } = await insforge
        .from('reviews')
        .update({
          response,
          response_date: new Date().toISOString()
        })
        .eq('id', reviewId)

      if (error) throw error

      setReviews(reviews.map(review =>
        review.id === reviewId ? {
          ...review,
          response,
          responseDate: new Date().toISOString()
        } : review
      ))
    } catch (error) {
      console.error('Error responding to review:', error)
      alert('Failed to submit response')
    }
  }

  const sendReviewRequest = async (requestData: Omit<ReviewRequest, 'id' | 'status' | 'sentDate'>) => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { error } = await insforge
        .from('review_requests')
        .insert({
          workspace_id: workspace.id,
          ...requestData,
          status: 'sent',
          sent_date: new Date().toISOString()
        })

      if (error) throw error

      alert('Review request sent successfully!')
      fetchData()
    } catch (error) {
      console.error('Error sending review request:', error)
      alert('Failed to send review request')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google': return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
      case 'yelp': return <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
      case 'facebook': return <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">F</div>
      default: return <MessageSquare className="w-6 h-6 text-gray-400" />
    }
  }

  const tabs = [
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'requests', name: 'Review Requests', icon: Send },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reputation Management</h1>
          <p className="text-gray-300">Manage reviews, send review requests, and monitor your online reputation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Share className="w-4 h-4 mr-2" />
            Share Widget
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Review Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#00F5FF]">{analytics.averageRating}</div>
                    <div className="text-gray-400 text-sm">Average Rating</div>
                  </div>
                  <Star className="w-8 h-8 text-[#00F5FF]" />
                </div>
                <div className="flex mt-2">
                  {renderStars(Math.round(analytics.averageRating))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{analytics.totalReviews}</div>
                    <div className="text-gray-400 text-sm">Total Reviews</div>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{analytics.responseRate}%</div>
                    <div className="text-gray-400 text-sm">Response Rate</div>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{analytics.positiveReviews}</div>
                    <div className="text-gray-400 text-sm">Positive Reviews</div>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-600 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getSourceIcon(review.source)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{review.customerName}</h3>
                            <Badge className={`${
                              review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {review.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-gray-400 text-sm">{review.created_at}</span>
                          </div>
                          <h4 className="text-white font-medium mb-2">{review.title}</h4>
                          <p className="text-gray-300">{review.content}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateReviewStatus(review.id, 'approved')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => updateReviewStatus(review.id, 'rejected')}
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Response Section */}
                    {review.response ? (
                      <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">R</span>
                          </div>
                          <span className="text-gray-400 text-sm">Your Response</span>
                          <span className="text-gray-500 text-xs">{review.responseDate}</span>
                        </div>
                        <p className="text-gray-300">{review.response}</p>
                      </div>
                    ) : (
                      review.status === 'approved' && (
                        <div className="mt-4">
                          <ResponseForm reviewId={review.id} onSubmit={(response) => respondToReview(review.id, response)} />
                        </div>
                      )
                    )}
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-400 mb-6">
                      Reviews will appear here once customers leave feedback
                    </p>
                    <Button onClick={() => setActiveTab('requests')} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Review Requests
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Review Requests</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Send New Request
            </Button>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{request.customerName}</div>
                      <div className="text-gray-400 text-sm">{request.customerEmail}</div>
                      <div className="text-gray-400 text-sm">{request.serviceType}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${
                        request.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        request.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {request.status}
                      </Badge>
                      <div className="text-gray-400 text-sm">{request.sentDate}</div>
                    </div>
                  </div>
                ))}

                {requests.length === 0 && (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No review requests sent</h3>
                    <p className="text-gray-400">
                      Send review requests to your customers to encourage feedback
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Review Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.reviewSources).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getSourceIcon(source)}
                        <span className="text-white capitalize">{source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#00F5FF] h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(analytics.reviewSources))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm w-8">{count}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Review Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Review trend chart</p>
                    <p className="text-sm mt-2">Shows review volume over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Review Widget Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Widget Code
                </label>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <code className="text-green-400 text-sm">
                    {`<script src="https://clipgenius.com/widgets/reviews.js"></script>
<div id="clipgenius-reviews" data-business-id="YOUR_BUSINESS_ID"></div>`}
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Add this code to your website to display the review widget
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-Response Settings
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <label className="text-gray-300 text-sm">Auto-respond to 5-star reviews</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <label className="text-gray-300 text-sm">Auto-respond to negative reviews</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Response Form Component
function ResponseForm({ reviewId, onSubmit }: { reviewId: string, onSubmit: (response: string) => void }) {
  const [response, setResponse] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (response.trim()) {
      onSubmit(response)
      setResponse('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Write your response to this review..."
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[100px] resize-none"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="w-4 h-4 mr-1" />
          Submit Response
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          onClick={() => setResponse('')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}