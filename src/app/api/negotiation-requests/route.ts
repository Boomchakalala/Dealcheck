import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NegotiationRequestSchema } from '@/lib/schemas'
import { notifyAdmins } from '@/lib/notifications'

// CRITICAL: file upload handling requires Node.js runtime
export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB, matches /api/upload
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const payloadRaw = formData.get('payload')
    if (typeof payloadRaw !== 'string') {
      return NextResponse.json({ error: 'Missing payload' }, { status: 400 })
    }

    const parsed = NegotiationRequestSchema.safeParse(JSON.parse(payloadRaw))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }
    const input = parsed.data

    // A request may only reference the caller's own deal/round — the admin close
    // flow later mirrors the outcome onto deal_id with the service-role client,
    // so an unverified id here would let one user write onto another's deal.
    if (input.dealId) {
      const { data: ownDeal } = await supabase
        .from('deals').select('id').eq('id', input.dealId).eq('user_id', user.id).single()
      if (!ownDeal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
      }
    }
    if (input.roundId) {
      const { data: ownRound } = await supabase
        .from('rounds').select('id').eq('id', input.roundId).eq('user_id', user.id).single()
      if (!ownRound) {
        return NextResponse.json({ error: 'Round not found' }, { status: 404 })
      }
    }

    const file = formData.get('document') as File | null
    let documentPath: string | null = null
    let documentConsentAt: string | null = null

    if (file && file.size > 0) {
      if (!input.documentConsent) {
        return NextResponse.json({ error: 'Document consent is required to upload a file' }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Only PDFs and images (PNG, JPG, WEBP) are supported.' }, { status: 400 })
      }

      const safeName = file.name.replace(/[^\w.\-]+/g, '_').replace(/^[._]+/, '').slice(-100) || 'document'
      const path = `${user.id}/${crypto.randomUUID()}/${safeName}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const { error: uploadError } = await supabase.storage
        .from('negotiation-documents')
        .upload(path, buffer, { contentType: file.type })

      if (uploadError) {
        console.error('Negotiation document upload error:', uploadError)
        return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
      }

      documentPath = path
      documentConsentAt = new Date().toISOString()
    }

    const { data: negotiationRequest, error: insertError } = await supabase
      .from('negotiation_requests')
      .insert({
        user_id: user.id,
        deal_id: input.dealId || null,
        round_id: input.roundId || null,
        source: input.source,
        vendor: input.vendor || null,
        category: input.category || null,
        renewal_date: input.renewalDate || null,
        current_total: input.currentTotal || null,
        seat_or_usage_notes: input.seatOrUsageNotes || null,
        contact_name: input.contactName || null,
        contact_phone: input.contactPhone || null,
        vendor_contact_name: input.vendorContactName || null,
        vendor_contact_email: input.vendorContactEmail || null,
        notes: input.notes || null,
        document_path: documentPath,
        document_consent_at: documentConsentAt,
        deal_type: input.dealType || null,
        deal_type_confidence: input.dealTypeConfidence || null,
        negotiation_objective: input.negotiationObjective || null,
        walk_away_notes: input.walkAwayNotes || null,
        competitor_context: input.competitorContext || null,
        analysis_context: input.analysisContext || null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Create negotiation request error:', insertError)
      return NextResponse.json({ error: 'Failed to submit negotiation request' }, { status: 500 })
    }

    await notifyAdmins({
      type: 'negotiation_new_request',
      title: 'New negotiation request',
      body: `${input.vendor || 'A vendor'} · ${user.email || 'a client'}`,
      link: `/app/admin/negotiations/${negotiationRequest.id}`,
    })

    return NextResponse.json({ negotiationRequestId: negotiationRequest.id })
  } catch (error) {
    console.error('Negotiation request error:', error)
    return NextResponse.json({ error: 'Failed to submit negotiation request. Please try again or contact support.' }, { status: 500 })
  }
}
