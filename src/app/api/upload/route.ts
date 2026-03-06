import { NextResponse } from 'next/server'
import { extractText } from '@/lib/extract'

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

    // For images, return as base64 to use OpenAI vision API
    if (file.type.startsWith('image/')) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = buffer.toString('base64')

      return NextResponse.json({
        useVision: true,
        imageData: {
          base64,
          mimeType: file.type,
        },
      })
    }

    // For PDFs, still extract text (PDFs aren't well supported by vision API yet)
    const extractedText = await extractText(file)

    // File is NOT stored - we only return the extracted text
    // This ensures no raw files are retained
    return NextResponse.json({ extractedText, useVision: false })
  } catch (error) {
    console.error('Upload error:', error)
    // Log full error for debugging, but don't expose to client
    return NextResponse.json({
      error: 'Failed to process file. Please try a different file or contact support.'
    }, { status: 500 })
  }
}
