import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/openai'
import { checkRateLimit } from '@/lib/rate-limit'

const FREE_ANALYSIS_LIMIT = 5

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

    // Rate limiting (admins bypass)
    if (!profile.is_admin) {
      const isPro = profile.plan === 'pro'
      const rateLimit = await checkRateLimit(user.id, isPro)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: rateLimit.message || 'Rate limit exceeded',
            remaining: rateLimit.remaining,
            resetAt: rateLimit.resetAt
          },
          { status: 429 }
        )
      }

      // Free plan limits (admins bypass)
      if (!isPro && profile.usage_count >= FREE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: `Free plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to Pro for unlimited analyses.` },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    // Analyze with V1 (full text analysis - catches everything)
    const output = await analyzeDeal(
      validated.extractedText || '',
      validated.dealType,
      validated.goal || undefined,
      validated.notes || undefined,
      undefined,
      validated.imageData
    )

    // Auto-detect vendor
    const vendor = validated.vendor || output.vendor

    // Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        vendor,
        title: `${vendor} - ${validated.dealType} - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        deal_type: validated.dealType,
        goal: validated.goal,
      })
      .select()
      .single()

    if (dealError || !deal) {
      throw new Error('Failed to create deal')
    }

    // Create Round 1 with V2 schema
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .insert({
        deal_id: deal.id,
        user_id: user.id,
        round_number: 1,
        note: validated.notes,
        extracted_text: validated.saveExtractedText ? validated.extractedText : null,
        output_json: output,
        output_markdown: '', // V1 doesn't need markdown
        status: 'done',
        model_version: 'gpt-4o',
        schema_version: 'v1',
      })
      .select()
      .single()

    if (roundError || !round) {
      throw new Error('Failed to create round')
    }

    // Increment usage count (skip for admins and demo text)
    if (!profile.is_admin && !validated.isDemoText) {
      await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      dealId: deal.id,
      roundId: round.id,
      output,
    })
  } catch (error) {
    console.error('Create deal error:', error)
    // CRITICAL: Never send raw error.message to client - may contain sensitive data
    return NextResponse.json({
      error: 'Failed to create deal. Please try again or contact support.'
    }, { status: 500 })
  }
}
