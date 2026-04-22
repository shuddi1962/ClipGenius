import { NextRequest, NextResponse } from 'next/server'
import { insforge } from '@/lib/insforge'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, description, customerEmail, metadata } = await request.json()

    if (!amount || !currency || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, description' },
        { status: 400 }
      )
    }

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

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description,
      metadata: {
        workspace_id: workspace.id,
        customer_email: customerEmail || '',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Store payment record in database
    const { data: paymentRecord, error: paymentError } = await insforge
      .from('payments')
      .insert({
        workspace_id: workspace.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount,
        currency: currency.toLowerCase(),
        description,
        status: 'pending',
        customer_email: customerEmail,
        metadata
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error storing payment record:', paymentError)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentRecordId: paymentRecord?.id
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    )
  }
}

// Webhook handler for Stripe events
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment record
    const { error } = await insforge
      .from('payments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Error updating payment record:', error)
    }

    // Log the successful payment
    console.log('Payment succeeded:', paymentIntent.id)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment record
    const { error } = await insforge
      .from('payments')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Error updating payment record:', error)
    }

    // Log the failed payment
    console.log('Payment failed:', paymentIntent.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}