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
import { calculateQuoteScore } from './score'
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
  pdfData?: { base64: string; mimeType: string }
): Promise<DealOutputType> {

  // ─── Step 0: Classify the quote (fast, uses Haiku) ───
  const classification = await classifyQuote(extractedText, dealType, imageData, allPages, pdfData)

  // ─── Step 1: Extract financial facts (~5s) ───
  const rawFacts = await extractFinancialFacts(extractedText, dealType, imageData, allPages, pdfData, userLocale)

  // ─── Step 1b: Code-validate total_commitment ───
  const validation = validateTotalCommitment(rawFacts.total_commitment, extractedText)
  if (validation.wasOverridden) {
    rawFacts.total_commitment = validation.total
  }

  // ─── Step 2: Analyze the deal (~20s) ───
  const analysis = await analyzeDealFacts(rawFacts, classification, extractedText, {
    dealType,
    goal,
    notes,
    previousRoundOutput,
    userLocale,
    imageData,
    allPages,
    pdfData,
  })

  // ─── Step 3: Generate emails (~10s) ───
  const emails = await generateEmailDrafts({
    vendor: rawFacts.vendor,
    total_commitment: rawFacts.total_commitment,
    term: rawFacts.term,
    verdict: analysis.verdict,
    red_flags: analysis.red_flags,
    what_to_ask_for: analysis.what_to_ask_for,
    negotiation_plan: analysis.negotiation_plan,
    quick_read: analysis.quick_read,
  }, userLocale)

  // ─── Step 4: Assemble the full DealOutput ───
  const assembled: any = {
    // From extraction (facts)
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

    // From analysis
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
    assumptions: analysis.assumptions,
    disclaimer: analysis.disclaimer,

    // From email generation
    email_drafts: emails,
  }

  // ─── Step 5: Calculate deterministic score ───
  const validated = DealOutputSchema.parse(assembled)
  const scoreData = calculateQuoteScore(validated)

  // Sanitize total_commitment (strip any calculation notes the AI might have added)
  if (validated.snapshot?.total_commitment) {
    const tc = validated.snapshot.total_commitment
    const amountMatch = tc.match(/[€$£¥][\s]?[\d,]+\.?\d*|(?:USD|EUR|GBP|CAD|AUD)\s?[\d,]+\.?\d*/i)
    if (amountMatch) {
      validated.snapshot.total_commitment = amountMatch[0].trim()
    }
  }

  return {
    ...validated,
    ...scoreData,
  }
}
