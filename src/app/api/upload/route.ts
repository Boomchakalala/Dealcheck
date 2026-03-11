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

    // For images and PDFs, use vision API to preserve layout and tables
    // Vision API can "see" the document structure like a human
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    return NextResponse.json({
      useVision: true,
      imageData: {
        base64,
        mimeType: file.type,
      },
      // Also provide extracted text as fallback for PDFs
      extractedText: file.type === 'application/pdf' ? await extractText(file).catch(() => '') : undefined,
    })
  } catch (error) {
    console.error('Upload error:', error)
    // Log full error for debugging, but don't expose to client
    return NextResponse.json({
      error: 'Failed to process file. Please try a different file or contact support.'
    }, { status: 500 })
  }
}
