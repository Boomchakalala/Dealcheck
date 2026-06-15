import { normalizeVendorName } from './vendor-normalize'

/**
 * Resolve (or create) the vendor for a deal by EXACT normalized-key match.
 *
 * Match order: vendor.normalized_key, then vendor.alias_keys (absorbed merges).
 * No match -> create a new vendor with this name as canonical.
 *
 * Deliberately NO fuzzy auto-matching: false merges are worse than duplicates.
 * (Fuzzy similarity only powers merge SUGGESTIONS in the UI.)
 *
 * `supabase` is any Supabase client (RLS or admin). Returns the vendor id, or
 * null if the name is empty or the vendors table is unavailable. Never throws —
 * callers treat vendor linking as best-effort so it can't break deal creation.
 */
export async function resolveVendorForDeal(
  supabase: any,
  userId: string,
  vendorName: string | null | undefined,
): Promise<string | null> {
  try {
    const name = (vendorName || '').trim()
    if (!name) return null
    const key = normalizeVendorName(name)
    if (!key) return null

    // 1. exact match on the canonical key
    const byKey = await supabase
      .from('vendors').select('id').eq('user_id', userId).eq('normalized_key', key).limit(1).maybeSingle()
    if (byKey.data) return byKey.data.id

    // 2. exact match on an absorbed alias key
    const byAlias = await supabase
      .from('vendors').select('id').eq('user_id', userId).contains('alias_keys', [key]).limit(1).maybeSingle()
    if (byAlias.data) return byAlias.data.id

    // 3. create
    const created = await supabase
      .from('vendors')
      .insert({ user_id: userId, canonical_name: name, normalized_key: key, aliases: [], alias_keys: [] })
      .select('id').single()
    if (!created.error && created.data) return created.data.id

    // Lost a create race on the unique (user_id, normalized_key) index — re-fetch.
    const retry = await supabase
      .from('vendors').select('id').eq('user_id', userId).eq('normalized_key', key).limit(1).maybeSingle()
    return retry.data?.id ?? null
  } catch {
    return null
  }
}
