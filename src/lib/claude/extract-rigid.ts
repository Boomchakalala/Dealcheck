import Anthropic from '@anthropic-ai/sdk'
import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, buildImageContent, type ClaudeImageMediaType } from './client'
import crypto from 'crypto'
import { logAiRaw } from '@/lib/ai-debug'

/**
 * Rigid extraction schema — forces the AI to fill a fixed template.
 * Every field must be answered, even if "not_stated".
 * This produces consistent, cacheable output.
 */

const RIGID_EXTRACTION_PROMPT = `You are a financial data extraction engine. Your ONLY job is to extract factual information from vendor quotes into a FIXED SCHEMA. Do NOT analyze, judge, or recommend.

CRITICAL: You MUST return valid JSON with EVERY field below. If a field is not present in the document, use "not_stated" for strings, null for numbers, and false for booleans. NEVER skip a field.

EXTRACT INTO THIS EXACT SCHEMA:

{
  "vendor": "Company name",
  "vendor_product": "Vendor / Product or Service",
  "category": "SaaS - Infrastructure | Professional Services | Equipment | etc.",
  "description": "One sentence describing what this vendor provides",

  "financials": {
    "total_commitment": "$50,000",
    "currency": "USD|EUR|GBP|CAD|AUD",
    "billing_frequency": "Monthly|Quarterly|Annual|One-time",
    "payment_terms": "Net 30|Net 60|Upon receipt|not_stated",
    "pricing_model": "Per-seat|Fixed retainer|Per-unit|Hourly|etc.",
    "line_items": [
      {"description": "item name", "quantity": 1, "unit_price": "$100", "total": "$100"}
    ],
    "fees_and_extras": [
      {"description": "fee name", "amount": "$500"}
    ],
    "discount_applied": "not_stated",
    "deposit_required": "not_stated"
  },

  "contract_terms": {
    "term_length": "12 months",
    "start_date": "not_stated",
    "deal_type": "New|Renewal",
    "auto_renewal": false,
    "auto_renewal_notice_days": null,
    "price_escalation_allowed": false,
    "price_escalation_cap_percent": null,
    "exit_clause_exists": false,
    "exit_notice_days": null,
    "exit_penalty": "not_stated",
    "minimum_commitment": "not_stated",
    "exclusivity_clause": false,
    "sla_defined": false,
    "liability_cap": "not_stated",
    "non_compete_or_non_solicit": false
  },

  "context": {
    "contact_name": "not_stated",
    "renewal_date": "not_stated",
    "signing_deadline": "not_stated",
    "quote_valid_until": "not_stated",
    "is_intermediary": false,
    "intermediary_type": "not_stated",
    "competing_alternatives_mentioned": false
  },

  "usage_indicators": {
    "seats_or_units_licensed": null,
    "seats_or_units_active": null,
    "usage_based_pricing": false,
    "overage_rate": "not_stated",
    "included_volume": "not_stated"
  }
}

RULES FOR total_commitment:
- SEARCH for a stated total FIRST: "Net Amount Due", "Total", "Grand Total", "Montant Total", "Total HT", "Total TTC"
- If found, USE IT AS-IS. Do NOT multiply by anything.
- If no total exists, SUM all line items.
- ONLY multiply by term if amounts are explicitly labeled "/month" and no total exists.
- Output ONLY a clean currency amount: "$16,328" or "€40,000".

RULES FOR line_items:
- Extract EVERY line item with pricing visible in the document.
- If only a total is shown with no breakdown, return an empty array.
- Include quantity and unit_price where visible.

RULES FOR contract_terms:
- auto_renewal: true ONLY if the document explicitly mentions automatic renewal.
- price_escalation_allowed: true if ANY mention of price increases, reviews, or adjustments.
- exit_clause_exists: true if ANY mention of early termination, cancellation, or exit rights.
- For _days fields: extract the number of days if stated, null if not.
- For _percent fields: extract the percentage if stated, null if not.

RULES FOR is_intermediary:
- true if the seller is a broker, reseller, dealer, distributor, mandataire, or franchise selling another brand's product.

Return ONLY valid JSON. Every field must be present.`

export interface RigidExtraction {
  vendor: string
  vendor_product: string
  category: string
  description: string

  financials: {
    total_commitment: string
    currency: string
    billing_frequency: string
    payment_terms: string
    pricing_model: string
    line_items: Array<{ description: string; quantity: number | null; unit_price: string | null; total: string }>
    fees_and_extras: Array<{ description: string; amount: string }>
    discount_applied: string
    deposit_required: string
  }

