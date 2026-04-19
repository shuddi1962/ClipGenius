import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

interface SMSSendRequest {
  campaignId: string
}

export async function POST(request: NextRequest) {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return NextResponse.json({ error: 'Twilio credentials not configured' }, { status: 500 })
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    const body: SMSSendRequest = await request.json()
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

    // Get leads with phone numbers
    const { data: leads } = await (await import('@/lib/insforge')).insforge
      .from('leads')
      .select('*')
      .in('id', leadList.lead_ids)

    if (!leads?.length) {
      return NextResponse.json({ error: 'No valid leads found' }, { status: 400 })
    }

    // Filter leads with phone numbers
    const validLeads = leads.filter((lead: any) => lead.phone)
    if (validLeads.length === 0) {
      return NextResponse.json({ error: 'No leads with phone numbers' }, { status: 400 })
    }

    let sentCount = 0
    let failedCount = 0

    // Send SMS messages (with rate limiting)
    for (const lead of validLeads) {
      try {
        // Personalize message (keep under 160 characters for single SMS)
        let message = template.body_text || 'Hello from ClipGenius!'

        const variables = {
          first_name: lead.first_name || 'there',
          last_name: lead.last_name || '',
          company: lead.company || 'your company',
          city: lead.city || ''
        }

        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g')
          message = message.replace(regex, value)
        })

        // Truncate if too long (SMS limit)
        if (message.length > 160) {
          message = message.substring(0, 157) + '...'
        }

        // Format phone number
        let phoneNumber = lead.phone
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+${phoneNumber}`
        }

        // Send SMS
        await client.messages.create({
          from: TWILIO_PHONE_NUMBER,
          to: phoneNumber,
          body: message
        })

        sentCount++

        // Create campaign log
        await (await import('@/lib/insforge')).insforge
          .from('campaign_logs')
          .insert({
            campaign_id: campaignId,
            lead_id: lead.id,
            channel: 'sms',
            status: 'sent',
            sent_at: new Date().toISOString()
          })

        // Rate limiting: 1 message per second
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error(`Failed to send SMS to ${lead.phone}:`, error)
        failedCount++

        // Log failed attempt
        await (await import('@/lib/insforge')).insforge
          .from('campaign_logs')
          .insert({
            campaign_id: campaignId,
            lead_id: lead.id,
            channel: 'sms',
            status: 'failed',
            sent_at: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
      }
    }

    // Update campaign status
    await (await import('@/lib/insforge')).insforge
      .from('campaigns')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        stats_json: {
          sent: sentCount,
          failed: failedCount,
          delivered: sentCount, // SMS delivery status comes later
          opened: 0,
          clicked: 0,
          replied: 0
        }
      })
      .eq('id', campaignId)

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      failed_count: failedCount,
      total_leads: validLeads.length
    })

  } catch (error) {
    console.error('SMS campaign send error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Send failed' },
      { status: 500 }
    )
  }
}