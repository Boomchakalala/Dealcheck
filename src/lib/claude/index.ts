/**
 * Claude AI Pipeline — 3-call architecture
 *
 * Call 1: Extract financial facts (fast, focused)
 * Call 2: Analyze the deal (uses verified facts)
 * Call 3: Generate emails (can run after analysis)
 *
 * Score calculation is deterministic code, not AI.
 * Total commitment is validated by code, not prompt instructions.
 */

export { CLAUDE_MODEL_ID, getLanguageInstruction, type ClaudeUserContent } from './client'
export { classifyQuote } from './classify'
export { extractFinancialFacts, type ExtractedFacts } from './extract'
export { analyzeDealFacts, type AnalysisOutput } from './analyze'
export { generateEmailDrafts, regenerateEmailDrafts, generateEmailV2 } from './emails'
export { calculateQuoteScore, parseMoneyAmount } from './score'
export { validateTotalCommitment } from './validate-total'

import { classifyQuote } from './classify'
import { extractFinancialFacts } from './extract'
import { analyzeDealFacts, type LeverageAssessment, type LeverageLevel } from './analyze'
import { generateEmailDrafts } from './emails'
import { calculateQuoteScore } from './score'
import { validateTotalCommitment } from './validate-total'
import { DealOutputSchema, type DealOutputType } from '../schemas'
import { parseMoney, normalizeAmount } from '../currency'
import type { DealOutput } from '@/types'

/**
 * Derive assertiveness band (1-4) from the 5 leverage dimension scores.
 * Band 1 = strong push, Band 4 = broadly solid, cleanup asks only.
 * Computed in code so it can't be hallucinated by the model.
 */
function deriveAssertivenessBand(la: LeverageAssessment | undefined): { band: 1 | 2 | 3 | 4; maxSavingsPct: number } {
  if (!la) return { band: 2, maxSavingsPct: 25 }

  const levelScore = (l: LeverageLevel): number => l === 'high' ? 3 : l === 'moderate' ? 2 : 1
  const total = levelScore(la.price_leverage) + levelScore(la.terms_leverage) +
    levelScore(la.structural_leverage) + levelScore(la.risk_leverage) + levelScore(la.ambiguity_leverage)
  // total ranges from 5 (all low) to 15 (all high)

  if (total >= 12) return { band: 1, maxSavingsPct: 35 }      // strong push
  if (total >= 9)  return { band: 2, maxSavingsPct: 25 }       // moderate push
  if (total >= 7)  return { band: 3, maxSavingsPct: 15 }       // light push
  return { band: 4, maxSavingsPct: 10 }                        // cleanup asks
}

/**
 * Main analysis pipeline — same signature as the old analyzeDeal.
 * Routes call this function exactly as before.
 */
