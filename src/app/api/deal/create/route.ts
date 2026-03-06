import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/openai'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { renderMarkdown } from '@/lib/render-markdown'

const FREE_ANALYSIS_LIMIT = 2

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
      const rl = rateLimit(`analysis:${user.id}`, RATE_LIMITS.analysis)
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }

      // Usage limits (admins bypass)
      if (profile.plan !== 'pro' && profile.usage_count >= FREE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: `Free plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to continue.` },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    // Analyze the deal with AI (with optional vision support)
    const output = await analyzeDeal(
      validated.extractedText || '',
      validated.dealType,
      validated.goal || undefined,
      validated.notes || undefined,
      undefined,
      validated.imageData
    )

    // Auto-detect vendor from output if not provided
    const vendor = validated.vendor || output.vendor

    // Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        vendor,
        title: output.title,
        deal_type: validated.dealType,
        goal: validated.goal,
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
        note: validated.notes,
        extracted_text: validated.saveExtractedText ? validated.extractedText : null,
        output_json: output,
        output_markdown: renderMarkdown(output),
        status: 'done',
        model_version: 'gpt-4o',
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
