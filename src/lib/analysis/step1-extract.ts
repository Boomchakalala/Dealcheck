import Anthropic from '@anthropic-ai/sdk'
import { createTrackedMessage, CLAUDE_MODEL, getResponseText, parseJsonFromContent, buildImageContent } from '../claude/client'
import type { QuoteExtraction } from './types'

// Combines what today's two separate extraction paths produce — the lightweight
// identity/terms fields from claude/extract.ts, and the scoring-fact fields
// currently buried inside claude/analyze.ts's monolithic "extraction" key —
// into one extraction call, plus contractTermFacts (needed for Step 2's red
// flag checks, not part of lib/scoring.ts's ExtractionResult at all).
//
// Deliberately flatter than extract-rigid.ts's 30-field nested schema, which
// caused token bloat and extraction errors on large quotes (see git history:
// "Revert to original simple extraction — rigid was too heavy").
export const STEP1_EXTRACTION_PROMPT = `You are a financial and contractual data extraction engine. Your ONLY job is to
extract factual information from vendor quotes. Do NOT analyze, judge, score,
or recommend anything — just extract.

CRITICAL: You MUST always return valid JSON. NEVER respond with conversational
text. If the input is unclear, extract whatever you can and use null for
missing fields. Do NOT invent, assume, or calculate values not present in the
document.

==================================================
PART 1 — IDENTITY AND TERMS
==================================================

1. vendor: Company or person name providing the quote
2. vendorProduct: "Vendor / Product or Service" format
3. description: One sentence describing what this vendor does, or null
4. term: Contract duration (e.g., "12 months", "one-time")
5. totalCommitment: The TOTAL contract value.
   - SEARCH for a stated total FIRST: "Net Amount Due", "Total", "Grand Total",
     "Total Contract Value", "Annual Total", "Montant Total", "Total HT", "Total TTC"
   - If found, USE IT AS-IS. Do NOT multiply by anything.
   - If NO stated total exists, SUM ALL LINE ITEMS including fees and add-ons.
   - If line items are rate x quantity, calculate each line then sum.
   - ONLY multiply by term if amounts are explicitly "/month" and no total exists.
   - SANITY CHECK: if line items sum to thousands but your total is under 100,
     you made an error — recalculate.
   - Output ONLY a clean currency amount: "$16,328" or "€40,000".
6. billingPayment: How they pay (e.g., "Monthly", "Annual upfront", "Quarterly")
7. pricingModel: How pricing is structured (e.g., "Per-seat, billed annually")
8. currency: "USD", "EUR", "GBP", "CAD", "AUD"
9. dealType: "New" or "Renewal"
10. contactName: First name only of the sales rep/signer, or null
11. renewalDate: If stated, else null
12. signingDeadline: If stated, else null

==================================================
PART 2 — STRUCTURED FACTS (for downstream scoring — be literal)
==================================================

You are not scoring or flagging anything here. A separate engine computes
scores and a separate step detects red flags from what you extract below.
Report only what the quote says. If a fact is genuinely not in the quote,
use null — do NOT infer intent or fill gaps.

pricingItemized: true if pricing is broken out line-by-line; false if lump sum.

fees: every fee, surcharge, service charge, gratuity, admin or processing
charge, or markup line. For each: name, type (admin|processing|gratuity|tax|other),
percentage (of subtotal, else null), dollarAmount (else null),
isAvoidable (true if the buyer could realistically get it waived/removed —
false for genuine government taxes), isDisclosedAsNonService (true if it is
not payment for a real service the buyer receives).

cancellationTerms: refundSchedule (short text), buyerInsideWindow (true if the
buyer is already inside a cancellation/penalty window), retentionPctInsideWindow
(% the vendor keeps if cancelled inside the window — 100 if fully non-refundable,
else the tier %, else null), forceMajeurePresent, rescheduleOption, rescheduleFeePct.

paymentTerms: depositPct, balanceDueDaysBeforeDelivery, achOffered, netTerms
(else null).

vendorRights: unilateralSubstitution (vendor may swap product/service/personnel
without consent), mandatoryMarketing (buyer must provide testimonials/logo/
marketing), reciprocalValue (true if the buyer gets something of value in
return for any mandatory obligation).

tbdLineItems: any line priced as TBD / "to be determined" / estimate / not
finalized. For each: description, dollarAmount (best estimate of exposure).

leverageFactors: competingQuoteInHand (only true if the document itself
references a competing offer), daysToDeadline (days to the signing deadline,
else null), soleSource (true only if the document states no alternative
vendor exists), dealSizeSignificant (true if the document itself signals this
is a large/strategic deal for the vendor — e.g. multi-year, enterprise tier),
buyerInsidePenaltyWindow.

==================================================
PART 3 — CONTRACT TERM FACTS (for red flag detection — be literal)
==================================================

Same rule as Part 2: report only what the quote states. Use null/false when
genuinely absent — do not infer.

contractTermFacts:
- autoRenewal: true if the contract auto-renews without buyer action
- autoRenewalNoticeDays: days of notice required to cancel before auto-renewal, else null
- priceEscalationAllowed: true if the vendor may raise pricing during the term or at renewal
- priceEscalationCapPct: the stated cap on that increase, else null (null with priceEscalationAllowed=true means uncapped)
- exitClauseExists: true if there is any stated early-termination or exit right
- exclusivityClause: true if the buyer is barred from sourcing this category elsewhere
- slaDefined: true if service levels, response times, or deliverable standards are specified
- liabilityCapDefined: true if a liability cap is stated
- nonCompeteOrNonSolicit: true if either clause is present
- seatsOrUnitsLicensed / seatsOrUnitsActive: for seat- or unit-based pricing, licensed vs. actually-active counts if both are stated, else null
- isIntermediary: true if the vendor is a reseller/broker/intermediary rather than the primary source
- intermediaryType: e.g. "reseller", "broker", else null
- quoteValidUntil: quote expiration date if stated, else null

==================================================
OUTPUT
==================================================

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "vendor": "...", "vendorProduct": "...", "description": null,
  "term": "...", "totalCommitment": "...", "billingPayment": "...",
  "pricingModel": "...", "currency": "...", "dealType": "...",
  "contactName": null, "renewalDate": null, "signingDeadline": null,
  "pricingItemized": true,
  "fees": [{"name": "...", "type": "admin", "percentage": 7, "dollarAmount": null, "isAvoidable": true, "isDisclosedAsNonService": true}],
  "cancellationTerms": {"refundSchedule": "...", "buyerInsideWindow": false, "retentionPctInsideWindow": null, "forceMajeurePresent": true, "rescheduleOption": true, "rescheduleFeePct": null},
  "paymentTerms": {"depositPct": null, "balanceDueDaysBeforeDelivery": null, "achOffered": false, "netTerms": 30},
  "vendorRights": {"unilateralSubstitution": false, "mandatoryMarketing": false, "reciprocalValue": true},
  "tbdLineItems": [],
  "leverageFactors": {"competingQuoteInHand": false, "daysToDeadline": 21, "soleSource": false, "dealSizeSignificant": false, "buyerInsidePenaltyWindow": false},
  "contractTermFacts": {"autoRenewal": true, "autoRenewalNoticeDays": 30, "priceEscalationAllowed": false, "priceEscalationCapPct": null, "exitClauseExists": false, "exclusivityClause": false, "slaDefined": false, "liabilityCapDefined": false, "nonCompeteOrNonSolicit": false, "seatsOrUnitsLicensed": null, "seatsOrUnitsActive": null, "isIntermediary": false, "intermediaryType": null, "quoteValidUntil": null}
}`

