import { createClient } from '@/lib/supabase/server'
import { getClaudeResponse, getLanguageInstruction, KEVIN_SYSTEM_PROMPT, EMAIL_RULES } from '@/lib/claude'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { SHOW_FULL_NEGOTIATION_PLAYBOOK } from '@/lib/negotiation-gating'
import { FULL_ANALYSIS_EMAIL_REGEN_LIMIT } from '@/lib/pricing'
import { canAccessFullAnalysis } from '@/lib/deep-analysis-status'
import { runWithAiContext } from '@/lib/ai-telemetry'
import { recommendTone, type EmailTone } from '@/lib/tone-recommend'

// Email generation regularly takes 15-25s (single Claude call producing 3
// variants) — matches the explicit maxDuration set on every other AI-calling
// route in this app (round, deep-analysis, trial, etc.); without it this
// route falls back to the platform default, which is too short and would
// time out under real generation latency.
export const maxDuration = 120

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
      .select('plan, is_admin, first_name, last_name')
      .eq('id', user.id)
      .single()

    const senderName = profile?.first_name
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
      : undefined
    // Email generation belongs to Full Analysis now, not a subscription tier —
    // the cap here is a flat abuse safeguard, not a paywall. Per-deal
    // entitlement (has this round's Full Analysis been unlocked) is checked
    // below, once the round is fetched.
    const maxRegens = profile?.is_admin ? 99 : FULL_ANALYSIS_EMAIL_REGEN_LIMIT

    if (!profile?.is_admin && !SHOW_FULL_NEGOTIATION_PLAYBOOK) {
      return NextResponse.json({ error: 'Email drafting is now handled by TermLift as part of the negotiation service.' }, { status: 403 })
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
      mustHaveAsks,
      niceToHaveAsks,
      redFlagAsks,
      canOffer,
      conclusion,
      dealType,
      // Automatic deal context (already known from analysis — the model
      // should never ask the user to re-supply any of this).
      targetPriceLow,
      targetPriceHigh,
      potentialSavingsTotal,
      leverageYouHave,
      paymentTerms,
      pricingModel,
      leverageLevel,
      highSeverityFlagCount,
      isRenewal,
      // Optional user-supplied context — only what the quote/analysis can't
      // reliably know. Every field is optional and omitted from the prompt
      // entirely when not provided.
      negotiationObjective,
      budgetCeiling,
      competingQuote,
      walkAwayFlexibility,
      internalDeadline,
      additionalInstructions,
    } = body

    const dealTypeContext: Record<string, string> = {
      renewal: 'This is a RENEWAL — the buyer is already a customer. Frame asks around retention leverage (the vendor doesn\'t want to lose an existing account) rather than new-logo competitive pressure.',
      new_purchase: 'This is a NEW PURCHASE — the buyer is not yet a customer. Frame asks around new-logo competitive pressure and fast-signature leverage.',
      expansion: 'This is an EXPANSION of an existing agreement (additional seats/usage) — frame asks around volume/loyalty leverage from the existing relationship, not a fresh competitive evaluation.',
    }

    // Check if round exists and belongs to user
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('email_regeneration_count, schema_version, output_json, deal_id')
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

    // Email generation is part of Full Analysis — require it to be unlocked
    // for this deal before drafting, same signal the deal page UI already
    // gates the "Generate email" entry point on.
    if (!profile?.is_admin && !canAccessFullAnalysis(round.output_json)) {
      return NextResponse.json({ error: 'Unlock Full Analysis for this deal before generating a negotiation email.' }, { status: 403 })
    }

    // Regeneration cap — a flat abuse safeguard, not a plan limit
    if (round.email_regeneration_count >= maxRegens) {
      return NextResponse.json({
        error: `You've reached the limit of ${maxRegens} email regeneration${maxRegens > 1 ? 's' : ''} for this round.`
      }, { status: 429 })
    }

    const allAsks: string[] = [
      ...(Array.isArray(mustHaveAsks) ? mustHaveAsks : []),
      ...(Array.isArray(niceToHaveAsks) ? niceToHaveAsks : []),
      ...(Array.isArray(redFlagAsks) ? redFlagAsks : []),
    ].filter(Boolean)
    const offers: string[] = Array.isArray(canOffer) ? canOffer : []
    const leverage: string[] = Array.isArray(leverageYouHave) ? leverageYouHave : []

    const walkAwayContext: Record<string, string> = {
      flexible: 'The buyer is genuinely flexible on this deal — no urgency to force a compromise, but open to pushing.',
      prefer_stay: 'The buyer would prefer to stay with this vendor if reasonably possible — push for the asks, but do not frame the email as a threat to leave.',
      can_walk: 'The buyer has real alternatives and is willing to walk away from this deal if the asks are not met — this is genuine leverage, but stay professional, do not bluff or exaggerate it.',
    }

    const basePrompt = `Write 3 supplier-facing email variations in Kevin's style.

${EMAIL_RULES}

DEAL CONTEXT (already known from the analysis — do not ask the user for any of this):
Vendor: ${vendor || 'the vendor'}
Contact Name: ${contactName || 'NOT AVAILABLE — use "Hi," as greeting'}
Total Commitment: ${totalCommitment || 'not specified'}
Term: ${term || 'not specified'}
Currency: ${currency || 'match the source quote'}
Payment terms: ${paymentTerms || 'not specified'}
Pricing model: ${pricingModel || 'not specified'}
${targetPriceLow && targetPriceHigh ? `Realistic target price range: ${targetPriceLow}–${targetPriceHigh} — push toward this range, do not just ask for an unspecified "discount."` : ''}
${potentialSavingsTotal ? `Estimated savings opportunity identified: ${potentialSavingsTotal} — this is the internal estimate, not a number to quote directly to the supplier.` : ''}
Situation: ${conclusion || 'Negotiation in progress'}
${dealType && dealTypeContext[dealType] ? `\n${dealTypeContext[dealType]}\n` : ''}

${contactName ? `The contact's first name is "${contactName}". Use "Hi ${contactName}," as the greeting in every email.` : ''}
SENDER NAME: ${senderName || '[Your Name]'}

