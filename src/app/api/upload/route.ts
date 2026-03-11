import { NextResponse } from 'next/server'
import { extractText } from '@/lib/extract'
import { uploadPDFToStorage, deleteTempPDF } from '@/lib/storage'
import { parsePDFWithLlamaParse } from '@/lib/llamaparse'

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

    // NEW ARCHITECTURE: For PDFs, use LlamaParse for table extraction
    if (file.type === 'application/pdf') {
      try {
        // Step 1: Upload PDF to Supabase Storage
        const fileUrl = await uploadPDFToStorage(buffer, file.name)

        // Step 2: Parse with LlamaParse (preserves tables)
        const parsed = await parsePDFWithLlamaParse(fileUrl)

        // Step 3: Clean up uploaded file (async, don't wait)
        deleteTempPDF(fileUrl).catch(err => console.error('Cleanup error:', err))

        // Step 4: Return parsed markdown with table structure
        return NextResponse.json({
          extractedText: parsed.markdown,
          useStructuredParsing: true,
          source: 'llamaparse',
        })
      } catch (error) {
        console.error('LlamaParse failed, using fallback:', error)

        // Fallback to basic text extraction if LlamaParse fails
        const extractedText = await extractText(file)
        return NextResponse.json({
          extractedText,
          useStructuredParsing: false,
          source: 'fallback',
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
