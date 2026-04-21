'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  BarChart3,
  Users,
  Send,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface Form {
  id: string
  title: string
  description: string
  fields: FormField[]
  status: 'draft' | 'published' | 'archived'
  submissions_count: number
  created_at: string
  updated_at: string
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, checkbox, radio
}

interface Submission {
  id: string
  form_id: string
  data: Record<string, any>
  submitted_at: string
  ip_address?: string
  user_agent?: string
}

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions' | 'create-form'>('forms')
  const [forms, setForms] = useState<Form[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<string | null>(null)

  // Form creation state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [] as FormField[]
  })

  useEffect(() => {
    if (activeTab === 'forms' || activeTab === 'submissions') {
      fetchData()
    }
  }, [activeTab, selectedForm])

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

      if (activeTab === 'forms') {
        const { data, error } = await insforge
          .from('forms')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setForms(data || [])
      } else if (activeTab === 'submissions') {
        let query = insforge
          .from('form_submissions')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('submitted_at', { ascending: false })

        if (selectedForm) {
          query = query.eq('form_id', selectedForm)
        }

        const { data, error } = await query
        if (error) throw error
        setSubmissions(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createForm = async () => {
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
        .from('forms')
        .insert({
          workspace_id: workspace.id,
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: 'draft',
          submissions_count: 0
        })

      if (error) throw error

      alert('Form created successfully!')
      setActiveTab('forms')
      setFormData({ title: '', description: '', fields: [] })
      fetchData()
    } catch (error) {
      console.error('Error creating form:', error)
      alert('Failed to create form')
    }
  }

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: '',
      required: false,
      ...(type === 'select' || type === 'checkbox' || type === 'radio' ? { options: [''] } : {})
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      )
    }))
  }

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const addFieldOption = (fieldIndex: number) => {
    const field = formData.fields[fieldIndex]
    if (field.options) {
      updateField(fieldIndex, {
        options: [...field.options, '']
      })
    }
  }

  const updateFieldOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = formData.fields[fieldIndex]
    if (field.options) {
      const newOptions = [...field.options]
      newOptions[optionIndex] = value
      updateField(fieldIndex, { options: newOptions })
    }
  }

  const removeFieldOption = (fieldIndex: number, optionIndex: number) => {
    const field = formData.fields[fieldIndex]
    if (field.options && field.options.length > 1) {
      const newOptions = field.options.filter((_, i) => i !== optionIndex)
      updateField(fieldIndex, { options: newOptions })
    }
  }

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝'
      case 'email': return '📧'
      case 'phone': return '📱'
      case 'textarea': return '📄'
      case 'select': return '▼'
      case 'checkbox': return '☑️'
      case 'radio': return '🔘'
      default: return '📋'
    }
  }

  const tabs = [
    { id: 'forms', name: 'Forms', icon: FileText },
    { id: 'submissions', name: 'Submissions', icon: BarChart3 },
    { id: 'create-form', name: 'Create Form', icon: Plus }
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
          <h1 className="text-3xl font-bold text-white mb-2">Forms & Surveys</h1>
          <p className="text-gray-300">Create lead capture forms and manage form submissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Form
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

      {/* Forms Tab */}
      {activeTab === 'forms' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{form.title}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{form.description}</p>
                  </div>
                  <Badge className={`${
                    form.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    form.status === 'draft' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {form.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{form.fields.length} fields</span>
                  <span>{form.submissions_count} submissions</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {forms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No forms yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first lead capture form to start collecting data
              </p>
              <Button onClick={() => setActiveTab('create-form')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedForm || ''}
              onChange={(e) => setSelectedForm(e.target.value || null)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
            >
              <option value="">All Forms</option>
              {forms.map((form) => (
                <option key={form.id} value={form.id}>{form.title}</option>
              ))}
            </select>
          </div>

          {/* Submissions Table */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Form</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Submitted</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => {
                      const form = forms.find(f => f.id === submission.form_id)
                      return (
                        <tr key={submission.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="py-4 px-4 text-white font-medium">
                            {form?.title || 'Unknown Form'}
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            <div className="max-w-xs truncate">
                              {Object.entries(submission.data).slice(0, 2).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                              {Object.keys(submission.data).length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{Object.keys(submission.data).length - 2} more fields
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Form Tab */}
      {activeTab === 'create-form' && (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Form Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Contact Us Form"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="A brief description of your form"
                />
              </div>

              {/* Form Fields */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Form Fields</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => addField('text')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Text
                    </Button>
                    <Button onClick={() => addField('email')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Email
                    </Button>
                    <Button onClick={() => addField('phone')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Phone
                    </Button>
                    <Button onClick={() => addField('textarea')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Textarea
                    </Button>
                    <Button onClick={() => addField('select')} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Select
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700/50">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl mt-1">{getFieldIcon(field.type)}</span>
                        <div className="flex-1 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Label
                              </label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(index, { label: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="Field label"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => updateField(index, { type: e.target.value as FormField['type'] })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-[#00F5FF]"
                              >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Select</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="radio">Radio</option>
                              </select>
                            </div>
                          </div>

                          {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Placeholder
                              </label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="Enter placeholder text"
                              />
                            </div>
                          )}

                          {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && field.options && (
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Options
                              </label>
                              <div className="space-y-2">
                                {field.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => updateFieldOption(index, optionIndex, e.target.value)}
                                      className="bg-gray-600 border-gray-500 text-white flex-1"
                                      placeholder="Option text"
                                    />
                                    <Button
                                      onClick={() => removeFieldOption(index, optionIndex)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300"
                                      disabled={field.options!.length <= 1}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  onClick={() => addFieldOption(index)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.required}
                              onChange={(e) => updateField(index, { required: e.target.checked })}
                              className="rounded border-gray-500 text-[#00F5FF] focus:ring-[#00F5FF]"
                            />
                            <label htmlFor={`required-${field.id}`} className="text-sm text-gray-300">
                              Required field
                            </label>
                          </div>
                        </div>

                        <Button
                          onClick={() => removeField(index)}
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No fields added yet. Click a field type above to get started.</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setActiveTab('forms')}
                >
                  Cancel
                </Button>
                <Button onClick={createForm} disabled={!formData.title || formData.fields.length === 0} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}