import { NextRequest, NextResponse } from 'next/server'
import insforge from '@/lib/insforge'

const BLAND_AI_API_KEY = process.env.BLAND_AI_API_KEY

interface VoiceCallRequest {
  agentId: string
  phoneNumber: string
  leadId?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!BLAND_AI_API_KEY) {
      return NextResponse.json({ error: 'Bland.ai API key not configured' }, { status: 500 })
    }

    const body: VoiceCallRequest = await request.json()
    const { agentId, phoneNumber, leadId } = body

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

    // Get voice agent
    const { data: agent, error: agentError } = await insforge
      .from('voice_agents')
      .select('*')
      .eq('id', agentId)
      .eq('workspace_id', workspace.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Voice agent not found' }, { status: 404 })
    }

    if (!agent.active) {
      return NextResponse.json({ error: 'Voice agent is not active' }, { status: 400 })
    }

    // Get lead info if provided
    let leadContext = ''
    if (leadId) {
      const { data: lead } = await insforge
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (lead) {
        leadContext = `Lead Information:
- Name: ${lead.first_name || ''} ${lead.last_name || ''}
- Company: ${lead.company || 'Unknown'}
- Email: ${lead.email || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Notes: ${lead.notes || 'None'}
- Qualification: ${lead.tier || 'Not qualified'} (${lead.score || 0}/100)`
      }
    }

    // Prepare Bland.ai call payload
    const blandPayload = {
      phone_number: phoneNumber.replace(/^\+/, ''), // Bland.ai expects number without +
      task: `${agent.goal}. ${leadContext ? `Context: ${leadContext}` : ''}`,
      voice: agent.voice_id,
      language: agent.language,
      model: 'enhanced', // Use enhanced model for better performance
      transfer_phone_number: null, // Could be configured later
      transfer_list: {},
      answered_by_enabled: false,
      voicemail_message: `Hi, this is ${agent.name} from our company. I tried to reach you regarding our services. Please call us back at your earliest convenience.`,
      amd: true, // Answering machine detection
      max_duration: 10, // 10 minutes max
      record: true,
      metadata: {
        agent_id: agentId,
        lead_id: leadId || null,
        workspace_id: workspace.id
      }
    }

    // Make call via Bland.ai
    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLAND_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blandPayload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Bland.ai API error: ${errorData.message || response.statusText}`)
    }

    const callData = await response.json()

    // Log the call
    await insforge
      .from('call_logs')
      .insert({
        workspace_id: workspace.id,
        lead_id: leadId || null,
        agent_id: agentId,
        direction: 'outbound',
        recording_url: callData.recording_url || null,
        cost: callData.cost || null,
        summary: `Call initiated via Bland.ai - ID: ${callData.call_id}`,
        outcome: 'initiated'
      })

    return NextResponse.json({
      success: true,
      call_id: callData.call_id,
      status: callData.status,
      message: 'Call initiated successfully'
    })

  } catch (error) {
    console.error('Voice call error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Call failed' },
      { status: 500 }
    )
  }
}