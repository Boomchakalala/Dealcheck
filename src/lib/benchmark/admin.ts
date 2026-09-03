import { z } from 'zod'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { eurRateFor } from './service'
import { productKey, vendorKey } from './normalize'

/** Shared by the admin benchmark API routes: auth gate + payload validation + EUR normalisation. */

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { supabase, user }
}

const nullableNum = z.union([z.number(), z.string().transform((s) => (s.trim() === '' ? null : Number(s)))]).nullable().optional()
  .transform((v) => (v == null || Number.isNaN(v) ? null : v))
const nullableStr = z.string().trim().max(500).nullable().optional().transform((v) => (v ? v : null))

export const SourceSchema = z.object({
  name: z.string().trim().min(1).max(200),
  source_type: z.enum(['vendor_pricing_page', 'vendor_quote', 'termlift_negotiation', 'customer_submission', 'cloud_marketplace', 'licensed_data_provider', 'public_research', 'analyst_report', 'community', 'other']),
  url: nullableStr,
  source_date: nullableStr,
  verification_level: z.enum(['unverified', 'plausible', 'verified']).default('unverified'),
  notes: nullableStr,
  is_test: z.boolean().default(false),
})

export const ProductSchema = z.object({
  vendor_name: z.string().trim().min(1).max(200),
  product_name: z.string().trim().min(1).max(200),
  sku: nullableStr,
  category: nullableStr,
  pricing_metric: z.string().trim().min(1).max(50).default('flat_total'),
  aliases: z.array(z.string().trim().min(1)).default([]),
  is_test: z.boolean().default(false),
})

export const ObservationSchema = z.object({
  source_id: z.string().uuid(),
  product_id: z.string().uuid().nullable().optional(),
  vendor_name: z.string().trim().min(1).max(200),
  product_name: nullableStr,
  sku: nullableStr,
  category: nullableStr,
  pricing_metric: z.string().trim().min(1).max(50).default('flat_total'),
  quantity: nullableNum,
  currency: z.string().trim().length(3).transform((s) => s.toUpperCase()),
  unit_price: nullableNum,
  annualized_price: nullableNum,
  total_contract_value: nullableNum,
  term_months: nullableNum,
  deal_type: z.enum(['new', 'renewal', 'expansion', 'unknown']).nullable().optional(),
  region: nullableStr,
  company_size_band: z.enum(['smb', 'mid_market', 'enterprise', 'unknown']).nullable().optional(),
  price_type: z.enum(['public_list_price', 'initial_customer_quote', 'negotiated_offer', 'executed_contract', 'third_party_aggregate']),
  initial_quote: nullableNum,
  final_price: nullableNum,
  discount_from_list: nullableNum,
  observation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  verification_level: z.enum(['unverified', 'plausible', 'verified']).default('unverified'),
  confidence: z.number().int().min(0).max(100).default(50),
  notes: nullableStr,
  is_test: z.boolean().default(false),
}).refine((o) => o.unit_price != null || o.annualized_price != null || o.total_contract_value != null, {
  message: 'At least one of unit_price, annualized_price or total_contract_value is required',
})

export type ObservationPayload = z.infer<typeof ObservationSchema>

/** Adds vendor/product keys and EUR-normalised values (recorded FX rate + date) so the engine's comparison is reproducible. */
export async function toObservationRow(p: ObservationPayload) {
  const fx = await eurRateFor(p.currency)
  if (fx == null) throw new Error(`No exchange rate available for ${p.currency}`)
  const eur = (n: number | null | undefined) => (n == null ? null : Math.round(n * fx * 10000) / 10000)
  return {
    source_id: p.source_id,
    product_id: p.product_id ?? null,
    vendor_key: vendorKey(p.vendor_name),
    vendor_name: p.vendor_name,
    product_key: p.product_name ? productKey(p.product_name) : null,
    product_name: p.product_name,
    sku: p.sku,
    category: p.category,
    pricing_metric: p.pricing_metric,
    quantity: p.quantity,
    currency: p.currency,
    unit_price: p.unit_price,
    annualized_price: p.annualized_price,
    total_contract_value: p.total_contract_value,
    unit_price_eur: eur(p.unit_price),
    annualized_price_eur: eur(p.annualized_price),
    total_contract_value_eur: eur(p.total_contract_value),
    fx_rate_to_eur: fx,
    fx_rate_date: new Date().toISOString().slice(0, 10),
    term_months: p.term_months == null ? null : Math.round(p.term_months),
    deal_type: p.deal_type ?? null,
    region: p.region,
    company_size_band: p.company_size_band ?? null,
    price_type: p.price_type,
    initial_quote: p.initial_quote,
    final_price: p.final_price,
    discount_from_list: p.discount_from_list,
    observation_date: p.observation_date,
    verification_level: p.verification_level,
    confidence: p.confidence,
    notes: p.notes,
    is_test: p.is_test,
  }
}

export function toProductRow(p: z.infer<typeof ProductSchema>) {
  return {
    vendor_key: vendorKey(p.vendor_name),
    vendor_name: p.vendor_name,
    product_key: productKey(p.product_name),
    product_name: p.product_name,
    sku: p.sku,
    category: p.category,
    pricing_metric: p.pricing_metric,
    aliases: p.aliases,
    is_test: p.is_test,
  }
}

export function badRequest(err: unknown) {
  const msg = err instanceof z.ZodError ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') : err instanceof Error ? err.message : 'Invalid request'
  return NextResponse.json({ error: msg }, { status: 400 })
}
