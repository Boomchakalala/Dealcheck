import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin, ObservationSchema, toObservationRow, badRequest } from '@/lib/benchmark/admin'
import { loadProducts } from '@/lib/benchmark/service'
import { vendorKey } from '@/lib/benchmark/normalize'
import { mapClosedDealToObservation, capVerification } from '@/lib/benchmark/outcome-mapper'
import { verificationForProvenance, type OutcomeProvenance } from '@/lib/close-outcome'
import type { StructuredExtraction } from '@/lib/structured-extraction'
import type { BenchmarkInput, VerificationLevel } from '@/lib/benchmark/types'

/**
 * Closed deal → benchmark observation, admin only, explicit.
 *
 *   GET  ?dealId=   preview the candidate the deterministic mapper builds — nothing is written
 *   POST            write ONE observation from an admin-reviewed candidate
 *
 * The response never carries the deal owner, the deal's notes, its summary or
 * any document reference: only the structured facts the mapper produces.
 */

const DEAL_COLUMNS = 'id, vendor, deal_type, status, closed_at, initial_total, final_total, final_total_provenance, what_changed'

async function loadFacts(dealId: string) {
  const admin = createAdminClient()
  const { data: deal } = await admin.from('deals').select(DEAL_COLUMNS).eq('id', dealId).single()
  if (!deal) return null
  const { data: round } = await admin.from('rounds').select('output_json, extracted_data').eq('deal_id', dealId).order('round_number', { ascending: false }).limit(1).maybeSingle()
  const output = (round?.output_json || {}) as { snapshot?: { currency?: string; total_commitment?: string }; benchmark_input?: BenchmarkInput | null; quote_facts?: unknown }
  const extraction = (round?.extracted_data as StructuredExtraction | null) ?? null
  const currency = extraction?.total_commitment.currency || output.snapshot?.currency || null
  const products = deal.vendor ? await loadProducts(vendorKey(deal.vendor)) : []
  const provenance = (deal.final_total_provenance as OutcomeProvenance | null) ?? null
  const mapping = mapClosedDealToObservation(
    {
      vendor: deal.vendor, dealType: deal.deal_type, closedAt: deal.closed_at,
      initialTotal: deal.initial_total != null ? Number(deal.initial_total) : null,
      finalTotal: deal.final_total != null ? Number(deal.final_total) : null,
      provenance, whatChanged: deal.what_changed, currency,
    },
    extraction,
    output.benchmark_input ?? null,
    products,
  )
  // Analysed before validated quote facts existed (2026-09-08): the stored total was never
  // cross-checked against printed line totals, so it must be verified by hand before ingestion.
  const historical = !output.quote_facts
  return { status: deal.status as string, provenance, mapping, extractionPresent: !!extraction, benchmarkInputPresent: !!output.benchmark_input, historical }
}

export async function GET(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const dealId = new URL(request.url).searchParams.get('dealId')
  if (!dealId || !/^[0-9a-f-]{36}$/i.test(dealId)) return NextResponse.json({ error: 'dealId required' }, { status: 400 })
  const facts = await loadFacts(dealId)
  if (!facts) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
  if (facts.status !== 'closed_won') return NextResponse.json({ error: 'Only deals closed as won can become observations' }, { status: 409 })
  const { mapping, provenance, extractionPresent, benchmarkInputPresent, historical } = facts
  return NextResponse.json({ mapping, provenance: provenance ?? 'inferred', maxVerification: verificationForProvenance(provenance).level, extractionPresent, benchmarkInputPresent, historical })
}

/**
 * The admin-edited candidate. Server-owned fields (source, verification,
 * confidence, notes, is_test) are stripped here and set below, then the full
 * row is validated by ObservationSchema — so the form can never smuggle them.
 */
const RecordSchema = z.object({
  dealId: z.string().uuid(),
  observation: z.record(z.string(), z.unknown()).transform((o) => {
    const { source_id: _s, notes: _n, is_test: _t, verification_level: _v, confidence: _c, ...rest } = o
    void _s; void _n; void _t; void _v; void _c
    return rest
  }),
  verification_level: z.enum(['unverified', 'plausible', 'verified']),
  levers: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
})

/** One shared source row per verification tier — never one per deal, so a source can't identify a customer. */
async function sourceForTier(admin: ReturnType<typeof createAdminClient>, level: VerificationLevel, userId: string): Promise<string> {
  const name = `TermLift negotiation outcomes (${level})`
  const { data: existing } = await admin.from('benchmark_sources').select('id').eq('name', name).eq('is_test', false).maybeSingle()
  if (existing?.id) return existing.id
  const { data: created, error } = await admin.from('benchmark_sources').insert({
    name, source_type: 'termlift_negotiation', verification_level: level, is_test: false, created_by: userId,
    notes: 'Anonymised outcomes of negotiations run through TermLift. One row per closed deal, reviewed by an admin before insertion. No customer identity is stored.',
  }).select('id').single()
  if (error || !created) throw new Error(`Could not create source: ${error?.message}`)
  return created.id
}

export async function POST(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  try {
    const body = RecordSchema.parse(await request.json())
    const facts = await loadFacts(body.dealId)
    if (!facts) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    if (facts.status !== 'closed_won') return NextResponse.json({ error: 'Only deals closed as won can become observations' }, { status: 409 })

    // Provenance is the ceiling. An inferred outcome cannot be saved as verified, whatever the form says.
    const level = capVerification(body.verification_level, facts.provenance)
    const confidence = verificationForProvenance(facts.provenance).confidence
    const admin = createAdminClient()
    const source_id = await sourceForTier(admin, level, gate.user.id)

    const payload = ObservationSchema.parse({
      ...body.observation,
      source_id,
      verification_level: level,
      confidence,
      notes: body.levers.length ? `levers: ${body.levers.join(', ')}` : null,
      is_test: false,
    })
    const row = await toObservationRow(payload)
    const { data, error } = await admin.from('benchmark_observations').insert({ ...row, created_by: gate.user.id }).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data.id, verification_level: level }, { status: 201 })
  } catch (err) {
    return badRequest(err)
  }
}
