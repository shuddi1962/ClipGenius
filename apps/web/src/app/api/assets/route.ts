import { NextRequest, NextResponse } from 'next/server'
import { insforge } from '@/lib/supabase'

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

    // Upload to InsForge storage
    const { data, error } = await insforge.storage
      .from('assets')
      .uploadAuto(file)

    if (error) throw error
    if (!data) throw new Error('Upload failed - no data returned')

    // Save to database
    const { data: assetData, error: dbError } = await insforge.database
      .from('assets')
      .insert([{
        filename: file.name,
        file_url: data.url,
        file_key: data.key,
        file_type: file.type,
        file_size: file.size
      }])
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json(assetData, { status: 201 })
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
    const { data, error } = await insforge.database
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}