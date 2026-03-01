import Tesseract from 'tesseract.js'

// Set up canvas for Node.js environment
if (typeof window === 'undefined') {
  try {
    const { Canvas } = require('canvas')
    global.DOMMatrix = class DOMMatrix {
      constructor() {
        this.a = 1
        this.b = 0
        this.c = 0
        this.d = 1
        this.e = 0
        this.f = 0
      }
    } as any
  } catch (e) {
    console.warn('Canvas not available, PDF parsing may fail')
  }
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('📄 Starting PDF extraction...')

    // Dynamic import to avoid module resolution issues
    const pdfParse = require('pdf-parse')

    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
    })

    const text = data.text.trim()
    console.log(`✅ Extracted ${text.length} characters from PDF (${data.numpages} pages)`)

    if (text.length < 50) {
      throw new Error(
        'PDF appears to contain mostly images or is empty.\n\n' +
        'Please try:\n' +
        '1. Taking a screenshot of the PDF\n' +
        '2. Copying and pasting the text directly'
      )
    }

    return text
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

    const cleanedText = text.trim()
    console.log(`✅ Extracted ${cleanedText.length} characters from image`)

    if (cleanedText.length < 30) {
      throw new Error(
        'Could not extract enough text from the image.\n\n' +
        'Tips:\n' +
        '• Make sure the image is clear and high resolution\n' +
        '• Ensure the text is readable\n' +
        '• Try a screenshot instead of a photo'
      )
    }

    return cleanedText
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