ALL AVAILABLE ASKS (apply the selection logic above — pick the 3-4 most commercially important ones, in order of priority):
${allAsks.map((a: string) => `- ${a}`).join('\n') || '- (none — write a short, friendly note that the buyer is happy with the quote and ready to proceed)'}

WHAT THE BUYER CAN OFFER IN RETURN (trade these against the asks where they fit naturally):
${offers.map((c: string) => `- ${c}`).join('\n') || '- fast signature once the points above are settled'}

LEVERAGE THE BUYER HAS (use the strongest one or two naturally — never state them as a list to the vendor):
${leverage.map((l: string) => `- ${l}`).join('\n') || '- (none specific — keep the tone collaborative rather than pushing hard on leverage)'}

${negotiationObjective ? `BUYER'S STATED OBJECTIVE FOR THIS NEGOTIATION: ${negotiationObjective}\n` : ''}${budgetCeiling ? `BUYER'S BUDGET CEILING: ${budgetCeiling} — negotiate toward this, but do not reveal the exact ceiling number to the supplier unless it naturally helps close (e.g. "we have budget approved up to X" only if that serves the ask).\n` : ''}${competingQuote ? `COMPETING QUOTE / ALTERNATIVE THE BUYER HAS: ${competingQuote} — this is real leverage; reference it naturally and factually, do not exaggerate or invent details beyond what's given.\n` : ''}${walkAwayFlexibility && walkAwayContext[walkAwayFlexibility] ? `WALK-AWAY POSITION: ${walkAwayContext[walkAwayFlexibility]}\n` : ''}${internalDeadline ? `INTERNAL DEADLINE: ${internalDeadline} — use this to create realistic urgency where it fits.\n` : ''}${additionalInstructions ? `ADDITIONAL INSTRUCTIONS FROM THE BUYER (honor these):\n${additionalInstructions}\n` : ''}
${customPrompt ? `USER'S CUSTOM REQUEST (honor this above all else):\n${customPrompt}\n` : ''}
Return ONLY valid JSON (no markdown, no code fences):
{
  "emails": [
    { "label": "neutral", "subject": "email subject", "body": "email body" },
    { "label": "firm", "subject": "email subject", "body": "email body" },
    { "label": "final_push", "subject": "email subject", "body": "email body" }
  ]
}`

    const recommendedTone: EmailTone = recommendTone({
      leverageLevel: leverageLevel || null,
      highSeverityFlagCount: typeof highSeverityFlagCount === 'number' ? highSeverityFlagCount : 0,
      walkAwayFlexibility: walkAwayFlexibility || null,
      isRenewal: dealType === 'renewal',
      hasInternalDeadline: !!internalDeadline,
    })

    // Determine locale from cookie
    const locale = (await cookies()).get('termlift_lang')?.value || 'en'
    const langInstruction = getLanguageInstruction(locale)

    const raw = (await runWithAiContext({ userId: user.id, dealId: round.deal_id, roundId }, () => getClaudeResponse({
      action: 'email_regenerate',
      system: KEVIN_SYSTEM_PROMPT + '\n' + langInstruction,
      userContent: basePrompt,
      temperature: 0.7,
      max_tokens: 2000,
    }))).trim() || '{}'

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
      recommendedTone,
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
