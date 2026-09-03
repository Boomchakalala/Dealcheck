import { NextResponse } from 'next/server'
import { requireAdmin, ObservationSchema, toObservationRow, badRequest } from '@/lib/benchmark/admin'

/** GET  /api/admin/benchmarks?vendor=&product=&price_type=  — list observations (admin only)
 *  POST /api/admin/benchmarks                                — create one */
export async function GET(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const url = new URL(request.url)
  const vendor = url.searchParams.get('vendor')?.trim()
  const product = url.searchParams.get('product')?.trim()
  const priceType = url.searchParams.get('price_type')?.trim()

  let q = gate.supabase
    .from('benchmark_observations')
    .select('*, benchmark_sources ( id, name, source_type, url, source_date, verification_level ), benchmark_products ( id, product_name )')
    .order('observation_date', { ascending: false })
    .limit(500)
  if (vendor) q = q.ilike('vendor_name', `%${vendor}%`)
  if (product) q = q.ilike('product_name', `%${product}%`)
  if (priceType) q = q.eq('price_type', priceType)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ observations: data })
}

export async function POST(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  try {
    const payload = ObservationSchema.parse(await request.json())
    const row = await toObservationRow(payload)
    const { data, error } = await gate.supabase
      .from('benchmark_observations')
      .insert({ ...row, created_by: gate.user.id })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err) {
    return badRequest(err)
  }
}
