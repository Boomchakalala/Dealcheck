import Anthropic from '@anthropic-ai/sdk'
import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction, buildImageContent, SUPPORTED_IMAGE_MIME_TYPES, type ClaudeImageMediaType } from './client'

const EXTRACTION_PROMPT = `You are a financial data extraction engine. Your ONLY job is to extract factual information from vendor quotes. Do NOT analyze, judge, or recommend — just extract.

CRITICAL: You MUST always return valid JSON. NEVER respond with conversational text like "I don't see a quote" or "I need more information". If the input is unclear, extract whatever you can and use "Unknown" for missing fields.

EXTRACT THESE FIELDS:

1. vendor: Company or person name providing the quote
2. vendor_product: "Vendor / Product or Service" format
3. category: What type of service/product (e.g., "SaaS - Infrastructure", "Professional Services - Marketing Agency")
4. description: One sentence describing what this vendor does
5. term: Contract duration (e.g., "12 months", "6 months", "one-time")
6. total_commitment: The TOTAL contract value
7. contact_name: The name of the sales rep, account manager, or person who sent/signed the quote. Look for: signatures, "Prepared by", "Your contact", "Account Manager", "Sales Rep", email sign-offs, or any person's name associated with the vendor. Extract FIRST NAME ONLY (e.g., "Sarah" not "Sarah Johnson"). If no person name found, omit this field.

   CRITICAL RULES FOR total_commitment:
   - SEARCH for a stated total FIRST: "Net Amount Due", "Total", "Grand Total", "Total Contract Value", "Annual Total"
   - If you find a stated total → USE IT AS-IS. DONE. Do NOT multiply by anything.
   - VERIFY: If line items show "Total Amount" per line, and a "Net Amount Due" sums them → that IS the full contract value
   - ONLY multiply by term if amounts are explicitly labeled "/month" or "per month" AND no total exists
   - Output ONLY a clean currency amount: "$16,328" or "€40,000". No formulas, no notes.

7. billing_payment: How they pay (e.g., "Monthly", "Annual upfront", "Quarterly")
8. pricing_model: How pricing is structured (e.g., "Per-seat, billed annually", "Fixed retainer + % of ad spend")
9. currency: "USD", "EUR", "GBP", "CAD", "AUD"
10. deal_type: "New purchase" or "Renewal"
11. renewal_date: If stated, otherwise omit
12. signing_deadline: If stated, otherwise omit

Return ONLY valid JSON:
{
  "vendor": "Company Name",
  "vendor_product": "Company / Product Name",
  "category": "SaaS - Infrastructure",
  "description": "One sentence description",
  "term": "12 months",
  "total_commitment": "$16,328",
  "billing_payment": "Monthly",
  "pricing_model": "Per-seat, billed annually",
  "currency": "USD",
  "deal_type": "Renewal",
  "contact_name": "Sarah",
  "renewal_date": "March 15, 2026",
  "signing_deadline": "February 28, 2026"
}

RULES:
- Extract ONLY what is explicitly stated in the document
- Do NOT invent, assume, or calculate values not present
- If a field is not stated, omit it from the output
- For total_commitment: if you cannot determine it, set to the stated amount with the currency symbol
- NEVER multiply a stated total by the term length`

export interface ExtractedFacts {
  vendor: string
  vendor_product: string
  category?: string
  description?: string
  term: string
  total_commitment: string
  billing_payment: string
  pricing_model: string
  currency: string
  deal_type: string
  contact_name?: string
  renewal_date?: string
  signing_deadline?: string
}

export async function extractFinancialFacts(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string },
  userLocale?: string,
): Promise<ExtractedFacts> {
  const visualContent = buildImageContent(imageData, allPages, pdfData)
  const hasVisualInput = !!visualContent

  const userPrompt = hasVisualInput
    ? `Deal Type: ${dealType}\n\nPlease extract the financial facts from the attached quote document. Read the entire document carefully — pay close attention to tables, pricing columns, totals, terms, and dates.${extractedText ? `\n\nExtracted text (for reference):\n${extractedText}` : ''}`
    : `Deal Type: ${dealType}\n\nExtract the financial facts from this quote:\n${extractedText}`

  let userContent: Anthropic.MessageParam['content']
  if (visualContent) {
    userContent = [{ type: 'text', text: userPrompt }, ...visualContent as any[]]
  } else {
    userContent = userPrompt
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: EXTRACTION_PROMPT + getLanguageInstruction(userLocale || 'en'),
    messages: [
      { role: 'user', content: userContent },
      { role: 'assistant', content: '{' },
    ],
    temperature: 0,
  })

  if (response.stop_reason === 'max_tokens') {
    throw new Error('AI_PARSE_ERROR: Extraction response truncated')
  }

  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')
  console.log('[TermLift] Extract raw response (first 500 chars):', content.substring(0, 500))

  const parsed = parseJsonFromContent(content) as ExtractedFacts
  console.log('[TermLift] Extract parsed keys:', Object.keys(parsed))

  // Validate required fields
  if (!parsed.vendor || !parsed.total_commitment) {
    const keys = Object.keys(parsed)
    const sample = JSON.stringify(parsed).substring(0, 300)
    console.error('[TermLift] Extract validation failed. Keys:', keys, 'Sample:', sample)
    throw new Error(`AI_VALIDATION_ERROR: Extraction missing required fields. Got keys: [${keys.join(', ')}]. Sample: ${sample}`)
  }

  return parsed
}
