import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripAdvancedOutput, SHOW_FULL_NEGOTIATION_PLAYBOOK } from '@/lib/negotiation-gating'
import { confirmVendorOffer, type VendorOffer } from '@/lib/vendor-offer'
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

/**
 * Confirm, edit or clear the vendor's offer on a Round 2+ reply.
 *   body: { vendorOffer: { amount, currency } }  → confirmed (provenance derived server-side)
 *   body: { vendorOffer: null }                   → no numeric offer on this round
 * The client never sets provenance: an unchanged extracted figure may reach
 * the ceiling computed at extraction; any edit is user_confirmed.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ roundId: string }> }
) {
  try {
    const { roundId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    if (!('vendorOffer' in body)) return NextResponse.json({ error: 'vendorOffer is required' }, { status: 400 })

    const { data: round } = await supabase
      .from('rounds')
      .select('id, round_number, vendor_offer')
      .eq('id', roundId)
      .eq('user_id', user.id)
      .single()
    if (!round) return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    if (round.round_number < 2) return NextResponse.json({ error: 'Round 1 is the initial quote, not a vendor offer.' }, { status: 400 })

    let next: VendorOffer | null = null
    if (body.vendorOffer !== null) {
      const input = body.vendorOffer && typeof body.vendorOffer === 'object' ? body.vendorOffer : {}
      const r = confirmVendorOffer((round.vendor_offer as VendorOffer | null) ?? null, { amount: input.amount, currency: input.currency })
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 })
      next = r.value
    }

    const { error } = await supabase.from('rounds').update({ vendor_offer: next }).eq('id', roundId).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: 'Failed to save the vendor offer' }, { status: 500 })
    return NextResponse.json({ vendorOffer: next })
  } catch (error) {
    console.error('Round PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
