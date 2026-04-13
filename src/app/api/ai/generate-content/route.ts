import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { businessType, product, audience } = await request.json()

    if (!businessType || !product || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields: businessType, product, audience' },
        { status: 400 }
      )
    }

    // Call InsForge edge function
    const insforgeResponse = await fetch('https://wk49fyqm.functions.insforge.app/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY}`,
      },
      body: JSON.stringify({
        businessType,
        product,
        audience,
      }),
    })

    if (!insforgeResponse.ok) {
      const errorData = await insforgeResponse.json()
      throw new Error(errorData.error || 'Failed to generate content')
    }

    const data = await insforgeResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}