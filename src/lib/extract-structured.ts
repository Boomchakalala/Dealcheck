import { pdfToPng } from 'pdf-to-png-converter'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Structured extraction schema
export const ExtractedQuoteSchema = z.object({
  vendor_name: z.string().describe('Company/vendor providing the quote'),
  quote_date: z.string().optional().describe('Date of the quote if visible'),
  quote_number: z.string().optional().describe('Quote/proposal reference number'),
  contract_length: z.string().optional().describe('Contract term/length (e.g., "12 months", "1 year")'),

  pricing_table_items: z.array(z.object({
    item_name: z.string().describe('Product/service name'),
    description: z.string().optional().describe('Item description if available'),
    quantity: z.string().optional().describe('Quantity/volume'),
    unit_price: z.string().optional().describe('Price per unit'),
    total_price: z.string().describe('Line item total'),
    billing_frequency: z.string().optional().describe('Monthly/Annual/One-time'),
  })).describe('All line items from pricing table'),

  totals: z.object({
    subtotal: z.string().optional(),
    tax: z.string().optional(),
    total: z.string().describe('Final total amount'),
    currency: z.string().optional().describe('USD, EUR, GBP, etc.'),
  }),

  payment_terms: z.string().optional().describe('Payment structure (upfront, monthly, etc.)'),
  additional_terms: z.array(z.string()).optional().describe('Key contract terms, renewal clauses, cancellation policy'),
  validity_period: z.string().optional().describe('How long quote is valid'),
})

export type ExtractedQuote = z.infer<typeof ExtractedQuoteSchema>

/**
 * Convert PDF to images (one per page)
 */
export async function pdfToImages(pdfBuffer: Buffer): Promise<string[]> {
  try {
    console.log('📄 Converting PDF to images...')

    const pngPages = await pdfToPng(pdfBuffer, {
      disableFontFace: false,
      useSystemFonts: false,
      viewportScale: 2.0, // Higher quality
    })

    const base64Images = pngPages.map((page) => {
      return page.content.toString('base64')
    })

    console.log(`✅ Converted PDF to ${base64Images.length} images`)
    return base64Images
  } catch (error) {
    console.error('PDF to image conversion error:', error)
    throw new Error('Failed to convert PDF to images')
  }
}

/**
 * Use GPT-4 Vision to extract structured data from quote images
 */
export async function extractStructuredFromImages(images: string[]): Promise<ExtractedQuote> {
  try {
    console.log(`🔍 Extracting structured data from ${images.length} image(s)...`)

    const messages: any[] = [
      {
        role: 'system',
        content: `You are a quote extraction expert. Analyze the provided quote/proposal images and extract structured data.

CRITICAL RULES:
- READ ALL PRICING TABLES CAREFULLY - capture every line item
- For tables: identify columns (item, quantity, unit price, total)
- If multiple pages: combine all data into single structured output
- Extract exact numbers/prices as shown
- If pricing has tiers/options, capture all of them
- Look for totals, subtotals, taxes in the document
- Identify payment terms (upfront, monthly, etc.)
- Note contract length, validity period, renewal terms

Return structured JSON only.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all pricing and contract information from this quote. Pay special attention to pricing tables - capture every row with item name, quantity, unit price, and total.',
          },
          ...images.map((base64) => ({
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64}`,
            },
          })),
        ],
      },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.1, // Low temperature for accurate extraction
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content)
    const validated = ExtractedQuoteSchema.parse(parsed)

    console.log(`✅ Extracted structured data: ${validated.pricing_table_items.length} line items, total: ${validated.totals.total}`)

    return validated
  } catch (error) {
    console.error('Structured extraction error:', error)
    throw new Error('Failed to extract structured data from quote')
  }
}

/**
 * Main function: convert PDF to structured quote data
 */
export async function extractStructuredQuote(pdfBuffer: Buffer): Promise<ExtractedQuote> {
  // Step 1: Convert PDF pages to images
  const images = await pdfToImages(pdfBuffer)

  // Step 2: Use GPT-4 Vision to extract structured data
  const structured = await extractStructuredFromImages(images)

  return structured
}
