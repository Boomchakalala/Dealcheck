import { createClient } from '@/lib/supabase/server'

/**
 * Upload PDF to Supabase Storage for temporary processing
 * @param fileBuffer - PDF file buffer
 * @param fileName - Original filename
 * @returns Public URL to the uploaded file
 */
export async function uploadPDFToStorage(fileBuffer: Buffer, fileName: string): Promise<string> {
  const supabase = await createClient()

  // Create unique filename to avoid collisions
  const timestamp = Date.now()
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storagePath = `temp-pdfs/${timestamp}-${sanitizedName}`

  try {
    console.log(`📤 Uploading PDF to Supabase Storage: ${storagePath}`)

    // Upload to 'quote-uploads' bucket (create this bucket in Supabase)
    const { data, error } = await supabase.storage
      .from('quote-uploads')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600', // Cache for 1 hour
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error('Failed to upload PDF to storage')
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('quote-uploads')
      .getPublicUrl(storagePath)

    console.log(`✅ PDF uploaded successfully: ${urlData.publicUrl}`)

    return urlData.publicUrl
  } catch (error) {
    console.error('PDF upload error:', error)
    throw new Error('Failed to upload PDF for processing')
  }
}

/**
 * Delete temporary PDF after processing
 * @param fileUrl - Public URL of the file to delete
 */
export async function deleteTempPDF(fileUrl: string): Promise<void> {
  try {
    const supabase = await createClient()

    // Extract path from URL
    const urlParts = fileUrl.split('/quote-uploads/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    await supabase.storage
      .from('quote-uploads')
      .remove([filePath])

    console.log(`🗑️  Deleted temp PDF: ${filePath}`)
  } catch (error) {
    console.error('Failed to delete temp PDF:', error)
    // Don't throw - cleanup is best effort
  }
}
