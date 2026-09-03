import { NextResponse } from 'next/server'
import { requireAdmin, ProductSchema, toProductRow, badRequest } from '@/lib/benchmark/admin'

export async function GET() {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  const { data, error } = await gate.supabase.from('benchmark_products').select('*').order('vendor_name').order('product_name').limit(1000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}

export async function POST(request: Request) {
  const gate = await requireAdmin()
  if ('error' in gate) return gate.error
  try {
    const payload = ProductSchema.parse(await request.json())
    const { data, error } = await gate.supabase.from('benchmark_products').upsert(toProductRow(payload), { onConflict: 'vendor_key,product_key' }).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err) {
    return badRequest(err)
  }
}
