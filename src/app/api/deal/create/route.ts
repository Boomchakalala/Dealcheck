import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/openai'

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
      .select('usage_count, plan')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check usage limit (2 free rounds)
    if (profile.plan === 'free' && profile.usage_count >= 2) {
      return NextResponse.json(
        { error: 'Free usage limit reached. Upgrade to continue.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    // Analyze the deal with AI
    const output = await analyzeDeal(
      validated.extractedText,
      validated.dealType,
      validated.goal,
      validated.notes
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

    // Increment usage count
    await supabase
      .from('profiles')
      .update({ usage_count: profile.usage_count + 1 })
      .eq('id', user.id)

    return NextResponse.json({
      dealId: deal.id,
      roundId: round.id,
      output,
    })
  } catch (error) {
    console.error('Create deal error:', error)
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
