'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, DollarSign, Package, Image as ImageIcon, Save } from 'lucide-react'
import insforge from '@/lib/insforge'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  active: boolean
  created_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    active: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
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
        .from('products')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      active: true
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      image_url: product.image_url || '',
      category: product.category || '',
      active: product.active
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const productData = {
        workspace_id: workspace.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        image_url: formData.image_url,
        category: formData.category,
        active: formData.active
      }

      if (editingProduct) {
        await insforge
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
      } else {
        await insforge
          .from('products')
          .insert(productData)
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleProduct = async (productId: string, active: boolean) => {
    try {
      await insforge
        .from('products')
        .update({ active })
        .eq('id', productId)

      setProducts(products.map(product =>
        product.id === productId ? { ...product, active } : product
      ))
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await insforge
        .from('products')
        .delete()
        .eq('id', productId)

      setProducts(products.filter(product => product.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products & Services</h1>
          <p className="text-gray-300">Manage your product catalog for better AI-generated content</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Premium Consulting Package"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Service, Product, Software..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  placeholder="Describe your product or service..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-[#00F5FF] bg-gray-900 border-gray-600 rounded focus:ring-[#00F5FF] focus:ring-2"
                />
                <label htmlFor="active" className="ml-3 text-sm font-medium text-gray-300">
                  Active (available for campaigns)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              {/* Image */}
              {product.image_url && (
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                  <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                    product.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {product.category && (
                  <div className="text-sm text-gray-400 mb-2">{product.category}</div>
                )}

                {product.description && (
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">{product.description}</p>
                )}

                {product.price > 0 && (
                  <div className="text-[#00F5FF] font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => toggleProduct(product.id, !product.active)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.active
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {product.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
          <p className="text-gray-400 mb-6">
            Add your products and services to help our AI generate better marketing content
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block bg-gradient-to-r from-[#00F5FF] to-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  )
}