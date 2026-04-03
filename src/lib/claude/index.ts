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
export { generateEmailDrafts, regenerateEmailDrafts, generateEmailV2 } from './emails'
export { calculateQuoteScore, parseMoneyAmount } from './score'
export { validateTotalCommitment } from './validate-total'
export { extractRigid, generateDocumentHash, rigidToLegacyFacts, type RigidExtraction } from './extract-rigid'
export { detectRedFlags, type CodeRedFlag } from './red-flags'
export { calculateDeterministicScore } from './score-deterministic'

import { classifyQuote } from './classify'
import { extractRigid, generateDocumentHash, rigidToLegacyFacts, type RigidExtraction } from './extract-rigid'
import { detectRedFlags, type CodeRedFlag } from './red-flags'
import { calculateDeterministicScore } from './score-deterministic'
import { analyzeDealFacts } from './analyze'
import { generateEmailDrafts } from './emails'
import { validateTotalCommitment } from './validate-total'
import { DealOutputSchema, type DealOutputType } from '../schemas'
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
  userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string }
): Promise<DealOutputType> {
  try {
    // ─── Step 0: Classify the quote (fast, uses Haiku) ───
    console.log('[TermLift] Step 0: Classifying quote...')
    const classification = await classifyQuote(extractedText, dealType, imageData, allPages, pdfData)
    console.log('[TermLift] Step 0 done:', classification.quote_type, classification.deal_size_bracket)

    // ─── Step 1: Rigid extraction ───
    console.log('[TermLift] Step 1: Rigid extraction...')
    const docHash = generateDocumentHash(extractedText || '')
    console.log('[TermLift] Document hash:', docHash.substring(0, 12) + '...')

    // TODO: Check cache here (Supabase extraction_cache table)
    // For now, always extract fresh — cache layer can be added without changing the pipeline

    const rigidFacts = await extractRigid(extractedText, dealType, imageData, allPages, pdfData)
    console.log('[TermLift] Step 1 done:', rigidFacts.vendor, rigidFacts.financials.total_commitment)

    // Convert to legacy format for backward compatibility
    const rawFacts = rigidToLegacyFacts(rigidFacts)

    // ─── Step 1a: Normalize total_commitment ───
    const rawTotalString = rawFacts.total_commitment
    rawFacts.total_commitment = normalizeAmount(rawFacts.total_commitment)
    const { amount: totalCommitmentAmount, currency: totalCommitmentCurrency } = parseMoney(rawFacts.total_commitment)
    console.log('[TermLift] Step 1a: Normalized total:', rawTotalString, '→', rawFacts.total_commitment)

    // ─── Step 1b: Code-validate total_commitment ───
    const validation = validateTotalCommitment(rawFacts.total_commitment, extractedText)
    if (validation.wasOverridden) {
      rawFacts.total_commitment = validation.total
      console.log('[TermLift] Step 1b: Total overridden to:', validation.total)
    }

    // ─── Step 2: Code-based red flag detection (deterministic) ───
    console.log('[TermLift] Step 2: Detecting red flags in code...')
    const codeFlags = detectRedFlags(rigidFacts)
    console.log('[TermLift] Step 2 done:', codeFlags.length, 'flags detected')
    for (const flag of codeFlags) {
      console.log(`[TermLift]   [${flag.severity}] ${flag.type}: ${flag.issue}`)
    }

    // ─── Step 3: AI analysis — free to judge, no constraints ───
    console.log('[TermLift] Step 3: AI analysis (Opus)...')
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
    console.log('[TermLift] Step 3 done:', analysis.verdict_type, '|', analysis.red_flags?.length, 'AI flags')

    // ─── Step 3a: Merge AI flags + code flags (code fills gaps only) ───
    const aiFlags = analysis.red_flags || []
    const codeFlagsNotCoveredByAI = codeFlags.filter(cf => {
      return !aiFlags.some(af =>
        af.issue.toLowerCase().includes(cf.issue.substring(0, 20).toLowerCase()) ||
        cf.issue.toLowerCase().includes(af.issue.substring(0, 20).toLowerCase()) ||
        (af.type === cf.type && af.score_category === cf.score_category) ||
        (cf.type === 'Source Insight' && af.type === 'Source Insight')
      )
    })
    const mergedFlags = [
      ...aiFlags,
      ...codeFlagsNotCoveredByAI.map(cf => ({
        type: cf.type,
        severity: cf.severity,
        score_category: cf.score_category,
        issue: cf.issue,
        why_it_matters: cf.why_it_matters,
        what_to_ask_for: cf.what_to_ask_for,
        if_they_push_back: cf.if_they_push_back,
      })),
    ]

    // ─── Step 3b: Savings — let AI estimate freely, only cap insanity ───
    const ps = analysis.potential_savings as any
    const commitAmount = parseMoney(rawFacts.total_commitment).amount
    let savingsTotal = 0

    if (ps?.must_have) {
      savingsTotal = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)

      // Only guard: savings cannot exceed total commitment
      if (commitAmount > 0 && savingsTotal > commitAmount) {
        console.warn(`[TermLift] GUARD: savings (${savingsTotal}) > total (${commitAmount}). Capping to 40%.`)
        const scaleFactor = (commitAmount * 0.4) / savingsTotal
        for (const item of ps.must_have) {
          if (typeof item.amount === 'number') item.amount = Math.round(item.amount * scaleFactor)
        }
        savingsTotal = (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 0)
      }
      ps.total = savingsTotal
    }

    // ─── Step 4: Deterministic score from ALL flags ───
    const allFlagsForScoring: CodeRedFlag[] = [
      ...codeFlags,
      ...aiFlags.map(f => ({
        type: f.type || 'Commercial',
        severity: (f.severity || 'medium') as 'high' | 'medium' | 'low',
        score_category: (f.score_category || 'pricing') as 'pricing' | 'terms' | 'leverage',
        issue: f.issue,
        why_it_matters: f.why_it_matters,
        what_to_ask_for: f.what_to_ask_for,
        if_they_push_back: f.if_they_push_back,
        points: f.severity === 'high' ? 12 : f.severity === 'medium' ? 8 : 4,
      })),
    ]
    console.log('[TermLift] Step 4: Scoring from', allFlagsForScoring.length, 'flags + savings', savingsTotal)
    const scoreData = calculateDeterministicScore(allFlagsForScoring, rawFacts.total_commitment, savingsTotal)
    console.log('[TermLift] Step 4 done:', scoreData.score, scoreData.score_label)

    // ─── Step 5: Generate emails ───
    console.log('[TermLift] Step 5: Generating emails...')
    let emails
    try {
      emails = await generateEmailDrafts({
        vendor: rawFacts.vendor,
        vendor_product: rawFacts.vendor_product,
        total_commitment: rawFacts.total_commitment,
        term: rawFacts.term,
        contact_name: rawFacts.contact_name,
        verdict: analysis.verdict,
        red_flags: mergedFlags,
        what_to_ask_for: analysis.what_to_ask_for,
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
    console.log('[TermLift] Step 5 done')

    // ─── Step 6: Assemble output ───
    const assembled: any = {
      vendor: rawFacts.vendor,
      category: rawFacts.category,
      description: rawFacts.description,
      leverage_assessment: analysis.leverage_assessment,
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
      red_flags: mergedFlags, // Code flags + AI-only flags
      negotiation_plan: analysis.negotiation_plan,
      what_to_ask_for: analysis.what_to_ask_for,
      potential_savings: analysis.potential_savings,
      cash_flow_improvements: analysis.cash_flow_improvements,
      score: scoreData.score,
      score_label: scoreData.score_label,
      score_breakdown: scoreData.score_breakdown,
      score_rationale: scoreData.score_rationale,
      assumptions: analysis.assumptions,
      disclaimer: analysis.disclaimer,
      email_drafts: emails,
    }

    const validated = DealOutputSchema.parse(assembled)

    // Sanitize total_commitment
    if (validated.snapshot?.total_commitment) {
      validated.snapshot.total_commitment = normalizeAmount(validated.snapshot.total_commitment)
    }

    console.log('[TermLift] Pipeline complete — score:', scoreData.score, '| flags:', mergedFlags.length, '| savings:', savingsTotal)
    return { ...validated, ...scoreData }

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
