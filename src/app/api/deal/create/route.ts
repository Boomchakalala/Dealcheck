import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'
import { FREE_ANALYSIS_LIMIT, isPaidPlan as checkIsPaidPlan } from '@/lib/tiers'

// Allow up to 120s for classification + analysis with retries (Vercel Pro plan)
export const maxDuration = 120

/** Retry a function with exponential backoff on transient failures */
async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 1000 } = {}
): Promise<T> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const msg = lastError.message.toLowerCase()
      const isTransient = msg.includes('overloaded') || msg.includes('529')
        || msg.includes('rate') || msg.includes('timeout')
        || msg.includes('econnreset') || msg.includes('socket')
        || msg.includes('503') || msg.includes('500')
        || msg.includes('ai_overloaded') || msg.includes('ai_analysis_error')
        || msg.includes('ai_parse_error') || msg.includes('ai_validation_error')
      if (!isTransient || attempt === maxAttempts) throw lastError
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      console.warn(`[TermLift] Create attempt ${attempt}/${maxAttempts} failed (${lastError.message}), retrying in ${delay}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw lastError
}

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
      .select('usage_count, plan, is_admin, negotiation_preferences')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Rate limiting (admins bypass)
    if (!profile.is_admin) {
      const isPaidUser = checkIsPaidPlan(profile.plan as any)
      const rateLimit = await checkRateLimit(user.id, profile.plan)

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

      // Free plan total limit (paid plans use rate limiter only)
      if (!isPaidUser && profile.usage_count >= FREE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: `Starter plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to Essentials (€15/mo) or Pro (€39/mo) for more analyses.` },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    // Determine locale from cookie or request body
    const locale = (await cookies()).get('termlift_lang')?.value || (body as any).locale || 'en'

    // Validate PDF data if provided
    const validPdfData = validated.pdfData?.base64 && validated.pdfData?.mimeType === 'application/pdf'
      ? { base64: validated.pdfData.base64, mimeType: validated.pdfData.mimeType }
      : undefined

    // Analyze with V1 (full text analysis — auto-retry on transient failures)
    const output = await withRetry(() => analyzeDeal(
      validated.extractedText || '',
      validated.dealType,
      validated.goal || undefined,
      validated.notes || undefined,
      undefined,
      validated.imageData,
      (body as any).allPages || undefined,
      locale,
      validPdfData,
      (profile as any)?.negotiation_preferences || undefined
    ))

    // Auto-detect vendor
    const vendor = validated.vendor || output.vendor

    // Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        vendor,
        title: `${vendor} · ${validated.dealType === 'New' ? 'New Purchase' : 'Renewal'} · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
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
        model_version: 'claude-sonnet-4',
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
    const msg = error instanceof Error ? error.message : ''
    const hint = msg.includes('AI_OVERLOADED') ? 'The AI service is temporarily busy. Please try again in a moment.'
      : msg.includes('AI_PARSE_ERROR') ? 'The AI returned an unexpected format. Please try again.'
      : msg.includes('AI_VALIDATION_ERROR') ? 'The AI response was incomplete. Please try again.'
      : msg.includes('AI_ANALYSIS_ERROR') ? 'The analysis failed. Please try again or use a shorter quote.'
      : (msg.includes('timeout') || msg.includes('aborted')) ? 'The analysis took too long. Please try again with a shorter quote.'
      : 'Failed to create deal. Please try again or contact support.'
    return NextResponse.json({ error: hint }, { status: 500 })
  }
}
