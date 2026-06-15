/**
 * Backfill: resolve every existing deal's vendor name into a vendor entity and
 * link deals.vendor_id. Idempotent (re-runnable). Prints a summary and lists
 * near-duplicate vendor candidates (similarity > 0.85) for MANUAL review — it
 * never merges them.
 *
 * Run (Node 20.6+ for --env-file, 22.6+ for --experimental-strip-types):
 *   node --env-file=.env.local --experimental-strip-types scripts/backfill-vendors.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the env.
 */
import { createClient } from '@supabase/supabase-js'
import { normalizeVendorName, vendorKeySimilarity } from '../src/lib/vendor-normalize.ts'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with --env-file=.env.local')
  process.exit(1)
}
const db = createClient(url, serviceKey, { auth: { persistSession: false } })

type Deal = { id: string; user_id: string; vendor: string | null; vendor_id: string | null }
type Vendor = { id: string; user_id: string; canonical_name: string; normalized_key: string; alias_keys: string[] }

async function main() {
  // ── load all deals (paginate) ──
  const deals: Deal[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('deals').select('id, user_id, vendor, vendor_id').range(from, from + 999)
    if (error) throw error
    if (!data?.length) break
    deals.push(...(data as Deal[]))
    if (data.length < 1000) break
  }

  // ── per-user key -> vendorId map, seeded from existing vendors ──
  const { data: existingVendors, error: vErr } = await db.from('vendors').select('id, user_id, canonical_name, normalized_key, alias_keys')
  if (vErr) throw vErr
  const keyToId = new Map<string, string>() // `${userId}\0${key}` -> vendorId
  const vendorsByUser = new Map<string, Vendor[]>()
  for (const v of (existingVendors || []) as Vendor[]) {
    keyToId.set(`${v.user_id}\0${v.normalized_key}`, v.id)
    for (const ak of v.alias_keys || []) keyToId.set(`${v.user_id}\0${ak}`, v.id)
    ;(vendorsByUser.get(v.user_id) || vendorsByUser.set(v.user_id, []).get(v.user_id)!).push(v)
  }

  let vendorsCreated = 0
  let dealsLinked = 0
  let skipped = 0

  for (const deal of deals) {
    const key = normalizeVendorName(deal.vendor || '')
    if (!key) { skipped++; continue }
    const mapKey = `${deal.user_id}\0${key}`
    let vendorId = keyToId.get(mapKey)

    if (!vendorId) {
      const { data: created, error } = await db
        .from('vendors')
        .insert({ user_id: deal.user_id, canonical_name: (deal.vendor || '').trim(), normalized_key: key, aliases: [], alias_keys: [] })
        .select('id, user_id, canonical_name, normalized_key, alias_keys')
        .single()
      if (error) {
        // unique race / already exists — re-fetch
        const { data: again } = await db.from('vendors').select('id').eq('user_id', deal.user_id).eq('normalized_key', key).maybeSingle()
        vendorId = again?.id
        if (!vendorId) { skipped++; continue }
      } else {
        vendorId = created!.id
        vendorsCreated++
        keyToId.set(mapKey, vendorId)
        ;(vendorsByUser.get(deal.user_id) || vendorsByUser.set(deal.user_id, []).get(deal.user_id)!).push(created as Vendor)
      }
    }

    if (!vendorId) { skipped++; continue }
    if (deal.vendor_id !== vendorId) {
      const { error } = await db.from('deals').update({ vendor_id: vendorId }).eq('id', deal.id)
      if (!error) dealsLinked++
    }
  }

  // ── near-duplicate candidates (per user, similarity > 0.85), printed not merged ──
  const candidates: string[] = []
  for (const [, vs] of vendorsByUser) {
    for (let i = 0; i < vs.length; i++) {
      for (let j = i + 1; j < vs.length; j++) {
        const sim = vendorKeySimilarity(vs[i].normalized_key, vs[j].normalized_key)
        if (sim > 0.85) candidates.push(`  ~${sim.toFixed(2)}  "${vs[i].canonical_name}"  <->  "${vs[j].canonical_name}"`)
      }
    }
  }

  console.log('\n──── Vendor backfill summary ────')
  console.log(`Deals processed:      ${deals.length}`)
  console.log(`Vendors created:      ${vendorsCreated}`)
  console.log(`Deals linked:         ${dealsLinked}`)
  console.log(`Skipped (no vendor):  ${skipped}`)
  console.log(`\nNear-duplicate candidates for manual review (NOT merged): ${candidates.length}`)
  if (candidates.length) console.log(candidates.join('\n'))
  console.log('\nDone.')
}

main().catch((e) => { console.error('Backfill failed:', e); process.exit(1) })
