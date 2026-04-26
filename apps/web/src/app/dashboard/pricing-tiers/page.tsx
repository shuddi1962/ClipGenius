'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Crown,
  Star,
  Zap,
  Users,
  Settings,
  BarChart3,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  DollarSign
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    leads: number
    campaigns: number
    users: number
    storage_gb: number
  }
  is_popular: boolean
  is_active: boolean
  stripe_price_id?: string
  created_at: string
}

export default function PricingTiersPage() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'subscribers' | 'analytics'>('tiers')
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)

  // New tier form
  const [newTier, setNewTier] = useState<{
    name: string;
    description: string;
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    limits: {
      leads: number;
      campaigns: number;
      users: number;
      storage_gb: number;
    };
    is_popular: boolean;
    featureInput: string;
  }>({
    name: '',
    description: '',
    price: 0,
    interval: 'monthly',
    features: [],
    limits: {
      leads: 1000,
      campaigns: 10,
      users: 5,
      storage_gb: 10
    },
    is_popular: false,
    featureInput: ''
  })

  useEffect(() => {
    if (activeTab === 'tiers' || activeTab === 'subscribers') {
      fetchTiers()
    }
  }, [activeTab])

  const fetchTiers = async () => {
    try {
      const { data, error } = await insforge
        .from('pricing_tiers')
        .select('*')
        .order('price', { ascending: true })

      if (error) throw error
      setTiers(data || [])
    } catch (error) {
      console.error('Error fetching pricing tiers:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTier = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { error } = await insforge
        .from('pricing_tiers')
        .insert({
          name: newTier.name,
          description: newTier.description,
          price: newTier.price,
          interval: newTier.interval,
          features: newTier.features.filter(f => f.trim()),
          limits: newTier.limits,
          is_popular: newTier.is_popular,
          is_active: true
        })

      if (error) throw error

      alert('Pricing tier created successfully!')
      setShowNewForm(false)
      setNewTier({
        name: '',
        description: '',
        price: 0,
        interval: 'monthly',
        features: [],
        limits: {
          leads: 1000,
          campaigns: 10,
          users: 5,
          storage_gb: 10
        },
        is_popular: false,
        featureInput: ''
      })
      fetchTiers()
    } catch (error) {
      console.error('Error creating tier:', error)
      alert('Failed to create pricing tier')
    }
  }

  const toggleTierStatus = async (tierId: string, isActive: boolean) => {
    try {
      const { error } = await insforge
        .from('pricing_tiers')
        .update({ is_active: !isActive })
        .eq('id', tierId)

      if (error) throw error
      fetchTiers()
    } catch (error) {
      console.error('Error updating tier status:', error)
    }
  }

  const deleteTier = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this pricing tier?')) return

    try {
      const { error } = await insforge
        .from('pricing_tiers')
        .delete()
        .eq('id', tierId)

      if (error) throw error
      setTiers(tiers.filter(tier => tier.id !== tierId))
    } catch (error) {
      console.error('Error deleting tier:', error)
      alert('Failed to delete pricing tier')
    }
  }

  const addFeature = () => {
    if (newTier.featureInput.trim() && !newTier.features.includes(newTier.featureInput.trim())) {
      setNewTier(prev => ({
        ...prev,
        features: [...prev.features, prev.featureInput.trim()],
        featureInput: ''
      }))
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setNewTier(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== featureToRemove)
    }))
  }

  const tabs = [
    { id: 'tiers', name: 'Pricing Tiers', icon: Crown },
    { id: 'subscribers', name: 'Subscribers', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  const sampleTiers = [
    {
      name: 'Starter',
      price: 49,
      interval: 'monthly',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 1,000 leads',
        '5 email campaigns/month',
        'Basic analytics',
        'Email support'
      ],
      limits: { leads: 1000, campaigns: 5, users: 3, storage_gb: 5 },
      is_popular: false
    },
    {
      name: 'Professional',
      price: 99,
      interval: 'monthly',
      description: 'Advanced features for growing businesses',
      features: [
        'Up to 10,000 leads',
        'Unlimited campaigns',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      limits: { leads: 10000, campaigns: -1, users: 10, storage_gb: 50 },
      is_popular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      interval: 'monthly',
      description: 'Complete solution for large organizations',
      features: [
        'Unlimited leads',
        'Unlimited campaigns',
        'White-label options',
        'Dedicated support',
        'API access',
        'Custom development'
      ],
      limits: { leads: -1, campaigns: -1, users: -1, storage_gb: 500 },
      is_popular: false
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Tiers</h1>
          <p className="text-gray-300">Manage subscription plans and pricing</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Tier
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

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          {/* Tiers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.id} className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors relative ${
                tier.is_popular ? 'ring-2 ring-[#00F5FF]' : ''
              }`}>
                {tier.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#00F5FF] text-black px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-xl flex items-center gap-2">
                        {tier.name}
                        {!tier.is_active && (
                          <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{tier.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">${tier.price}</span>
                      <span className="text-gray-400 ml-1">/{tier.interval}</span>
                    </div>

                    {/* Limits */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Leads:</span>
                        <span>{tier.limits.leads === -1 ? 'Unlimited' : tier.limits.leads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Campaigns:</span>
                        <span>{tier.limits.campaigns === -1 ? 'Unlimited' : tier.limits.campaigns}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Users:</span>
                        <span>{tier.limits.users === -1 ? 'Unlimited' : tier.limits.users}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Storage:</span>
                        <span>{tier.limits.storage_gb === -1 ? 'Unlimited' : `${tier.limits.storage_gb}GB`}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {tier.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {tier.features.length > 3 && (
                        <div className="text-sm text-gray-400">
                          +{tier.features.length - 3} more features
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => toggleTierStatus(tier.id, tier.is_active)}
                        size="sm"
                        variant={tier.is_active ? "destructive" : "default"}
                        className={tier.is_active ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        {tier.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        onClick={() => deleteTier(tier.id)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sample Tiers */}
            {tiers.length === 0 && (
              <div className="col-span-full">
                <h3 className="text-xl font-semibold text-white mb-4">Sample Pricing Tiers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleTiers.map((tier, index) => (
                    <Card key={index} className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors relative ${
                      tier.is_popular ? 'ring-2 ring-[#00F5FF]' : ''
                    }`}>
                      {tier.is_popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-[#00F5FF] text-black px-3 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                        <p className="text-gray-400 text-sm">{tier.description}</p>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white">${tier.price}</span>
                            <span className="text-gray-400 ml-1">/{tier.interval}</span>
                          </div>

                          <div className="space-y-2">
                            {tier.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white w-full">
                            <Plus className="w-4 h-4 mr-1" />
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Management</CardTitle>
              <p className="text-gray-400">Manage user subscriptions and billing</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-gray-400">
                  Subscriber management and billing integration will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Monthly Recurring Revenue</div>
                    <div className="text-gray-400 text-sm">Current month</div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">$12,450</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Active Subscribers</div>
                    <div className="text-gray-400 text-sm">Across all tiers</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">127</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Churn Rate</div>
                    <div className="text-gray-400 text-sm">Last 30 days</div>
                  </div>
                  <div className="text-2xl font-bold text-red-400">2.3%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { tier: 'Starter', subscribers: 45, percentage: 35.4, color: 'bg-blue-500' },
                  { tier: 'Professional', subscribers: 67, percentage: 52.8, color: 'bg-green-500' },
                  { tier: 'Enterprise', subscribers: 15, percentage: 11.8, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-white text-sm">{item.tier}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">{item.subscribers} users</span>
                      <span className="text-gray-300 text-sm">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Tier Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border border-gray-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Create Pricing Tier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tier Name
                  </label>
                  <Input
                    value={newTier.name}
                    onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Professional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Billing Interval
                  </label>
                  <select
                    value={newTier.interval}
                    onChange={(e) => setNewTier(prev => ({ ...prev, interval: e.target.value as 'monthly' | 'yearly' }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Input
                  value={newTier.description}
                  onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Perfect for growing businesses"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($)
                  </label>
                  <Input
                    type="number"
                    value={newTier.price}
                    onChange={(e) => setNewTier(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="99"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={newTier.is_popular}
                    onChange={(e) => setNewTier(prev => ({ ...prev, is_popular: e.target.checked }))}
                    className="rounded border-gray-600 text-[#00F5FF] focus:ring-[#00F5FF]"
                  />
                  <label htmlFor="popular" className="text-sm font-medium text-gray-300">
                    Mark as Most Popular
                  </label>
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Usage Limits</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Leads Limit
                    </label>
                    <Input
                      type="number"
                      value={newTier.limits.leads}
                      onChange={(e) => setNewTier(prev => ({
                        ...prev,
                        limits: { ...prev.limits, leads: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Campaigns Limit
                    </label>
                    <Input
                      type="number"
                      value={newTier.limits.campaigns}
                      onChange={(e) => setNewTier(prev => ({
                        ...prev,
                        limits: { ...prev.limits, campaigns: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Users Limit
                    </label>
                    <Input
                      type="number"
                      value={newTier.limits.users}
                      onChange={(e) => setNewTier(prev => ({
                        ...prev,
                        limits: { ...prev.limits, users: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Storage (GB)
                    </label>
                    <Input
                      type="number"
                      value={newTier.limits.storage_gb}
                      onChange={(e) => setNewTier(prev => ({
                        ...prev,
                        limits: { ...prev.limits, storage_gb: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="50"
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Use -1 for unlimited
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTier.featureInput}
                    onChange={(e) => setNewTier(prev => ({ ...prev, featureInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    placeholder="Add a feature (e.g., Advanced analytics)"
                  />
                  <Button onClick={addFeature} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {newTier.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {newTier.features.map((feature) => (
                      <Badge
                        key={feature}
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                        onClick={() => removeFeature(feature)}
                      >
                        {feature} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createTier} disabled={!newTier.name || newTier.price <= 0} className="bg-blue-600 hover:bg-blue-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Create Tier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}