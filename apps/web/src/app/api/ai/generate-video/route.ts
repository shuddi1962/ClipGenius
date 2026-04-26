import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { script, prompt, style, duration } = await request.json()

    if (!style) {
      return NextResponse.json(
        { error: 'Style is required' },
        { status: 400 }
      )
    }

    if (!script && !prompt) {
      return NextResponse.json(
        { error: 'Either script or prompt is required' },
        { status: 400 }
      )
    }

    // Call InsForge edge function
    const insforgeResponse = await fetch('https://wk49fyqm.functions.insforge.app/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY}`,
      },
      body: JSON.stringify({
        script,
        prompt,
        style,
        duration,
      }),
    })

    if (!insforgeResponse.ok) {
      const errorData = await insforgeResponse.json()
      throw new Error(errorData.error || 'Failed to generate video')
    }

    const data = await insforgeResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}