import { NextRequest, NextResponse } from 'next/server'
import { insforge } from '@/lib/insforge'
import { VibeProspectingAPI } from '@/lib/vibeprospecting'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN

interface ScrapingRequest {
  source: 'gmb' | 'google' | 'instagram' | 'linkedin' | 'facebook' | 'website' | 'vibeprospecting'
  query?: string
  location?: string
  industry?: string
  company_size?: string
  title?: string
  limit?: number
}

interface LeadData {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  website?: string
  address?: string
  city?: string
  country?: string
  rating?: number
  review_count?: number
  source: string
  raw_data: any
}

// Apify actor configurations
const APIFY_ACTORS = {
  gmb: 'compass/google-maps-scraper',
  google: 'apify/google-search-scraper',
  instagram: 'apify/instagram-scraper',
  linkedin: 'apify/linkedin-profile-scraper',
  facebook: 'apify/facebook-pages-scraper',
  website: 'apify/website-content-crawler'
}

const VIBEPROSPECTING_API_KEY = process.env.VIBEPROSPECTING_API_KEY

async function qualifyLeadWithClaude(
  lead: any,
  businessProfile?: any
): Promise<{ score: number; tier: 'hot' | 'warm' | 'cold'; notes: string }> {
  let score = 0
  const reasons = []

  // Contact completeness (40 points max)
  if (lead.email) { score += 20; reasons.push('Has email') }
  if (lead.phone) { score += 10; reasons.push('Has phone') }
  if (lead.company) { score += 10; reasons.push('Has company') }

  // Location (10 points)
  if (lead.city && lead.country) { score += 10; reasons.push('Complete location') }

  // Source quality (20 points)
  const goodSources = ['linkedin', 'vibeprospecting', 'gmb']
  if (goodSources.includes(lead.source)) { score += 20; reasons.push('High-quality source') }

  // Company signals (30 points)
  if (lead.company && lead.company.length > 3) { score += 30; reasons.push('Valid company name') }

  const tier = score >= 85 ? 'hot' : score >= 50 ? 'warm' : 'cold'
  const notes = `Auto-qualified: ${reasons.join(', ')}. Score: ${score}/100`

  return { score, tier, notes }
}

async function runApifyActor(actorId: string, input: any) {
  if (!APIFY_API_TOKEN) {
    throw new Error('APIFY_API_TOKEN not configured')
  }

  const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${APIFY_API_TOKEN}`
    },
    body: JSON.stringify({
      ...input,
      maxItems: input.maxItems || 50
    })
  })

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.status} ${response.statusText}`)
  }

  const runData = await response.json()
  const runId = runData.data.id

  // Wait for completion
  let attempts = 0
  const maxAttempts = 30 // 5 minutes max

  while (attempts < maxAttempts) {
    const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${APIFY_API_TOKEN}`
      }
    })

    const statusData = await statusResponse.json()

    if (statusData.data.status === 'SUCCEEDED') {
      // Get results
      const resultsResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items`, {
        headers: {
          'Authorization': `Bearer ${APIFY_API_TOKEN}`
        }
      })

      return await resultsResponse.json()
    } else if (statusData.data.status === 'FAILED') {
      throw new Error('Apify actor failed')
    }

    // Wait 10 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 10000))
    attempts++
  }

  throw new Error('Apify actor timed out')
}

function transformGMBData(rawData: any): LeadData[] {
  return rawData.map((item: any) => ({
    company: item.title,
    address: item.address,
    city: item.city,
    country: 'Nigeria', // Assuming Nigerian businesses for now
    phone: item.phone,
    website: item.website,
    rating: item.totalScore,
    review_count: item.reviewsCount,
    source: 'gmb',
    raw_data: item
  }))
}

function transformGoogleData(rawData: any): LeadData[] {
  return rawData.map((item: any) => ({
    company: item.title,
    website: item.url,
    source: 'google',
    raw_data: item
  }))
}

function transformInstagramData(rawData: any): LeadData[] {
  return rawData.map((item: any) => ({
    company: item.username,
    website: item.url,
    source: 'instagram',
    raw_data: item
  }))
}

