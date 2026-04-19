import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

interface CampaignSendRequest {
  campaignId: string
}

export async function POST(request: NextRequest) {
  try {
    if (!SENDGRID_API_KEY) {
      return NextResponse.json({ error: 'SendGrid API key not configured' }, { status: 500 })
    }

    sgMail.setApiKey(SENDGRID_API_KEY)

    const body: CampaignSendRequest = await request.json()
    const { campaignId } = body

    // Get current user and workspace
    const { data: userData, error: userError } = await (await import('@/lib/insforge')).insforge.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await (await import('@/lib/insforge')).insforge
      .from('workspaces')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await (await import('@/lib/insforge')).insforge
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('workspace_id', workspace.id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return NextResponse.json({ error: 'Campaign cannot be sent' }, { status: 400 })
    }

    // Get template
    const { data: template } = await (await import('@/lib/insforge')).insforge
      .from('templates')
      .select('*')
      .eq('id', campaign.template_id)
      .single()

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Get lead list
    const { data: leadList } = await (await import('@/lib/insforge')).insforge
      .from('lead_lists')
      .select('lead_ids')
      .eq('id', campaign.lead_list_id)
      .single()

    if (!leadList?.lead_ids?.length) {
      return NextResponse.json({ error: 'No leads in campaign list' }, { status: 400 })
    }

    // Get leads
    const { data: leads } = await (await import('@/lib/insforge')).insforge
      .from('leads')
      .select('*')
      .in('id', leadList.lead_ids)

    if (!leads?.length) {
      return NextResponse.json({ error: 'No valid leads found' }, { status: 400 })
    }

    // Filter leads with email addresses
    const validLeads = leads.filter((lead: any) => lead.email)
    if (validLeads.length === 0) {
      return NextResponse.json({ error: 'No leads with email addresses' }, { status: 400 })
    }

    // Prepare personalized emails
    const messages = validLeads.map(lead => {
      // Replace variables in subject and content
      let subject = template.subject || 'Campaign Email'
      let html = template.body_html || template.body_text || ''

      // Replace common variables
      const variables = {
        first_name: lead.first_name || 'there',
        last_name: lead.last_name || '',
        email: lead.email,
        company: lead.company || 'your company',
        city: lead.city || '',
        country: lead.country || ''
      }

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        subject = subject.replace(regex, value)
        html = html.replace(regex, value)
      })

      return {
        to: lead.email,
        from: {
          email: 'campaigns@clipgenius.ai', // Configure this in SendGrid
          name: 'ClipGenius'
        },
        subject,
        html,
        customArgs: {
          campaign_id: campaignId,
          lead_id: lead.id
        }
      }
    })

    // Send emails in batches (SendGrid limit is 1000 per request)
    const batchSize = 500
    let sentCount = 0

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize)
      try {
        await sgMail.send(batch)
        sentCount += batch.length
      } catch (error) {
        console.error(`Error sending batch ${i / batchSize + 1}:`, error)
        // Continue with next batch
      }
    }

    // Update campaign status
    await (await import('@/lib/insforge')).insforge
      .from('campaigns')
      .update({
        status: 'running',
        stats_json: { sent: sentCount, delivered: 0, opened: 0, clicked: 0, replied: 0 }
      })
      .eq('id', campaignId)

    // Create campaign logs
    const logEntries = validLeads.map(lead => ({
      campaign_id: campaignId,
      lead_id: lead.id,
      channel: 'email',
      status: 'sent',
      sent_at: new Date().toISOString()
    }))

    await (await import('@/lib/insforge')).insforge
      .from('campaign_logs')
      .insert(logEntries)

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      total_leads: validLeads.length
    })

  } catch (error) {
    console.error('Campaign send error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Send failed' },
      { status: 500 }
    )
  }
}