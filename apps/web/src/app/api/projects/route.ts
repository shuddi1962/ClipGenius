import { NextRequest, NextResponse } from 'next/server'
import { insforge } from '@/lib/supabase'

// GET /api/projects - Get user's projects
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const { name, type } = await request.json()

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Mock response until auth is properly configured
    const newProject = {
      id: Date.now().toString(),
      name,
      type,
      created_at: new Date().toISOString(),
      content_count: 0,
      video_count: 0,
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}