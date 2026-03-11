/**
 * LlamaParse Integration
 * Parses complex PDFs with tables into structured markdown/JSON
 * https://cloud.llamaindex.ai/parse
 */

import { z } from 'zod'

const LLAMAPARSE_API_URL = 'https://api.cloud.llamaindex.ai/api/parsing/upload'

// LlamaParse result schema
export const ParsedDocumentSchema = z.object({
  markdown: z.string().describe('Parsed document as markdown with preserved table structure'),
  pages: z.array(z.object({
    page: z.number(),
    text: z.string(),
    markdown: z.string(),
  })).optional(),
})

export type ParsedDocument = z.infer<typeof ParsedDocumentSchema>

/**
 * Parse PDF using LlamaParse API
 * @param fileUrl - Public URL to the PDF file
 * @returns Structured markdown with tables preserved
 */
export async function parsePDFWithLlamaParse(fileUrl: string): Promise<ParsedDocument> {
  const apiKey = process.env.LLAMAPARSE_API_KEY

  if (!apiKey) {
    throw new Error('LLAMAPARSE_API_KEY not configured')
  }

  try {
    console.log('📄 Sending PDF to LlamaParse...')

    // Step 1: Submit document for parsing
    const response = await fetch(LLAMAPARSE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fileUrl,
        parsing_instruction: `Extract all content while preserving table structure.
          Pay special attention to pricing tables with columns like Item, Quantity, Unit Price, Total.
          Preserve numerical data and currency symbols accurately.`,
        result_type: 'markdown', // Get markdown with table structure
        premium_mode: true, // Better table extraction
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('LlamaParse error:', error)
      throw new Error(`LlamaParse failed: ${response.status}`)
    }

    const result = await response.json()

    // Step 2: Get the job ID and poll for results
    const jobId = result.id
    console.log(`📝 LlamaParse job submitted: ${jobId}`)

    // Poll for completion (LlamaParse is async)
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second

      const statusResponse = await fetch(`${LLAMAPARSE_API_URL}/${jobId}/result/markdown`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (statusResponse.ok) {
        const markdown = await statusResponse.text()
        console.log(`✅ LlamaParse completed: ${markdown.length} chars`)

        return {
          markdown,
          pages: [], // We'll use the full markdown
        }
      }

      if (statusResponse.status === 404 || statusResponse.status === 400) {
        // Still processing
        attempts++
        continue
      }

      throw new Error(`LlamaParse polling failed: ${statusResponse.status}`)
    }

    throw new Error('LlamaParse timeout - document took too long to process')
  } catch (error) {
    console.error('LlamaParse error:', error)
    throw new Error('Failed to parse PDF. Please try uploading a screenshot instead.')
  }
}

/**
 * Fallback: Use simple text extraction if LlamaParse fails
 */
export async function parsePDFWithFallback(fileBuffer: Buffer, fileUrl?: string): Promise<string> {
  // Try LlamaParse first if URL provided
  if (fileUrl) {
    try {
      const parsed = await parsePDFWithLlamaParse(fileUrl)
      return parsed.markdown
    } catch (error) {
      console.warn('LlamaParse failed, using fallback extraction:', error)
    }
  }

  // Fallback to basic extraction
  const { extractTextFromPDF } = await import('./extract')
  return await extractTextFromPDF(fileBuffer)
}