export async function analyzeDeal(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  goal?: string,
  notes?: string,
  previousRoundOutput?: DealOutput,
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  userLocale?: string,
  pdfData?: { base64: string; mimeType: string },
  userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string }
): Promise<DealOutputType> {
  try {
    // ─── Step 0: Classify the quote (fast, uses Haiku) ───
    console.log('[TermLift] Step 0: Classifying quote...')
    const classification = await classifyQuote(extractedText, dealType, imageData, allPages, pdfData)
    console.log('[TermLift] Step 0 done:', classification.quote_type, classification.deal_size_bracket)

    // ─── Step 1: Extract financial facts (~5s) ───
    console.log('[TermLift] Step 1: Extracting financial facts...')
    console.log('[TermLift] Input: text length =', extractedText?.length || 0, '| hasImage =', !!imageData, '| hasPages =', !!allPages?.length, '| hasPdf =', !!pdfData)
    const rawFacts = await extractFinancialFacts(extractedText, dealType, imageData, allPages, pdfData)
    console.log('[TermLift] Step 1 done:', rawFacts.vendor, rawFacts.total_commitment)

    // ─── Step 1a: Normalize total_commitment to canonical format ───
    // This catches French-style numbers ("21 456,00 €") and normalizes to "$21,456"
    const rawTotalString = rawFacts.total_commitment
    rawFacts.total_commitment = normalizeAmount(rawFacts.total_commitment)
    const { amount: totalCommitmentAmount, currency: totalCommitmentCurrency } = parseMoney(rawFacts.total_commitment)
    const totalCommitmentCents = Math.round(totalCommitmentAmount * 100)
    console.log('[TermLift] Step 1a: Normalized total_commitment:', {
      raw: rawTotalString,
      normalized: rawFacts.total_commitment,
      amount: totalCommitmentAmount,
      cents: totalCommitmentCents,
      currency: totalCommitmentCurrency,
    })

    // ─── Step 1b: Code-validate total_commitment ───
    const validation = validateTotalCommitment(rawFacts.total_commitment, extractedText)
    if (validation.wasOverridden) {
      rawFacts.total_commitment = validation.total
    }

    // ─── Step 2: Analyze the deal (~20s) ───
    console.log('[TermLift] Step 2: Analyzing deal...')
    const analysis = await analyzeDealFacts(rawFacts, classification, extractedText, {
      dealType,
      goal,
      notes,
      previousRoundOutput,
      userLocale,
      imageData,
      allPages,
      pdfData,
      userPreferences,
    })
    console.log('[TermLift] Step 2 done:', analysis.verdict_type, analysis.red_flags?.length, 'flags')

    // ─── Step 2b: Derive assertiveness band from leverage assessment ───
    const leverageAssessment = analysis.leverage_assessment
    const { band: assertivenessBand, maxSavingsPct } = deriveAssertivenessBand(leverageAssessment)
    console.log('[TermLift] Assertiveness band:', assertivenessBand, '| max savings %:', maxSavingsPct,
      '| leverage:', leverageAssessment ? JSON.stringify(leverageAssessment) : 'not provided')

    // ─── Step 2c: Validation guards — catch inconsistencies before rendering ───
    const ps = analysis.potential_savings as any
    const commitAmount = parseMoney(rawFacts.total_commitment).amount

    if (ps?.must_have && rawFacts.total_commitment) {
      const savingsFromItems = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)

      // Guard 1: Savings cannot exceed total commitment
      if (commitAmount > 0 && savingsFromItems > commitAmount) {
        console.warn(`[TermLift] GUARD: savings must_have (${savingsFromItems}) > total_commitment (${commitAmount}). Capping savings.`)
      }

      // Guard 2: Cap savings to assertiveness-band-derived max
      if (commitAmount > 0) {
        const maxSavings = commitAmount * (maxSavingsPct / 100)
        if (savingsFromItems > maxSavings) {
          console.warn(`[TermLift] GUARD: savings (${savingsFromItems}) exceeds band ${assertivenessBand} max (${maxSavingsPct}% = ${maxSavings}). Scaling down.`)
          const scaleFactor = maxSavings / savingsFromItems
          for (const item of ps.must_have) {
            if (typeof item.amount === 'number') {
              item.amount = Math.round(item.amount * scaleFactor)
            }
          }
        }
      }

      // Guard 3: Recalculate savings total from items (never trust AI's total)
      const recalculatedTotal = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
      if (ps.total !== recalculatedTotal) {
        console.warn(`[TermLift] GUARD: savings.total (${ps.total}) !== sum of must_have items (${recalculatedTotal}). Correcting.`)
        ps.total = recalculatedTotal
      }

      // Guard 4: Log savings percentage for audit
      if (commitAmount > 0) {
        const savingsPct = (recalculatedTotal / commitAmount) * 100
        console.log(`[TermLift] GUARD: savings = ${savingsPct.toFixed(1)}% of total (${recalculatedTotal} / ${commitAmount})`)
        if (savingsPct > maxSavingsPct) {
          console.warn(`[TermLift] GUARD: savings percentage (${savingsPct.toFixed(1)}%) exceeds band ${assertivenessBand} cap (${maxSavingsPct}%)`)
          if (!analysis.assumptions) analysis.assumptions = []
          analysis.assumptions.push(`Estimated savings (${savingsPct.toFixed(0)}%) are higher than expected for this leverage profile and may reflect optimistic estimates`)
        }
      }
    }

    // Guard 4: Expired signing deadline must not produce contradictory leverage
    if (rawFacts.signing_deadline) {
      const deadlineDate = new Date(rawFacts.signing_deadline)
      const now = new Date()
      if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
        console.warn(`[TermLift] GUARD: signing_deadline "${rawFacts.signing_deadline}" is in the past. Removing deadline-based leverage.`)
        // Remove deadline leverage from negotiation plan
        if (analysis.negotiation_plan?.leverage_you_have) {
          analysis.negotiation_plan.leverage_you_have = analysis.negotiation_plan.leverage_you_have.filter(
            (l: string) => !l.toLowerCase().includes('deadline') && !l.toLowerCase().includes('expir')
          )
        }
        // Flag it
        if (!analysis.assumptions) analysis.assumptions = []
        analysis.assumptions.push(`The signing deadline (${rawFacts.signing_deadline}) has passed — deadline-based leverage may no longer apply`)
      }
    }

    // ─── Step 2c: Debug log — canonical fact object ───
    const finalCommit = parseMoney(rawFacts.total_commitment)
    console.log('[TermLift] === CANONICAL FACTS (language-agnostic) ===')
    console.log('[TermLift]   vendor:', rawFacts.vendor)
    console.log('[TermLift]   total_commitment (display):', rawFacts.total_commitment)
    console.log('[TermLift]   total_commitment (amount):', finalCommit.amount)
    console.log('[TermLift]   total_commitment (currency):', finalCommit.currency)
    console.log('[TermLift]   term:', rawFacts.term)
    console.log('[TermLift]   billing_payment:', rawFacts.billing_payment)
    console.log('[TermLift]   signing_deadline:', rawFacts.signing_deadline || 'none')
    console.log('[TermLift]   contact_name:', rawFacts.contact_name || 'none')
    console.log('[TermLift]   deal_type:', rawFacts.deal_type)
    if (ps?.must_have) {
      console.log('[TermLift]   savings.total:', ps.total)
      console.log('[TermLift]   savings.must_have:', JSON.stringify(ps.must_have.map((i: any) => ({ ask: i.ask, amount: i.amount }))))
    }
    console.log('[TermLift]   locale:', userLocale || 'en')
    console.log('[TermLift]   assertiveness_band:', assertivenessBand)
    console.log('[TermLift]   best_negotiation_angle:', leverageAssessment?.best_negotiation_angle || 'n/a')
    console.log('[TermLift]   savings_confidence:', leverageAssessment?.savings_confidence || 'n/a')
    console.log('[TermLift] ==========================================')

    // ─── Step 3: Generate emails (~10s) ───
    console.log('[TermLift] Step 3: Generating emails...')
    let emails
    try {
      emails = await generateEmailDrafts({
        vendor: rawFacts.vendor,
        vendor_product: rawFacts.vendor_product,
        total_commitment: rawFacts.total_commitment,
        term: rawFacts.term,
        contact_name: rawFacts.contact_name,
        verdict: analysis.verdict,
        red_flags: analysis.red_flags,
        what_to_ask_for: analysis.what_to_ask_for,
        negotiation_plan: analysis.negotiation_plan,
        quick_read: analysis.quick_read,
        assertiveness_band: assertivenessBand,
        best_negotiation_angle: leverageAssessment?.best_negotiation_angle,
      }, userLocale)
    } catch (emailError) {
      // Email generation is not critical — use fallback emails
      console.error('[TermLift] Email generation failed, using fallbacks:', emailError)
      emails = {
        neutral: { subject: `${rawFacts.vendor} — Questions Before We Sign`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
        firm: { subject: `${rawFacts.vendor} — Revised Terms Needed`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
        final_push: { subject: `${rawFacts.vendor} — Final Decision`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
      }
    }
    // Ensure all emails have sign-off
    const ensureSignOff = (body: string): string => {
      const signOff = userLocale === 'fr' ? '\n\nCordialement,\n[Votre nom]' : '\n\nBest regards,\n[Your Name]'
      if (!body.includes('[Your Name]') && !body.includes('[Votre nom]')) {
        return body.trimEnd() + signOff
      }
      return body
    }
    if (emails) {
      for (const key of ['neutral', 'firm', 'final_push'] as const) {
        if (emails[key]?.body) emails[key].body = ensureSignOff(emails[key].body)
      }
    }
    console.log('[TermLift] Step 3 done')

    // ─── Step 4: Assemble the full DealOutput ───
    const assembled: any = {
      vendor: rawFacts.vendor,
      category: rawFacts.category,
      description: rawFacts.description,
      snapshot: {
        vendor_product: rawFacts.vendor_product,
        term: rawFacts.term,
        total_commitment: rawFacts.total_commitment,
        currency: rawFacts.currency,
        billing_payment: rawFacts.billing_payment,
        pricing_model: rawFacts.pricing_model,
        deal_type: rawFacts.deal_type,
        renewal_date: rawFacts.renewal_date,
        signing_deadline: rawFacts.signing_deadline,
      },
      title: analysis.title,
      verdict: analysis.verdict,
      verdict_type: analysis.verdict_type,
      price_insight: analysis.price_insight,
      quick_read: analysis.quick_read,
      red_flags: analysis.red_flags,
      negotiation_plan: analysis.negotiation_plan,
      what_to_ask_for: analysis.what_to_ask_for,
      potential_savings: analysis.potential_savings,
      cash_flow_improvements: analysis.cash_flow_improvements,
      score: analysis.score,
      score_label: analysis.score_label,
      score_breakdown: analysis.score_breakdown,
      score_rationale: analysis.score_rationale,
      assumptions: analysis.assumptions,
      disclaimer: analysis.disclaimer,
      email_drafts: emails,
    }

    // ─── Step 5: Calculate deterministic score ───
    const validated = DealOutputSchema.parse(assembled)
    const scoreData = calculateQuoteScore(validated)

    // Sanitize total_commitment (normalize again in case Zod passthrough changed it)
    if (validated.snapshot?.total_commitment) {
      validated.snapshot.total_commitment = normalizeAmount(validated.snapshot.total_commitment)
    }

    console.log('[TermLift] Pipeline complete — score:', scoreData.score)
    return { ...validated, ...scoreData }

  } catch (error) {
    // Re-throw with AI_ prefix so routes can detect the error type
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[TermLift] Pipeline error:', msg)

    if (msg.includes('AI_PARSE_ERROR') || msg.includes('AI_VALIDATION_ERROR') || msg.includes('AI_OVERLOADED')) {
      throw error // Already has the right prefix
    }

    if (error instanceof Error && error.name === 'ZodError') {
      const issues = (error as any).issues || (error as any).errors || []
      const summary = issues.map((i: any) => `${i.path?.join('.')}: ${i.message}`).join('; ')
      console.error('[TermLift] Zod validation details:', JSON.stringify(issues, null, 2))
      throw new Error(`AI_VALIDATION_ERROR: ${summary || 'AI response missing required fields'}`)
    }

    if (msg.includes('overloaded') || msg.includes('529')) {
      throw new Error('AI_OVERLOADED: AI service is temporarily overloaded')
    }

    throw new Error('AI_ANALYSIS_ERROR: ' + msg)
  }
}
