import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, PLANS, type PlanKey } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!plan || !PLANS[plan as PlanKey]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const selectedPlan = PLANS[plan as PlanKey]

    // Guard against placeholder price IDs
    if (!selectedPlan.priceId || selectedPlan.priceId.includes('placeholder')) {
      return NextResponse.json({ error: 'This plan is not yet available. Please contact support.' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, plan')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // If user already has an active subscription, upgrade it instead of creating a new one
    if (profile?.stripe_subscription_id) {
      try {
        const subscription = await getStripe().subscriptions.retrieve(profile.stripe_subscription_id)

        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Update the existing subscription to the new plan
          await getStripe().subscriptions.update(profile.stripe_subscription_id, {
            items: [{
              id: subscription.items.data[0].id,
              price: selectedPlan.priceId,
            }],
            proration_behavior: 'create_prorations',
            metadata: {
              supabase_user_id: user.id,
              plan: plan,
            },
          })

          // Update profile immediately
          await supabase
            .from('profiles')
            .update({ plan: plan })
            .eq('id', user.id)

          // Redirect to settings with success
          return NextResponse.json({
            url: `${request.headers.get('origin')}/app/settings?upgraded=true`,
          })
        }
      } catch (err) {
        // Subscription retrieval failed (maybe deleted), fall through to new checkout
        console.warn('[Stripe] Could not retrieve existing subscription, creating new checkout:', err)
      }
    }

    // No existing subscription — create a new checkout session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      success_url: `${request.headers.get('origin')}/app/settings?upgraded=true`,
      cancel_url: `${request.headers.get('origin')}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
