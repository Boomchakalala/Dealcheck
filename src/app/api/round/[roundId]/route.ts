import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripAdvancedOutput, SHOW_FULL_NEGOTIATION_PLAYBOOK } from '@/lib/negotiation-gating'
import type { DealOutput, DealOutputV2 } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roundId: string }> }
) {
  try {
    const { roundId } = await params
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get round
    const { data: round, error } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .eq('user_id', user.id)
      .single()

    if (error || !round) {
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (round.output_json && !profile?.is_admin && !SHOW_FULL_NEGOTIATION_PLAYBOOK) {
      round.output_json = stripAdvancedOutput(round.output_json as DealOutput | DealOutputV2)
    }

    return NextResponse.json({ round })
  } catch (error) {
    console.error('Get round error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
