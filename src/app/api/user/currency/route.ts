import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { baseCurrency } = await request.json()

    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    if (!validCurrencies.includes(baseCurrency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ base_currency: baseCurrency })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update currency:', updateError)
      return NextResponse.json({ error: 'Failed to update currency' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Currency update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
