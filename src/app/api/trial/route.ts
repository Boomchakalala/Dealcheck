import { NextResponse } from 'next/server'
import { analyzeDeal } from '@/lib/openai'
import { DealOutputSchema } from '@/lib/schemas'

// Guest trial - no auth required, one free try
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { extractedText, dealType, goal, notes, previousOutput } = body

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json(
        { error: 'Please provide text to analyze' },
        { status: 400 }
      )
    }

    // Analyze the deal with AI (no storage, no user)
    const output = await analyzeDeal(
      extractedText,
      dealType || 'New',
      goal,
      notes,
      previousOutput // Pass previous round output for context
    )

    // Validate output
    const validated = DealOutputSchema.parse(output)

    return NextResponse.json({
      success: true,
      output: validated,
      message: 'Sign up to save your analysis and track negotiation rounds!'
    })
  } catch (error) {
    console.error('Trial analysis error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
