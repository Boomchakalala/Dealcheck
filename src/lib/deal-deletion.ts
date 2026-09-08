import type { SupabaseClient } from '@supabase/supabase-js'

const DOC_BUCKET = 'negotiation-documents'

export interface DealDeletionResult {
  requestsDeleted: number
  documentsDeleted: number
}

/**
 * Delete one deal and everything that only exists because of it. Runs with
 * the service role; the caller has already verified ownership.
 *
 * Rounds cascade from the deal. Negotiation requests do not (their FK is
 * SET NULL, so that a request could outlive an accidental deal delete) —
 * but an unlinked request would keep the client's contact details and the
 * stored document with no deal to explain them, so they are removed here
 * on purpose. Benchmark observations have no reference to the deal and
 * remain, by design.
 *
 * Idempotent: a deal that is already gone yields zeros; a document already
 * missing from storage is not an error.
 */
export async function deleteDeal(admin: SupabaseClient, dealId: string): Promise<DealDeletionResult> {
  const { data: requests, error: listErr } = await admin
    .from('negotiation_requests')
    .select('id, document_path')
    .eq('deal_id', dealId)
  if (listErr) throw new Error(`list negotiation requests failed: ${listErr.message}`)

  let documentsDeleted = 0
  const paths = (requests || []).map((r) => r.document_path as string | null).filter((p): p is string => !!p)
  if (paths.length) {
    const { data: removed, error: rmErr } = await admin.storage.from(DOC_BUCKET).remove(paths)
    if (rmErr && !/not found/i.test(rmErr.message)) throw new Error(`storage delete failed: ${rmErr.message}`)
    documentsDeleted = removed?.length ?? 0
  }

  let requestsDeleted = 0
  if ((requests || []).length) {
    const { data: gone, error: reqErr } = await admin
      .from('negotiation_requests')
      .delete()
      .eq('deal_id', dealId)
      .select('id')
    if (reqErr) throw new Error(`delete negotiation requests failed: ${reqErr.message}`)
    requestsDeleted = gone?.length ?? 0
  }

  const { error: dealErr } = await admin.from('deals').delete().eq('id', dealId)
  if (dealErr) throw new Error(`delete deal failed: ${dealErr.message}`)

  return { requestsDeleted, documentsDeleted }
}
