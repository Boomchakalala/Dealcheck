import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { notifyUser } from '@/lib/notifications'
import { detectCurrency, formatCurrency } from '@/lib/currency'
import { deriveCloseOutcome } from '@/lib/close-outcome'
import { documentDeleteAt } from '@/lib/retention'
import { buildVerificationRecord, sha256Hex, type DocumentEvidenceInput, type VerificationRecord } from '@/lib/verification'

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
    const { status, finalTotal, documentVerified, closeNotes, adminNotes, nextAction } = body

    if (status !== undefined && (typeof status !== 'string' || !VALID_STATUSES.includes(status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (status === undefined && adminNotes === undefined && nextAction === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const isClosing = status === 'closed_won' || status === 'closed_lost'
    const update: Record<string, unknown> = {}
    if (status !== undefined) update.status = status

    // Same arithmetic as the self-service close: savings derive from the
    // request's quoted total and the final total the admin entered. A savings
    // figure in the body is ignored. The admin acts as the confirming person;
    // `documentVerified: true` means the figure was read off the signed contract.
    let outcome: ReturnType<typeof deriveCloseOutcome> | null = null
    let verification: VerificationRecord | null = null
    if (isClosing) {
      const { data: current } = await supabase.from('negotiation_requests')
        .select('current_total, document_path, document_consent_at, document_delete_at, created_at')
        .eq('id', id).single()
      outcome = deriveCloseOutcome({
        outcome: status === 'closed_won' ? 'won' : 'lost',
        initialTotalRaw: current?.current_total ?? null,
        finalTotalRaw: typeof finalTotal === 'number' || typeof finalTotal === 'string' ? finalTotal : null,
        finalTotalConfirmed: true,
        finalTotalEvidence: documentVerified === true ? 'document' : 'manual',
      })
      if (!outcome.ok) return NextResponse.json({ error: outcome.error }, { status: 400 })
      const closedAt = new Date()
      update.closed_at = closedAt.toISOString()
      update.final_total = outcome.value.finalTotal
      update.savings_amount = outcome.value.savingsAmount
      update.savings_percent = outcome.value.savingsPercent
      if (typeof closeNotes === 'string') update.close_notes = closeNotes

      // The stored document now has 30 days left (or less, if the 12-month cap
      // from upload comes first). Fingerprint it before it goes so a
      // document_verified outcome keeps its evidence after deletion.
      if (current?.document_path) {
        const uploadedAt = current.document_consent_at || current.created_at
        const deadline = documentDeleteAt(uploadedAt, closedAt)
        const existing = current.document_delete_at ? new Date(current.document_delete_at) : null
        update.document_delete_at = (existing && existing < deadline ? existing : deadline).toISOString()
      }
      let evidence: DocumentEvidenceInput | null = null
      if (documentVerified === true && current?.document_path) {
        try {
          const { data: blob } = await createAdminClient().storage.from('negotiation-documents').download(current.document_path)
          if (blob) {
            const bytes = new Uint8Array(await blob.arrayBuffer())
            evidence = { sha256: await sha256Hex(bytes), type: blob.type || null, sizeBytes: bytes.byteLength }
          }
        } catch (e) {
          console.warn('[negotiation close] could not fingerprint document (non-fatal):', e instanceof Error ? e.message : e)
        }
      }
      verification = buildVerificationRecord({
        tier: outcome.value.provenance,
        method: documentVerified === true ? 'admin_document' : 'user_entry',
        confirmedTotal: outcome.value.finalTotal,
        currency: current?.current_total ? detectCurrency(current.current_total) : null,
        evidence,
        now: closedAt,
      })
      update.verification = verification
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
    if (isClosing && updated?.deal_id && outcome?.ok) {
      const adminClient = createAdminClient()
      // Closed: the raw quote text on the deal's rounds has no reader left.
      await adminClient.from('rounds')
        .update({ extracted_text: null, extracted_text_purged_at: update.closed_at as string })
        .eq('deal_id', updated.deal_id)
        .not('extracted_text', 'is', null)
      await adminClient
        .from('deals')
        .update({
          status,
          closed_at: update.closed_at,
          initial_total: outcome.value.initialTotal,
          final_total: outcome.value.finalTotal,
          final_total_provenance: outcome.value.provenance,
          verification,
          savings_amount: outcome.value.savingsAmount,
          savings_percent: outcome.value.savingsPercent,
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
        const savingsAmt = outcome?.ok ? outcome.value.savingsAmount : null
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
