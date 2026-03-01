import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AddRoundSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/openai'

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

    // Check usage limit (2 free rounds total) - skip for admins
    if (!profile.is_admin && profile.plan === 'free' && profile.usage_count >= 2) {
      return NextResponse.json(
        { error: 'Free usage limit reached. Upgrade to continue.' },
        { status: 403 }
      )
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
      deal.goal,
      validated.note,
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

    // Increment usage count
    await supabase
      .from('profiles')
      .update({ usage_count: profile.usage_count + 1 })
      .eq('id', user.id)

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

## Quote Overview

**Vendor:** ${output.vendor}

**Products/Services:**
${output.quote_overview.products_services.map((p: string) => `- ${p}`).join('\n')}

**Term:** ${output.quote_overview.term}

**Pricing:** ${output.quote_overview.pricing_summary}

**Key Terms:**
${output.quote_overview.key_terms_found.map((t: string) => `- ${t}`).join('\n')}

## Red Flags

${output.red_flags.map((flag: any) => `
### ${flag.type}: ${flag.issue}

**Why it matters:** ${flag.why_it_matters}

**Suggested fix:** ${flag.suggested_fix}
`).join('\n')}

## What to Ask For

### Must-Have
${output.asks.must_have.map((ask: string) => `- ${ask}`).join('\n')}

### Nice-to-Have
${output.asks.nice_to_have.map((ask: string) => `- ${ask}`).join('\n')}

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
${output.assumptions.map((a: string) => `- ${a}`).join('\n')}

## Disclaimer
${output.disclaimer}
`
}
