import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all deals for the user
    const { data: deals, error } = await supabase
      .from('deals')
      .select(`
        *,
        rounds (
          id,
          round_number,
          created_at,
          status
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ deals: deals || [] })
  } catch (error) {
    console.error('Get deals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
