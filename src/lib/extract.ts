import Tesseract from 'tesseract.js'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // PDF libraries in serverless environments are problematic due to canvas/DOMMatrix dependencies
  // Guide users to better alternatives
  throw new Error(
    '📄 PDF upload isn\'t supported yet.\n\n' +
    '✅ Instead, please:\n' +
    '1. Take a screenshot of your PDF (Shift+Cmd+4 on Mac, Win+Shift+S on Windows)\n' +
    '2. Paste it here with Cmd/Ctrl+V\n' +
    '3. Or copy and paste the text directly\n\n' +
    'Screenshot paste works just like ChatGPT!'
  )
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
        '• Try a screenshot instead of a photo\n' +
        '• Or paste the text directly'
      )
    }

    return cleanedText
  } catch (error) {
    if (error instanceof Error && error.message.includes('not extract enough')) {
      throw error
    }
    console.error('Image OCR error:', error)
    throw new Error(
      'Failed to read text from image.\n\n' +
      'Please ensure:\n' +
      '• The image is clear and readable\n' +
      '• Text is in English\n' +
      '• The file isn\'t corrupted'
    )
  }
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileType = file.type

  console.log(`📎 Processing: ${file.name} (${fileType}, ${Math.round(buffer.length / 1024)}KB)`)

  // Image extraction (OCR) - RECOMMENDED METHOD
  if (fileType.startsWith('image/')) {
    return extractTextFromImage(buffer)
  }

  // PDF - guide to screenshot instead
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(buffer)
  }

  throw new Error(
    'Unsupported file type.\n\n' +
    'Supported formats:\n' +
    '• Screenshots (PNG, JPG, WEBP) - paste with Cmd/Ctrl+V\n' +
    '• Or paste text directly'
  )
}
