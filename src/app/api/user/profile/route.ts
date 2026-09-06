import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName } = await request.json()

    // profiles has one name column, contact_name (no first_name/last_name — verified
    // against information_schema). The form keeps two fields; we store them joined.
    const contactName = [firstName, lastName].map((s: unknown) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean).join(' ') || null

    const { error } = await supabase
      .from('profiles')
      .update({ contact_name: contactName })
      .eq('id', user.id)

    if (error) {
      console.error('[TermLift] profile update failed:', error.message)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
