import { NextResponse } from 'next/server'
import { requireAdmin, ObservationSchema, toObservationRow, badRequest } from '@/lib/benchmark/admin'

/** PATCH  /api/admin/benchmarks/[id] — full update (the form always sends the whole record)
 *  DELETE /api/admin/benchmarks/[id] */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const { id } = await params
  try {
    const payload = ObservationSchema.parse(await request.json())
    const row = await toObservationRow(payload)
    const { error } = await gate.supabase.from('benchmark_observations').update(row).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return badRequest(err)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const { id } = await params
  const { error } = await gate.supabase.from('benchmark_observations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
