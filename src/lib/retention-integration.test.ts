/**
 * Integration test against the real Supabase project (auth, Postgres
 * cascades, RLS-bypassing service role, Storage). Opt-in:
 *
 *   TERMLIFT_INTEGRATION=1 npx vitest run src/lib/retention-integration.test.ts
 *
 * Reads the service-role key from .env.local. Creates ONE throwaway auth user
 * with synthetic rows and a tiny synthetic file, exercises the retention job
 * and account deletion on that user only, and asserts nothing of it remains.
 * It never touches any other account.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { runRetentionCleanup } from './retention-cleanup'
import { deleteAccount } from './account-deletion'
import { deleteDeal } from './deal-deletion'
import { daysAgo, documentDeleteAt } from './retention'
import { buildVerificationRecord } from './verification'

const enabled = process.env.TERMLIFT_INTEGRATION === '1'

function loadEnv(): { url: string; key: string } {
  const file = path.resolve(process.cwd(), '.env.local')
  const env: Record<string, string> = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
  }
  return { url: env.NEXT_PUBLIC_SUPABASE_URL, key: env.SUPABASE_SERVICE_ROLE_KEY }
}

const BUCKET = 'negotiation-documents'
const OUTPUT = { vendor: 'Synthetic Vendor', snapshot: { total_commitment: '$1,000', currency: 'USD' } }

describe.skipIf(!enabled)('retention job + account deletion against the live project', () => {
  let admin: SupabaseClient
  let userId = ''
  let deals: { open: string; closed: string } = { open: '', closed: '' }
  let rounds: { deepDone: string; quickRecent: string; quickOld: string; onClosed: string } = { deepDone: '', quickRecent: '', quickOld: '', onClosed: '' }
  let requests: { expired: string; active: string } = { expired: '', active: '' }
  let paths: { expired: string; active: string } = { expired: '', active: '' }
  let telemetry: { old: string; recent: string } = { old: '', recent: '' }
  const now = new Date()

  beforeAll(async () => {
    const { url, key } = loadEnv()
    admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

    const email = `retention-test-${Date.now()}@example.invalid`
    const { data: created, error } = await admin.auth.admin.createUser({ email, password: crypto.randomUUID(), email_confirm: true })
    if (error || !created.user) throw new Error(`createUser: ${error?.message}`)
    userId = created.user.id
    // The signup trigger creates the profile; make sure it is there.
    await admin.from('profiles').upsert({ id: userId, email })

    const ins = async <T,>(table: string, row: Record<string, unknown>): Promise<T> => {
      const { data, error } = await admin.from(table).insert(row).select('id').single()
      if (error) throw new Error(`${table}: ${error.message}`)
      return data.id as T
    }
    deals.open = await ins('deals', { user_id: userId, vendor: 'Synthetic Vendor', title: 'open', deal_type: 'New' })
    deals.closed = await ins('deals', { user_id: userId, vendor: 'Synthetic Vendor', title: 'closed', deal_type: 'New', status: 'closed_won', closed_at: now.toISOString(), final_total: 900, final_total_provenance: 'document_verified',
      verification: buildVerificationRecord({ tier: 'document_verified', method: 'final_document_extract', confirmedTotal: 900, currency: 'USD', evidence: { sha256: 'b'.repeat(64), type: 'application/pdf', sizeBytes: 12, extractedTotal: 900 } }) })

    const round = (deal: string, n: number, over: Record<string, unknown>) => ins<string>('rounds', { deal_id: deal, user_id: userId, round_number: n, extracted_text: 'SYNTHETIC QUOTE TEXT', output_markdown: '', status: 'done', ...over })
    rounds.deepDone = await round(deals.open, 1, { output_json: { ...OUTPUT, deep_analysis_status: 'done' } })
    // A failed Deep Analysis reverts to 'idle': the text must survive for the retry.
    rounds.quickRecent = await round(deals.open, 2, { output_json: { ...OUTPUT, deep_analysis_status: 'idle' } })
    rounds.quickOld = await round(deals.open, 3, { output_json: OUTPUT, created_at: daysAgo(91, now).toISOString() })
    rounds.onClosed = await round(deals.closed, 1, { output_json: OUTPUT })

    const upload = async (name: string) => {
      const p = `${userId}/${crypto.randomUUID()}/${name}`
      const { error } = await admin.storage.from(BUCKET).upload(p, new Blob(['%PDF-1.4 synthetic'], { type: 'application/pdf' }), { contentType: 'application/pdf' })
      if (error) throw new Error(`upload: ${error.message}`)
      return p
    }
    paths.expired = await upload('expired.pdf')
    paths.active = await upload('active.pdf')
    const uploadedAt = daysAgo(40, now)
    requests.expired = await ins('negotiation_requests', { user_id: userId, source: 'direct', status: 'closed_won', closed_at: daysAgo(31, now).toISOString(), document_path: paths.expired, document_consent_at: uploadedAt.toISOString(), document_delete_at: documentDeleteAt(uploadedAt, daysAgo(31, now)).toISOString(),
      verification: buildVerificationRecord({ tier: 'document_verified', method: 'admin_document', confirmedTotal: 900, currency: 'USD', evidence: { sha256: 'c'.repeat(64), type: 'application/pdf', sizeBytes: 18 } }) })
    requests.active = await ins('negotiation_requests', { user_id: userId, source: 'direct', status: 'negotiating', document_path: paths.active, document_consent_at: uploadedAt.toISOString(), document_delete_at: documentDeleteAt(uploadedAt, null).toISOString() })

    telemetry.old = await ins('ai_usage_events', { user_id: userId, deal_id: deals.open, action: 'classify', model: 'test', input_tokens: 10, output_tokens: 5, estimated_cost_usd: 0.001, ip_address: '203.0.113.7', error_message: 'synthetic error', created_at: daysAgo(91, now).toISOString() })
    telemetry.recent = await ins('ai_usage_events', { user_id: userId, deal_id: deals.open, action: 'classify', model: 'test', input_tokens: 10, output_tokens: 5, estimated_cost_usd: 0.001, ip_address: '203.0.113.8', created_at: now.toISOString() })
  }, 60_000)

  afterAll(async () => {
    // Belt and braces: if an assertion failed before deleteAccount ran, remove the throwaway user anyway.
    if (admin && userId) {
      try { await deleteAccount(admin, userId) } catch { /* already gone */ }
    }
  }, 60_000)

  it('the retention job applies every rule, then reports zeros on a second run', async () => {
    const first = await runRetentionCleanup(admin, now)
    expect(first.errors).toEqual([])
    expect(first.rawTextPurgedDeepDone).toBeGreaterThanOrEqual(1)
    expect(first.rawTextPurgedClosed).toBeGreaterThanOrEqual(1)
    expect(first.rawTextPurgedExpired).toBeGreaterThanOrEqual(1)
    expect(first.documentsDeleted).toBeGreaterThanOrEqual(1)
    expect(first.telemetryRowsScrubbed).toBeGreaterThanOrEqual(1)

    const { data: rs } = await admin.from('rounds').select('id, extracted_text, extracted_text_purged_at').in('id', Object.values(rounds))
    const byId = Object.fromEntries((rs || []).map((r) => [r.id, r]))
    // raw text survives Quick Analysis when required (recent, deep not done / failed)
    expect(byId[rounds.quickRecent].extracted_text).toBe('SYNTHETIC QUOTE TEXT')
    expect(byId[rounds.quickRecent].extracted_text_purged_at).toBeNull()
    // …and disappears after Deep Analysis, on close, and past the max age
    expect(byId[rounds.deepDone].extracted_text).toBeNull()
    expect(byId[rounds.onClosed].extracted_text).toBeNull()
    expect(byId[rounds.quickOld].extracted_text).toBeNull()
    expect(byId[rounds.deepDone].extracted_text_purged_at).not.toBeNull()

    // negotiation document: gone after the deadline, kept while active
    const { data: reqs } = await admin.from('negotiation_requests').select('id, document_path, document_deleted_at, verification').in('id', Object.values(requests))
    const req = Object.fromEntries((reqs || []).map((r) => [r.id, r]))
    expect(req[requests.expired].document_path).toBeNull()
    expect(req[requests.expired].document_deleted_at).not.toBeNull()
    expect(req[requests.active].document_path).toBe(paths.active)
    const { data: expiredObj } = await admin.storage.from(BUCKET).list(paths.expired.split('/').slice(0, 2).join('/'))
    expect((expiredObj || []).filter((o) => o.id).length).toBe(0)
    const { data: activeObj } = await admin.storage.from(BUCKET).list(paths.active.split('/').slice(0, 2).join('/'))
    expect((activeObj || []).filter((o) => o.id).length).toBe(1)

    // document_verified provenance survives source deletion
    expect(req[requests.expired].verification?.tier).toBe('document_verified')
    expect(req[requests.expired].verification?.document?.sha256).toBe('c'.repeat(64))
    const { data: closedDeal } = await admin.from('deals').select('final_total_provenance, verification').eq('id', deals.closed).single()
    expect(closedDeal?.final_total_provenance).toBe('document_verified')
    expect(closedDeal?.verification?.document?.sha256).toBe('b'.repeat(64))

    // telemetry: identifiers gone on the old row, cost figures intact; recent row untouched
    const { data: tel } = await admin.from('ai_usage_events').select('id, ip_address, error_message, input_tokens, estimated_cost_usd').in('id', Object.values(telemetry))
    const t = Object.fromEntries((tel || []).map((r) => [r.id, r]))
    expect(t[telemetry.old].ip_address).toBeNull()
    expect(t[telemetry.old].error_message).toBeNull()
    expect(Number(t[telemetry.old].estimated_cost_usd)).toBeCloseTo(0.001)
    expect(t[telemetry.old].input_tokens).toBe(10)
    expect(t[telemetry.recent].ip_address).toBe('203.0.113.8')

    // idempotent: nothing left to do for this user's rows on a second pass
    const second = await runRetentionCleanup(admin, now)
    expect(second.errors).toEqual([])
    expect(second.documentsDeleted).toBe(0)
    expect(second.documentsAlreadyMissing).toBe(0)
    const { data: again } = await admin.from('rounds').select('id, extracted_text').eq('id', rounds.quickRecent).single()
    expect(again?.extracted_text).toBe('SYNTHETIC QUOTE TEXT')
  }, 60_000)

  it('deleting a deal removes its linked negotiation request and stored document, and is idempotent', async () => {
    // A request linked to the open deal, with a document that is still within its retention window.
    const linkedPath = `${userId}/${crypto.randomUUID()}/linked.pdf`
    const { error: upErr } = await admin.storage.from(BUCKET).upload(linkedPath, new Blob(['%PDF-1.4 linked'], { type: 'application/pdf' }), { contentType: 'application/pdf' })
    if (upErr) throw new Error(upErr.message)
    const { data: linked, error: insErr } = await admin.from('negotiation_requests').insert({
      user_id: userId, deal_id: deals.open, source: 'post_analysis', status: 'reviewing',
      document_path: linkedPath, document_consent_at: now.toISOString(), document_delete_at: documentDeleteAt(now, null).toISOString(),
    }).select('id').single()
    if (insErr) throw new Error(insErr.message)

    const first = await deleteDeal(admin, deals.open)
    expect(first).toEqual({ requestsDeleted: 1, documentsDeleted: 1 })

    const { count: dealLeft } = await admin.from('deals').select('id', { count: 'exact', head: true }).eq('id', deals.open)
    expect(dealLeft).toBe(0)
    const { count: roundsLeft } = await admin.from('rounds').select('id', { count: 'exact', head: true }).eq('deal_id', deals.open)
    expect(roundsLeft).toBe(0)
    const { count: reqLeft } = await admin.from('negotiation_requests').select('id', { count: 'exact', head: true }).eq('id', linked.id)
    expect(reqLeft).toBe(0)
    const { data: objs } = await admin.storage.from(BUCKET).list(linkedPath.split('/').slice(0, 2).join('/'))
    expect((objs || []).filter((o) => o.id).length).toBe(0)
    // The unlinked request (no deal) and its active document are untouched.
    const { data: other } = await admin.from('negotiation_requests').select('document_path').eq('id', requests.active).single()
    expect(other?.document_path).toBe(paths.active)

    // Second call on the same id: nothing to do, no error.
    const second = await deleteDeal(admin, deals.open)
    expect(second).toEqual({ requestsDeleted: 0, documentsDeleted: 0 })
  }, 60_000)

  it('account deletion removes the auth user, every owned row and every stored file', async () => {
    const result = await deleteAccount(admin, userId)
    expect(result.authUserDeleted).toBe(true)
    expect(result.storageObjectsDeleted).toBeGreaterThanOrEqual(1) // the active document

    // cannot leave an active auth user
    const { data: gone, error } = await admin.auth.admin.getUserById(userId)
    expect(gone?.user ?? null).toBeNull()
    expect(error).not.toBeNull()

    for (const table of ['profiles', 'deals', 'rounds', 'negotiation_requests']) {
      const col = table === 'profiles' ? 'id' : 'user_id'
      const { count } = await admin.from(table).select('id', { count: 'exact', head: true }).eq(col, userId)
      expect({ table, count }).toEqual({ table, count: 0 })
    }
    const { count: tel } = await admin.from('ai_usage_events').select('id', { count: 'exact', head: true }).eq('user_id', userId)
    expect(tel).toBe(0)

    const { data: folder } = await admin.storage.from(BUCKET).list(userId)
    expect(folder || []).toEqual([])
    userId = ''
  }, 60_000)
})
