'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'
import {
  TrendingUp,
  Users,
  FileText,
  Video,
  Target,
  BarChart3,
  Zap,
  MessageSquare,
  Phone,
  Calendar,
  Settings,
  Plus,
  ArrowRight,
  Activity,
  DollarSign,
  Eye,
  MousePointer
} from 'lucide-react'

interface ClientDashboardProps {
  user: any
  stats: any
  todayIdea: any
  trendingTopics: any
  isLoadingIdea: boolean
  onRefreshIdea: () => void
  onRefreshTopics: () => void
}

export function ClientDashboard({
  user,
  stats,
  todayIdea,
  trendingTopics,
  isLoadingIdea,
  onRefreshIdea,
  onRefreshTopics
}: ClientDashboardProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'John'}! 👋
          </h1>
          <p className="text-gray-400 mt-2">{currentDate}</p>
          <p className="text-gray-500 text-sm mt-1">Ready to grow your business today?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <div className="text-xs text-green-400 font-medium">PLAN</div>
            <div className="text-lg font-bold text-green-400">Pro</div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">Total Leads</p>
              <p className="text-3xl font-bold text-white mt-1">2,847</p>
              <p className="text-xs text-green-400 mt-1">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-400">Qualified Leads</p>
              <p className="text-3xl font-bold text-white mt-1">1,429</p>
              <p className="text-xs text-green-400 mt-1">+8.2% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-400">Content Created</p>
              <p className="text-3xl font-bold text-white mt-1">156</p>
              <p className="text-xs text-purple-400 mt-1">+24 posts this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-400">Campaigns Sent</p>
              <p className="text-3xl font-bold text-white mt-1">89</p>
              <p className="text-xs text-orange-400 mt-1">+15.3% open rate</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - AI Insights & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Content Idea */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Content Idea</h3>
                  <p className="text-sm text-gray-400">Trending suggestion for your business</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onRefreshIdea}
                disabled={isLoadingIdea}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {isLoadingIdea ? 'Generating...' : '🔄 Refresh'}
              </Button>
            </div>

            {todayIdea && (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{todayIdea.title}</h4>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {todayIdea.format}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        High Engagement
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{todayIdea.caption}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {todayIdea.hashtags?.slice(0, 4).map((hashtag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                      {hashtag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Use This Idea
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/leads/scrape">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Scrape Leads</h4>
                      <p className="text-sm text-gray-400">Import from Google, Instagram, LinkedIn</p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    Start Scraping <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/content">
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Create Content</h4>
                      <p className="text-sm text-gray-400">AI-powered content generation</p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-400 text-sm font-medium">
                    Generate Now <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/campaigns/email">
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Send Campaign</h4>
                      <p className="text-sm text-gray-400">Email, WhatsApp, SMS outreach</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-400 text-sm font-medium">
                    Launch Campaign <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/analytics">
                <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">View Analytics</h4>
                      <p className="text-sm text-gray-400">Performance metrics & insights</p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-400 text-sm font-medium">
                    See Reports <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column - Trending & Activity */}
        <div className="space-y-8">
          {/* Trending Topics */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={onRefreshTopics}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                🔄
              </Button>
            </div>

            <div className="space-y-4">
              {trendingTopics.slice(0, 3).map((topic: any, index: number) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white line-clamp-2">{topic.title}</h4>
                    <span className="text-xs text-green-400 font-medium ml-2 flex-shrink-0">
                      {topic.trend}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{topic.reason}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 <strong>Pro Tip:</strong> Content about trending topics gets 3x more engagement. Use our AI to create posts about these rising trends.
              </p>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">Scraped 47 new leads from Google</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">Generated 3 Instagram posts</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">Sent WhatsApp campaign to 156 leads</p>
                  <p className="text-xs text-gray-400">6 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">Analytics report generated</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}