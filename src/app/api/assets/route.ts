// POST /api/assets - Upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images for now)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Mock response until storage is properly configured
    const mockAsset = {
      id: Date.now().toString(),
      filename: file.name,
      file_url: `https://wk49fyqm.storage.insforge.app/assets/${Date.now()}-${file.name}`,
      file_type: file.type,
      file_size: file.size,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(mockAsset, { status: 201 })
  } catch (error) {
    console.error('Error uploading asset:', error)
    return NextResponse.json(
      { error: 'Failed to upload asset' },
      { status: 500 }
    )
  }
}

// GET /api/assets - Get user's assets
export async function GET(request: NextRequest) {
  try {
    // Mock data until auth is properly configured
    const mockAssets = [
      {
        id: '1',
        filename: 'product-image.jpg',
        file_url: 'https://wk49fyqm.storage.insforge.app/assets/product-image.jpg',
        file_type: 'image/jpeg',
        file_size: 2048000,
        created_at: '2024-01-10T10:00:00Z',
      },
    ]

    return NextResponse.json(mockAssets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}