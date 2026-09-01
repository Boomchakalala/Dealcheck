import Anthropic from '@anthropic-ai/sdk'
import { createTrackedMessage, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction, buildImageContent } from '../claude/client'
import { buildPreferencesDirective } from '../claude/analyze'
import type { QuoteClassificationType } from '../schemas'
import type { DealOutput } from '@/types'
import { getCategoryBenchmark, resolveSavingsTarget, adjustSavingsTarget, type QuoteCategory } from '../category-benchmarks'
import type { QuoteExtraction, VerifiedRedFlag } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — strategy/savings synthesis from ALREADY-VERIFIED facts and red
// flags (Steps 1-3). This is the trimmed remainder of analyze.ts's
// ANALYSIS_PROMPT: the red-flag-detection and structured-extraction sections
// are removed entirely (that's Step 1/2/3's job now), leaving only the
// negotiation-strategy and savings-quantification job. Persona, savings
// philosophy, and writing style are carried over verbatim from the original
// prompt since those aren't part of what's being restructured.
// ─────────────────────────────────────────────────────────────────────────────

const STRATEGY_PROMPT = `You are a sharp buyer-side procurement expert.

You are not neutral. You are on the buyer's side. You are aggressive but honest.

You will receive:
1. VERIFIED financial facts and structured extraction (fees, cancellation terms, payment terms, leverage factors). Ground truth — do not recalculate.
2. A list of VERIFIED red flags — already detected and fact-checked against the original document by a separate process. Do NOT invent new red flags, do NOT drop any, and do NOT second-guess whether they are real. Treat them as given.
3. The raw quote, for context only.

Your job is NOT to find red flags. Your job is to turn the verified facts and verified red flags into a negotiation strategy: concrete asks, dollar-quantified savings, the buyer's leverage, and an overall verdict.

==================================================
STRATEGY
==================================================

- For every verified red flag, translate its "what to ask for" into a concrete negotiation ask. If a flag has a clear dollar impact, it MUST also appear as a savings item — ground the amount in the flag or the extraction, never invent a figure.
- Beyond the verified red flags, look for additional realistic savings they don't already cover: a baseline discount ask (5% minimum on any negotiated quote), volume/loyalty/multi-year discounts where relevant, right-sizing quantity to actual usage from the extraction, challenging intermediary/reseller margin if the extraction shows one.
- Each challengeable element is a SEPARATE savings item. Do not merge them.
- what_to_ask_for.must_have: the asks you would put in a negotiation email — draw directly from the verified red flags' "what to ask for" plus any additional pricing asks you found.
- what_to_ask_for.nice_to_have: worth asking but not the main battle.
- negotiation_plan.leverage_you_have: derived from leverageFactors in the extraction (competing quote in hand, deal size significant, sole source, days to deadline, buyer inside penalty window) plus category context.
- negotiation_plan.trades_you_can_offer: fast signature, longer commitment, referral, case study — only where genuinely plausible from context, never generic filler.
- watchItems: minor observations worth a mention that do not rise to the level of a verified red flag. Do not duplicate any verified red flag here.

Payment term improvements are NOT savings — they go in cash_flow_improvements.
All potential_savings amounts are RAW NUMBERS (e.g. 700 not "700 EUR"). Include currency separately.
total = sum of must_have amounts.
Savings amounts must be annual for recurring deals, total for one-time purchases.

==================================================
WRITING STYLE
==================================================

Write like an experienced procurement lead. Sharp, direct, human.
Never use en dash or em dash characters. Use commas, colons, or normal hyphens.
Do not use hedging language ("it may be worth considering"). Be direct.
Do not repeat the same point across sections.

==================================================
OUTPUT SCHEMA
==================================================

Return valid JSON only:

{
  "title": "Vendor | New Purchase or Renewal | Month Year",
  "verdict": "One clear sentence telling the buyer what to do next",
  "verdict_type": "negotiate|competitive|overpay_risk",
  "price_insight": "Optional pricing observation. Omit if none.",
  "quick_read": {
    "whats_solid": ["..."],
    "whats_concerning": ["..."],
    "conclusion": "One sentence, the dominant issue"
  },
  "negotiation_plan": {
    "leverage_you_have": ["..."],
    "trades_you_can_offer": ["..."]
  },
  "what_to_ask_for": {
    "must_have": ["..."],
    "nice_to_have": ["..."]
  },
  "potential_savings": {
    "total": 950,
    "currency": "EUR",
    "must_have": [
      {"ask": "5% discount on total price", "amount": 700, "rationale": "Standard ask on negotiated quote"}
    ],
    "nice_to_have": [
      {"ask": "Include accessories in the deal", "amount": 200, "rationale": "Possible if buyer commits quickly"}
    ]
  },
  "cash_flow_improvements": [
    {"recommendation": "", "category": "cash_flow|risk"}
  ],
  "watchItems": [
    {"description": "One-line note worth mentioning but not a verified red flag", "category": "pricing|terms|leverage|scope|other"}
  ],
  "score_rationale": "One or two short, qualitative sentences on where this deal stands. Do NOT state or imply a number.",
  "assumptions": ["..."],
  "disclaimer": "This analysis is commercial guidance, not legal advice. Verify final terms before signing."
}

==================================================
GROUND RULES
==================================================

- Use the PROVIDED total_commitment, extraction, and verified red flags as ground truth. Do not recalculate or override them.
- Every amount must trace to the quote, the extraction, or simple arithmetic on quote numbers.
- Do not invent competitor prices or claim market data as fact.
- Do not ask the user questions in the output.
- Do not pad. If the deal is clean, say so.
- Keep currency consistent throughout.

Return ONLY valid JSON.`

