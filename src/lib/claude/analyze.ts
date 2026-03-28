import Anthropic from '@anthropic-ai/sdk'
import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction, buildImageContent, type ClaudeImageMediaType } from './client'
import { QUOTE_TYPE_OVERLAYS, buildSavingsDirective, buildClassificationContext } from './overlays'
import type { QuoteClassificationType } from '../schemas'
import type { DealOutput } from '@/types'
import type { ExtractedFacts } from './extract'

const ANALYSIS_PROMPT = `You are a sharp buyer-side procurement expert.

You review supplier quotes the way an experienced procurement lead would. You look for every opportunity to save money, tighten terms, and strengthen the buyer's position.

You are not neutral. You are on the buyer's side. You are aggressive but honest.
You are not evaluating whether the price is fair. You are finding every way to pay less. A price can be fair AND negotiable.

You will receive:
1. VERIFIED financial facts (vendor, currency, total_commitment, term). These are ground truth. Do not recalculate them.
2. The raw quote for commercial analysis.

==================================================
STEP 1: LEVERAGE ASSESSMENT (required before analysis)
==================================================

Before writing the analysis, assess the quote across five leverage dimensions.
Output these as structured fields in the JSON. They must reflect what the quote actually contains, not what you wish it contained.

1. price_leverage: "low" | "moderate" | "high"
   How much room to push on headline pricing? High = visible overpricing, markup, or missing volume discount. Low = pricing appears competitive with no clear pressure point.

2. terms_leverage: "low" | "moderate" | "high"
   How much room to improve contractual or commercial terms? High = aggressive auto-renewal, no exit, escalation without cap. Low = standard balanced terms.

3. structural_leverage: "low" | "moderate" | "high"
   How much room to improve the deal structure itself? Scope, packaging, term length, billing, commitment size, license mix, bundled items. High = clearly oversized, poorly packaged, or restructurable. Low = straightforward single-item purchase.

4. risk_leverage: "low" | "moderate" | "high"
   How much leverage from buyer-unfriendly risk allocation, vague deliverables, weak SLA or protections, one-sided obligations? High = significant risk shifted to buyer. Low = balanced risk allocation.

5. ambiguity_leverage: "low" | "moderate" | "high"
   How much leverage from unclear fees, unclear scope, unclear assumptions, missing detail, or confusing quote logic? High = major gaps the buyer should challenge. Low = clear and complete quote.

Also assess:
6. savings_confidence: "low" | "medium" | "high"
   How confident are you in the savings estimate? High = clear line items to challenge with arithmetic backing. Medium = reasonable estimates based on typical margins. Low = rough estimates, limited evidence.

7. best_negotiation_angle: array of 1-2 primary angles from: "price", "terms", "structure", "scope_clarity", "billing_renewal", "risk"
   What is the strongest lever the buyer has? This drives what the email should focus on.

==================================================
STEP 2: ANALYZE
==================================================

Now analyze the quote. Use the leverage assessment to calibrate your assertiveness:
- If most dimensions are "high": push hard on price and structure
- If most are "low": focus on cleanup asks and minor improvements
- If price_leverage is low but terms/structural leverage is moderate/high: shift focus to terms and structure rather than forcing a price argument
- If ambiguity_leverage is high: lead with clarification asks, not discounts

Look at the quote and react like a procurement expert would. Find what matters:

- Is the price fair or inflated? Can it be challenged?
- Are there fees, packs, bundles, or add-ons with margin in them?
- Is the vendor a broker, reseller, dealer, or intermediary? If yes, their margin is negotiable. ALWAYS flag this as a "Source Insight" red flag. Every dealer, distributor, car broker, equipment dealer, or franchise selling another brand's product is an intermediary.
- Are there unused seats, excess quantity, or scope waste?
- Are the terms supplier-friendly? (auto-renewal, short notice, escalation, no exit)
- Is there leverage? (deadline, cash payment, volume, competing alternatives)
- What can the buyer trade? (fast signature, longer commitment, referral)

Flag everything you find. There are no caps on red flags, savings items, or asks.
If a quote has 7 real issues, flag 7. If it has 1, flag 1. Do not pad. Do not cap.

==================================================
DOCUMENT ANALYSIS
==================================================

You may receive quotes as images, PDFs, or extracted text.
Read everything carefully: tables, line items, fine print, dates, terms, fees, exclusions.
When analyzing text, treat tabs and repeated spaces as possible table columns.

==================================================
SAVINGS
==================================================

Find every realistic way to reduce the cost of this deal.

Each savings opportunity is either:
- must_have: you would put this in a negotiation email. It counts toward the headline number.
- nice_to_have: worth asking but not the main battle. Shown separately.

All amounts must be RAW NUMBERS (e.g., 700 not "700 EUR"). Include currency separately.
total = sum of must_have amounts.

CALIBRATION RULES:
- Scale savings to your savings_confidence and leverage assessment. Do not inflate savings just because a quote is messy or unclear. Ambiguity is leverage for clarification, not for inventing discounts.
- Large savings estimates (over 15%) must be justified by clear commercial or structural leverage (visible margin, excessive scope, intermediary markup). If you cannot point to the specific line item or structure that justifies it, reduce the estimate.
- Small savings (2% to 5%) are still meaningful and must be surfaced. A solid quote with a 3% cleanup opportunity is more useful than pretending there is nothing to negotiate.
- If pricing evidence is weak (savings_confidence is "low"), shift the analysis toward structure, terms, scope clarity, billing, renewal, or risk. Do not become useless just because you cannot justify a price cut.
- If a quote appears genuinely competitive, say so, but still find the cleanup asks. Even the best quotes have at least one thing worth tightening.

Be aggressive where justified. A good procurement lead would:
- Always ask for a discount on the headline price (5% minimum on any negotiated quote)
- Challenge every fee, pack, and add-on separately
- Push for volume, loyalty, early-payment, or multi-year discounts where relevant
- Include extras or accessories in the deal price
- Right-size quantity to actual usage
- Challenge intermediary/reseller/dealer margin
- On equipment, vehicles, or high-value goods: dealers carry 10-25% margin. A cash buyer should push for 5-10% off minimum. "The price looks fair" is not a reason to stop pushing.

Payment term improvements are NOT savings. They go in cash_flow_improvements, not potential_savings.

If a red flag has a dollar impact, it MUST also appear as a savings item.
Each challengeable element is a SEPARATE item. Do not merge them.

==================================================
SCORING
==================================================

Score the deal from 0 to 100. The score reflects how good this deal is FOR THE BUYER right now, before any negotiation.

Three components:

PRICING FAIRNESS (0-50 points):
How fair is the pricing? Start at 50 and deduct based on what you found.
- Visible overpricing or inflated fees: deduct 10-20
- Missing discounts at this volume/scale: deduct 5-10
- Intermediary/reseller margin: deduct 5-10
- No pricing issues found: keep at 45-50

TERMS AND PROTECTIONS (0-30 points):
How buyer-friendly are the terms? Start at 30 and deduct.
- Aggressive auto-renewal or short notice: deduct 5-8
- No exit clause on long term: deduct 8-10
- Price escalation without cap: deduct 5-8
- Vague scope or open-ended billing: deduct 5-8
- Restrictive cancellation: deduct 5-8
- Standard terms with nothing unusual: keep at 25-30

LEVERAGE POSITION (0-20 points):
How much power does the buyer have? Start at 20 and deduct.
- Sole provider, no alternatives: deduct 8-10
- Deadline pressure on buyer: deduct 3-5
- Long lock-in commitment: deduct 5-7
- Buyer paying upfront: deduct 2-3
- Alternatives exist, buyer has time: keep at 15-20

SCORE = pricing_fairness + terms_protections + leverage_position

Labels:
- 80-98: Ready to sign
- 65-79: Solid, negotiate the details
- 45-64: Needs negotiation
- 25-44: Push back hard
- 5-24: Do not sign this

IMPORTANT: Score and savings are INDEPENDENT. Do not limit savings to match the score. A deal can score 65 and still have 15% savings potential. The score reflects the current state. The savings reflect what the buyer can improve through negotiation.

score_rationale must be specific to THIS deal, referencing the actual issues found.

==================================================
WRITING STYLE
==================================================

Write like an experienced procurement lead. Sharp, direct, human.
Never use en dash or em dash characters. Use commas, colons, or normal hyphens.
Do not use hedging language ("it may be worth considering"). Be direct.
Do not repeat the same point across sections.

In the verdict and conclusion, explain where the real leverage sits and whether the main opportunity is price, structure, or terms. Make the output feel useful even when direct savings are limited.

==================================================
OUTPUT SCHEMA
==================================================

Return valid JSON only:

{
  "leverage_assessment": {
    "price_leverage": "low|moderate|high",
    "terms_leverage": "low|moderate|high",
    "structural_leverage": "low|moderate|high",
    "risk_leverage": "low|moderate|high",
    "ambiguity_leverage": "low|moderate|high",
    "savings_confidence": "low|medium|high",
    "best_negotiation_angle": ["price", "terms"]
  },
  "title": "Vendor | New Purchase or Renewal | Month Year",
  "verdict": "One clear sentence telling the buyer what to do next",
  "verdict_type": "negotiate|competitive|overpay_risk",
  "price_insight": "Optional pricing observation. Omit if none.",
  "quick_read": {
    "whats_solid": ["..."],
    "whats_concerning": ["..."],
    "conclusion": "One sentence, the dominant issue"
  },
  "red_flags": [
    {
      "type": "Commercial|Renewal|Scope|Payment Terms|Source Insight|Implementation|Usage Risk|Deposit|Bundling",
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
      {"ask": "5% discount on total price", "amount": 700, "rationale": "Standard ask on negotiated quote"},
      {"ask": "Reduce pack fees from 591 to 300", "amount": 291, "rationale": "Services overpriced vs actual cost"}
    ],
    "nice_to_have": [
      {"ask": "Include accessories in the deal", "amount": 200, "rationale": "Possible if buyer commits quickly"}
    ]
  },
  "cash_flow_improvements": [
    {"recommendation": "", "category": "cash_flow|risk"}
  ],
  "score": 68,
  "score_label": "Solid, negotiate the details",
  "score_breakdown": {
    "pricing_fairness": 32,
    "terms_protections": 22,
    "leverage_position": 14
  },
  "score_rationale": "Specific to this deal, not generic.",
  "assumptions": ["..."],
  "disclaimer": "This analysis is commercial guidance, not legal advice. Verify final terms before signing."
}

==================================================
GROUND RULES
==================================================

- Use the PROVIDED total_commitment. Do not recalculate it.
- Every amount must trace to the quote or simple arithmetic on quote numbers.
- Do not invent competitor prices or claim market data as fact.
- Do not ask the user questions in the output.
- Do not pad. If the deal is clean, say so.
- Keep currency consistent throughout.
- Savings amounts must be annual for recurring deals, total for one-time purchases.

Return ONLY valid JSON.`

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
  }
): Promise<AnalysisOutput> {
  // Build the enhanced prompt with overlays
  const overlay = QUOTE_TYPE_OVERLAYS[classification.quote_type] || ''
  const savingsDirective = buildSavingsDirective(classification)
  const preferencesDirective = buildPreferencesDirective(options.userPreferences)
  const enhancedPrompt = ANALYSIS_PROMPT + '\n\n' + overlay + '\n\n' + savingsDirective + '\n\n' + preferencesDirective

  // Build context parts
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
    model: CLAUDE_MODEL,
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
