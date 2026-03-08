import { NextResponse } from 'next/server'
import { analyzeDeal } from '@/lib/openai'

// Guest trial - no auth required, uses V1 schema (full text analysis)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { extractedText, dealType, goal, notes, imageData } = body

    // TODO: Add IP-based rate limiting for trial route (currently unlimited for testing)

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json(
        { error: 'Please provide text to analyze' },
        { status: 400 }
      )
    }

    // Analyze with V1 (full text analysis - catches everything)
    const output = await analyzeDeal(
      extractedText,
      dealType || 'New',
      goal,
      notes,
      undefined,
      imageData
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
