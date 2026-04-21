'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  CreditCard,
  DollarSign,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  FileText
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Payment {
  id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  customer_email?: string
  created_at: string
  completed_at?: string
  failed_at?: string
}

interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  items: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
  created_at: string
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'create-invoice'>('payments')
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Invoice creation state
  const [invoiceForm, setInvoiceForm] = useState({
    customer_name: '',
    customer_email: '',
    due_date: '',
    items: [{ description: '', quantity: 1, unit_price: 0 }]
  })

  useEffect(() => {
    if (activeTab === 'payments' || activeTab === 'invoices') {
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

      if (activeTab === 'payments') {
        const { data, error } = await insforge
          .from('payments')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPayments(data || [])
      } else if (activeTab === 'invoices') {
        const { data, error } = await insforge
          .from('invoices')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setInvoices(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 99.99,
          currency: 'USD',
          description: 'Test Payment',
          customerEmail: 'test@example.com'
        })
      })

      if (!response.ok) throw new Error('Failed to create payment')

      const { clientSecret } = await response.json()
      console.log('Payment intent created:', clientSecret)
      alert('Payment intent created successfully!')
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Failed to create payment')
    }
  }

  const createInvoice = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const total = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      const invoiceNumber = `INV-${Date.now()}`

      const { error } = await insforge
        .from('invoices')
        .insert({
          workspace_id: workspace.id,
          invoice_number: invoiceNumber,
          customer_name: invoiceForm.customer_name,
          customer_email: invoiceForm.customer_email,
          amount: total,
          currency: 'USD',
          status: 'draft',
          due_date: invoiceForm.due_date,
          items: invoiceForm.items
        })

      if (error) throw error

      alert('Invoice created successfully!')
      setActiveTab('invoices')
      fetchData()
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Failed to create invoice')
    }
  }

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }))
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid': return 'bg-green-500/20 text-green-400'
      case 'pending':
      case 'sent':
      case 'draft': return 'bg-blue-500/20 text-blue-400'
      case 'failed':
      case 'overdue':
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'failed':
      case 'overdue':
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const tabs = [
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'invoices', name: 'Invoices', icon: Receipt },
    { id: 'create-invoice', name: 'Create Invoice', icon: FileText }
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
          <h1 className="text-3xl font-bold text-white mb-2">Payments & Invoicing</h1>
          <p className="text-gray-300">Manage payments, invoices, and financial transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          {activeTab === 'payments' && (
            <Button onClick={createPaymentIntent} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Test Payment
            </Button>
          )}
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

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payments Table */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-4 text-white font-medium">{payment.description}</td>
                        <td className="py-4 px-4 text-gray-300">{payment.customer_email || 'N/A'}</td>
                        <td className="py-4 px-4 text-green-400 font-medium">
                          ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{payment.status}</span>
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Invoices Table */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Invoice #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-4 text-white font-medium">{invoice.invoice_number}</td>
                        <td className="py-4 px-4 text-gray-300">{invoice.customer_name}</td>
                        <td className="py-4 px-4 text-green-400 font-medium">
                          ${invoice.amount.toFixed(2)} {invoice.currency.toUpperCase()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              Download
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Invoice Tab */}
      {activeTab === 'create-invoice' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Name
                  </label>
                  <Input
                    value={invoiceForm.customer_name}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Email
                  </label>
                  <Input
                    type="email"
                    value={invoiceForm.customer_email}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, customer_email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
                  <Button onClick={addInvoiceItem} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {invoiceForm.items.map((item, index) => (
                    <div key={index} className="grid md:grid-cols-5 gap-4 p-4 border border-gray-600 rounded-lg">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Service description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Quantity
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Unit Price
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateInvoiceItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-white font-medium">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </div>
                        <Button
                          onClick={() => removeInvoiceItem(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          disabled={invoiceForm.items.length <= 1}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-right">
                  <div className="text-2xl font-bold text-white">
                    Total: ${invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('invoices')}
                >
                  Cancel
                </Button>
                <Button onClick={createInvoice} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}