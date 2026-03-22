import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { renderMarkdown } from '@/lib/render-markdown'
import { FREE_ANALYSIS_LIMIT, ESSENTIALS_MONTHLY_LIMIT } from '@/lib/tiers'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and check usage limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('usage_count, plan, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Rate limiting and plan enforcement (admins bypass)
    if (!profile.is_admin) {
      const plan = (profile.plan || 'free') as string
      const rateLimit = await checkRateLimit(user.id, plan)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: rateLimit.message || 'Rate limit exceeded', remaining: rateLimit.remaining, resetAt: rateLimit.resetAt },
          { status: 429 }
        )
      }

      if (plan === 'free') {
        if (profile.usage_count >= FREE_ANALYSIS_LIMIT) {
          return NextResponse.json(
            { error: `Starter plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to Essentials (\u20AC15/mo) or Pro (\u20AC39/mo) for more.` },
            { status: 403 }
          )
        }
      } else if (plan === 'essentials') {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        const { count: monthlyCount } = await supabase
          .from('rounds')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
        if ((monthlyCount || 0) >= ESSENTIALS_MONTHLY_LIMIT) {
          return NextResponse.json(
            { error: `Essentials plan limited to ${ESSENTIALS_MONTHLY_LIMIT} analyses per month. Upgrade to Pro (\u20AC39/mo) for unlimited.` },
            { status: 403 }
          )
        }
      }
    }

    // Parse request body
    const body = await request.json()
    const { output, dealType, goal, extractedText } = body

    if (!output || !dealType) {
      return NextResponse.json({ error: 'Missing required fields: output, dealType' }, { status: 400 })
    }

    // Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        vendor: output.vendor,
        title: output.title,
        deal_type: dealType,
        goal: goal || null,
      })
      .select()
      .single()

    if (dealError || !deal) {
      throw new Error('Failed to create deal')
    }

    // Create Round 1
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .insert({
        deal_id: deal.id,
        user_id: user.id,
        round_number: 1,
        extracted_text: extractedText || null,
        output_json: output,
        output_markdown: renderMarkdown(output),
        status: 'done',
        model_version: 'claude-sonnet-4',
      })
      .select()
      .single()

    if (roundError || !round) {
      throw new Error('Failed to create round')
    }

    // Increment usage count (skip for admins)
    if (!profile.is_admin) {
      await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      dealId: deal.id,
      roundId: round.id,
    })
  } catch (error) {
    console.error('Import trial error:', error)
    // CRITICAL: Never send raw error.message to client - may contain sensitive data
    return NextResponse.json({
      error: 'Failed to import trial. Please try again or contact support.'
    }, { status: 500 })
  }
}
