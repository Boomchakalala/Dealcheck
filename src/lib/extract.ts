import Tesseract from 'tesseract.js'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import of pdf-parse to handle ESM issues
    const pdf = (await import('pdf-parse')).default
    const data = await pdf(buffer)
    const text = data.text.trim()

    if (text.length < 50) {
      throw new Error('PDF extraction yielded insufficient text. Please try uploading a screenshot or pasting the text manually.')
    }

    return text
  } catch (error) {
    console.error('PDF extraction error:', error)
    if (error instanceof Error && error.message.includes('insufficient')) {
      throw error
    }
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {}, // Suppress logs
    })

    const cleanedText = text.trim()

    if (cleanedText.length < 50) {
      throw new Error('OCR extraction yielded insufficient text. Please try a clearer image or paste the text manually.')
    }

    return cleanedText
  } catch (error) {
    if (error instanceof Error && error.message.includes('insufficient')) {
      throw error
    }
    throw new Error('Failed to extract text from image. Please try a clearer image or paste the text manually.')
  }
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const fileType = file.type

  // PDF extraction
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(buffer)
  }

  // Image extraction (OCR)
  if (fileType.startsWith('image/')) {
    return extractTextFromImage(buffer)
  }

  throw new Error('Unsupported file type. Please upload a PDF or image file.')
}
