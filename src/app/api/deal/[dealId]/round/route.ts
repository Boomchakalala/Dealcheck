import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { AddRoundSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

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
      // Only retry on transient errors (overloaded, rate limit, network, timeout)
      const isTransient = msg.includes('overloaded') || msg.includes('529')
        || msg.includes('rate') || msg.includes('timeout')
        || msg.includes('econnreset') || msg.includes('socket')
        || msg.includes('503') || msg.includes('500')
        || msg.includes('ai_overloaded') || msg.includes('ai_analysis_error')
      if (!isTransient || attempt === maxAttempts) throw lastError
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      console.warn(`[TermLift] Attempt ${attempt}/${maxAttempts} failed (${lastError.message}), retrying in ${delay}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw lastError
}

const FREE_ANALYSIS_LIMIT = 5

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params
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

      // Free plan limits
      if (!isPro && profile.usage_count >= FREE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: `Free plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to Pro for unlimited analyses.` },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const validated = AddRoundSchema.parse({ ...body, dealId })

    // Get deal
    const { data: deal } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Get previous rounds to find the latest output and round number
    const { data: previousRounds } = await supabase
      .from('rounds')
      .select('*')
      .eq('deal_id', dealId)
      .order('round_number', { ascending: false })
      .limit(1)

    const lastRound = previousRounds?.[0]
    const nextRoundNumber = lastRound ? lastRound.round_number + 1 : 1
    const previousOutput = lastRound?.output_json

    // Determine locale from cookie
    const locale = (await cookies()).get('termlift_lang')?.value || 'en'

    // Analyze with context from previous round (auto-retry on transient failures)
    const output = await withRetry(() => analyzeDeal(
      validated.extractedText,
      deal.deal_type,
      deal.goal || undefined,
      validated.note || undefined,
      previousOutput,
      undefined,
      undefined,
      locale
    ))

    // Create new round
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .insert({
        deal_id: dealId,
        user_id: user.id,
        round_number: nextRoundNumber,
        note: validated.note,
        extracted_text: validated.saveExtractedText ? validated.extractedText : null,
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

    // Update deal's updated_at timestamp
    await supabase
      .from('deals')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', dealId)

    return NextResponse.json({
      roundId: round.id,
      output,
    })
  } catch (error) {
    console.error('Add round error:', error)
    // CRITICAL: Never send raw error.message to client - may contain sensitive data
    return NextResponse.json({
      error: 'Failed to add round. Please try again or contact support.'
    }, { status: 500 })
  }
}

// Helper to render markdown from output JSON
function renderMarkdown(output: any): string {
  return `# ${output.title}

## Snapshot

**Vendor / Product:** ${output.snapshot?.vendor_product || output.vendor}

**Term:** ${output.snapshot?.term || 'N/A'}

**Total Commitment:** ${output.snapshot?.total_commitment || 'N/A'}

**Billing / Payment:** ${output.snapshot?.billing_payment || 'N/A'}

**Pricing Model:** ${output.snapshot?.pricing_model || 'N/A'}

**Deal Type:** ${output.snapshot?.deal_type || 'N/A'}

## Quick Read

**What's Solid:**
${(output.quick_read?.whats_solid || []).map((s: string) => `- ${s}`).join('\n')}

**What's Concerning:**
${(output.quick_read?.whats_concerning || []).map((s: string) => `- ${s}`).join('\n')}

**Conclusion:** ${output.quick_read?.conclusion || 'N/A'}

## Red Flags

${(output.red_flags || []).map((flag: any) => `
### ${flag.type}: ${flag.issue}

**Why it matters:** ${flag.why_it_matters}

**What to ask for:** ${flag.what_to_ask_for}

**If they push back:** ${flag.if_they_push_back}
`).join('\n')}

## Negotiation Plan

**Leverage You Have:**
${(output.negotiation_plan?.leverage_you_have || []).map((l: string) => `- ${l}`).join('\n')}

**Must-Have Asks:**
${(output.negotiation_plan?.must_have_asks || []).map((a: string) => `- ${a}`).join('\n')}

**Nice-to-Have Asks:**
${(output.negotiation_plan?.nice_to_have_asks || []).map((a: string) => `- ${a}`).join('\n')}

**Trades You Can Offer:**
${(output.negotiation_plan?.trades_you_can_offer || []).map((t: string) => `- ${t}`).join('\n')}

## What to Ask For

### Must-Have
${(output.what_to_ask_for?.must_have || []).map((ask: string) => `- ${ask}`).join('\n')}

### Nice-to-Have
${(output.what_to_ask_for?.nice_to_have || []).map((ask: string) => `- ${ask}`).join('\n')}

## Email Drafts

### Neutral
**Subject:** ${output.email_drafts.neutral.subject}

${output.email_drafts.neutral.body}

### Firm
**Subject:** ${output.email_drafts.firm.subject}

${output.email_drafts.firm.body}

### Final Push
**Subject:** ${output.email_drafts.final_push.subject}

${output.email_drafts.final_push.body}

## Assumptions
${(output.assumptions || []).map((a: string) => `- ${a}`).join('\n')}

## Disclaimer
${output.disclaimer}
`
}
