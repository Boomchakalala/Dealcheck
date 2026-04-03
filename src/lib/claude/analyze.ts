import Anthropic from '@anthropic-ai/sdk'
import { anthropic, CLAUDE_MODEL_ANALYSIS, getResponseText, parseJsonFromContent, getLanguageInstruction, buildImageContent, type ClaudeImageMediaType } from './client'
import { QUOTE_TYPE_OVERLAYS, buildSavingsDirective, buildClassificationContext } from './overlays'
import type { QuoteClassificationType } from '../schemas'
import type { DealOutput } from '@/types'
import type { ExtractedFacts } from './extract'

const ANALYSIS_PROMPT = `You are a sharp buyer-side procurement expert with 10 years of experience.

Read this vendor quote like you are about to spend your own money. Find every way to pay less, get better terms, and reduce risk. Be aggressive but honest.

You will receive VERIFIED financial facts (total, term, currency) as ground truth. Do not recalculate them. You will also receive the raw quote.

Read everything: tables, line items, fine print, dates, terms, fees, exclusions, clauses. Then react.

==================================================
WHAT TO LOOK FOR
==================================================

- Is the price inflated? What margin does the vendor have?
- Are there fees, packs, bundles, or add-ons you can challenge?
- Is this vendor an intermediary, dealer, broker, or reseller? If yes, flag it. Their margin is negotiable.
- Are you paying for things you do not use? (unused seats, excess quantity, oversized scope)
- Are the terms one-sided? (auto-renewal traps, no exit, price escalation, vague scope, one-sided risk)
- What leverage does the buyer have? (cash payment, volume, competing alternatives, timing)
- What can the buyer trade? (fast signature, longer commitment, referral, upfront payment)

==================================================
SAVINGS
==================================================

Find every realistic way to reduce cost. Be bold. If you identify margin, your ask should reflect it.

- Dealers and intermediaries carry 10-25% margin. Push for 8-15%.
- Events and sponsorships have high margin. Push for 15-25%.
- SaaS renewals: push for 5-15% depending on volume and tenure.
- Professional services: challenge hourly rates and cap escalation.
- If the quote is genuinely competitive, say so, but still find cleanup asks.

Each savings item is:
- must_have: goes in the negotiation email, counts toward the headline number
- nice_to_have: worth asking, shown separately

All amounts are RAW NUMBERS (e.g., 700 not "700 EUR"). Include currency separately.
total = sum of must_have amounts.

Payment term improvements go in cash_flow_improvements, not savings.
If a red flag has a dollar impact, it must also be a savings item.

==================================================
RED FLAGS
==================================================

Flag the issues that cost the buyer real money or create real risk. Use severity honestly:
- high: financial exposure over 10% of total, or one-sided clauses that could cost the buyer significantly
- medium: meaningful commercial issue worth negotiating
- low: minor optimization

Do not pad. Do not repeat the same issue twice with different wording. If a deal has 3 real issues, flag 3. Quality over quantity.

==================================================
STYLE
==================================================

Write like an experienced procurement lead talking to a colleague. Sharp, direct, specific.
Never use en dash or em dash characters. Use commas, colons, or normal hyphens.
No hedging. No filler. No generic advice that could apply to any deal.
Every sentence should reference THIS specific quote.

==================================================
OUTPUT
==================================================

Return valid JSON only:

{
  "title": "Vendor | New Purchase or Renewal | Month Year",
  "verdict": "One clear sentence: what to do and where the leverage is",
  "verdict_type": "negotiate|competitive|overpay_risk",
  "price_insight": "Optional one-liner on pricing. Omit if nothing to say.",
  "quick_read": {
    "whats_solid": ["..."],
    "whats_concerning": ["..."],
    "conclusion": "One sentence, the dominant issue"
  },
  "red_flags": [
    {
      "type": "Commercial|Renewal|Scope|Payment Terms|Source Insight|Usage Risk|Bundling",
      "severity": "high|medium|low",
      "score_category": "pricing|terms|leverage",
      "issue": "",
      "why_it_matters": "",
      "what_to_ask_for": "",
      "if_they_push_back": ""
    }
  ],
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
      {"ask": "what to ask for", "amount": 700, "rationale": "why this is justified"}
    ],
    "nice_to_have": [
      {"ask": "bonus ask", "amount": 200, "rationale": "why it could work"}
    ]
  },
  "cash_flow_improvements": [
    {"recommendation": "", "category": "cash_flow|risk"}
  ],
  "assumptions": ["..."],
  "disclaimer": "This analysis is commercial guidance, not legal advice. Verify final terms before signing."
}

RULES:
- Use the PROVIDED total_commitment. Do not recalculate it.
- Every savings amount must trace to the quote or simple arithmetic on quote numbers.
- Do not invent competitor prices as fact.
- Keep currency consistent.
- Savings are annual for recurring deals, total for one-time purchases.
- Return ONLY valid JSON.`

