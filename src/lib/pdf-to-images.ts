/**
 * Convert PDF pages to base64 PNG images using pdfjs-dist + canvas.
 * Falls back to text extraction if rendering fails.
 */

export async function pdfToImages(pdfBuffer: Buffer, maxPages: number = 10): Promise<Array<{ base64: string; mimeType: string }>> {
  try {
    // @ts-ignore - Canvas is optional for production
    const canvas = require('canvas')
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs')

    // Create a canvas factory for pdfjs
    const canvasFactory = {
      create(width: number, height: number) {
        const c = canvas.createCanvas(width, height)
        return { canvas: c, context: c.getContext('2d') }
      },
      reset(pair: any, width: number, height: number) {
        pair.canvas.width = width
        pair.canvas.height = height
      },
      destroy(pair: any) {
        pair.canvas.width = 0
        pair.canvas.height = 0
      },
    }

    const data = new Uint8Array(pdfBuffer)
    const doc = await pdfjsLib.getDocument({
      data,
      canvasFactory,
      useSystemFonts: true,
    }).promise

    const numPages = Math.min(doc.numPages, maxPages)
    const images: Array<{ base64: string; mimeType: string }> = []

    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i)

      // Render at 2x scale for readability (150 DPI equivalent)
      const scale = 2.0
      const viewport = page.getViewport({ scale })

      const { canvas: pageCanvas, context } = canvasFactory.create(
        Math.floor(viewport.width),
        Math.floor(viewport.height)
      )

      await page.render({
        canvasContext: context,
        viewport,
      }).promise

      // Convert to PNG base64
      const pngBuffer = pageCanvas.toBuffer('image/png')
      const base64 = pngBuffer.toString('base64')

      images.push({
        base64,
        mimeType: 'image/png',
      })

      canvasFactory.destroy({ canvas: pageCanvas })
    }

    return images
  } catch (error) {
    console.warn('PDF-to-image conversion failed, will fall back to text extraction:', error)
    throw error
  }
}
