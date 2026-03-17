import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
export const CLAUDE_CLASSIFY_MODEL = 'claude-haiku-4-5-20251001'
export const CLAUDE_MODEL_ID = CLAUDE_MODEL

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
  return JSON.parse(stripped)
}

export function getLanguageInstruction(locale: string): string {
  if (locale === 'fr') {
    return '\n\nIMPORTANT: The user\'s language preference is French. Generate ALL output text in French. This includes: verdict, red flag descriptions, negotiation advice, strategy text, savings descriptions, and all other user-facing text. Use professional French business/procurement terminology. Keep proper nouns, product names, and currency amounts as-is.'
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
