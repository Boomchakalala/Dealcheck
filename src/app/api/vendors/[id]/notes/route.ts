import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => ({}))) as { body?: string }
  const text = (body.body || '').trim()
  if (!text) return NextResponse.json({ error: 'Note is empty' }, { status: 400 })

  // Ownership check (RLS also enforces this).
  const { data: vendor } = await supabase.from('vendors').select('id').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('vendor_notes')
    .insert({ vendor_id: id, user_id: user.id, body: text.slice(0, 4000) })
    .select('id, body, created_at')
    .single()
  if (error) return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })

  return NextResponse.json({ note: data })
}