  contract_terms: {
    term_length: string
    start_date: string
    deal_type: string
    auto_renewal: boolean
    auto_renewal_notice_days: number | null
    price_escalation_allowed: boolean
    price_escalation_cap_percent: number | null
    exit_clause_exists: boolean
    exit_notice_days: number | null
    exit_penalty: string
    minimum_commitment: string
    exclusivity_clause: boolean
    sla_defined: boolean
    liability_cap: string
    non_compete_or_non_solicit: boolean
  }

  context: {
    contact_name: string
    renewal_date: string
    signing_deadline: string
    quote_valid_until: string
    is_intermediary: boolean
    intermediary_type: string
    competing_alternatives_mentioned: boolean
  }

  usage_indicators: {
    seats_or_units_licensed: number | null
    seats_or_units_active: number | null
    usage_based_pricing: boolean
    overage_rate: string
    included_volume: string
  }
}

/**
 * Generate a SHA-256 hash of the input for caching.
 * Same document text = same hash = same extraction.
 */
export function generateDocumentHash(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex')
}

/**
 * Extract facts using the rigid schema.
 * This replaces the old freestyle extraction.
 */
export async function extractRigid(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string },
): Promise<RigidExtraction> {
  const visualContent = buildImageContent(imageData, allPages, pdfData)
  const hasVisualInput = !!visualContent

  const userPrompt = (hasVisualInput
    ? `Deal Type: ${dealType}\n\nExtract ALL facts from the attached quote into the rigid schema. Read every table, line item, clause, date, and fee.${extractedText ? `\n\nExtracted text (for reference):\n${extractedText}` : ''}`
    : `Deal Type: ${dealType}\n\nExtract ALL facts from this quote into the rigid schema:\n${extractedText}`)
    + `\n\nRespond with ONLY the JSON object. Begin your response with the { character — no preamble, no explanation, no markdown fences. Output raw JSON and nothing else.`

  let userContent: Anthropic.MessageParam['content']
  if (visualContent) {
    userContent = [{ type: 'text', text: userPrompt }, ...visualContent as any[]]
  } else {
    userContent = userPrompt
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: RIGID_EXTRACTION_PROMPT,
    messages: [
      { role: 'user', content: userContent },
    ],
    temperature: 0,
  })

  if (response.stop_reason === 'max_tokens') {
    throw new Error('AI_PARSE_ERROR: Extraction response truncated')
  }

  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')
  logAiRaw('Rigid extract raw response', content)

  const parsed = parseJsonFromContent(content) as RigidExtraction

  // Validate critical fields
  if (!parsed.vendor || !parsed.financials?.total_commitment) {
    throw new Error(`AI_VALIDATION_ERROR: Rigid extraction missing vendor or total_commitment`)
  }

  return parsed
}

/**
 * Convert RigidExtraction to the legacy ExtractedFacts format
 * for backward compatibility with existing pipeline components.
 */
/** Clean "not_stated" values — replace with undefined or a sensible display value */
function clean(val: string): string | undefined {
  if (!val || val === 'not_stated' || val === 'Unknown' || val === 'unknown') return undefined
  return val
}

/** Clean contact name — extract first name, fix casing */
function cleanContactName(name: string): string | undefined {
  const cleaned = clean(name)
  if (!cleaned) return undefined
  // Fix ALL CAPS: "EMMANUEL PICHEREAU" → "Emmanuel Pichereau"
  const fixed = cleaned.replace(/\b[A-Z]{2,}\b/g, (word) =>
    word.charAt(0) + word.slice(1).toLowerCase()
  )
  // Return first name only
  return fixed.split(/\s+/)[0]
}

export function rigidToLegacyFacts(rigid: RigidExtraction): import('./extract').ExtractedFacts {
  return {
    vendor: rigid.vendor,
    vendor_product: rigid.vendor_product,
    category: clean(rigid.category) || rigid.category,
    description: clean(rigid.description) || rigid.description,
    term: clean(rigid.contract_terms.term_length) || 'Not specified',
    total_commitment: rigid.financials.total_commitment,
    billing_payment: clean(rigid.financials.billing_frequency) || 'Not specified',
    pricing_model: clean(rigid.financials.pricing_model) || 'Not specified',
    currency: rigid.financials.currency || 'USD',
    deal_type: clean(rigid.contract_terms.deal_type) || 'New purchase',
    contact_name: cleanContactName(rigid.context.contact_name),
    renewal_date: clean(rigid.context.renewal_date),
    signing_deadline: clean(rigid.context.signing_deadline),
  }
}
