import type { SupabaseClient } from '@supabase/supabase-js'
import { daysAgo, RAW_TEXT_MAX_AGE_DAYS, TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS } from '@/lib/retention'

const DOC_BUCKET = 'negotiation-documents'

export interface RetentionCleanupCounts {
  rawTextPurgedDeepDone: number
  rawTextPurgedClosed: number
  rawTextPurgedExpired: number
  documentsDeleted: number
  documentsAlreadyMissing: number
  orphanStorageObjectsDeleted: number
  telemetryRowsScrubbed: number
  errors: string[]
}

/**
 * The scheduled retention job. Every step is a set-based statement or an
 * idempotent delete, so re-running it is safe and a second run right after
 * the first reports zeros. It reports counts only: never a path, a user id
 * or any content.
 */
export async function runRetentionCleanup(admin: SupabaseClient, now: Date = new Date()): Promise<RetentionCleanupCounts> {
  const c: RetentionCleanupCounts = {
    rawTextPurgedDeepDone: 0, rawTextPurgedClosed: 0, rawTextPurgedExpired: 0,
    documentsDeleted: 0, documentsAlreadyMissing: 0, orphanStorageObjectsDeleted: 0,
    telemetryRowsScrubbed: 0, errors: [],
  }
  const nowIso = now.toISOString()

  // ── 1. Raw quote text ────────────────────────────────────────────────────
  // a) Deep Analysis completed: nothing reads the text any more.
  try {
    const { data, error } = await admin.from('rounds')
      .update({ extracted_text: null, extracted_text_purged_at: nowIso })
      .not('extracted_text', 'is', null)
      .eq('output_json->>deep_analysis_status', 'done')
      .select('id')
    if (error) throw error
    c.rawTextPurgedDeepDone = data?.length ?? 0
  } catch (e) { c.errors.push(`rawText.deepDone: ${msg(e)}`) }

  // b) Deal closed: the negotiation is over.
  try {
    const { data: closedDeals, error: dealsErr } = await admin.from('deals').select('id').like('status', 'closed%')
    if (dealsErr) throw dealsErr
    const ids = (closedDeals || []).map((d) => d.id as string)
    if (ids.length) {
      const { data, error } = await admin.from('rounds')
        .update({ extracted_text: null, extracted_text_purged_at: nowIso })
        .not('extracted_text', 'is', null)
        .in('deal_id', ids)
        .select('id')
      if (error) throw error
      c.rawTextPurgedClosed = data?.length ?? 0
    }
  } catch (e) { c.errors.push(`rawText.closed: ${msg(e)}`) }

  // c) Maximum age, whatever the analysis state (quick-only or abandoned deals).
  try {
    const { data, error } = await admin.from('rounds')
      .update({ extracted_text: null, extracted_text_purged_at: nowIso })
      .not('extracted_text', 'is', null)
      .lte('created_at', daysAgo(RAW_TEXT_MAX_AGE_DAYS, now).toISOString())
      .select('id')
    if (error) throw error
    c.rawTextPurgedExpired = data?.length ?? 0
  } catch (e) { c.errors.push(`rawText.expired: ${msg(e)}`) }

  // ── 2. Negotiation documents past their deadline ─────────────────────────
  try {
    const { data: due, error } = await admin.from('negotiation_requests')
      .select('id, document_path')
      .not('document_path', 'is', null)
      .lte('document_delete_at', nowIso)
    if (error) throw error
    for (const row of due || []) {
      const path = row.document_path as string
      const { data: removed, error: rmErr } = await admin.storage.from(DOC_BUCKET).remove([path])
      // A missing object is not an error: the row still needs closing out.
      if (rmErr && !/not found/i.test(rmErr.message)) { c.errors.push(`document.remove: ${rmErr.message}`); continue }
      if (removed && removed.length > 0) c.documentsDeleted++
      else c.documentsAlreadyMissing++
      const { error: updErr } = await admin.from('negotiation_requests')
        .update({ document_path: null, document_deleted_at: nowIso })
        .eq('id', row.id)
      if (updErr) c.errors.push(`document.mark: ${updErr.message}`)
    }
  } catch (e) { c.errors.push(`documents: ${msg(e)}`) }

  // ── 3. Orphaned storage folders (account deleted but a file remained) ────
  try {
    const { data: folders, error } = await admin.storage.from(DOC_BUCKET).list('', { limit: 1000 })
    if (error) throw error
    const userIds = (folders || []).filter((f) => !f.id).map((f) => f.name).filter((n) => /^[0-9a-f-]{36}$/i.test(n))
    if (userIds.length) {
      const { data: profiles, error: pErr } = await admin.from('profiles').select('id').in('id', userIds)
      if (pErr) throw pErr
      const live = new Set((profiles || []).map((p) => p.id as string))
      for (const uid of userIds) {
        if (live.has(uid)) continue
        const paths = await listPaths(admin, uid)
        if (!paths.length) continue
        const { data: removed, error: rmErr } = await admin.storage.from(DOC_BUCKET).remove(paths)
        if (rmErr) { c.errors.push(`orphan.remove: ${rmErr.message}`); continue }
        c.orphanStorageObjectsDeleted += removed?.length ?? 0
      }
    }
  } catch (e) { c.errors.push(`orphans: ${msg(e)}`) }

  // ── 4. Telemetry: strip identifiers, keep token/cost figures ─────────────
  try {
    const cutoff = daysAgo(TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS, now).toISOString()
    const { data, error } = await admin.from('ai_usage_events')
      .update({ ip_address: null, error_message: null })
      .lte('created_at', cutoff)
      .or('ip_address.not.is.null,error_message.not.is.null')
      .select('id')
    if (error) throw error
    c.telemetryRowsScrubbed = data?.length ?? 0
  } catch (e) { c.errors.push(`telemetry: ${msg(e)}`) }

  return c
}

async function listPaths(admin: SupabaseClient, prefix: string): Promise<string[]> {
  const { data, error } = await admin.storage.from(DOC_BUCKET).list(prefix, { limit: 1000 })
  if (error) throw error
  const out: string[] = []
  for (const e of data || []) {
    if (e.id) out.push(`${prefix}/${e.name}`)
    else out.push(...(await listPaths(admin, `${prefix}/${e.name}`)))
  }
  return out
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : String(e)
}
