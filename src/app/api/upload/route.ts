import { NextResponse } from 'next/server'
import { extractText } from '@/lib/extract'

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

    // Extract text from file
    const extractedText = await extractText(file)

    // File is NOT stored - we only return the extracted text
    // This ensures no raw files are retained
    return NextResponse.json({ extractedText })
  } catch (error) {
    console.error('Upload error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}
