import { NextResponse } from 'next/server'
import { requireAdmin, SourceSchema, badRequest } from '@/lib/benchmark/admin'

export async function GET() {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const { data, error } = await gate.supabase.from('benchmark_sources').select('*').order('created_at', { ascending: false }).limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sources: data })
}

export async function POST(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  try {
    const payload = SourceSchema.parse(await request.json())
    const { data, error } = await gate.supabase.from('benchmark_sources').insert({ ...payload, created_by: gate.user.id }).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err) {
    return badRequest(err)
  }
}
