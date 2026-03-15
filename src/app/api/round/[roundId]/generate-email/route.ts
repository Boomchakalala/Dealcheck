import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { generateEmailV2 } from '@/lib/claude'
import type { DealOutputV2, EmailControls } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roundId } = await params
    const body = await request.json()

    // Validate email controls
    const emailControls: EmailControls = {
      tone_preference: body.tone_preference || 'balanced',
      supplier_relationship: body.supplier_relationship || 'unknown',
      email_goal: body.email_goal || 'negotiate',
      user_notes: body.user_notes || '',
    }

    // Fetch the round
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .eq('user_id', user.id)
      .single()

    if (roundError || !round) {
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    // Check schema version
    if (round.schema_version !== 'v2') {
      return NextResponse.json(
        { error: 'Email generation is only available for V2 analysis. Please create a new analysis.' },
        { status: 400 }
      )
    }

    const output = round.output_json as DealOutputV2

    // Determine locale from cookie
    const locale = (await cookies()).get('termlift_lang')?.value || 'en'

    // Generate email using V2 function
    const generatedEmail = await generateEmailV2(output, emailControls, locale)

    return NextResponse.json(generatedEmail)
  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    )
  }
}
