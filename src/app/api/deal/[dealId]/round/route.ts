import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AddRoundSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/openai'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

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

    // Analyze with context from previous round
    const output = await analyzeDeal(
      validated.extractedText,
      deal.deal_type,
      deal.goal || undefined,
      validated.note || undefined,
      previousOutput
    )

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
        model_version: 'gpt-4o',
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
