import { NextRequest, NextResponse } from 'next/server'

interface WorkflowTriggerRequest {
  workflowId?: string
  triggerType: string
  eventData: any
}

export async function POST(request: NextRequest) {
  try {
    const body: WorkflowTriggerRequest = await request.json()
    const { workflowId, triggerType, eventData } = body

    if (!triggerType) {
      return NextResponse.json(
        { error: 'Missing required field: triggerType' },
        { status: 400 }
      )
    }

    // Get current user and workspace
    const { data: userData, error: userError } = await (await import('@/lib/insforge')).default.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workspace } = await (await import('@/lib/insforge')).default
      .from('workspaces')
      .select('id')
      .eq('user_id', userData.user.id)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    let workflowsToExecute = []

    if (workflowId) {
      // Execute specific workflow
      const { data: workflow, error } = await (await import('@/lib/insforge')).default
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .eq('workspace_id', workspace.id)
        .eq('active', true)
        .single()

      if (error || !workflow) {
        return NextResponse.json({ error: 'Workflow not found or inactive' }, { status: 404 })
      }

      workflowsToExecute = [workflow]
    } else {
      // Find workflows that match the trigger type
      const { data: workflows, error } = await (await import('@/lib/insforge')).default
        .from('workflows')
        .select('*')
        .eq('workspace_id', workspace.id)
        .eq('active', true)
        .eq('trigger_type', triggerType)

      if (error) throw error
      workflowsToExecute = workflows || []
    }

    // Execute workflows
    const executionResults = []
    for (const workflow of workflowsToExecute) {
      try {
        const result = await executeWorkflow(workflow, eventData, workspace.id)
        executionResults.push({
          workflowId: workflow.id,
          success: true,
          stepsExecuted: result.stepsExecuted
        })
      } catch (error) {
        console.error(`Error executing workflow ${workflow.id}:`, error)
        executionResults.push({
          workflowId: workflow.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      executedWorkflows: executionResults.length,
      results: executionResults
    })

  } catch (error) {
    console.error('Workflow execution error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    )
  }
}

async function executeWorkflow(workflow: any, eventData: any, workspaceId: string) {
  const steps = workflow.steps_json || []
  let currentStepIndex = 0
  const executionContext = { ...eventData }
  const stepsExecuted = []

  while (currentStepIndex < steps.length) {
    const step = steps[currentStepIndex]

    try {
      const result = await executeStep(step, executionContext, workspaceId)

      stepsExecuted.push({
        stepId: step.id,
        type: step.type,
        success: true,
        result
      })

      // Handle step flow control
      if (step.type === 'condition') {
        // Conditions determine next step
        const conditionResult = evaluateCondition(step.config, executionContext)
        currentStepIndex = findStepIndex(steps, conditionResult ? step.config.true_step : step.config.false_step)
      } else {
        currentStepIndex++
      }

      // Add delay if this is a wait step
      if (step.type === 'wait') {
        const delay = calculateDelay(step.config)
        await new Promise(resolve => setTimeout(resolve, delay))
      }

    } catch (error) {
      stepsExecuted.push({
        stepId: step.id,
        type: step.type,
        success: false,
        error: error instanceof Error ? error.message : 'Step execution failed'
      })

      // Continue to next step or stop execution based on workflow configuration
      currentStepIndex++
    }
  }

  return { stepsExecuted }
}

async function executeStep(step: any, context: any, workspaceId: string) {
  switch (step.type) {
    case 'email':
      return await sendEmail(step.config, context, workspaceId)

    case 'whatsapp':
      return await sendWhatsApp(step.config, context, workspaceId)

    case 'sms':
      return await sendSMS(step.config, context, workspaceId)

    case 'voice':
      return await makeVoiceCall(step.config, context, workspaceId)

    case 'wait':
      // Wait is handled in the main execution loop
      return { waited: true }

    case 'condition':
      // Conditions are evaluated in the main execution loop
      return { evaluated: true }

    default:
      throw new Error(`Unknown step type: ${step.type}`)
  }
}

async function sendEmail(config: any, context: any, workspaceId: string) {
  // Use the existing campaigns API to send email
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/campaigns/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: config.template_id,
      leadListId: config.lead_list_id,
      variables: context
    })
  })

  if (!response.ok) {
    throw new Error('Email sending failed')
  }

  return await response.json()
}

async function sendWhatsApp(config: any, context: any, workspaceId: string) {
  // Use the existing WhatsApp API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/campaigns/send-whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: config.template_id,
      leadListId: config.lead_list_id,
      variables: context
    })
  })

  if (!response.ok) {
    throw new Error('WhatsApp sending failed')
  }

  return await response.json()
}

async function sendSMS(config: any, context: any, workspaceId: string) {
  // Use the existing SMS API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/campaigns/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: config.template_id,
      leadListId: config.lead_list_id,
      variables: context
    })
  })

  if (!response.ok) {
    throw new Error('SMS sending failed')
  }

  return await response.json()
}

async function makeVoiceCall(config: any, context: any, workspaceId: string) {
  // Use the existing voice API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/voice/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: config.agent_id,
      leadId: context.leadId || config.lead_id,
      variables: context
    })
  })

  if (!response.ok) {
    throw new Error('Voice call failed')
  }

  return await response.json()
}

function evaluateCondition(config: any, context: any): boolean {
  const { field, operator, value } = config
  const fieldValue = context[field]

  switch (operator) {
    case '>':
      return Number(fieldValue) > Number(value)
    case '<':
      return Number(fieldValue) < Number(value)
    case '>=':
      return Number(fieldValue) >= Number(value)
    case '<=':
      return Number(fieldValue) <= Number(value)
    case '==':
    case '===':
      return fieldValue == value
    case '!=':
    case '!==':
      return fieldValue != value
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    default:
      return false
  }
}

function findStepIndex(steps: any[], stepId: string): number {
  return steps.findIndex(step => step.id === stepId)
}

function calculateDelay(config: any): number {
  const { duration, unit } = config
  const multipliers = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000
  }

  return duration * (multipliers[unit as keyof typeof multipliers] || 0)
}