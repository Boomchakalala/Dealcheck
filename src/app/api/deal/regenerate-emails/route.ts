import { createClient } from '@/lib/supabase/server'
import { getClaudeResponse, getLanguageInstruction, EMAIL_PROMPT } from '@/lib/claude'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getMaxEmailRegens } from '@/lib/tiers'
import type { Plan } from '@/lib/tiers'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user plan for regen limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, is_admin')
      .eq('id', user.id)
      .single()

    const plan = (profile?.plan || 'free') as Plan
    const maxRegens = profile?.is_admin ? 99 : getMaxEmailRegens(plan)

    if (maxRegens === 0) {
      return NextResponse.json({ error: 'Email regeneration requires Essentials or Pro plan.' }, { status: 403 })
    }

    const body = await request.json()
    const {
      roundId,
      customPrompt,
      vendor,
      contactName,
      totalCommitment,
      term,
      currency,
      selectedAsks,
      canOffer,
      mustHaveAsks,
      conclusion,
    } = body

    // Check if round exists and belongs to user
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('email_regeneration_count, schema_version')
      .eq('id', roundId)
      .eq('user_id', user.id)
      .single()

    if (roundError || !round) {
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    // V2 rounds use on-demand email generation
    if (round.schema_version === 'v2') {
      return NextResponse.json({
        error: 'Email regeneration is not available for V2 analysis. Use the on-demand email generator instead.'
      }, { status: 400 })
    }

    // Check regeneration limit based on plan
    if (round.email_regeneration_count >= maxRegens) {
      return NextResponse.json({
        error: `You've reached the limit of ${maxRegens} email regeneration${maxRegens > 1 ? 's' : ''} for this round.${plan === 'essentials' ? ' Upgrade to Pro for 3 per round.' : ''}`
      }, { status: 429 })
    }

    // The user's checkbox selection drives generation. Fall back to the old must-have list
    // for any client that hasn't been updated yet.
    const selected: string[] = (Array.isArray(selectedAsks) && selectedAsks.length ? selectedAsks : (mustHaveAsks || [])).filter(Boolean)
    const offers: string[] = Array.isArray(canOffer) ? canOffer : []

    const basePrompt = `You are TermLift's email generation engine. Write 3 supplier-facing email variations.

${EMAIL_PROMPT}

DEAL CONTEXT:
Vendor: ${vendor || 'the vendor'}
Contact Name: ${contactName || 'NOT AVAILABLE, use "Hi," as greeting'}
Total Commitment: ${totalCommitment || 'not specified'}
Term: ${term || 'not specified'}
Currency: ${currency || 'match the source quote'}
Situation: ${conclusion || 'Negotiation in progress'}

THE ASKS TO PUSH ON (use ALL of these, in this priority order — the first gets the lead position and the most space):
${selected.map((a: string) => `- ${a}`).join('\n') || '- (none selected — write a short, friendly note that the buyer is happy with the quote and ready to proceed)'}

WHAT THE BUYER CAN OFFER IN RETURN (trade these against the asks where they fit, in the same breath):
${offers.map((c: string) => `- ${c}`).join('\n') || '- a fast signature once the points above are settled'}

${customPrompt ? `USER'S CUSTOM REQUEST (honor this):\n${customPrompt}\n` : ''}
Return ONLY valid JSON (no markdown, no code fences):
{
  "emails": [
    { "label": "Friendly", "subject": "email subject", "body": "email body" },
    { "label": "Direct", "subject": "email subject", "body": "email body" },
    { "label": "Firm", "subject": "email subject", "body": "email body" }
  ]
}`

    // Determine locale from cookie
    const locale = (await cookies()).get('termlift_lang')?.value || 'en'
    const langInstruction = getLanguageInstruction(locale)

    const raw = (await getClaudeResponse({
      system: 'You are a procurement negotiation expert. Write professional, effective emails. Return only valid JSON.' + langInstruction,
      userContent: basePrompt,
      temperature: 0.7,
      max_tokens: 2000,
    })).trim() || '{}'

    let result
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse regenerated emails:', raw)
      return NextResponse.json({ error: 'Failed to parse generated emails' }, { status: 500 })
    }

    if (!result.emails || !Array.isArray(result.emails) || result.emails.length < 3) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }

    // Increment regeneration count
    await supabase
      .from('rounds')
      .update({ email_regeneration_count: round.email_regeneration_count + 1 })
      .eq('id', roundId)

    return NextResponse.json({
      emails: result.emails.slice(0, 3),
      remainingRegenerations: maxRegens - round.email_regeneration_count - 1
    })
  } catch (error) {
    console.error('Regenerate emails error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
