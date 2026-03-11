import Tesseract from 'tesseract.js'

// Canvas is optional - not needed for Vercel deployment
if (typeof window === 'undefined') {
  try {
    // @ts-ignore - Canvas is optional for production
    const canvas = require('canvas')
    if (canvas) {
      // @ts-ignore - DOMMatrix polyfill for pdf-parse
      global.DOMMatrix = class DOMMatrix {
        constructor() {
          // @ts-ignore
          this.a = 1
          // @ts-ignore
          this.b = 0
          // @ts-ignore
          this.c = 0
          // @ts-ignore
          this.d = 1
          // @ts-ignore
          this.e = 0
          // @ts-ignore
          this.f = 0
        }
      }
    }
  } catch (e) {
    // Canvas not available - this is fine for production
    console.log('Canvas not available (expected in production)')
  }
}

/**
 * Clean and normalize extracted text to preserve table structure
 * This helps the AI understand pricing tables and structured data
 */
function normalizeExtractedText(rawText: string): string {
  let text = rawText

  // Preserve table-like structures by maintaining spacing
  // Look for patterns like: "Item    $500    Monthly"
  const lines = text.split('\n')
  const processedLines = lines.map(line => {
    // If line has multiple spaces (potential table columns), preserve them
    if (/\s{2,}/.test(line)) {
      // Replace multiple spaces with tab for better structure
      return line.replace(/\s{2,}/g, '\t')
    }
    return line
  })

  text = processedLines.join('\n')

  // Remove excessive blank lines (more than 2 consecutive)
  text = text.replace(/\n{3,}/g, '\n\n')

  // Preserve currency and number formatting
  // Ensure there's space between currency symbols and numbers for clarity
  text = text.replace(/(\$|€|£)(\d)/g, '$1 $2')

  return text.trim()
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('📄 Starting PDF extraction...')

    // Use require() to load pdf-parse only when needed
    // Next.js config excludes it from bundling to avoid test code execution
    const pdfParse = require('pdf-parse')

    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
    })

    const rawText = data.text.trim()
    console.log(`✅ Extracted ${rawText.length} characters from PDF (${data.numpages} pages)`)

    if (rawText.length < 50) {
      throw new Error(
        'PDF appears to contain mostly images or is empty.\n\n' +
        'Please try:\n' +
        '1. Taking a screenshot of the PDF\n' +
        '2. Copying and pasting the text directly'
      )
    }

    // Normalize text to preserve table structure
    const normalizedText = normalizeExtractedText(rawText)
    console.log('✅ Text normalized to preserve table structure')

    return normalizedText
  } catch (error) {
    console.error('PDF extraction error:', error)

    if (error instanceof Error) {
      if (error.message.includes('mostly images') || error.message.includes('empty')) {
        throw error
      }
      throw new Error(
        `Could not read PDF: ${error.message}\n\n` +
        'Please try:\n' +
        '• Taking a screenshot of the PDF\n' +
        '• Copying the text directly from the PDF\n' +
        '• Converting to image first'
      )
    }

    throw new Error('Failed to process PDF. Please try a screenshot or paste text directly.')
  }
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Starting OCR extraction...')

    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`📝 OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      }
    })

    const rawText = text.trim()
    console.log(`✅ Extracted ${rawText.length} characters from image`)

    if (rawText.length < 30) {
      throw new Error(
        'Could not extract enough text from the image.\n\n' +
        'Tips:\n' +
        '• Make sure the image is clear and high resolution\n' +
        '• Ensure the text is readable\n' +
        '• Try a screenshot instead of a photo'
      )
    }

    // Normalize text to preserve structure (tables, pricing layouts)
    const normalizedText = normalizeExtractedText(rawText)
    console.log('✅ OCR text normalized to preserve structure')

    return normalizedText
  } catch (error) {
    if (error instanceof Error && error.message.includes('not extract enough')) {
      throw error
    }
    console.error('Image OCR error:', error)
    throw new Error('Failed to read text from image. Please ensure the image is clear and readable.')
  }
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileType = file.type

  console.log(`📎 Processing: ${file.name} (${fileType}, ${Math.round(buffer.length / 1024)}KB)`)

  // PDF extraction
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(buffer)
  }

  // Image extraction (OCR)
  if (fileType.startsWith('image/')) {
    return extractTextFromImage(buffer)
  }

  throw new Error(
    'Unsupported file type.\n\n' +
    'Supported formats:\n' +
    '• PDF documents\n' +
    '• Screenshots (PNG, JPG, WEBP)\n' +
    '• Or paste text directly'
  )
}
