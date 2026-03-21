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
import { analyzeDealFacts } from './analyze'
import { generateEmailDrafts } from './emails'
import { calculateQuoteScore, parseMoneyAmount } from './score'
import { validateTotalCommitment } from './validate-total'
import { DealOutputSchema, type DealOutputType } from '../schemas'
import type { DealOutput } from '@/types'

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
    const rawFacts = await extractFinancialFacts(extractedText, dealType, imageData, allPages, pdfData, userLocale)
    console.log('[TermLift] Step 1 done:', rawFacts.vendor, rawFacts.total_commitment)

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

    // ─── Step 2b: Ensure 5% baseline discount exists as a must-have item ───
    if (analysis.potential_savings && rawFacts.total_commitment) {
      const ps = analysis.potential_savings as any
      const commitAmount = parseMoneyAmount(rawFacts.total_commitment)
      const fivePercent = Math.round(commitAmount * 0.05)

      if (commitAmount > 0 && ps.must_have !== undefined) {
        if (!ps.must_have) ps.must_have = []
        // Check if the AI already included a 5% discount item
        const has5pct = ps.must_have.some((item: any) =>
          (item.amount >= fivePercent * 0.9) && (item.ask?.toLowerCase().includes('discount') || item.ask?.toLowerCase().includes('remise') || item.ask?.toLowerCase().includes('5%'))
        )
        if (!has5pct) {
          // Add the 5% baseline as the first must-have item
          ps.must_have.unshift({
            ask: 'Request 5% overall discount citing budget constraints',
            amount: fivePercent,
            rationale: 'Standard budget constraint ask. No vendor prices at their floor.',
          })
          // Also ensure the email asks mention it
          const currency = rawFacts.currency === 'EUR' ? '€' : rawFacts.currency === 'GBP' ? '£' : '$'
          const hasDiscountAsk = analysis.what_to_ask_for?.must_have?.some(
            (ask: string) => ask.includes('5%') || ask.includes(`${fivePercent}`)
          )
          if (!hasDiscountAsk && analysis.what_to_ask_for?.must_have) {
            analysis.what_to_ask_for.must_have.unshift(
              `Request 5% overall discount (${currency}${fivePercent.toLocaleString()}) citing budget constraints`
            )
          }
          console.log(`[TermLift] Added 5% baseline discount: ${fivePercent} (5% of ${commitAmount})`)
        }
        // Recalculate total from must_have items
        ps.total = ps.must_have.reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
      }
    }

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

    // Sanitize total_commitment
    if (validated.snapshot?.total_commitment) {
      const tc = validated.snapshot.total_commitment
      const amountMatch = tc.match(/[€$£¥][\s]?[\d,]+\.?\d*|(?:USD|EUR|GBP|CAD|AUD)\s?[\d,]+\.?\d*/i)
      if (amountMatch) {
        validated.snapshot.total_commitment = amountMatch[0].trim()
      }
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
