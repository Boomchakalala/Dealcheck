import { NextResponse } from 'next/server'
import { analyzeDeal } from '@/lib/openai'

// Guest trial - no auth required, uses V1 schema (full text analysis)
// Simple IP-based rate limiting: 5 requests per IP per day
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
    return { allowed: true, remaining: 4 }
  }

  // Check limit (5 per day for trial)
  if (cached.count >= 5) {
    return { allowed: false, remaining: 0 }
  }

  cached.count++
  return { allowed: true, remaining: 5 - cached.count }
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
    const { extractedText, dealType, goal, notes, imageData, structuredQuote } = body

    // IP-based rate limiting for trial route
    const clientIP = getClientIP(request)
    const rateLimit = checkTrialRateLimit(clientIP)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trial limit reached. Sign up for free to continue analyzing deals!' },
        { status: 429 }
      )
    }

    if (!extractedText || extractedText.length < 10) {
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

    // Analyze with V1 (full text analysis - catches everything)
    const output = await analyzeDeal(
      extractedText,
      dealType || 'New',
      goal,
      notes,
      undefined,
      validImageData
    )

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
