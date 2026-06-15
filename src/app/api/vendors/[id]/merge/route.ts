import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Merge THIS vendor ([id], the loser) into `targetId` (the winner):
 *  - move the loser's deals to the winner
 *  - absorb the loser's canonical name + aliases into the winner's aliases/alias_keys
 *  - delete the loser
 * RLS scopes everything to the current user.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: loserId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetId } = (await request.json().catch(() => ({}))) as { targetId?: string }
  if (!targetId || targetId === loserId) return NextResponse.json({ error: 'Invalid merge target' }, { status: 400 })

  const { data: both } = await supabase
    .from('vendors')
    .select('id, canonical_name, normalized_key, aliases, alias_keys')
    .eq('user_id', user.id)
    .in('id', [loserId, targetId])
  const loser = both?.find((v) => v.id === loserId)
  const winner = both?.find((v) => v.id === targetId)
  if (!loser || !winner) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  // 1. move deals
  const { error: moveErr } = await supabase.from('deals').update({ vendor_id: winner.id }).eq('vendor_id', loser.id).eq('user_id', user.id)
  if (moveErr) return NextResponse.json({ error: 'Failed to move deals' }, { status: 500 })

  // 2. absorb names/keys (dedupe)
  const aliases = Array.from(new Set([...(winner.aliases || []), loser.canonical_name, ...(loser.aliases || [])]))
  const aliasKeys = Array.from(new Set([...(winner.alias_keys || []), loser.normalized_key, ...(loser.alias_keys || [])])).filter((k) => k && k !== winner.normalized_key)
  const { error: absErr } = await supabase.from('vendors').update({ aliases, alias_keys: aliasKeys }).eq('id', winner.id).eq('user_id', user.id)
  if (absErr) return NextResponse.json({ error: 'Failed to absorb aliases' }, { status: 500 })

  // 3. delete loser
  const { error: delErr } = await supabase.from('vendors').delete().eq('id', loser.id).eq('user_id', user.id)
  if (delErr) return NextResponse.json({ error: 'Failed to remove merged vendor' }, { status: 500 })

  return NextResponse.json({ ok: true, winnerId: winner.id })
}
