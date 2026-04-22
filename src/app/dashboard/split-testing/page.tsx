'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Split,
  Plus,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Eye,
  MousePointer,
  CheckCircle,
  AlertTriangle,
  Settings,
  Target
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface ABTest {
  id: string
  name: string
  description: string
  campaignType: 'email' | 'sms' | 'social'
  status: 'draft' | 'running' | 'completed' | 'stopped'
  testType: 'subject_line' | 'content' | 'send_time' | 'audience_segment'
  variants: ABVariant[]
  winner?: string
  startDate?: string
  endDate?: string
  created_at: string
}

interface ABVariant {
  id: string
  name: string
  content: string
  subject?: string
  sendTime?: string
  audienceSize: number
  sent: number
  opened: number
  clicked: number
  converted: number
  openRate: number
  clickRate: number
  conversionRate: number
}

export default function SplitTestingPage() {
  const [activeTab, setActiveTab] = useState<'tests' | 'create' | 'analytics'>('tests')
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  // New test form
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    campaignType: 'email' as ABTest['campaignType'],
    testType: 'subject_line' as ABTest['testType'],
    variants: [
      { name: 'Variant A', content: '', subject: '', audienceSize: 50 },
      { name: 'Variant B', content: '', subject: '', audienceSize: 50 }
    ]
  })

  useEffect(() => {
    if (activeTab === 'tests' || activeTab === 'analytics') {
      fetchTests()
    }
  }, [activeTab])

  const fetchTests = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('ab_tests')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTests(data || [])
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTest = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      // Calculate metrics for variants
      const variantsWithMetrics = newTest.variants.map(variant => ({
        ...variant,
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0
      }))

      const { error } = await insforge
        .from('ab_tests')
        .insert({
          workspace_id: workspace.id,
          name: newTest.name,
          description: newTest.description,
          campaign_type: newTest.campaignType,
          test_type: newTest.testType,
          status: 'draft',
          variants: variantsWithMetrics
        })

      if (error) throw error

      alert('A/B test created successfully!')
      setActiveTab('tests')
      setNewTest({
        name: '',
        description: '',
        campaignType: 'email',
        testType: 'subject_line',
        variants: [
          { name: 'Variant A', content: '', subject: '', audienceSize: 50 },
          { name: 'Variant B', content: '', subject: '', audienceSize: 50 }
        ]
      })
      fetchTests()
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create A/B test')
    }
  }

  const startTest = async (testId: string) => {
    try {
      const { error } = await insforge
        .from('ab_tests')
        .update({
          status: 'running',
          start_date: new Date().toISOString()
        })
        .eq('id', testId)

      if (error) throw error

      setTests(tests.map(test =>
        test.id === testId ? { ...test, status: 'running', startDate: new Date().toISOString() } : test
      ))
    } catch (error) {
      console.error('Error starting test:', error)
      alert('Failed to start A/B test')
    }
  }

  const stopTest = async (testId: string, winnerVariantId?: string) => {
    try {
      const { error } = await insforge
        .from('ab_tests')
        .update({
          status: 'completed',
          end_date: new Date().toISOString(),
          winner: winnerVariantId
        })
        .eq('id', testId)

      if (error) throw error

      setTests(tests.map(test =>
        test.id === testId ? {
          ...test,
          status: 'completed',
          endDate: new Date().toISOString(),
          winner: winnerVariantId
        } : test
      ))
    } catch (error) {
      console.error('Error stopping test:', error)
      alert('Failed to stop A/B test')
    }
  }

  const addVariant = () => {
    const newVariant = {
      name: `Variant ${String.fromCharCode(65 + newTest.variants.length)}`,
      content: '',
      subject: '',
      audienceSize: Math.floor(100 / (newTest.variants.length + 1))
    }

    // Redistribute audience sizes
    const totalVariants = newTest.variants.length + 1
    const redistributedVariants = newTest.variants.map(v => ({
      ...v,
      audienceSize: Math.floor(100 / totalVariants)
    }))

    setNewTest(prev => ({
      ...prev,
      variants: [...redistributedVariants, newVariant]
    }))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    setNewTest(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const removeVariant = (index: number) => {
    if (newTest.variants.length <= 2) return

    setNewTest(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const getTestTypeLabel = (type: string) => {
    switch (type) {
      case 'subject_line': return 'Subject Line'
      case 'content': return 'Content'
      case 'send_time': return 'Send Time'
      case 'audience_segment': return 'Audience Segment'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500/20 text-blue-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'stopped': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const calculateWinner = (test: ABTest): string | undefined => {
    if (test.testType === 'subject_line' || test.testType === 'content') {
      // Find variant with highest click rate
      return test.variants.reduce((winner, variant) =>
        variant.clickRate > winner.clickRate ? variant.id : winner.id,
        test.variants[0].id
      )
    } else if (test.testType === 'send_time') {
      // Find variant with highest open rate
      return test.variants.reduce((winner, variant) =>
        variant.openRate > winner.openRate ? variant.id : winner.id,
        test.variants[0].id
      )
    }
    return test.variants[0].id
  }

  const tabs = [
    { id: 'tests', name: 'A/B Tests', icon: Split },
    { id: 'create', name: 'Create Test', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
          <h1 className="text-3xl font-bold text-white mb-2">Split Testing (A/B Tests)</h1>
          <p className="text-gray-300">Optimize your campaigns with data-driven A/B testing</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New A/B Test
        </Button>
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

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{test.name}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{test.description}</p>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{getTestTypeLabel(test.testType)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Campaign:</span>
                    <span className="text-white capitalize">{test.campaignType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Variants:</span>
                    <span className="text-white">{test.variants.length}</span>
                  </div>

                  {test.status === 'running' && (
                    <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                      <div className="text-blue-400 text-sm mb-2">Test in Progress</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">65% complete</div>
                    </div>
                  )}

                  {test.status === 'completed' && test.winner && (
                    <div className="mt-4 p-3 bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Winner: {test.variants.find(v => v.id === test.winner)?.name}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {test.status === 'draft' && (
                      <Button
                        onClick={() => startTest(test.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start Test
                      </Button>
                    )}
                    {test.status === 'running' && (
                      <Button
                        onClick={() => stopTest(test.id, calculateWinner(test))}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 flex-1"
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Stop Test
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {tests.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Split className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No A/B tests yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first A/B test to optimize your campaign performance
              </p>
              <Button onClick={() => setActiveTab('create')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Test
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Test Tab */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create A/B Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Name
                  </label>
                  <Input
                    value={newTest.name}
                    onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Subject Line Test #1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Type
                  </label>
                  <select
                    value={newTest.campaignType}
                    onChange={(e) => setNewTest(prev => ({ ...prev, campaignType: e.target.value as ABTest['campaignType'] }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="email">Email Campaign</option>
                    <option value="sms">SMS Campaign</option>
                    <option value="social">Social Media Post</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Type
                </label>
                <select
                  value={newTest.testType}
                  onChange={(e) => setNewTest(prev => ({ ...prev, testType: e.target.value as ABTest['testType'] }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                >
                  <option value="subject_line">Subject Line</option>
                  <option value="content">Content</option>
                  <option value="send_time">Send Time</option>
                  <option value="audience_segment">Audience Segment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Input
                  value={newTest.description}
                  onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Testing different subject lines to improve open rates"
                />
              </div>

              {/* Test Variants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Test Variants</h3>
                  <Button onClick={addVariant} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-4">
                  {newTest.variants.map((variant, index) => (
                    <div key={index} className="p-4 border border-gray-600 rounded-lg bg-gray-700/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#00F5FF] rounded-full flex items-center justify-center text-black font-bold text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <Input
                            value={variant.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            className="bg-gray-600 border-gray-500 text-white font-medium"
                            placeholder="Variant name"
                          />
                        </div>

                        {newTest.variants.length > 2 && (
                          <Button
                            onClick={() => removeVariant(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {(newTest.testType === 'subject_line' || newTest.campaignType === 'email') && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subject Line
                          </label>
                          <Input
                            value={variant.subject}
                            onChange={(e) => updateVariant(index, 'subject', e.target.value)}
                            className="bg-gray-600 border-gray-500 text-white"
                            placeholder="Enter subject line..."
                          />
                        </div>
                      )}

                      {(newTest.testType === 'content' || newTest.testType === 'subject_line') && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content
                          </label>
                          <textarea
                            value={variant.content}
                            onChange={(e) => updateVariant(index, 'content', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[100px] resize-none"
                            placeholder="Enter content..."
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Audience Size (%)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={variant.audienceSize}
                          onChange={(e) => updateVariant(index, 'audienceSize', parseInt(e.target.value) || 0)}
                          className="bg-gray-600 border-gray-500 text-white w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-300">
                    <strong>Total Audience Distribution:</strong>{' '}
                    {newTest.variants.reduce((sum, v) => sum + v.audienceSize, 0)}%
                    {newTest.variants.reduce((sum, v) => sum + v.audienceSize, 0) !== 100 && (
                      <span className="text-yellow-400 ml-2">
                        (Should total 100% for optimal testing)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('tests')}
                >
                  Cancel
                </Button>
                <Button onClick={createTest} disabled={!newTest.name || newTest.variants.length < 2} className="bg-blue-600 hover:bg-blue-700">
                  <Split className="w-4 h-4 mr-2" />
                  Create A/B Test
                </Button>
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
                <CardTitle className="text-white">A/B Test Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tests.filter(t => t.status === 'completed').slice(0, 5).map((test) => (
                    <div key={test.id} className="p-4 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{test.name}</h4>
                        <Badge className="bg-green-500/20 text-green-400">
                          Winner: {test.variants.find(v => v.id === test.winner)?.name}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Best Open Rate:</span>
                          <span className="text-white ml-2">
                            {Math.max(...test.variants.map(v => v.openRate)).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Click Rate:</span>
                          <span className="text-white ml-2">
                            {Math.max(...test.variants.map(v => v.clickRate)).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {tests.filter(t => t.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No completed A/B tests yet</p>
                      <p className="text-sm mt-2">Complete tests to see performance analytics</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Testing Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Target className="w-4 h-4" />
                      <span className="font-medium">Subject Line Testing</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Tests show that personalized subject lines increase open rates by an average of 23%.
                    </p>
                  </div>

                  <div className="p-4 bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Send Time Optimization</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Tuesday and Wednesday sends typically perform 15% better than weekend sends.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Content Testing</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Shorter, benefit-focused content outperforms lengthy explanations by 31%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}