function transformVibeData(rawData: any[]): LeadData[] {
  return rawData.map((item: any) => ({
    first_name: item.first_name,
    last_name: item.last_name,
    email: item.email,
    phone: item.phone,
    company: item.company,
    city: item.location?.split(',')[0]?.trim(),
    country: 'Nigeria', // Assuming Nigerian market
    source: 'vibeprospecting',
    raw_data: item
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapingRequest = await request.json()
    const { source, query, location, industry, company_size, title, limit = 50 } = body

    // Get current user and workspace
    const { data: userData, error: userError } = await insforge.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await insforge
      .from('workspaces')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    let rawResults: any[] = []
    let leads: LeadData[] = []

    // Run appropriate scraper based on source
    switch (source) {
      case 'gmb':
        if (!query || !location) {
          return NextResponse.json({ error: 'Query and location required for GMB scraping' }, { status: 400 })
        }

        rawResults = await runApifyActor(APIFY_ACTORS.gmb, {
          searchStringsArray: [`${query} in ${location}`],
          maxItems: limit,
          language: 'en',
          country: 'NG'
        })
        leads = transformGMBData(rawResults)
        break

      case 'google':
        if (!query) {
          return NextResponse.json({ error: 'Query required for Google scraping' }, { status: 400 })
        }

        rawResults = await runApifyActor(APIFY_ACTORS.google, {
          queries: [query],
          maxItems: limit,
          language: 'en'
        })
        leads = transformGoogleData(rawResults)
        break

      case 'instagram':
        if (!query) {
          return NextResponse.json({ error: 'Query required for Instagram scraping' }, { status: 400 })
        }

        rawResults = await runApifyActor(APIFY_ACTORS.instagram, {
          searchQueries: [query],
          resultsLimit: limit
        })
        leads = transformInstagramData(rawResults)
        break

      case 'vibeprospecting':
        if (!VIBEPROSPECTING_API_KEY) {
          return NextResponse.json({ error: 'VibeProspecting API key not configured' }, { status: 500 })
        }

        const vibeAPI = new VibeProspectingAPI(VIBEPROSPECTING_API_KEY)
        rawResults = await vibeAPI.searchLeads({
          industry,
          location,
          company_size,
          title,
          keywords: query,
          limit
        })
        leads = transformVibeData(rawResults)
        break

      default:
        return NextResponse.json({ error: 'Unsupported scraping source' }, { status: 400 })
    }

    // Filter out duplicates and invalid entries
    const validLeads = leads.filter(lead =>
      lead.company || lead.email || lead.phone || lead.website
    )

    // Remove duplicates based on email/phone/company
    const uniqueLeads = validLeads.filter((lead, index, self) =>
      index === self.findIndex(l =>
        (l.email && l.email === lead.email) ||
        (l.phone && l.phone === lead.phone) ||
        (l.company && l.company === lead.company)
      )
    )

    // Save leads to database with auto-qualification
    if (uniqueLeads.length > 0) {
      const leadInserts = []

      for (const lead of uniqueLeads) {
        // Auto-qualify each lead
        const qualification = await qualifyLeadWithClaude(lead, workspace.business_profile_json)

        leadInserts.push({
          workspace_id: workspace.id,
          source: lead.source,
          first_name: lead.first_name || null,
          last_name: lead.last_name || null,
          email: lead.email || null,
          phone: lead.phone || null,
          company: lead.company || null,
          city: lead.city || null,
          country: lead.country || null,
          score: qualification.score,
          tier: qualification.tier,
          status: qualification.score >= 50 ? 'qualified' : 'new',
          notes: qualification.notes,
          qualified_at: new Date().toISOString(),
          raw_data: lead.raw_data
        })
      }

      const { error: insertError } = await insforge
        .from('leads')
        .insert(leadInserts)

      if (insertError) {
        console.error('Error inserting leads:', insertError)
        return NextResponse.json({ error: 'Failed to save leads' }, { status: 500 })
      }
    }

    // Update usage tracking
    await insforge.from('usage_logs').insert({
      workspace_id: workspace.id,
      feature: 'leads',
      count: uniqueLeads.length
    })

    return NextResponse.json({
      success: true,
      leads_scraped: uniqueLeads.length,
      leads: uniqueLeads.slice(0, 10) // Return first 10 for preview
    })

  } catch (error) {
    console.error('Lead scraping error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraping failed' },
      { status: 500 }
    )
  }
}