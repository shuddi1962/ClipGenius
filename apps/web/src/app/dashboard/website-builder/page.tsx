'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Palette,
  Plus,
  Save,
  Eye,
  Undo,
  Redo,
  Settings,
  Trash2,
  Copy,
  Move,
  Type,
  Image,
  Square,
  Circle,
  RectangleHorizontal,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  File,
  Italic,
  Underline,
  Link,
  Upload,
  Download,
  Share,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { insforge } from '@/lib/insforge'

interface WebsiteElement {
  id: string
  type: 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer' | 'container'
  content?: string
  style: {
    x: number
    y: number
    width: number
    height: number
    backgroundColor?: string
    color?: string
    fontSize?: number
    fontWeight?: string
    textAlign?: 'left' | 'center' | 'right'
    borderRadius?: number
    padding?: number
    margin?: number
  }
  properties?: any
}

interface WebsitePage {
  id: string
  name: string
  elements: WebsiteElement[]
  settings: {
    backgroundColor: string
    fontFamily: string
    metaTitle: string
    metaDescription: string
  }
}

export default function WebsiteBuilderPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'pages' | 'templates' | 'settings'>('builder')
  const [currentPage, setCurrentPage] = useState<WebsitePage>({
    id: 'page_1',
    name: 'Home',
    elements: [],
    settings: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      metaTitle: 'My Website',
      metaDescription: 'Welcome to my website'
    }
  })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [pages, setPages] = useState<WebsitePage[]>([currentPage])
  const [showElementPanel, setShowElementPanel] = useState(true)
  const [showStylePanel, setShowStylePanel] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadWebsite()
  }, [])

  const loadWebsite = async () => {
    try {
      const { data, error } = await insforge
        .from('websites')
        .select('*')
        .eq('user_id', 'user_1')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        const parsedPages = JSON.parse(data.pages_json || '[]')
        if (parsedPages.length > 0) {
          setPages(parsedPages)
          setCurrentPage(parsedPages[0])
        }
      }
    } catch (error) {
      console.error('Error loading website:', error)
    }
  }

  const saveWebsite = async () => {
    try {
      const websiteData = {
        user_id: 'user_1',
        name: 'My Website',
        pages_json: JSON.stringify(pages),
        updated_at: new Date().toISOString()
      }

      const { error } = await insforge
        .from('websites')
        .upsert(websiteData)

      if (error) throw error
      alert('Website saved successfully!')
    } catch (error) {
      console.error('Error saving website:', error)
      alert('Failed to save website')
    }
  }

  const addElement = (type: WebsiteElement['type']) => {
    const newElement: WebsiteElement = {
      id: `element_${Date.now()}`,
      type,
      content: type === 'text' ? 'Your text here' :
               type === 'heading' ? 'Heading Text' :
               type === 'button' ? 'Click Me' : '',
      style: {
        x: 100,
        y: 100,
        width: type === 'heading' ? 300 : type === 'button' ? 120 : 200,
        height: type === 'heading' ? 50 : type === 'button' ? 40 : type === 'spacer' ? 20 : 100,
        backgroundColor: type === 'button' ? '#00F5FF' : 'transparent',
        color: type === 'button' ? '#000000' : '#000000',
        fontSize: type === 'heading' ? 24 : 16,
        fontWeight: type === 'heading' ? 'bold' : 'normal',
        textAlign: 'left',
        borderRadius: type === 'button' ? 8 : 0,
        padding: type === 'button' ? 12 : 0,
        margin: 0
      }
    }

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement]
    }

    setCurrentPage(updatedPage)
    updatePageInPages(updatedPage)
    setSelectedElement(newElement.id)
    setShowStylePanel(true)
  }

  const updateElement = (elementId: string, updates: Partial<WebsiteElement>) => {
    const updatedPage = {
      ...currentPage,
      elements: currentPage.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }

    setCurrentPage(updatedPage)
    updatePageInPages(updatedPage)
  }

  const deleteElement = (elementId: string) => {
    const updatedPage = {
      ...currentPage,
      elements: currentPage.elements.filter(el => el.id !== elementId)
    }

    setCurrentPage(updatedPage)
    updatePageInPages(updatedPage)
    setSelectedElement(null)
  }

  const updatePageInPages = (updatedPage: WebsitePage) => {
    setPages(pages.map(page =>
      page.id === updatedPage.id ? updatedPage : page
    ))
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
      setShowStylePanel(false)
    }
  }

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    setSelectedElement(elementId)
    setShowStylePanel(true)
  }

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setDraggedElement(null)
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedElement) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    updateElement(draggedElement, {
      style: {
        ...currentPage.elements.find(el => el.id === draggedElement)?.style!,
        x: Math.max(0, x),
        y: Math.max(0, y)
      }
    })
  }

  const duplicateElement = (elementId: string) => {
    const element = currentPage.elements.find(el => el.id === elementId)
    if (!element) return

    const newElement = {
      ...element,
      id: `element_${Date.now()}`,
      style: {
        ...element.style,
        x: element.style.x + 20,
        y: element.style.y + 20
      }
    }

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement]
    }

    setCurrentPage(updatedPage)
    updatePageInPages(updatedPage)
  }

  const selectedElementData = selectedElement
    ? currentPage.elements.find(el => el.id === selectedElement)
    : null

  const elementTypes = [
    { type: 'text' as const, name: 'Text', icon: Type, description: 'Add text content' },
    { type: 'heading' as const, name: 'Heading', icon: Heading1, description: 'Add heading text' },
    { type: 'image' as const, name: 'Image', icon: Image, description: 'Add image element' },
    { type: 'button' as const, name: 'Button', icon: Square, description: 'Add call-to-action button' },
    { type: 'divider' as const, name: 'Divider', icon: RectangleHorizontal, description: 'Add section divider' },
    { type: 'spacer' as const, name: 'Spacer', icon: Move, description: 'Add empty space' }
  ]

  const tabs = [
    { id: 'builder', name: 'Builder', icon: Palette },
    { id: 'pages', name: 'Pages', icon: File },
    { id: 'templates', name: 'Templates', icon: Copy },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Left Sidebar - Elements Panel */}
      {showElementPanel && (
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Elements</h3>
            <p className="text-gray-400 text-sm">Drag elements to the canvas</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {elementTypes.map((elementType) => (
                <div
                  key={elementType.type}
                  className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 cursor-pointer transition-colors"
                  onClick={() => addElement(elementType.type)}
                >
                  <div className="flex items-center gap-3">
                    <elementType.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{elementType.name}</div>
                      <div className="text-xs text-gray-400">{elementType.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Website Builder</h1>
            <Badge variant="secondary" className="bg-blue-600">{currentPage.name}</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Preview */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <Button variant="outline" size="sm" className="border-gray-600">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button onClick={saveWebsite} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800/50 p-1 mx-6 mt-4 rounded-xl backdrop-blur-sm border border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* Canvas */}
        <div className="flex-1 p-6">
          <div
            ref={canvasRef}
            className={`bg-white mx-auto border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden ${
              previewMode === 'desktop' ? 'w-full max-w-6xl h-full' :
              previewMode === 'tablet' ? 'w-full max-w-md h-full' :
              'w-full max-w-sm h-full'
            }`}
            style={{ backgroundColor: currentPage.settings.backgroundColor }}
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {currentPage.elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-pointer ${
                  selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                } ${draggedElement === element.id ? 'opacity-50' : ''}`}
                style={{
                  left: element.style.x,
                  top: element.style.y,
                  width: element.style.width,
                  height: element.style.height,
                  backgroundColor: element.style.backgroundColor,
                  color: element.style.color,
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  textAlign: element.style.textAlign,
                  borderRadius: element.style.borderRadius,
                  padding: element.style.padding,
                  margin: element.style.margin
                }}
                onClick={(e) => handleElementClick(e, element.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, element.id)}
                onDragEnd={handleDragEnd}
              >
                {element.type === 'text' && (
                  <div className="w-full h-full flex items-center">
                    {element.content}
                  </div>
                )}

                {element.type === 'heading' && (
                  <div className="w-full h-full flex items-center font-bold">
                    {element.content}
                  </div>
                )}

                {element.type === 'button' && (
                  <div className="w-full h-full flex items-center justify-center font-medium">
                    {element.content}
                  </div>
                )}

                {element.type === 'image' && (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <Image className="w-8 h-8" />
                  </div>
                )}

                {element.type === 'divider' && (
                  <div className="w-full h-full flex items-center">
                    <hr className="w-full border-gray-400" />
                  </div>
                )}

                {element.type === 'spacer' && (
                  <div className="w-full h-full"></div>
                )}

                {/* Element Controls */}
                {selectedElement === element.id && (
                  <div className="absolute -top-8 left-0 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateElement(element.id)
                      }}
                      className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteElement(element.id)
                      }}
                      className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {currentPage.elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Start Building Your Website</h3>
                  <p className="text-sm">Drag elements from the left panel to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Style Panel */}
      {showStylePanel && selectedElementData && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Style Properties</h3>
            <p className="text-gray-400 text-sm">{selectedElementData.type} element</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Content */}
            {(selectedElementData.type === 'text' || selectedElementData.type === 'heading' || selectedElementData.type === 'button') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <Input
                  value={selectedElementData.content || ''}
                  onChange={(e) => updateElement(selectedElementData.id, { content: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}

            {/* Typography */}
            {(selectedElementData.type === 'text' || selectedElementData.type === 'heading') && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Typography</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                    <Input
                      type="number"
                      value={selectedElementData.style.fontSize || 16}
                      onChange={(e) => updateElement(selectedElementData.id, {
                        style: { ...selectedElementData.style, fontSize: parseInt(e.target.value) }
                      })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Text Align</label>
                    <select
                      value={selectedElementData.style.textAlign || 'left'}
                      onChange={(e) => updateElement(selectedElementData.id, {
                        style: { ...selectedElementData.style, textAlign: e.target.value as 'left' | 'center' | 'right' }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                  <Input
                    type="color"
                    value={selectedElementData.style.color || '#000000'}
                    onChange={(e) => updateElement(selectedElementData.id, {
                      style: { ...selectedElementData.style, color: e.target.value }
                    })}
                    className="bg-gray-700 border-gray-600 h-10"
                  />
                </div>

                {selectedElementData.type === 'button' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                    <Input
                      type="color"
                      value={selectedElementData.style.backgroundColor || '#00F5FF'}
                      onChange={(e) => updateElement(selectedElementData.id, {
                        style: { ...selectedElementData.style, backgroundColor: e.target.value }
                      })}
                      className="bg-gray-700 border-gray-600 h-10"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Dimensions</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Width</label>
                  <Input
                    type="number"
                    value={selectedElementData.style.width}
                    onChange={(e) => updateElement(selectedElementData.id, {
                      style: { ...selectedElementData.style, width: parseInt(e.target.value) }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Height</label>
                  <Input
                    type="number"
                    value={selectedElementData.style.height}
                    onChange={(e) => updateElement(selectedElementData.id, {
                      style: { ...selectedElementData.style, height: parseInt(e.target.value) }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Position</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">X</label>
                  <Input
                    type="number"
                    value={selectedElementData.style.x}
                    onChange={(e) => updateElement(selectedElementData.id, {
                      style: { ...selectedElementData.style, x: parseInt(e.target.value) }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Y</label>
                  <Input
                    type="number"
                    value={selectedElementData.style.y}
                    onChange={(e) => updateElement(selectedElementData.id, {
                      style: { ...selectedElementData.style, y: parseInt(e.target.value) }
                    })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}