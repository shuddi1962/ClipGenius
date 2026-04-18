import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How AI is Revolutionizing Small Business Marketing",
      excerpt: "Discover how artificial intelligence is leveling the playing field for small businesses, enabling them to compete with enterprise-level marketing strategies.",
      author: "Sarah Johnson",
      date: "2025-01-15",
      readTime: "5 min read",
      category: "AI Marketing",
      tags: ["AI", "Small Business", "Marketing"],
      featured: true
    },
    {
      id: 2,
      title: "The Complete Guide to Lead Generation Automation",
      excerpt: "Learn how to set up automated lead generation systems that work 24/7, from initial contact to qualified prospect.",
      author: "Michael Chen",
      date: "2025-01-12",
      readTime: "8 min read",
      category: "Lead Generation",
      tags: ["Automation", "Leads", "Sales"],
      featured: false
    },
    {
      id: 3,
      title: "Social Media Posting: Manual vs Automated Strategies",
      excerpt: "Compare the pros and cons of manual social media management versus AI-powered automation platforms.",
      author: "Emily Rodriguez",
      date: "2025-01-10",
      readTime: "6 min read",
      category: "Social Media",
      tags: ["Social Media", "Automation", "Strategy"],
      featured: false
    },
    {
      id: 4,
      title: "Building Customer Relationships with AI Voice Agents",
      excerpt: "Explore how AI voice agents are transforming customer service and lead qualification processes.",
      author: "David Kim",
      date: "2025-01-08",
      readTime: "7 min read",
      category: "Customer Service",
      tags: ["AI", "Voice", "Customer Service"],
      featured: false
    },
    {
      id: 5,
      title: "Email Marketing Automation: Best Practices for 2025",
      excerpt: "Stay ahead of the curve with the latest email marketing automation strategies and compliance requirements.",
      author: "Sarah Johnson",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "Email Marketing",
      tags: ["Email", "Automation", "Compliance"],
      featured: false
    },
    {
      id: 6,
      title: "Competitor Analysis: Using AI to Stay Ahead",
      excerpt: "Learn how to leverage AI-powered competitor monitoring to identify opportunities and optimize your strategy.",
      author: "Michael Chen",
      date: "2025-01-03",
      readTime: "5 min read",
      category: "Strategy",
      tags: ["Competitor Analysis", "Strategy", "AI"],
      featured: false
    }
  ]

  const categories = ["All", "AI Marketing", "Lead Generation", "Social Media", "Customer Service", "Email Marketing", "Strategy"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Insights, strategies, and best practices for AI-powered marketing automation.
            Stay ahead of the curve with expert guidance and industry trends.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.find(post => post.featured) && (
          <Card className="p-8 mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {(() => {
              const featured = blogPosts.find(post => post.featured)!
              return (
                <div className="max-w-4xl">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      Featured Article
                    </span>
                    <span className="ml-4 px-3 py-1 bg-white/20 rounded-full text-sm">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-xl mb-6 text-blue-100">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{featured.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(featured.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{featured.readTime}</span>
                      </div>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      Read Article
                    </Button>
                  </div>
                </div>
              )
            })()}
          </Card>
        )}

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-6 text-blue-100">
            Get the latest insights on AI marketing automation delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-3">
            No spam, unsubscribe at any time.
          </p>
        </Card>
      </div>
    </div>
  )
}