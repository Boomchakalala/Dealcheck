import { classifyQuote } from '../claude/classify'
import { validateTotalCommitment } from '../claude/validate-total'
import { normalizeAmount, parseMoney } from '../currency'
import type { QuoteClassificationType } from '../schemas'
import type { QuoteCategory } from '../category-benchmarks'
import { extractQuote } from './step1-extract'
import { detectStructuralRedFlags, detectJudgmentRedFlags } from './step2-red-flags'
import { verifyRedFlags } from './step3-verify'
import type { QuoteExtraction, VerifiedRedFlag } from './types'

export interface PipelineV3Result {
  classification: QuoteClassificationType
  extraction: QuoteExtraction
  contractTotal: number
  redFlags: VerifiedRedFlag[]
}

/**
 * New Step 1-3 pipeline: classify (existing claude/classify.ts, unchanged) ->
 * extract (Step 1) -> detect red flags, structural + judgment (Step 2) ->
 * verify against original text (Step 3).
 *
 * Steps 4-5 (live market research, strategy/email) are NOT part of this —
 * out of scope for this pass. Returns raw pipeline data, not a DealOutput;
 * there is no adapter back to the live schema yet. Not called from any
 * route — see flag.ts.
 */
export async function runAnalysisPipelineV3(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string },
): Promise<PipelineV3Result> {
  const t0 = Date.now()
  const [classification, extraction] = await Promise.all([
    classifyQuote(extractedText, dealType, imageData, allPages, pdfData),
    extractQuote(extractedText, dealType, imageData, allPages, pdfData),
  ])
  const t1 = Date.now()
  console.log(`[TermLift v3 timing] Steps 0+1 (classify+extract, parallel): ${t1 - t0}ms`)

  const normalizedTotal = normalizeAmount(extraction.totalCommitment)
  const validated = validateTotalCommitment(normalizedTotal, extractedText)
  const contractTotal = parseMoney(validated.total).amount

  const category = classification.quote_type as QuoteCategory

  const structuralFlags = detectStructuralRedFlags(extraction, category, contractTotal)
  const t2 = Date.now()
  const judgmentFlags = await detectJudgmentRedFlags(extraction, extractedText, classification, structuralFlags)
  const t3 = Date.now()
  console.log(`[TermLift v3 timing] Step 2 structural (code): ${t2 - t1}ms | judgment (LLM): ${t3 - t2}ms`)

  const verifiedFlags = await verifyRedFlags([...structuralFlags, ...judgmentFlags], extractedText)
  const t4 = Date.now()
  console.log(`[TermLift v3 timing] Step 3 verify: ${t4 - t3}ms`)

  return { classification, extraction, contractTotal, redFlags: verifiedFlags }
}
