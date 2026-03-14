import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { locale } = await request.json()

    if (locale !== 'en' && locale !== 'fr') {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ locale })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update locale:', updateError)
      return NextResponse.json({ error: 'Failed to update locale' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Locale update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
