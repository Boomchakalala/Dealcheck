import { NextResponse } from 'next/server'
import { extractText } from '@/lib/extract'
import { extractStructuredQuote } from '@/lib/extract-structured'

// CRITICAL: pdf-parse requires Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDFs and images (PNG, JPG, WEBP) are supported.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // NEW PIPELINE: For PDFs, convert to images and extract structured data
    if (file.type === 'application/pdf') {
      try {
        const structuredQuote = await extractStructuredQuote(buffer)

        return NextResponse.json({
          useStructuredExtraction: true,
          structuredQuote,
          // Fallback text extraction in case vision fails
          extractedText: await extractText(file).catch(() => ''),
        })
      } catch (error) {
        console.error('Structured extraction failed, falling back to text:', error)
        // Fallback to old text extraction if vision fails
        const extractedText = await extractText(file)
        return NextResponse.json({
          useStructuredExtraction: false,
          extractedText,
        })
      }
    }

    // For images, send directly to vision API
    const base64 = buffer.toString('base64')
    return NextResponse.json({
      useVision: true,
      imageData: {
        base64,
        mimeType: file.type,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: 'Failed to process file. Please try a different file or contact support.'
    }, { status: 500 })
  }
}
