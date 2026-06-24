/**
 * Claude AI Pipeline — v2 architecture
 *
 * 1. Classify the quote type (Haiku, fast)
 * 2. Extract facts into rigid schema (Sonnet, cached by document hash)
 * 3. Run code-based red flag engine (deterministic, no AI)
 * 4. Calculate deterministic score (code, from flags + savings)
 * 5. AI analysis for judgment calls (market fairness, negotiation angle, strategy)
 * 6. Generate emails (uses code flags + AI judgment)
 *
 * Same document = same extraction = same flags = same score.
 * AI only handles what code can't: market judgment, writing, strategy.
 */

export { CLAUDE_MODEL_ID, getLanguageInstruction, type ClaudeUserContent } from './client'
export { classifyQuote } from './classify'
export { extractFinancialFacts, type ExtractedFacts } from './extract'
export { analyzeDealFacts, type AnalysisOutput } from './analyze'
export { generateEmailDrafts, regenerateEmailDrafts, generateEmailV2, KEVIN_SYSTEM_PROMPT, EMAIL_RULES } from './emails'
export { calculateQuoteScore, parseMoneyAmount } from './score'
export { validateTotalCommitment } from './validate-total'
export { extractRigid, generateDocumentHash, rigidToLegacyFacts, type RigidExtraction } from './extract-rigid'
export { detectRedFlags, type CodeRedFlag } from './red-flags'
export { calculateDeterministicScore } from './score-deterministic'

import { classifyQuote } from './classify'
import { extractFinancialFacts } from './extract'
import { analyzeDealFacts } from './analyze'
import { generateEmailDrafts } from './emails'
import { validateTotalCommitment } from './validate-total'
import { DealOutputSchema, type DealOutputType } from '../schemas'
import { computeScores, normalizeExtraction, scoreLabel } from '../scoring'
import { parseMoney, normalizeAmount } from '../currency'
import type { DealOutput } from '@/types'

/**
 * Main analysis pipeline — v2 with deterministic extraction and scoring.
 * Same signature as before for backward compatibility.
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
  userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string; contract_term_strategy?: string }
): Promise<DealOutputType> {
  try {
    // ─── Steps 0+1: Classify + extract in parallel ───
    // Both only read the quote — neither depends on the other, so run them together.
    console.log('[TermLift] Steps 0+1: Classifying + extracting facts (parallel)...')
    const [classification, rawFacts] = await Promise.all([
      classifyQuote(extractedText, dealType, imageData, allPages, pdfData),
      extractFinancialFacts(extractedText, dealType, imageData, allPages, pdfData),
    ])
    console.log('[TermLift] Steps 0+1 done:', classification.quote_type, classification.deal_size_bracket, '|', rawFacts.vendor, rawFacts.total_commitment)

    // ─── Step 1a: Normalize total_commitment ───
    rawFacts.total_commitment = normalizeAmount(rawFacts.total_commitment)
    console.log('[TermLift] Step 1a: Normalized total:', rawFacts.total_commitment)

    // ─── Step 1b: Code-validate total_commitment ───
    const validation = validateTotalCommitment(rawFacts.total_commitment, extractedText)
    if (validation.wasOverridden) {
      rawFacts.total_commitment = validation.total
      console.log('[TermLift] Step 1b: Total overridden to:', validation.total)
    }

    // ─── Step 2: AI analysis (Opus, free to judge) ───
    console.log('[TermLift] Step 2: AI analysis...')
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
    console.log('[TermLift] Step 2 done:', analysis.verdict_type, '|', analysis.red_flags?.length, 'flags | extraction:', analysis.extraction ? 'yes' : 'missing')

    // ─── Step 2b: Sanity check savings ───
    const ps = analysis.potential_savings as any
    const commitAmount = parseMoney(rawFacts.total_commitment).amount
    if (ps?.must_have) {
      const savingsFromItems = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
      if (commitAmount > 0 && savingsFromItems > commitAmount) {
        console.warn(`[TermLift] GUARD: savings (${savingsFromItems}) > total (${commitAmount}).`)
      }
      // Always recalculate total from items
      ps.total = savingsFromItems
    }

    // ─── Step 3: Generate emails ───
    console.log('[TermLift] Step 3: Generating emails...')
    let emails
    try {
      emails = await generateEmailDrafts({
        vendor: rawFacts.vendor,
        vendor_product: rawFacts.vendor_product,
        total_commitment: rawFacts.total_commitment,
        term: rawFacts.term,
        contact_name: rawFacts.contact_name,
        currency: rawFacts.currency,
        verdict: analysis.verdict,
        red_flags: analysis.red_flags,
        what_to_ask_for: analysis.what_to_ask_for,
        potential_savings: analysis.potential_savings,
        negotiation_plan: analysis.negotiation_plan,
        quick_read: analysis.quick_read,
      }, userLocale)
    } catch (emailError) {
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

    // ─── Step 4: Assemble output ───
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
      watchItems: analysis.watchItems,
      score_rationale: analysis.score_rationale,
      assumptions: analysis.assumptions,
      disclaimer: analysis.disclaimer,
      email_drafts: emails,
    }

    // ─── Step 5: Validate, then compute deterministic scores ───
    const validated = DealOutputSchema.parse(assembled)

    // Sanitize total_commitment
    if (validated.snapshot?.total_commitment) {
      validated.snapshot.total_commitment = normalizeAmount(validated.snapshot.total_commitment)
    }

    // Extract-then-compute: the LLM extracted the facts, the engine sets the numbers.
    const contractTotal = parseMoney(rawFacts.total_commitment).amount
    const extraction = normalizeExtraction(analysis.extraction, contractTotal)
    const scores = computeScores(extraction)

    console.log('[TermLift] Pipeline complete — score:', scores.overall, `(p${scores.pricing}/t${scores.terms}/l${scores.leverage})`)

    // Persist the extraction + deductions alongside the computed scores so the deal
    // carries everything the breakdown UI needs. (No legacy `calculateQuoteScore`.)
    const result: any = {
      ...validated,
      score: scores.overall,
      score_label: scoreLabel(scores.overall),
      score_rationale: analysis.score_rationale || '',
      score_breakdown: {
        pricing: scores.pricing,
        terms: scores.terms,
        leverage: scores.leverage,
        deductions: scores.deductions,
      },
      extraction: analysis.extraction,
      deductions: scores.deductions,
    }
    return result as DealOutputType

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[TermLift] Pipeline error:', msg)

    if (msg.includes('AI_PARSE_ERROR') || msg.includes('AI_VALIDATION_ERROR') || msg.includes('AI_OVERLOADED')) {
      throw error
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
