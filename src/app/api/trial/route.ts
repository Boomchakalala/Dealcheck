import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { analyzeDeal } from '@/lib/claude'

// Allow up to 120s for classification + analysis with retries (Vercel Pro plan)
export const maxDuration = 120

/** Retry a function with exponential backoff on transient failures */
async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 1000 } = {}
): Promise<T> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const msg = lastError.message.toLowerCase()
      const isTransient = msg.includes('overloaded') || msg.includes('529')
        || msg.includes('rate') || msg.includes('timeout')
        || msg.includes('econnreset') || msg.includes('socket')
        || msg.includes('503') || msg.includes('500')
        || msg.includes('ai_overloaded') || msg.includes('ai_analysis_error')
        || msg.includes('ai_parse_error') || msg.includes('ai_validation_error')
      if (!isTransient || attempt === maxAttempts) throw lastError
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      console.warn(`[TermLift] Trial attempt ${attempt}/${maxAttempts} failed (${lastError.message}), retrying in ${delay}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw lastError
}

// Guest trial - no auth required, uses V1 schema (full text analysis)
// 1 free analysis per IP without signup — then prompt to create account
const trialCache = new Map<string, { count: number; resetAt: number }>()

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkTrialRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const cached = trialCache.get(ip)

  // Reset daily (24 hours)
  if (!cached || now > cached.resetAt) {
    trialCache.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 })
    return { allowed: true, remaining: 0 }
  }

  // Check limit (1 per IP for anonymous trial — sign up for more)
  if (cached.count >= 1) {
    return { allowed: false, remaining: 0 }
  }

  cached.count++
  return { allowed: true, remaining: 1 - cached.count }
}

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Trial route: ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'Analysis failed. Please try again or contact support.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { extractedText, dealType, goal, notes, imageData, allPages, pdfData, structuredQuote, locale } = body

    // IP-based rate limiting for trial route
    const clientIP = getClientIP(request)
    const rateLimit = checkTrialRateLimit(clientIP)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'You\'ve used your free trial analysis. Sign up to unlock 3 more free analyses!' },
        { status: 429 }
      )
    }

    // Allow empty text when images or PDFs are provided
    const hasVisualInput = imageData?.base64 || (allPages && allPages.length > 0) || pdfData?.base64
    if (!hasVisualInput && (!extractedText || extractedText.length < 10)) {
      return NextResponse.json(
        { error: 'Please provide text to analyze' },
        { status: 400 }
      )
    }

    // Only pass imageData if it has required fields and a supported type (Anthropic accepts jpeg/png/gif/webp only)
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const validImageData =
      imageData?.base64 && imageData?.mimeType && supportedImageTypes.includes(imageData.mimeType)
        ? { base64: imageData.base64, mimeType: imageData.mimeType }
        : undefined

    // Validate all page images
    const validAllPages = allPages?.filter((p: any) =>
      p.base64 && p.mimeType && supportedImageTypes.includes(p.mimeType)
    ) || undefined

    // Validate PDF data
    const validPdfData = pdfData?.base64 && pdfData?.mimeType === 'application/pdf'
      ? { base64: pdfData.base64, mimeType: pdfData.mimeType }
      : undefined

    // Determine locale from cookie or request body
    const resolvedLocale = (await cookies()).get('termlift_lang')?.value || locale || 'en'

    // Analyze with V1 (full text analysis — auto-retry on transient failures)
    const output = await withRetry(() => analyzeDeal(
      extractedText || '',
      dealType || 'New',
      goal,
      notes,
      undefined,
      validImageData,
      validAllPages && validAllPages.length > 0 ? validAllPages : undefined,
      resolvedLocale,
      validPdfData
    ))

    return NextResponse.json({
      success: true,
      output,
      message: 'Sign up to save your analysis and track negotiation rounds!'
    })
  } catch (error) {
    console.error('Trial analysis error:', error)
    // CRITICAL: Never send raw error.message to client - may contain sensitive data
    return NextResponse.json({
      error: 'Analysis failed. Please try again or contact support.'
    }, { status: 500 })
  }
}
