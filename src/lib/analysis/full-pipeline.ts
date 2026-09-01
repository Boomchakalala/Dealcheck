import { DealOutputSchema, type DealOutputType } from '../schemas'
import { computeScores, scoreLabel, type ExtractionResult } from '../scoring'
import { generateEmailDrafts } from '../claude/emails'
import type { DealOutput } from '@/types'
import { getCategoryBenchmark, type QuoteCategory } from '../category-benchmarks'
import { runAnalysisPipelineV3 } from './pipeline'
import { generateStrategy } from './step4-strategy'

/**
 * Full hybrid pipeline: Steps 0-3 (classify/extract/red-flags/verify, all new
 * and deterministic where possible) + Step 4 (strategy synthesis, new, grounded
 * in the verified flags rather than re-detecting them) + email generation
 * (existing claude/emails.ts, reused as-is — it was already a standalone step).
 *
 * Same parameter signature as claude/index.ts's analyzeDeal() so it can be
 * swapped in behind the ANALYSIS_PIPELINE_V3 flag with no call-site changes.
 * Assembly and DealOutputSchema validation mirror analyzeDeal()'s exactly —
 * see that function for why score_breakdown is added AFTER validation rather
 * than being part of the validated shape (pre-existing pattern, not new here).
 */
export async function runFullAnalysisPipelineV3(
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
): Promise<DealOutputType> {
  const pipelineStart = Date.now()
  try {
    console.log('[TermLift v3] Steps 0-3: classify + extract + red flags + verify...')
    const stepsStart = Date.now()
    const { classification, extraction, contractTotal, redFlags } = await runAnalysisPipelineV3(
      extractedText, dealType, imageData, allPages, pdfData,
    )
    console.log(`[TermLift v3 timing] Steps 0-3 total: ${Date.now() - stepsStart}ms`)
    console.log('[TermLift v3] Steps 0-3 done:', classification.quote_type, '|', extraction.vendor, '|', redFlags.filter((f) => f.verified).length, 'verified flags')

    console.log('[TermLift v3] Step 4: strategy synthesis...')
    const step4Start = Date.now()
    const strategy = await generateStrategy(extraction, contractTotal, classification, redFlags, extractedText, {
      dealType, goal, notes, previousRoundOutput, userLocale, imageData, allPages, pdfData, userPreferences,
    })
    console.log(`[TermLift v3 timing] Step 4: ${Date.now() - step4Start}ms`)
    console.log('[TermLift v3] Step 4 done:', strategy.verdict_type)

    // Sanity-check savings — same guard as the old pipeline (Step 2b there).
    const ps = strategy.potential_savings as any
    if (ps?.must_have) {
      const savingsFromItems = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
      if (contractTotal > 0 && savingsFromItems > contractTotal) {
        console.warn(`[TermLift v3] GUARD: savings (${savingsFromItems}) > total (${contractTotal}).`)
      }
      ps.total = savingsFromItems
    }

    const verifiedFlags = redFlags.filter((f) => f.verified)
    const redFlagsForOutput = verifiedFlags.map((f) => ({
      type: f.type,
      severity: f.severity,
      score_category: f.scoreCategory,
      issue: f.issue,
      why_it_matters: f.whyItMatters,
      what_to_ask_for: f.whatToAskFor,
      if_they_push_back: f.ifTheyPushBack,
    }))

    console.log('[TermLift v3] Step 5: emails...')
    const step5Start = Date.now()
    let emails: DealOutputType['email_drafts']
    try {
      emails = await generateEmailDrafts({
        vendor: extraction.vendor,
        vendor_product: extraction.vendorProduct,
        total_commitment: extraction.totalCommitment,
        term: extraction.term,
        contact_name: extraction.contactName || undefined,
        currency: extraction.currency,
        verdict: strategy.verdict,
        red_flags: redFlagsForOutput.map((f) => ({ issue: f.issue, what_to_ask_for: f.what_to_ask_for, severity: f.severity })),
        what_to_ask_for: strategy.what_to_ask_for,
        potential_savings: strategy.potential_savings,
        negotiation_plan: strategy.negotiation_plan,
        quick_read: strategy.quick_read,
      }, userLocale)
    } catch (emailError) {
      console.error('[TermLift v3] Email generation failed, using fallbacks:', emailError)
      emails = {
        neutral: { subject: `${extraction.vendor} — Questions Before We Sign`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
        firm: { subject: `${extraction.vendor} — Revised Terms Needed`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
        final_push: { subject: `${extraction.vendor} — Final Decision`, body: 'Email generation failed. Please use the "Regenerate" button to try again.' },
      }
    }
    const ensureSignOff = (body: string): string => {
      const signOff = userLocale === 'fr' ? '\n\nCordialement,\n[Votre nom]' : '\n\nBest regards,\n[Your Name]'
      if (!body.includes('[Your Name]') && !body.includes('[Votre nom]')) return body.trimEnd() + signOff
      return body
    }
    for (const key of ['neutral', 'firm', 'final_push'] as const) {
      if (emails[key]?.body) emails[key].body = ensureSignOff(emails[key].body)
    }
    console.log(`[TermLift v3 timing] Step 5: ${Date.now() - step5Start}ms`)

    const category = getCategoryBenchmark(classification.quote_type as QuoteCategory).label

    const assembled: any = {
      vendor: extraction.vendor,
      category,
      description: extraction.description || undefined,
      snapshot: {
        vendor_product: extraction.vendorProduct,
        term: extraction.term,
        total_commitment: extraction.totalCommitment,
        currency: extraction.currency,
        billing_payment: extraction.billingPayment,
        pricing_model: extraction.pricingModel,
        deal_type: extraction.dealType,
        renewal_date: extraction.renewalDate || undefined,
        signing_deadline: extraction.signingDeadline || undefined,
      },
      title: strategy.title,
      verdict: strategy.verdict,
      verdict_type: strategy.verdict_type,
      price_insight: strategy.price_insight,
      quick_read: strategy.quick_read,
      red_flags: redFlagsForOutput,
      negotiation_plan: strategy.negotiation_plan,
      what_to_ask_for: strategy.what_to_ask_for,
      potential_savings: strategy.potential_savings,
      cash_flow_improvements: strategy.cash_flow_improvements,
      watchItems: strategy.watchItems,
      score_rationale: strategy.score_rationale,
      assumptions: strategy.assumptions,
      disclaimer: strategy.disclaimer,
      email_drafts: emails,
    }

    const validated = DealOutputSchema.parse(assembled)

    const extractionForScoring: ExtractionResult = { ...extraction, contractTotal }
    const scores = computeScores(extractionForScoring)

    console.log(`[TermLift v3 timing] TOTAL: ${Date.now() - pipelineStart}ms`)
    console.log('[TermLift v3] Pipeline complete — score:', scores.overall, `(p${scores.pricing}/t${scores.terms}/l${scores.leverage})`)

    const result: any = {
      ...validated,
      score: scores.overall,
      score_label: scoreLabel(scores.overall),
      score_rationale: strategy.score_rationale || '',
      score_breakdown: { pricing: scores.pricing, terms: scores.terms, leverage: scores.leverage, deductions: scores.deductions },
      extraction,
      deductions: scores.deductions,
    }
    return result as DealOutputType
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[TermLift v3] Pipeline error:', msg)

    if (msg.includes('AI_PARSE_ERROR') || msg.includes('AI_VALIDATION_ERROR') || msg.includes('AI_OVERLOADED')) {
      throw error
    }

    if (error instanceof Error && error.name === 'ZodError') {
      const issues = (error as any).issues || (error as any).errors || []
      const summary = issues.map((i: any) => `${i.path?.join('.')}: ${i.message}`).join('; ')
      console.error('[TermLift v3] Zod validation details:', JSON.stringify(issues, null, 2))
      throw new Error(`AI_VALIDATION_ERROR: ${summary || 'AI response missing required fields'}`)
    }

    if (msg.includes('overloaded') || msg.includes('529')) {
      throw new Error('AI_OVERLOADED: AI service is temporarily overloaded')
    }

    throw new Error('AI_ANALYSIS_ERROR: ' + msg)
  }
}