// Leverage levels used in the pre-analysis assessment
export type LeverageLevel = 'low' | 'moderate' | 'high'
export type SavingsConfidence = 'low' | 'medium' | 'high'
export type NegotiationAngle = 'price' | 'terms' | 'structure' | 'scope_clarity' | 'billing_renewal' | 'risk'

export interface LeverageAssessment {
  price_leverage: LeverageLevel
  terms_leverage: LeverageLevel
  structural_leverage: LeverageLevel
  risk_leverage: LeverageLevel
  ambiguity_leverage: LeverageLevel
  savings_confidence: SavingsConfidence
  best_negotiation_angle: NegotiationAngle[]
}

// Type for the analysis output
export interface AnalysisOutput {
  leverage_assessment?: LeverageAssessment
  title: string
  verdict: string
  verdict_type: 'negotiate' | 'competitive' | 'overpay_risk'
  price_insight?: string
  quick_read: {
    whats_solid: string[]
    whats_concerning: string[]
    conclusion: string
  }
  red_flags: Array<{
    type: string
    severity: 'high' | 'medium' | 'low'
    score_category: 'pricing' | 'terms' | 'leverage'
    issue: string
    why_it_matters: string
    what_to_ask_for: string
    if_they_push_back: string
  }>
  negotiation_plan: {
    leverage_you_have: string[]
    trades_you_can_offer: string[]
  }
  what_to_ask_for: {
    must_have: string[]
    nice_to_have: string[]
  }
  potential_savings?: {
    total: number
    currency: string
    must_have: Array<{ ask: string; amount: number; rationale: string }>
    nice_to_have?: Array<{ ask: string; amount: number; rationale: string }>
  }
  cash_flow_improvements?: Array<{ recommendation: string; category: string }>
  score?: number
  score_label?: string
  score_breakdown?: { pricing_fairness: number; terms_protections: number; leverage_position: number }
  score_rationale?: string
  assumptions: string[]
  disclaimer: string
}