/**
 * Step 1: single extraction call producing everything Step 2/3 and scoring
 * need. NOT yet stress-tested against a large real quote for token size /
 * error rate — do that before trusting this in the pipeline (flagged during
 * design; still open).
 */
export async function extractQuote(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string },
): Promise<QuoteExtraction> {
  const visualContent = buildImageContent(imageData, allPages, pdfData)
  const hasVisualInput = !!visualContent

  const userPrompt = (hasVisualInput
    ? `Deal Type: ${dealType}\n\nExtract from the attached quote document. Read the entire document carefully — pay close attention to tables, pricing columns, totals, terms, fees, and dates.${extractedText ? `\n\nExtracted text (for reference):\n${extractedText}` : ''}`
    : `Deal Type: ${dealType}\n\nExtract from this quote:\n${extractedText}`)
    + `\n\nRespond with ONLY the JSON object. Begin your response with the { character — no preamble, no explanation, no markdown fences. Output raw JSON and nothing else.`

  let userContent: Anthropic.MessageParam['content']
  if (visualContent) {
    userContent = [{ type: 'text', text: userPrompt }, ...(visualContent as any[])]
  } else {
    userContent = userPrompt
  }

  const response = await createTrackedMessage('v3_step1_extract', {
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: STEP1_EXTRACTION_PROMPT,
    messages: [{ role: 'user', content: userContent }],
    temperature: 0,
    thinking: { type: 'disabled' },
    output_config: { effort: 'low' },
  })

  if (response.stop_reason === 'max_tokens') {
    throw new Error('AI_PARSE_ERROR: Step 1 extraction response truncated')
  }

  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')

  const parsed = parseJsonFromContent(content) as QuoteExtraction

  if (!parsed.vendor || !parsed.totalCommitment) {
    const keys = Object.keys(parsed)
    throw new Error(`AI_VALIDATION_ERROR: Step 1 extraction missing required fields. Got keys: [${keys.join(', ')}]`)
  }

  return parsed
}
