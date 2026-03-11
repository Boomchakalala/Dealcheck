import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

export interface ExtractedQuote {
  supplier: string | null
  total_value: string | null
  currency: string | null
  term_length: string | null
  billing_structure: string | null
  key_elements: string[]
  unclear_fields: string[]
  raw_text: string
  confidence: 'high' | 'medium' | 'low'
  extraction_notes?: string
}

const EXTRACTION_PROMPT = `You extract commercial facts from quotes, proposals, and estimates.

RULES:
1. Extract what's clearly stated in the document
2. Mark unclear or missing fields as null
3. Do NOT invent or assume values
4. Preserve ambiguity honestly
5. Note what's missing or vague

Return JSON with this structure:
{
  "supplier": "company name or null",
  "total_value": "numeric value with context (e.g., '$45,000/year') or null",
  "currency": "USD|EUR|GBP|etc or null",
  "term_length": "duration (e.g., '12 months', '3 years') or null",
  "billing_structure": "how payment works or null",
  "key_elements": ["list 3-5 main items/services included"],
  "unclear_fields": ["list what's ambiguous or missing"],
  "confidence": "high|medium|low",
  "extraction_notes": "brief note if anything important is unclear"
}

Confidence levels:
- high: All key commercial facts are clear
- medium: Some important details are missing or vague
- low: Quote is too unclear to assess fairly (missing pricing, scope, or terms)

Be honest about confidence. Better to mark as "low" than to guess.`

export async function extractAndNormalize(
  rawText: string,
  imageData?: { base64: string; mimeType: string }
): Promise<ExtractedQuote> {
  try {
    const userContent: Anthropic.MessageParam['content'] = imageData
      ? [
          { type: 'text', text: `Extract commercial facts from this quote/document:\n\n${rawText || '(see image)'}` },
          {
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: imageData.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageData.base64,
            },
          },
        ]
      : `Extract commercial facts from this quote:\n\n${rawText}`

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 800,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: userContent }],
      temperature: 0.3,
    })

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    const content = textBlock?.text ?? ''
    if (!content) {
      throw new Error('No response from extraction')
    }

    const parsed = JSON.parse(content)

    // Build extracted quote with raw text preserved
    const extracted: ExtractedQuote = {
      supplier: parsed.supplier || null,
      total_value: parsed.total_value || null,
      currency: parsed.currency || null,
      term_length: parsed.term_length || null,
      billing_structure: parsed.billing_structure || null,
      key_elements: Array.isArray(parsed.key_elements) ? parsed.key_elements : [],
      unclear_fields: Array.isArray(parsed.unclear_fields) ? parsed.unclear_fields : [],
      raw_text: rawText,
      confidence: parsed.confidence || 'medium',
      extraction_notes: parsed.extraction_notes,
    }

    return extracted
  } catch (error) {
    console.error('Extraction error:', error)
    // Return low-confidence fallback on error
    return {
      supplier: null,
      total_value: null,
      currency: null,
      term_length: null,
      billing_structure: null,
      key_elements: [],
      unclear_fields: ['Failed to extract: technical error'],
      raw_text: rawText,
      confidence: 'low',
      extraction_notes: 'Extraction failed - proceeding with raw text',
    }
  }
}