export async function analyzeDealFacts(
  facts: ExtractedFacts,
  classification: QuoteClassificationType,
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
    userPreferences?: { payment_terms?: string; top_priority?: string; auto_renewal?: string }
    codeFlags?: Array<{ type: string; severity: string; issue: string; what_to_ask_for: string }>
  }
): Promise<AnalysisOutput> {
  // Build the enhanced prompt with overlays
  const overlay = QUOTE_TYPE_OVERLAYS[classification.quote_type] || ''
  const savingsDirective = buildSavingsDirective(classification)
  const preferencesDirective = buildPreferencesDirective(options.userPreferences)
  const enhancedPrompt = ANALYSIS_PROMPT + '\n\n' + overlay + '\n\n' + savingsDirective + '\n\n' + preferencesDirective

  // Build context parts — no code flags injected, let the AI think freely
  const contextParts = [
    `Deal Type: ${options.dealType}`,
    buildClassificationContext(classification),
    `\nVERIFIED FINANCIAL FACTS (use these as ground truth, do NOT recalculate):\n${JSON.stringify(facts, null, 2)}`,
    options.goal && `User Goal: ${options.goal}`,
    options.notes && `User Notes: ${options.notes}`,
    options.previousRoundOutput && `MULTI-ROUND ANALYSIS CONTEXT:\nThis is a follow-up round. Previous analysis: ${JSON.stringify(options.previousRoundOutput, null, 2)}\nKeep scoring consistent. Only change findings if the quote materially changed.`,
  ].filter(Boolean)

  const visualContent = buildImageContent(options.imageData, options.allPages, options.pdfData)
  const hasVisualInput = !!visualContent

  const userPrompt = hasVisualInput
    ? `${contextParts.join('\n\n')}\n\nPlease analyze the quote/contract shown in the attached document. Read the entire document carefully, pay close attention to tables, pricing, terms, dates, and any fine print.${rawText ? `\n\nExtracted text (for reference):\n${rawText}` : ''}`
    : `${contextParts.join('\n\n')}\n\nSupplier Document/Quote:\n${rawText}`

  let userContent: Anthropic.MessageParam['content']
  if (visualContent) {
    userContent = [{ type: 'text', text: userPrompt }, ...visualContent as any[]]
  } else {
    userContent = userPrompt
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_ANALYSIS,
    max_tokens: 6144,
    system: enhancedPrompt + getLanguageInstruction(options.userLocale || 'en'),
    messages: [{ role: 'user', content: userContent }],
    temperature: 0,
  })

  if (response.stop_reason === 'max_tokens') {
    console.error('[TermLift] Analysis response truncated')
    throw new Error('AI_PARSE_ERROR: Analysis response truncated')
  }

  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')
  console.log('[TermLift] Analyze raw response (first 500 chars):', content.substring(0, 500))

  const parsed = parseJsonFromContent(content) as AnalysisOutput
  console.log('[TermLift] Analyze parsed keys:', Object.keys(parsed))

  // Basic validation
  if (!parsed.verdict || !parsed.red_flags || !parsed.what_to_ask_for) {
    const keys = Object.keys(parsed)
    const sample = JSON.stringify(parsed).substring(0, 300)
    console.error('[TermLift] Analysis validation failed. Keys:', keys, 'Sample:', sample)
    throw new Error(`AI_VALIDATION_ERROR: Analysis missing required fields. Got keys: [${keys.join(', ')}]. Sample: ${sample}`)
  }

  return parsed
}

function buildPreferencesDirective(prefs?: { payment_terms?: string; top_priority?: string; auto_renewal?: string }): string {
  if (!prefs) return ''

  const parts: string[] = []

  if (prefs.payment_terms && prefs.payment_terms !== 'no_preference') {
    const label = prefs.payment_terms === 'net_30' ? 'Net 30' : prefs.payment_terms === 'net_60' ? 'Net 60' : 'Net 90'
    parts.push(`- PAYMENT TERMS: User prefers ${label}. If the quote is worse and payment terms are commercially relevant, flag it in cash_flow_improvements. If the quote already matches, do not flag it.`)
  }

  if (prefs.top_priority) {
    if (prefs.top_priority === 'lowest_price') {
      parts.push(`- TOP PRIORITY: LOWEST PRICE. Lean harder into savings and cost structure. Weight pricing issues higher.`)
    } else if (prefs.top_priority === 'best_terms') {
      parts.push(`- TOP PRIORITY: BEST CONTRACT TERMS. Lean harder into renewal, caps, and protections. Weight contract terms higher than pricing.`)
    } else if (prefs.top_priority === 'max_flexibility') {
      parts.push(`- TOP PRIORITY: MAXIMUM FLEXIBILITY. Lean harder into lock-in, minimums, and exit or scaling rights. Flag anything that reduces the buyer's ability to change course.`)
    }
  }

  if (prefs.auto_renewal === 'fine') {
    parts.push(`- AUTO-RENEWAL: User is fine with auto-renewal. Do not flag it unless the notice window, escalation right, or lock-in effect is commercially aggressive.`)
  } else if (prefs.auto_renewal === 'prefer_opt_in') {
    parts.push(`- AUTO-RENEWAL: User prefers opt-in renewal. Flag supplier-friendly auto-renewal and recommend a tighter structure.`)
  }

  if (parts.length === 0) return ''

  return `
USER PREFERENCES (apply when relevant):

${parts.join('\n\n')}`
}
