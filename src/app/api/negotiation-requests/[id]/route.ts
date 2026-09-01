import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { notifyUser } from '@/lib/notifications'
import { detectCurrency, formatCurrency } from '@/lib/currency'

const VALID_STATUSES = [
  'new', 'reviewing', 'waiting_for_client_info', 'ready_to_negotiate',
  'negotiating', 'offer_received', 'closed_won', 'closed_lost',
]

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, finalTotal, savingsAmount, savingsPercent, closeNotes, adminNotes, nextAction } = body

    if (status !== undefined && (typeof status !== 'string' || !VALID_STATUSES.includes(status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (status === undefined && adminNotes === undefined && nextAction === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const isClosing = status === 'closed_won' || status === 'closed_lost'
    const update: Record<string, unknown> = {}
    if (status !== undefined) update.status = status
    if (isClosing) {
      update.closed_at = new Date().toISOString()
      if (typeof finalTotal === 'number') update.final_total = finalTotal
      if (typeof savingsAmount === 'number') update.savings_amount = savingsAmount
      if (typeof savingsPercent === 'number') update.savings_percent = savingsPercent
      if (typeof closeNotes === 'string') update.close_notes = closeNotes
    }
    if (typeof adminNotes === 'string') update.admin_notes = adminNotes
    if (typeof nextAction === 'string') update.next_action = nextAction

    const { data: updated, error } = await supabase
      .from('negotiation_requests')
      .update(update)
      .eq('id', id)
      .select('deal_id, user_id, vendor, current_total')
      .single()

    if (error) {
      console.error('Update negotiation request error:', error)
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }

    // Mirror the outcome onto the linked deal, if any, so the client's
    // existing dashboard/deal page reflect it via the mechanism they already have.
    // Uses the admin client — the admin isn't the deal's owner, so the deal's own
    // RLS policy (auth.uid() = user_id) would otherwise silently block this write.
    if (isClosing && updated?.deal_id) {
      const adminClient = createAdminClient()
      await adminClient
        .from('deals')
        .update({
          status,
          closed_at: update.closed_at,
          ...(typeof finalTotal === 'number' ? { final_total: finalTotal } : {}),
          ...(typeof savingsAmount === 'number' ? { savings_amount: savingsAmount } : {}),
          ...(typeof savingsPercent === 'number' ? { savings_percent: savingsPercent } : {}),
          ...(typeof closeNotes === 'string' ? { close_notes: closeNotes } : {}),
        })
        .eq('id', updated.deal_id)
    }

    // Meaningful-transitions-only: notify the client when they need to act,
    // or when the case is done. Skip the in-between admin-workflow states.
    if (updated?.user_id) {
      const vendorName = updated.vendor || 'your vendor'
      if (status === 'waiting_for_client_info') {
        await notifyUser(updated.user_id, {
          type: 'negotiation_waiting_on_client',
          title: 'We need more info from you',
          body: `Your ${vendorName} negotiation needs a bit more from you before it can move forward.`,
          link: `/app/negotiations/${id}`,
        })
      } else if (isClosing) {
        const won = status === 'closed_won'
        const savingsAmt = typeof savingsAmount === 'number' ? savingsAmount : null
        await notifyUser(updated.user_id, {
          type: 'negotiation_closed',
          title: won ? 'Negotiation closed — savings recorded' : 'Negotiation closed',
          body: won && savingsAmt
            ? `You saved ${formatCurrency(savingsAmt, detectCurrency(updated.current_total || ''))} on ${vendorName}.`
            : `Your ${vendorName} negotiation has closed.`,
          link: `/app/negotiations/${id}`,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Negotiation request PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
