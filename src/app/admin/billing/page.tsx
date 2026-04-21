import { CreditCard, DollarSign, Users, TrendingUp, Calendar, Download, Filter, Search, BarChart3, PieChart, Activity, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Subscription {
  id: string
  userId: string
  userEmail: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'trial'
  amount: number
  currency: string
  interval: 'month' | 'year'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
}

interface RevenueMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  churnRate: number
  newSubscriptions: number
  canceledSubscriptions: number
  averageRevenuePerUser: number
  lifetimeValue: number
}

export default function BillingPage() {
  // Mock data - in real app, this would come from your billing provider (Stripe, etc.)
  const subscriptions: Subscription[] = [
    {
      id: 'sub_1',
      userId: 'user_1',
      userEmail: 'john@company.com',
      plan: 'professional',
      status: 'active',
      amount: 99,
      currency: 'USD',
      interval: 'month',
      currentPeriodStart: '2024-04-01',
      currentPeriodEnd: '2024-05-01',
      cancelAtPeriodEnd: false,
      createdAt: '2024-01-15'
    },
    {
      id: 'sub_2',
      userId: 'user_2',
      userEmail: 'sarah@startup.io',
      plan: 'enterprise',
      status: 'active',
      amount: 299,
      currency: 'USD',
      interval: 'month',
      currentPeriodStart: '2024-04-01',
      currentPeriodEnd: '2024-05-01',
      cancelAtPeriodEnd: false,
      createdAt: '2024-02-20'
    },
    {
      id: 'sub_3',
      userId: 'user_3',
      userEmail: 'mike@agency.com',
      plan: 'starter',
      status: 'trial',
      amount: 0,
      currency: 'USD',
      interval: 'month',
      currentPeriodStart: '2024-04-15',
      currentPeriodEnd: '2024-05-15',
      cancelAtPeriodEnd: false,
      createdAt: '2024-04-15'
    }
  ]

  const metrics: RevenueMetrics = {
    totalRevenue: 45280,
    monthlyRecurringRevenue: 12850,
    annualRecurringRevenue: 154200,
    churnRate: 2.3,
    newSubscriptions: 45,
    canceledSubscriptions: 8,
    averageRevenuePerUser: 87.50,
    lifetimeValue: 1050
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'trial': return 'bg-blue-500/20 text-blue-400'
      case 'canceled': return 'bg-red-500/20 text-red-400'
      case 'past_due': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-gray-500/20 text-gray-400'
      case 'professional': return 'bg-blue-500/20 text-blue-400'
      case 'enterprise': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing & Revenue</h1>
          <p className="text-gray-400 mt-2">Monitor subscriptions, payments, and financial performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Billing Settings
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${metrics.monthlyRecurringRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Churn Rate</CardTitle>
            <Activity className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.churnRate}%</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">-0.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">ARPU</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${metrics.averageRevenuePerUser}</div>
            <p className="text-xs text-gray-400">
              Average revenue per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Active Subscriptions</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-9 bg-gray-700 border-gray-600 text-white w-64"
                />
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Next Billing</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{subscription.userEmail}</div>
                      <div className="text-gray-400 text-sm">ID: {subscription.userId}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getPlanColor(subscription.plan)}>
                        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-white">
                      ${subscription.amount}/{subscription.interval}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          Edit
                        </Button>
                        {subscription.status === 'active' && (
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Revenue chart would be displayed here</p>
                <p className="text-sm mt-2">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Subscription distribution chart</p>
                <p className="text-sm mt-2">Shows plan distribution and status breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'txn_1', customer: 'john@company.com', amount: 99, status: 'succeeded', date: '2024-04-15' },
              { id: 'txn_2', customer: 'sarah@startup.io', amount: 299, status: 'succeeded', date: '2024-04-15' },
              { id: 'txn_3', customer: 'mike@agency.com', amount: 29, status: 'succeeded', date: '2024-04-14' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.status === 'succeeded' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      transaction.status === 'succeeded' ? 'text-green-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{transaction.customer}</div>
                    <div className="text-gray-400 text-sm">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${transaction.amount}</div>
                  <Badge className={transaction.status === 'succeeded' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}