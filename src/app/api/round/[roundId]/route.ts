import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    return NextResponse.json({ round })
  } catch (error) {
    console.error('Get round error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
