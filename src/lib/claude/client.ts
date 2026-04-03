import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'          // Extraction, emails, general calls
export const CLAUDE_MODEL_ANALYSIS = 'claude-opus-4-6'          // Analysis only — market judgment, severity, savings
export const CLAUDE_CLASSIFY_MODEL = 'claude-haiku-4-5-20251001' // Classification — fast, cheap
export const CLAUDE_MODEL_ID = CLAUDE_MODEL_ANALYSIS

export type ClaudeImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

export type ClaudeUserContent =
  | string
  | Array<
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: ClaudeImageMediaType; data: string } }
    >

export const SUPPORTED_IMAGE_MIME_TYPES: ClaudeImageMediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function getResponseText(response: Anthropic.Message): string {
  const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text')
  return textBlock?.text ?? ''
}

export function parseJsonFromContent(content: string): unknown {
  const trimmed = content.trim()
  const stripped = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  // Prepend '{' if needed (assistant prefill strips the leading brace)
  const full = stripped.startsWith('{') ? stripped : '{' + stripped
  // Extract only the JSON object — Claude sometimes adds trailing text after the closing '}'
  let depth = 0
  let inString = false
  let escape = false
  for (let i = 0; i < full.length; i++) {
    const ch = full[i]
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"' && !escape) { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return JSON.parse(full.substring(0, i + 1))
    }
  }
  // Fallback: try parsing the whole thing
  return JSON.parse(full)
}

export function getLanguageInstruction(locale: string): string {
  if (locale === 'fr') {
    return `

IMPORTANT: The user's language preference is French. Generate ALL descriptive text in French. This includes: verdict, red flag descriptions, negotiation advice, strategy text, savings rationale text, email drafts, and all other user-facing prose.

Use professional French business/procurement terminology. Keep proper nouns, product names, and currency amounts as-is.

CRITICAL — FACTS ARE IMMUTABLE:
- All numeric values (amounts, percentages, scores) must remain EXACTLY as provided in the verified facts. Do NOT reformulate, round, convert, or re-localize them.
- Currency amounts in JSON fields must use the EXACT same format as the input facts (e.g., if facts say "$16,328", output "$16,328" — never "16 328 $" or "16.328 $").
- The "total" field in potential_savings must equal the arithmetic sum of must_have amounts. Do NOT change it.
- savings amounts are raw numbers (e.g., 700 not "700 EUR"). This does not change with language.

For email greetings, use "Bonjour [Name]," (not "Hi" or "Hey"). For email sign-offs, use "Cordialement," followed by "[Votre nom]".`
  }
  return '\n\nIMPORTANT: Generate ALL output text in English.'
}

/** Build image content blocks for Claude API calls */
export function buildImageContent(
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string }
): Anthropic.MessageParam['content'] | null {
  const hasPdf = pdfData?.base64 && pdfData?.mimeType === 'application/pdf'
  const hasImages = !hasPdf && allPages && allPages.length > 0
  const hasSingleImage = !hasPdf && imageData && SUPPORTED_IMAGE_MIME_TYPES.includes(imageData.mimeType as ClaudeImageMediaType)

  if (hasPdf) {
    return [
      {
        type: 'document' as any,
        source: { type: 'base64' as any, media_type: 'application/pdf' as any, data: pdfData!.base64 },
      },
    ]
  }

  if (hasImages) {
    return allPages!.map((page) => ({
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: page.mimeType as ClaudeImageMediaType, data: page.base64 },
    }))
  }

  if (hasSingleImage) {
    return [
      { type: 'image' as const, source: { type: 'base64' as const, media_type: imageData!.mimeType as ClaudeImageMediaType, data: imageData!.base64 } },
    ]
  }

  return null
}
