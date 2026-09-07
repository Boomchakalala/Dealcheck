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
export { analyzeFastCore, type FastAnalysisOutput } from './fast-analyze'
export { generateEmailDrafts, regenerateEmailDrafts, generateEmailV2, KEVIN_SYSTEM_PROMPT, EMAIL_RULES } from './emails'
export { calculateQuoteScore, parseMoneyAmount } from './score'
export { validateTotalCommitment } from './validate-total'
export { extractRigid, generateDocumentHash, rigidToLegacyFacts, type RigidExtraction } from './extract-rigid'
export { detectRedFlags, type CodeRedFlag } from './red-flags'
export { calculateDeterministicScore } from './score-deterministic'

import { classifyQuote } from './classify'
import { extractFinancialFacts, type ExtractedFacts } from './extract'
import { analyzeFastCore } from './fast-analyze'
import { validateTotalCommitment } from './validate-total'
import { buildQuoteFacts, reconcileTotalWithLines } from '@/lib/quote-facts'
import { DealOutputSchema, type DealOutputType, type QuoteClassificationType } from '../schemas'
import { computeScores, normalizeExtraction, scoreLabel } from '../scoring'
import { parseMoney, normalizeAmount } from '../currency'
import type { DealOutput } from '@/types'
import { ANALYSIS_PIPELINE_V3 } from '../analysis/flag'
import { runFullAnalysisPipelineV3 } from '../analysis/full-pipeline'

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
  userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string; contract_term_strategy?: string },
  // Optional result of an earlier /api/deal/extract-preview call — when
  // present, Steps 0+1 reuse it instead of re-calling classifyQuote()/
  // extractFinancialFacts(), so the two-request flow never doubles the
  // LLM calls a single analysis makes.
  precomputed?: { classification: QuoteClassificationType; rawFacts: ExtractedFacts }
): Promise<DealOutputType> {
  if (ANALYSIS_PIPELINE_V3) {
    return runFullAnalysisPipelineV3(
      extractedText, dealType, goal, notes, previousRoundOutput,
      imageData, allPages, userLocale, pdfData, userPreferences,
    )
  }

  const pipelineStart = Date.now()
  try {
    // ─── Steps 0+1: Classify + extract in parallel (or reuse precomputed) ───
    // Both only read the quote — neither depends on the other, so run them together.
    let classification: QuoteClassificationType
    let rawFacts: ExtractedFacts
    if (precomputed) {
      console.log('[TermLift] Steps 0+1: Reusing precomputed classify+extract from extract-preview')
      classification = precomputed.classification
      rawFacts = precomputed.rawFacts
    } else {
      console.log('[TermLift] Steps 0+1: Classifying + extracting facts (parallel)...')
      const stepsStart = Date.now()
      ;[classification, rawFacts] = await Promise.all([
        classifyQuote(extractedText, dealType, imageData, allPages, pdfData),
        extractFinancialFacts(extractedText, dealType, imageData, allPages, pdfData),
      ])
      console.log(`[TermLift timing] Steps 0+1 (classify+extract, parallel): ${Date.now() - stepsStart}ms`)
    }
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
    // ─── Step 1c: Cross-check the total against printed line totals ───
    // Overrides only when the document itself prints the line sum as a total; otherwise records the discrepancy.
    const lineCheck = reconcileTotalWithLines(rawFacts.total_commitment, rawFacts.printed_line_totals, extractedText)
    if (lineCheck.corrected) {
      rawFacts.total_commitment = lineCheck.total
      console.warn('[TermLift] Step 1c: Total corrected from printed line totals:', lineCheck.note)
    } else if (lineCheck.note) {
      console.warn('[TermLift] Step 1c:', lineCheck.note)
    }
    // Validated structured facts — the only place quantity / unit price / list price are trusted.
    const quoteFacts = buildQuoteFacts(rawFacts)
    if (lineCheck.note) quoteFacts.notes.push(lineCheck.note)
    if (lineCheck.corrected) quoteFacts.checks.total = 'corrected'

    // ─── Step 2: FAST core analysis ───
    // Deliberately trimmed sibling of analyzeDealFacts() (see fast-analyze.ts) —
    // 3-5 highest-value red flags instead of up to 10, no full negotiation
    // strategy, no cash-flow analysis, no watch items. analyzeDealFacts() and
    // generateEmailDrafts() are untouched and still exported for later use
    // (deeper analysis on demand, negotiation workflows) — just disconnected
    // from this blocking path, not deleted.
    console.log('[TermLift] Step 2: Fast core analysis...')
    const fastStepStart = Date.now()
    const analysis = await analyzeFastCore(rawFacts, classification, extractedText, {
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
    console.log(`[TermLift timing] Step 2 (fast core analysis): ${Date.now() - fastStepStart}ms`)
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

    // ─── Step 3: Assemble output ───
    // Email generation no longer happens here — it blocked initial display
    // for ~20s to produce content most users don't read immediately.
    // email_drafts is left absent; DealScrollView.tsx already renders a
    // "Generate email" CTA when it's missing, wired to the existing
    // /api/deal/regenerate-emails route (which needs no pre-existing draft).
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
      score_rationale: analysis.score_rationale,
      assumptions: analysis.assumptions,
    }

    // ─── Step 4: Validate, then compute deterministic scores ───
    const validated = DealOutputSchema.parse(assembled)

    // Sanitize total_commitment
    if (validated.snapshot?.total_commitment) {
      validated.snapshot.total_commitment = normalizeAmount(validated.snapshot.total_commitment)
    }

    // Extract-then-compute: the LLM extracted the facts, the engine sets the numbers.
    const contractTotal = parseMoney(rawFacts.total_commitment).amount
    const extraction = normalizeExtraction(analysis.extraction, contractTotal)
    const scores = computeScores(extraction)

    const assembleStart = Date.now()
    // Persist the extraction + deductions alongside the computed scores so the deal
    // carries everything the breakdown UI needs. (No legacy `calculateQuoteScore`.)
    // confidence/target_price_range are new fast-analysis-only fields, attached
    // after validation the same way score/score_breakdown already are —
    // DealOutputSchema is a plain z.object() (strips unknown keys on parse),
    // so this is the existing pattern for adding fields the schema doesn't
    // declare, not a new trick.
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
      confidence: analysis.confidence,
      target_price_range: analysis.target_price_range,
      // Persisted so deep analysis (triggered later, on demand) can reuse it
      // instead of re-running classifyQuote() — same non-schema attach
      // pattern as everything else above.
      classification,
      // Validated commercial facts (lib/quote-facts.ts) — persisted with the
      // round so outcomes can be compared later without the quote text.
      quote_facts: quoteFacts,
      deep_analysis_status: 'idle' as const,
    }
    console.log(`[TermLift timing] Step 4 (validate + score, in-process, no DB): ${Date.now() - assembleStart}ms`)
    console.log(`[TermLift timing] TOTAL analyzeDeal() (excludes DB writes, done by the caller): ${Date.now() - pipelineStart}ms`)
    console.log('[TermLift] Pipeline complete — score:', scores.overall, `(p${scores.pricing}/t${scores.terms}/l${scores.leverage})`)

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
