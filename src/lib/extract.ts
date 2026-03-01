import Tesseract from 'tesseract.js'
import PDFParser from 'pdf2json'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('PDF parse error:', errData.parserError)
      reject(new Error('Failed to read PDF. Please try taking a screenshot of the PDF instead.'))
    })

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from all pages
        let fullText = ''

        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const text of page.Texts) {
                if (text.R) {
                  for (const r of text.R) {
                    if (r.T) {
                      // Decode URI component and add spaces
                      fullText += decodeURIComponent(r.T) + ' '
                    }
                  }
                }
              }
              fullText += '\n'
            }
          }
        }

        const cleanedText = fullText.trim()
        console.log(`Extracted ${cleanedText.length} characters from PDF`)

        if (cleanedText.length < 50) {
          reject(new Error('PDF appears to be empty or contains mostly images. Please try:\n1. Taking a screenshot and pasting it\n2. Copying the text directly from the PDF'))
          return
        }

        resolve(cleanedText)
      } catch (error) {
        console.error('PDF text extraction error:', error)
        reject(new Error('Could not extract text from PDF. Please try a screenshot instead.'))
      }
    })

    // Parse the buffer
    pdfParser.parseBuffer(buffer)
  })
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    console.log('Starting OCR extraction...')
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      }
    })

    const cleanedText = text.trim()
    console.log(`Extracted ${cleanedText.length} characters from image`)

    if (cleanedText.length < 50) {
      throw new Error('Could not extract enough text from image. Please ensure the image is clear and contains readable text.')
    }

    return cleanedText
  } catch (error) {
    if (error instanceof Error && error.message.includes('not extract enough')) {
      throw error
    }
    console.error('Image OCR error:', error)
    throw new Error('Failed to read text from image. Please ensure the image is clear and try again.')
  }
}

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileType = file.type

  console.log(`Processing file: ${file.name} (${fileType}, ${buffer.length} bytes)`)

  // Image extraction (OCR)
  if (fileType.startsWith('image/')) {
    return extractTextFromImage(buffer)
  }

  // PDF extraction
  if (fileType === 'application/pdf') {
    return extractTextFromPDF(buffer)
  }

  throw new Error('Unsupported file type. Please upload a PDF or image (PNG, JPG, WEBP).')
}
