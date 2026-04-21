'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Folder,
  Upload,
  Download,
  Share,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  File,
  Image,
  Video,
  Archive,
  Calendar,
  User,
  Lock,
  Unlock,
  Star,
  StarOff,
  Grid,
  List,
  FolderPlus,
  Clock
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'archive' | 'spreadsheet' | 'presentation'
  size: number
  folderId: string | null
  uploadedBy: string
  uploadedAt: string
  lastModified: string
  isPublic: boolean
  isFavorite: boolean
  tags: string[]
  description?: string
  thumbnail?: string
}

interface Folder {
  id: string
  name: string
  parentId: string | null
  createdBy: string
  createdAt: string
  color: string
  isShared: boolean
}

export default function DocumentManagement() {
  const [activeTab, setActiveTab] = useState<'files' | 'folders' | 'shared' | 'recent'>('files')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [uploadModal, setUploadModal] = useState(false)

  // Mock folders data
  const [folders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Marketing Materials',
      parentId: null,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-15T10:00:00Z',
      color: 'blue',
      isShared: true
    },
    {
      id: '2',
      name: 'Client Contracts',
      parentId: null,
      createdBy: 'Mike Chen',
      createdAt: '2024-02-01T14:30:00Z',
      color: 'green',
      isShared: false
    },
    {
      id: '3',
      name: 'Presentations',
      parentId: null,
      createdBy: 'Emma Davis',
      createdAt: '2024-03-10T09:15:00Z',
      color: 'purple',
      isShared: true
    },
    {
      id: '4',
      name: 'Legal Documents',
      parentId: null,
      createdBy: 'Alex Rodriguez',
      createdAt: '2024-01-20T16:45:00Z',
      color: 'red',
      isShared: false
    }
  ])

  // Mock documents data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Q1 Marketing Strategy.pdf',
      type: 'document',
      size: 2048576, // 2MB
      folderId: '1',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-04-19T14:30:00Z',
      lastModified: '2024-04-19T14:30:00Z',
      isPublic: true,
      isFavorite: true,
      tags: ['marketing', 'strategy', 'q1'],
      description: 'Comprehensive marketing strategy for Q1 2024'
    },
    {
      id: '2',
      name: 'Client Agreement Template.docx',
      type: 'document',
      size: 512000, // 512KB
      folderId: '2',
      uploadedBy: 'Mike Chen',
      uploadedAt: '2024-04-18T11:20:00Z',
      lastModified: '2024-04-18T11:20:00Z',
      isPublic: false,
      isFavorite: false,
      tags: ['contract', 'template', 'legal'],
      description: 'Standard client agreement template'
    },
    {
      id: '3',
      name: 'Product Demo Video.mp4',
      type: 'video',
      size: 52428800, // 50MB
      folderId: '1',
      uploadedBy: 'Emma Davis',
      uploadedAt: '2024-04-17T16:45:00Z',
      lastModified: '2024-04-17T16:45:00Z',
      isPublic: true,
      isFavorite: true,
      tags: ['demo', 'video', 'product'],
      description: 'Latest product demonstration video'
    },
    {
      id: '4',
      name: 'Company Logo Pack.zip',
      type: 'archive',
      size: 15728640, // 15MB
      folderId: '3',
      uploadedBy: 'Alex Rodriguez',
      uploadedAt: '2024-04-16T09:15:00Z',
      lastModified: '2024-04-16T09:15:00Z',
      isPublic: true,
      isFavorite: false,
      tags: ['logo', 'branding', 'assets'],
      description: 'Complete logo package with various formats'
    },
    {
      id: '5',
      name: 'Financial Report Q1.xlsx',
      type: 'spreadsheet',
      size: 1024000, // 1MB
      folderId: '4',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-04-15T12:30:00Z',
      lastModified: '2024-04-19T10:45:00Z',
      isPublic: false,
      isFavorite: false,
      tags: ['financial', 'report', 'q1'],
      description: 'Q1 financial performance report'
    },
    {
      id: '6',
      name: 'Team Photo.jpg',
      type: 'image',
      size: 2097152, // 2MB
      folderId: '3',
      uploadedBy: 'Mike Chen',
      uploadedAt: '2024-04-14T14:20:00Z',
      lastModified: '2024-04-14T14:20:00Z',
      isPublic: true,
      isFavorite: true,
      tags: ['team', 'photo', 'company'],
      description: 'Company team photo for marketing materials'
    }
  ])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFolder = selectedFolder ? doc.folderId === selectedFolder : true
    return matchesSearch && matchesFolder
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-8 h-8 text-blue-400" />
      case 'image': return <Image className="w-8 h-8 text-green-400" />
      case 'video': return <Video className="w-8 h-8 text-purple-400" />
      case 'archive': return <Archive className="w-8 h-8 text-orange-400" />
      case 'spreadsheet': return <File className="w-8 h-8 text-green-500" />
      case 'presentation': return <File className="w-8 h-8 text-red-400" />
      default: return <File className="w-8 h-8 text-gray-400" />
    }
  }

  const getFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const getFolderName = (folderId: string | null) => {
    if (!folderId) return 'Root'
    return folders.find(f => f.id === folderId)?.name || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const toggleFavorite = (docId: string) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for document:', docId)
  }

  const tabs = [
    { id: 'files', name: 'Files', icon: FileText },
    { id: 'folders', name: 'Folders', icon: Folder },
    { id: 'shared', name: 'Shared', icon: Share },
    { id: 'recent', name: 'Recent', icon: Clock }
  ]

  const totalStorage = documents.reduce((sum, doc) => sum + doc.size, 0)
  const recentUploads = documents.filter(doc => {
    const uploadDate = new Date(doc.uploadedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return uploadDate > weekAgo
  }).length
  const favoriteFiles = documents.filter(doc => doc.isFavorite).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Management</h1>
          <p className="text-gray-400 mt-2">Organize, store, and share your documents securely</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{documents.length}</div>
            <p className="text-xs text-gray-400">
              Across {folders.length} folders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Storage Used</CardTitle>
            <Archive className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getFileSize(totalStorage)}</div>
            <p className="text-xs text-gray-400">
              2.5 GB available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Recent Uploads</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{recentUploads}</div>
            <p className="text-xs text-gray-400">
              In the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Favorites</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{favoriteFiles}</div>
            <p className="text-xs text-gray-400">
              Marked as favorite
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

      {/* Search and Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <select
              value={selectedFolder || 'all'}
              onChange={(e) => setSelectedFolder(e.target.value === 'all' ? null : e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="all">All Folders</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Tab */}
      {activeTab === 'files' && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3">
                        {getFileIcon(doc.type)}
                      </div>

                      <h3 className="text-white font-medium text-sm mb-2 line-clamp-2" title={doc.name}>
                        {doc.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {getFileSize(doc.size)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>

                      <div className="text-gray-400 text-xs mb-3">
                        {getFolderName(doc.folderId)}
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(doc.id)}
                          className={doc.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
                        >
                          {doc.isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Name</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Type</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Size</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Folder</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Modified</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.type)}
                              <div>
                                <div className="text-white font-medium">{doc.name}</div>
                                <div className="text-gray-400 text-sm">by {doc.uploadedBy}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className="capitalize">
                              {doc.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-gray-300">{getFileSize(doc.size)}</td>
                          <td className="py-4 px-6 text-gray-300">{getFolderName(doc.folderId)}</td>
                          <td className="py-4 px-6 text-gray-300 text-sm">{formatDate(doc.lastModified)}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(doc.id)}
                                className={doc.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
                              >
                                {doc.isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
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
        </>
      )}

      {/* Folders Tab */}
      {activeTab === 'folders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => {
            const folderDocs = documents.filter(doc => doc.folderId === folder.id)
            return (
              <Card key={folder.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${folder.color}-500/20`}>
                      <Folder className={`w-6 h-6 text-${folder.color}-400`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{folder.name}</h3>
                        {folder.isShared && <Share className="w-4 h-4 text-blue-400" />}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span>{folderDocs.length} files</span>
                        <span>{getFileSize(folderDocs.reduce((sum, doc) => sum + doc.size, 0))}</span>
                      </div>

                      <div className="text-gray-400 text-sm mb-4">
                        Created by {folder.createdBy} • {formatDate(folder.createdAt)}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Shared Tab */}
      {activeTab === 'shared' && (
        <div className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Shared with Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Share className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <div className="text-gray-400 text-lg mb-2">No shared files</div>
                <div className="text-gray-500">Files shared with you will appear here</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Tab */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          {documents
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
            .slice(0, 10)
            .map((doc) => (
              <Card key={doc.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.type)}
                    <div className="flex-1">
                      <div className="text-white font-medium">{doc.name}</div>
                      <div className="text-gray-400 text-sm">
                        {getFolderName(doc.folderId)} • Uploaded {formatDate(doc.uploadedAt)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {filteredDocuments.length === 0 && activeTab === 'files' && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <div className="text-gray-400 text-lg mb-2">No files found</div>
          <div className="text-gray-500">Try adjusting your search or folder filter</div>
        </div>
      )}
    </div>
  )
}