export interface StrategyOutput {
  title: string
  verdict: string
  verdict_type: 'negotiate' | 'competitive' | 'overpay_risk'
  price_insight?: string
  quick_read: { whats_solid: string[]; whats_concerning: string[]; conclusion: string }
  negotiation_plan: { leverage_you_have: string[]; trades_you_can_offer: string[] }
  what_to_ask_for: { must_have: string[]; nice_to_have: string[] }
  potential_savings?: {
    total: number
    currency: string
    must_have: Array<{ ask: string; amount: number; rationale: string }>
    nice_to_have?: Array<{ ask: string; amount: number; rationale: string }>
  }
  cash_flow_improvements?: Array<{ recommendation: string; category: string }>
  watchItems?: Array<{ description: string; category: string }>
  score_rationale?: string
  assumptions: string[]
  disclaimer: string
}

export async function generateStrategy(
  extraction: QuoteExtraction,
  contractTotal: number,
  classification: QuoteClassificationType,
  verifiedRedFlags: VerifiedRedFlag[],
  rawText: string,
  options: {
    dealType: 'New' | 'Renewal'
    goal?: string
    notes?: string
    previousRoundOutput?: DealOutput
    userLocale?: string
    imageData?: { base64: string; mimeType: string }
    allPages?: Array<{ base64: string; mimeType: string }>
    pdfData?: { base64: string; mimeType: string }
    userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string; contract_term_strategy?: string }
  },
): Promise<StrategyOutput> {
  const category = classification.quote_type as QuoteCategory
  const benchmark = getCategoryBenchmark(category)
  const isRenewal = extraction.dealType === 'Renewal'
  const target = resolveSavingsTarget(benchmark, { dealSizeBracket: classification.deal_size_bracket, isRenewal })
  const adjusted = adjustSavingsTarget(target, {
    isRenewal,
    alreadyRenewalSpecific: !!target.isRenewal,
    leverageLevel: classification.leverage_level,
    dealSizeBracket: classification.deal_size_bracket,
  })

  const savingsFrame = `
==================================================
SAVINGS FRAME
==================================================

Expected realistic savings ceiling for this quote type and deal shape: ${adjusted.minPct}-${adjusted.maxPct}% via ${target.lever}.
Use this only as a plausibility check. Do not force the analysis to land inside the range.
Returning zero additional savings beyond what the verified red flags already justify is acceptable.`

  const preferencesDirective = buildPreferencesDirective(options.userPreferences)
  const enhancedPrompt = STRATEGY_PROMPT + '\n\n' + savingsFrame + '\n\n' + preferencesDirective

  const onlyVerified = verifiedRedFlags.filter((f) => f.verified)

  const contextParts = [
    `Deal Type: ${options.dealType}`,
    `QUOTE CLASSIFICATION: Type: ${classification.quote_type}, Deal Size: ${classification.deal_size_bracket}, Recurring: ${classification.recurring}, Leverage: ${classification.leverage_level}`,
    `\nVERIFIED EXTRACTION (use as ground truth, do NOT recalculate):\n${JSON.stringify({ ...extraction, contractTotal }, null, 2)}`,
    `\nVERIFIED RED FLAGS (already fact-checked — treat as given, do not re-derive or drop):\n${JSON.stringify(onlyVerified.map((f) => ({ type: f.type, severity: f.severity, issue: f.issue, whyItMatters: f.whyItMatters, whatToAskFor: f.whatToAskFor, ifTheyPushBack: f.ifTheyPushBack })), null, 2)}`,
    options.goal && `User Goal: ${options.goal}`,
    options.notes && `User Notes: ${options.notes}`,
    options.previousRoundOutput && `MULTI-ROUND CONTEXT:\nThis is a follow-up round. Previous analysis: ${JSON.stringify(options.previousRoundOutput, null, 2)}\nKeep strategy consistent unless the quote materially changed.`,
  ].filter(Boolean)

  const visualContent = buildImageContent(options.imageData, options.allPages, options.pdfData)
  const hasVisualInput = !!visualContent

  // Deliberately NOT re-sending rawText in the text-only case: the extraction +
  // verified red flags above are already the complete, fact-checked ground
  // truth this step is designed to work from — re-attaching the full document
  // just adds input-processing time for no grounding this step still needs.
  // Visual input (images/PDF) is kept, since that's the actual source document
  // reference, not a redundant text dump.
  const userPrompt = hasVisualInput
    ? `${contextParts.join('\n\n')}\n\nThe attached document is the original quote, for context only.`
    : contextParts.join('\n\n')

  let userContent: Anthropic.MessageParam['content']
  if (visualContent) {
    userContent = [{ type: 'text', text: userPrompt }, ...(visualContent as any[])]
  } else {
    userContent = userPrompt
  }

  const response = await createTrackedMessage('v3_step4_strategy', {
    model: CLAUDE_MODEL,
    max_tokens: 8192,
    system: enhancedPrompt + getLanguageInstruction(options.userLocale || 'en'),
    messages: [{ role: 'user', content: userContent }],
    temperature: 0,
    output_config: { effort: 'medium' },
  })

  if (response.stop_reason === 'max_tokens') {
    console.error('[TermLift] Step 4 strategy response truncated')
    throw new Error('AI_PARSE_ERROR: Strategy response truncated')
  }

  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')

  const parsed = parseJsonFromContent(content) as StrategyOutput

  if (!parsed.verdict || !parsed.what_to_ask_for) {
    const keys = Object.keys(parsed)
    throw new Error(`AI_VALIDATION_ERROR: Strategy missing required fields. Got keys: [${keys.join(', ')}]`)
  }

  return parsed
}
