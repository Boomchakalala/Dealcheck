import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { runRetentionCleanup } from '@/lib/retention-cleanup'

/**
 * Scheduled retention job (vercel.json → daily). Vercel Cron sends
 * `Authorization: Bearer $CRON_SECRET`; the same header lets you run it by
 * hand. Without CRON_SECRET configured the route refuses every call, so it
 * can never run open.
 *
 * Idempotent and safe to retry: every step is a set-based update or a
 * delete that tolerates already-missing objects. The response and the log
 * line carry counts only.
 */
export const runtime = 'nodejs'
export const maxDuration = 60

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') || ''
  return header === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const started = Date.now()
  const counts = await runRetentionCleanup(createAdminClient())
  const summary = { ...counts, durationMs: Date.now() - started }
  console.log('[retention] run complete', JSON.stringify(summary))
  return NextResponse.json(summary, { status: counts.errors.length ? 207 : 200 })
}
