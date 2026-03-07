import { NextResponse } from 'next/server'
import { analyzeDealV2 } from '@/lib/openai'
import { extractAndNormalize } from '@/lib/extract-normalize'
import { DealOutputSchemaV2 } from '@/lib/schemas'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// Guest trial - no auth required, rate limited per IP - Uses V2 schema
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { extractedText, dealType, goal, notes, previousOutput, isDemoText } = body

    // Skip rate limiting for demo text (users can try demo multiple times)
    if (!isDemoText) {
      // Rate limit by IP for real analyses only
      const headersList = await headers()
      const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const rl = rateLimit(`trial:${ip}`, RATE_LIMITS.trial)
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Trial limit reached. Sign up for more analyses.' },
          { status: 429 }
        )
      }
    }

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json(
        { error: 'Please provide text to analyze' },
        { status: 400 }
      )
    }

    // STEP 1: Extract & normalize
    const extracted = await extractAndNormalize(extractedText)

    // STEP 2: Analyze with V2 (uses structured extraction)
    const output = await analyzeDealV2(
      extracted,
      dealType || 'New',
      {
        goal,
        notes,
        previousAnalysis: previousOutput, // Pass previous round output for context
      }
    )

    // Validate output
    const validated = DealOutputSchemaV2.parse(output)

    return NextResponse.json({
      success: true,
      output: validated,
      extraction: {
        confidence: extracted.confidence,
        unclear_fields: extracted.unclear_fields,
      },
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
