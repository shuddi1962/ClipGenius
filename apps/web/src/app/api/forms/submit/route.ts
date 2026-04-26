import { NextRequest, NextResponse } from 'next/server'

interface FormSubmissionRequest {
  formId: string
  data: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmissionRequest = await request.json()
    const { formId, data } = body

    if (!formId || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: formId and data' },
        { status: 400 }
      )
    }

    // Get workspace from form (assuming forms are public for now)
    const { data: form, error: formError } = await (await import('@/lib/insforge')).insforge
      .from('forms')
      .select('workspace_id')
      .eq('id', formId)
      .eq('status', 'published')
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found or not published' }, { status: 404 })
    }

    // Store submission
    const { data: submission, error: submissionError } = await (await import('@/lib/insforge')).insforge
      .from('form_submissions')
      .insert({
        workspace_id: form.workspace_id,
        form_id: formId,
        data,
        submitted_at: new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error storing submission:', submissionError)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    // Update form submission count
    await (await import('@/lib/insforge')).insforge
      .from('forms')
      .update({
        submissions_count: (await (await import('@/lib/insforge')).insforge
          .from('forms')
          .select('submissions_count')
          .eq('id', formId)
          .single()).data?.submissions_count || 0 + 1
      })
      .eq('id', formId)

    // Check if this looks like a lead and create one
    if (data.email || data.phone) {
      try {
        await createLeadFromSubmission(form.workspace_id, data)
      } catch (error) {
        console.error('Error creating lead from submission:', error)
        // Don't fail the submission if lead creation fails
      }
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully'
    })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Submission failed' },
      { status: 500 }
    )
  }
}

async function createLeadFromSubmission(workspaceId: string, data: Record<string, any>) {
  const leadData = {
    workspace_id: workspaceId,
    name: data.name || data.fullName || data.firstName + ' ' + data.lastName || 'Form Submission',
    email: data.email,
    phone: data.phone || data.mobile || data.telephone,
    company: data.company || data.organization,
    source: 'form_submission',
    status: 'new',
    score: 25, // Default score for form submissions
    notes: `Submitted via web form. Additional data: ${JSON.stringify(data)}`
  }

  await (await import('@/lib/insforge')).insforge
    .from('leads')
    .insert(leadData)
}