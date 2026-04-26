import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

interface QualificationRequest {
  leadIds?: string[]
  workspaceId?: string
  singleLead?: {
    id: string
    first_name?: string | null
    last_name?: string | null
    email?: string | null
    phone?: string | null
    company?: string | null
    city?: string | null
    country?: string | null
    notes?: string | null
    source: string
  }
}

interface QualifiedLead {
  id: string
  score: number
  tier: 'hot' | 'warm' | 'cold'
  qualification_notes: string
  recommended_actions: string[]
}

async function qualifyLeadWithClaude(
  lead: any,
  businessProfile?: any
): Promise<{ score: number; tier: 'hot' | 'warm' | 'cold'; notes: string; actions: string[] }> {
  const systemPrompt = `You are an expert B2B sales qualification AI. Analyze the following lead information and business profile to determine:

1. Lead Score (0-100): Based on contact completeness, company size, industry match, engagement signals, and buying potential
2. Lead Tier: 'hot' (85+ score), 'warm' (50-84 score), or 'cold' (0-49 score)
3. Qualification Notes: Brief analysis of why this score/tier
4. Recommended Actions: 2-3 specific next steps for this lead

Consider:
- Contact completeness (email, phone, company, location)
- Company signals (size, industry alignment)
- Lead source quality
- Geographic relevance
- Business profile alignment

Return only JSON in this exact format:
{
  "score": number,
  "tier": "hot|warm|cold",
  "notes": "string",
  "actions": ["action1", "action2", "action3"]
}`

  const leadInfo = `
Lead Information:
- Name: ${lead.first_name || ''} ${lead.last_name || ''}
- Email: ${lead.email || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Company: ${lead.company || 'Not provided'}
- Location: ${lead.city || ''}, ${lead.country || ''}
- Source: ${lead.source}
- Notes: ${lead.notes || 'None'}

Business Profile:
${businessProfile ? JSON.stringify(businessProfile, null, 2) : 'No business profile available'}
`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Please qualify this lead:\n\n${leadInfo}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      const result = JSON.parse(content.text)
      return {
        score: Math.max(0, Math.min(100, result.score)),
        tier: result.tier,
        notes: result.notes,
        actions: result.actions
      }
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Claude API error:', error)
    // Fallback scoring based on available data
    return getFallbackQualification(lead)
  }
}

function getFallbackQualification(lead: any): { score: number; tier: 'hot' | 'warm' | 'cold'; notes: string; actions: string[] } {
  let score = 0
  const reasons = []
  const actions = []

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
  const notes = `Fallback qualification: ${reasons.join(', ')}. Score: ${score}/100`

  if (tier === 'hot') {
    actions.push('Send immediate personalized outreach', 'Schedule discovery call', 'Add to priority follow-up')
  } else if (tier === 'warm') {
    actions.push('Add to nurture sequence', 'Send educational content', 'Follow up in 3-5 days')
  } else {
    actions.push('Add to long-term nurture', 'Monitor for engagement signals', 'Re-qualify in 30 days')
  }

  return { score, tier, notes, actions }
}

export async function POST(request: NextRequest) {
  try {
    const body: QualificationRequest = await request.json()

    if (!body.singleLead && !body.leadIds) {
      return NextResponse.json({ error: 'Either leadIds or singleLead required' }, { status: 400 })
    }

    // Get current user and workspace
    const { data: userData, error: userError } = await (await import('@/lib/insforge')).insforge.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await (await import('@/lib/insforge')).insforge
      .from('workspaces')
      .select('id, business_profile_json')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const qualifiedLeads: QualifiedLead[] = []

    if (body.singleLead) {
      // Qualify single lead
      const result = await qualifyLeadWithClaude(body.singleLead, workspace.business_profile_json)
      qualifiedLeads.push({
        id: body.singleLead.id,
        score: result.score,
        tier: result.tier,
        qualification_notes: result.notes,
        recommended_actions: result.actions
      })
    } else if (body.leadIds) {
      // Qualify multiple leads
      const { data: leads, error } = await (await import('@/lib/insforge')).insforge
        .from('leads')
        .select('*')
        .eq('workspace_id', workspace.id)
        .in('id', body.leadIds)

      if (error) throw error

      for (const lead of leads || []) {
        const result = await qualifyLeadWithClaude(lead, workspace.business_profile_json)
        qualifiedLeads.push({
          id: lead.id,
          score: result.score,
          tier: result.tier,
          qualification_notes: result.notes,
          recommended_actions: result.actions
        })
      }
    }

    // Update leads in database
    if (qualifiedLeads.length > 0) {
      const updates = qualifiedLeads.map((lead: any) => ({
        id: lead.id,
        score: lead.score,
        tier: lead.tier,
        notes: lead.qualification_notes,
        qualified_at: new Date().toISOString()
      }))

      for (const update of updates) {
        await (await import('@/lib/insforge')).insforge
          .from('leads')
          .update({
            score: update.score,
            tier: update.tier,
            notes: update.notes,
            qualified_at: update.qualified_at
          })
          .eq('id', update.id)
      }
    }

    return NextResponse.json({
      success: true,
      qualified_leads: qualifiedLeads
    })

  } catch (error) {
    console.error('Qualification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Qualification failed' },
      { status: 500 }
    )
  }
}