'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react'
import insforge from '@/lib/insforge'

interface Form {
  id: string
  title: string
  description: string
  fields: FormField[]
  status: 'draft' | 'published' | 'archived'
  submissions_count: number
  created_at: string
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select'
  label: string
  required: boolean
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [] as FormField[]
  })

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const { data, error } = await insforge
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setForms(data || [])
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const createForm = async () => {
    try {
      const { error } = await insforge
        .from('forms')
        .insert({
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: 'draft'
        })

      if (error) throw error

      setFormData({ title: '', description: '', fields: [] })
      setShowCreateForm(false)
      fetchForms()
    } catch (error) {
      console.error('Error creating form:', error)
      alert('Failed to create form')
    }
  }

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false
    }
    setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }))
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...formData.fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFormData(prev => ({ ...prev, fields: newFields }))
  }

  const removeField = (index: number) => {
    const newFields = formData.fields.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, fields: newFields }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Forms & Surveys</h1>
        <p className="text-gray-400">Create and manage lead capture forms</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setShowCreateForm(true)} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-gray-900">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Card key={form.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">{form.description}</p>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${
                  form.status === 'published' ? 'bg-green-500' :
                  form.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                } text-white`}>
                  {form.status}
                </Badge>
                <span className="text-sm text-gray-500">{form.submissions_count} submissions</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateForm && (
        <Card className="bg-gray-800 border-gray-700 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white">Create New Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => addField('text')} size="sm">Add Text Field</Button>
              <Button onClick={() => addField('email')} size="sm">Add Email Field</Button>
              <Button onClick={() => addField('textarea')} size="sm">Add Textarea</Button>
            </div>
            <div className="space-y-2">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                  <span className="text-white">{field.label}</span>
                  <Badge>{field.type}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => removeField(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={createForm} disabled={!formData.title}>
                Create Form
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}