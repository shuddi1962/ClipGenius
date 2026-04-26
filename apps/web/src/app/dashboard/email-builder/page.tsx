'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Send,
  Save,
  Eye,
  Copy,
  Trash2,
  Plus,
  Image,
  Type,
  Link,
  MousePointer,
  Settings,
  Layout,
  Move,
  Download,
  Upload,
  Zap,
  Target,
  BarChart3,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: EmailElement[]
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  category: string
  thumbnail?: string
}

interface EmailElement {
  id: string
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer'
  content: string
  style: Record<string, any>
  position: number
}

interface EmailCampaign {
  id: string
  name: string
  templateId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent'
  recipientCount: number
  sentCount: number
  openRate: number
  clickRate: number
  scheduledFor?: string
  createdAt: string
}

export default function EmailBuilder() {
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'campaigns' | 'analytics'>('builder')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [emailElements, setEmailElements] = useState<EmailElement[]>([
    {
      id: '1',
      type: 'text',
      content: '<h1>Welcome to Our Newsletter</h1><p>Stay updated with the latest news and insights.</p>',
      style: { fontSize: '16px', color: '#333333', textAlign: 'left' },
      position: 0
    }
  ])

  // Mock templates data
  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to Our Platform!',
      content: [],
      status: 'published',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-04-10T14:30:00Z',
      category: 'Onboarding'
    },
    {
      id: '2',
      name: 'Product Launch',
      subject: 'Introducing Our New Feature',
      content: [],
      status: 'published',
      createdAt: '2024-02-01T09:30:00Z',
      updatedAt: '2024-04-08T11:15:00Z',
      category: 'Marketing'
    },
    {
      id: '3',
      name: 'Newsletter',
      subject: 'Monthly Insights & Updates',
      content: [],
      status: 'draft',
      createdAt: '2024-04-15T16:45:00Z',
      updatedAt: '2024-04-15T16:45:00Z',
      category: 'Newsletter'
    }
  ])

  // Mock campaigns data
  const [campaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Q1 Product Launch',
      templateId: '2',
      status: 'sent',
      recipientCount: 5000,
      sentCount: 4980,
      openRate: 24.5,
      clickRate: 8.2,
      createdAt: '2024-04-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Welcome Series',
      templateId: '1',
      status: 'sending',
      recipientCount: 1200,
      sentCount: 450,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-04-10T14:30:00Z'
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      templateId: '3',
      status: 'scheduled',
      recipientCount: 8500,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      scheduledFor: '2024-04-25T09:00:00Z',
      createdAt: '2024-04-18T11:20:00Z'
    }
  ])

  const tabs = [
    { id: 'builder', name: 'Email Builder', icon: Mail },
    { id: 'templates', name: 'Templates', icon: Layout },
    { id: 'campaigns', name: 'Campaigns', icon: Send },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  const elementTypes = [
    { type: 'text', name: 'Text Block', icon: Type, description: 'Add formatted text content' },
    { type: 'image', name: 'Image', icon: Image, description: 'Insert images and graphics' },
    { type: 'button', name: 'Button', icon: MousePointer, description: 'Add call-to-action buttons' },
    { type: 'divider', name: 'Divider', icon: Move, description: 'Add section separators' },
    { type: 'spacer', name: 'Spacer', icon: Move, description: 'Add white space between elements' }
  ]

  const addElement = (type: string) => {
    const newElement: EmailElement = {
      id: Date.now().toString(),
      type: type as any,
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
      position: emailElements.length
    }
    setEmailElements(prev => [...prev, newElement])
  }

  const getDefaultContent = (type: string): string => {
    switch (type) {
      case 'text': return '<p>Your text content here</p>'
      case 'image': return 'https://via.placeholder.com/600x200?text=Your+Image'
      case 'button': return 'Click Here'
      case 'divider': return ''
      case 'spacer': return '20'
      default: return ''
    }
  }

  const getDefaultStyle = (type: string): Record<string, any> => {
    switch (type) {
      case 'text': return { fontSize: '16px', color: '#333333', textAlign: 'left' }
      case 'image': return { width: '100%', height: 'auto', maxWidth: '600px' }
      case 'button': return { backgroundColor: '#007bff', color: '#ffffff', padding: '12px 24px', borderRadius: '4px', textAlign: 'center' }
      case 'divider': return { borderTop: '1px solid #cccccc', margin: '20px 0' }
      case 'spacer': return { height: '20px' }
      default: return {}
    }
  }

  const moveElement = (index: number, direction: 'up' | 'down') => {
    const newElements = [...emailElements]
    if (direction === 'up' && index > 0) {
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]]
    } else if (direction === 'down' && index < newElements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]]
    }
    setEmailElements(newElements)
  }

  const deleteElement = (id: string) => {
    setEmailElements(prev => prev.filter(el => el.id !== id))
  }

  const updateElement = (id: string, updates: Partial<EmailElement>) => {
    setEmailElements(prev => prev.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const saveTemplate = () => {
    // Mock save functionality
    console.log('Saving template with elements:', emailElements)
  }

  const exportHTML = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
          ${emailElements.map(el => {
            switch (el.type) {
              case 'text': return `<div style="${Object.entries(el.style).map(([k, v]) => `${k}:${v}`).join(';')}">${el.content}</div>`
              case 'image': return `<img src="${el.content}" style="${Object.entries(el.style).map(([k, v]) => `${k}:${v}`).join(';')}" />`
              case 'button': return `<a href="#" style="${Object.entries(el.style).map(([k, v]) => `${k}:${v}`).join(';')}">${el.content}</a>`
              case 'divider': return `<hr style="${Object.entries(el.style).map(([k, v]) => `${k}:${v}`).join(';')}" />`
              case 'spacer': return `<div style="height: ${el.content}px;"></div>`
              default: return ''
            }
          }).join('')}
        </body>
      </html>
    `
    console.log('Exported HTML:', html)
  }

  const totalCampaigns = campaigns.length
  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipientCount, 0)
  const avgOpenRate = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.openRate, 0) /
                     campaigns.filter(c => c.status === 'sent').length || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Builder</h1>
          <p className="text-gray-400 mt-2">Create stunning email campaigns with our drag-and-drop builder</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={saveTemplate}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={exportHTML}>
            <Download className="w-4 h-4 mr-2" />
            Export HTML
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Templates</CardTitle>
            <Layout className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{templates.length}</div>
            <p className="text-xs text-gray-400">
              {templates.filter(t => t.status === 'published').length} published
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Campaigns Sent</CardTitle>
            <Send className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sentCampaigns}</div>
            <p className="text-xs text-gray-400">
              Of {totalCampaigns} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Emails delivered
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              Campaign performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Builder Tab */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Elements Panel */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {elementTypes.map((element) => (
                <div
                  key={element.type}
                  onClick={() => addElement(element.type)}
                  className="p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <element.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-white font-medium text-sm">{element.name}</div>
                      <div className="text-gray-400 text-xs">{element.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-96 bg-white rounded-lg p-6 space-y-4">
                  {emailElements.map((element, index) => (
                    <div key={element.id} className="relative group border border-gray-300 rounded p-4">
                      {/* Element Controls */}
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveElement(index, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveElement(index, 'down')}
                          disabled={index === emailElements.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteElement(element.id)}
                          className="h-6 w-6 p-0 text-red-400 border-red-400 hover:bg-red-400"
                        >
                          ×
                        </Button>
                      </div>

                      {/* Element Content */}
                      {element.type === 'text' && (
                        <div
                          contentEditable
                          dangerouslySetInnerHTML={{ __html: element.content }}
                          onBlur={(e) => updateElement(element.id, { content: e.currentTarget.innerHTML })}
                          className="outline-none"
                          style={element.style}
                        />
                      )}

                      {element.type === 'image' && (
                        <img
                          src={element.content}
                          alt="Email content"
                          style={element.style}
                          className="max-w-full h-auto"
                        />
                      )}

                      {element.type === 'button' && (
                        <button
                          style={element.style}
                          className="cursor-pointer"
                          contentEditable
                          onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
                        >
                          {element.content}
                        </button>
                      )}

                      {element.type === 'divider' && (
                        <hr style={element.style} />
                      )}

                      {element.type === 'spacer' && (
                        <div style={{ height: `${element.content}px` }} className="bg-gray-100"></div>
                      )}

                      {/* Element Type Badge */}
                      <Badge variant="secondary" className="absolute -top-2 -left-2 text-xs capitalize">
                        {element.type}
                      </Badge>
                    </div>
                  ))}

                  {emailElements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <div className="text-lg mb-2">Start building your email</div>
                      <div className="text-sm">Add elements from the panel on the left</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Subject</label>
                  <Input
                    placeholder="Enter email subject..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Name</label>
                  <Input
                    placeholder="Your Company Name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Email</label>
                  <Input
                    type="email"
                    placeholder="noreply@yourcompany.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Width</label>
                  <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    <option value="600">600px (Standard)</option>
                    <option value="800">800px (Wide)</option>
                    <option value="100%">Full Width</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                  <Input
                    type="color"
                    defaultValue="#ffffff"
                    className="bg-gray-700 border-gray-600 h-10"
                  />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{template.subject}</p>

                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Copy className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Campaign Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Recipients</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Open Rate</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Click Rate</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{campaign.name}</div>
                        <div className="text-gray-400 text-sm">
                          {campaign.scheduledFor ? `Scheduled: ${new Date(campaign.scheduledFor).toLocaleDateString()}` : 'Sent'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={
                          campaign.status === 'sent' ? 'default' :
                          campaign.status === 'sending' ? 'secondary' :
                          campaign.status === 'scheduled' ? 'outline' : 'secondary'
                        } className="capitalize">
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {campaign.sentCount.toLocaleString()} / {campaign.recipientCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {campaign.status === 'sent' ? `${campaign.openRate}%` : '-'}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {campaign.status === 'sent' ? `${campaign.clickRate}%` : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Copy className="w-4 h-4" />
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
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Open Rate</span>
                    <span className="text-white font-medium">24.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Click Rate</span>
                    <span className="text-white font-medium">8.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Conversion Rate</span>
                    <span className="text-white font-medium">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Unsubscribe Rate</span>
                    <span className="text-white font-medium">0.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Product Launch</span>
                    <span className="text-green-400 text-sm">32.1% open</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Welcome Series</span>
                    <span className="text-green-400 text-sm">28.5% open</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Monthly Newsletter</span>
                    <span className="text-green-400 text-sm">19.8% open</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Delivery Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Delivered</span>
                    <span className="text-white font-medium">98.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bounced</span>
                    <span className="text-red-400 font-medium">1.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Spam Complaints</span>
                    <span className="text-yellow-400 font-medium">0.1%</span>
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