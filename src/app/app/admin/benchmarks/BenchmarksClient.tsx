'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react'
import { Btn, Chip } from '@/components/system'
import { cn } from '@/lib/utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Source = any
type Product = any
type Observation = any

const PRICE_TYPES = ['executed_contract', 'negotiated_offer', 'initial_customer_quote', 'third_party_aggregate', 'public_list_price'] as const
const SOURCE_TYPES = ['vendor_pricing_page', 'vendor_quote', 'termlift_negotiation', 'customer_submission', 'cloud_marketplace', 'licensed_data_provider', 'public_research', 'analyst_report', 'community', 'other'] as const
const METRICS = ['per_seat_month', 'per_seat_year', 'per_host_month', 'per_host_year', 'per_gb_month', 'per_unit', 'per_hour', 'flat_annual', 'flat_total'] as const
const VERIFICATION = ['unverified', 'plausible', 'verified'] as const
const CATEGORIES = ['saas', 'professional_services', 'product_hardware', 'household', 'event_project', 'construction', 'staffing', 'travel', 'media', 'usage_based_infra', 'managed_services', 'insurance', 'logistics', 'garage', 'leasing']

const inputCls = 'w-full h-9 px-3 rounded-[8px] border border-line bg-surface text-[13px] text-ink focus:outline-none focus:border-green'
const labelCls = 'text-[11.5px] font-semibold text-ink-2 mb-1 block'

function ageMonths(iso: string) {
  const d = new Date(iso); const n = new Date()
  return Math.max(0, (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth()))
}
function fmt(n: number | null | undefined, cur?: string) {
  if (n == null) return '—'
  return `${cur ? cur + ' ' : ''}${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}
function verTone(v: string) { return v === 'verified' ? 'green' : v === 'plausible' ? 'info' : 'neutral' }
function typeTone(t: string) { return t === 'executed_contract' ? 'green' : t === 'negotiated_offer' ? 'info' : t === 'public_list_price' ? 'neutral' : 'warn' }

const emptyObs = () => ({
  source_id: '', product_id: '', vendor_name: '', product_name: '', sku: '', category: '', pricing_metric: 'flat_total',
  quantity: '', currency: 'EUR', unit_price: '', annualized_price: '', total_contract_value: '', term_months: '',
  deal_type: 'unknown', region: '', company_size_band: 'unknown', price_type: 'executed_contract', initial_quote: '', final_price: '',
  discount_from_list: '', observation_date: new Date().toISOString().slice(0, 10), verification_level: 'unverified', confidence: 50, notes: '', is_test: false,
})

export function BenchmarksClient({ sources, products, observations }: { sources: Source[]; products: Product[]; observations: Observation[] }) {
  const router = useRouter()
  const [vendorF, setVendorF] = useState('')
  const [productF, setProductF] = useState('')
  const [typeF, setTypeF] = useState('')
  const [hideTest, setHideTest] = useState(false)
  const [panel, setPanel] = useState<'none' | 'obs' | 'source' | 'product'>('none')
  const [editing, setEditing] = useState<Observation | null>(null)
  const [form, setForm] = useState<any>(emptyObs())
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [showSources, setShowSources] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  const rows = useMemo(() => observations.filter((o) =>
    (!vendorF || (o.vendor_name || '').toLowerCase().includes(vendorF.toLowerCase())) &&
    (!productF || (o.product_name || '').toLowerCase().includes(productF.toLowerCase())) &&
    (!typeF || o.price_type === typeF) &&
    (!hideTest || !o.is_test),
  ), [observations, vendorF, productF, typeF, hideTest])

  const openNew = () => { setEditing(null); setForm(emptyObs()); setErr(null); setPanel('obs') }
  const openEdit = (o: Observation) => {
    setEditing(o); setErr(null); setPanel('obs')
    setForm({
      ...emptyObs(), ...o,
      product_id: o.product_id || '', quantity: o.quantity ?? '', unit_price: o.unit_price ?? '', annualized_price: o.annualized_price ?? '',
      total_contract_value: o.total_contract_value ?? '', term_months: o.term_months ?? '', initial_quote: o.initial_quote ?? '', final_price: o.final_price ?? '',
      discount_from_list: o.discount_from_list ?? '', deal_type: o.deal_type || 'unknown', company_size_band: o.company_size_band || 'unknown',
      region: o.region || '', sku: o.sku || '', category: o.category || '', product_name: o.product_name || '', notes: o.notes || '',
    })
  }

  const numOrNull = (v: any) => (v === '' || v == null ? null : Number(v))
  const submitObs = async () => {
    setBusy(true); setErr(null)
    const payload = {
      ...form,
      product_id: form.product_id || null,
      quantity: numOrNull(form.quantity), unit_price: numOrNull(form.unit_price), annualized_price: numOrNull(form.annualized_price),
      total_contract_value: numOrNull(form.total_contract_value), term_months: numOrNull(form.term_months), initial_quote: numOrNull(form.initial_quote),
      final_price: numOrNull(form.final_price), discount_from_list: numOrNull(form.discount_from_list), confidence: Number(form.confidence),
      product_name: form.product_name || null, sku: form.sku || null, category: form.category || null, region: form.region || null, notes: form.notes || null,
    }
    delete payload.benchmark_sources; delete payload.benchmark_products; delete payload.id; delete payload.created_at; delete payload.updated_at; delete payload.created_by
    delete payload.vendor_key; delete payload.product_key; delete payload.unit_price_eur; delete payload.annualized_price_eur; delete payload.total_contract_value_eur; delete payload.fx_rate_to_eur; delete payload.fx_rate_date
    const res = await fetch(editing ? `/api/admin/benchmarks/${editing.id}` : '/api/admin/benchmarks', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setErr(data.error || 'Save failed'); return }
    setPanel('none'); router.refresh()
  }
  const del = async (id: string) => {
    setBusy(true)
    const res = await fetch(`/api/admin/benchmarks/${id}`, { method: 'DELETE' })
    setBusy(false); setConfirmDel(null)
    if (res.ok) router.refresh()
  }

  const onProductPick = (id: string) => {
    const p = products.find((x) => x.id === id)
    setForm((f: any) => ({ ...f, product_id: id, ...(p ? { vendor_name: p.vendor_name, product_name: p.product_name, sku: p.sku || f.sku, category: p.category || f.category, pricing_metric: p.pricing_metric || f.pricing_metric } : {}) }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-3">
        <div><label className={labelCls}>Vendor</label><input className={cn(inputCls, 'w-44')} value={vendorF} onChange={(e) => setVendorF(e.target.value)} placeholder="Filter vendor" /></div>
        <div><label className={labelCls}>Product</label><input className={cn(inputCls, 'w-44')} value={productF} onChange={(e) => setProductF(e.target.value)} placeholder="Filter product" /></div>
        <div><label className={labelCls}>Price type</label>
          <select className={cn(inputCls, 'w-48')} value={typeF} onChange={(e) => setTypeF(e.target.value)}><option value="">All</option>{PRICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <label className="flex items-center gap-2 text-[12.5px] text-ink-2 h-9"><input type="checkbox" checked={hideTest} onChange={(e) => setHideTest(e.target.checked)} />Hide test rows</label>
        <div className="ml-auto flex items-center gap-2">
          <Btn variant="ghost" size="sm" onClick={() => { setPanel(panel === 'source' ? 'none' : 'source'); setErr(null) }}><Plus className="w-3.5 h-3.5" />Source</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { setPanel(panel === 'product' ? 'none' : 'product'); setErr(null) }}><Plus className="w-3.5 h-3.5" />Product</Btn>
          <Btn variant="primary" size="sm" onClick={openNew}><Plus className="w-3.5 h-3.5" />Observation</Btn>
        </div>
      </div>

      {panel === 'source' && <SourceForm onDone={() => { setPanel('none'); router.refresh() }} onClose={() => setPanel('none')} />}
      {panel === 'product' && <ProductForm onDone={() => { setPanel('none'); router.refresh() }} onClose={() => setPanel('none')} />}

      {panel === 'obs' && (
        <div className="bg-surface border border-line rounded-[14px] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold text-[15px] text-ink">{editing ? 'Edit observation' : 'New observation'}</p>
            <button onClick={() => setPanel('none')} className="text-ink-3 hover:text-ink"><X className="w-4 h-4" /></button>
          </div>
          {sources.length === 0 && <p className="text-[12.5px] text-risk mb-2">Add a source first — every observation must carry provenance.</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2"><label className={labelCls}>Source *</label>
              <select className={inputCls} value={form.source_id} onChange={(e) => setForm({ ...form, source_id: e.target.value })}><option value="">Select…</option>{sources.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.source_type}{s.is_test ? ', TEST' : ''})</option>)}</select></div>
            <div className="col-span-2"><label className={labelCls}>Curated product</label>
              <select className={inputCls} value={form.product_id} onChange={(e) => onProductPick(e.target.value)}><option value="">— none (free text below) —</option>{products.map((p) => <option key={p.id} value={p.id}>{p.vendor_name} / {p.product_name}{p.is_test ? ' (TEST)' : ''}</option>)}</select></div>
            <div><label className={labelCls}>Vendor *</label><input className={inputCls} value={form.vendor_name} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} /></div>
            <div><label className={labelCls}>Product</label><input className={inputCls} value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} /></div>
            <div><label className={labelCls}>SKU</label><input className={inputCls} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
            <div><label className={labelCls}>Category</label><select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">—</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelCls}>Pricing metric *</label><select className={inputCls} value={form.pricing_metric} onChange={(e) => setForm({ ...form, pricing_metric: e.target.value })}>{METRICS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className={labelCls}>Quantity</label><input className={inputCls} type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
            <div><label className={labelCls}>Currency *</label><input className={inputCls} value={form.currency} maxLength={3} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} /></div>
            <div><label className={labelCls}>Unit price</label><input className={inputCls} type="number" step="any" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} /></div>
            <div><label className={labelCls}>Annualized price</label><input className={inputCls} type="number" step="any" value={form.annualized_price} onChange={(e) => setForm({ ...form, annualized_price: e.target.value })} /></div>
            <div><label className={labelCls}>Total contract value</label><input className={inputCls} type="number" step="any" value={form.total_contract_value} onChange={(e) => setForm({ ...form, total_contract_value: e.target.value })} /></div>
            <div><label className={labelCls}>Term (months)</label><input className={inputCls} type="number" value={form.term_months} onChange={(e) => setForm({ ...form, term_months: e.target.value })} /></div>
            <div><label className={labelCls}>Deal type</label><select className={inputCls} value={form.deal_type} onChange={(e) => setForm({ ...form, deal_type: e.target.value })}>{['new', 'renewal', 'expansion', 'unknown'].map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className={labelCls}>Region</label><input className={inputCls} value={form.region} placeholder="EU / US / FR" onChange={(e) => setForm({ ...form, region: e.target.value })} /></div>
            <div><label className={labelCls}>Company size</label><select className={inputCls} value={form.company_size_band} onChange={(e) => setForm({ ...form, company_size_band: e.target.value })}>{['smb', 'mid_market', 'enterprise', 'unknown'].map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className={labelCls}>Price type *</label><select className={inputCls} value={form.price_type} onChange={(e) => setForm({ ...form, price_type: e.target.value })}>{PRICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={labelCls}>Initial quote</label><input className={inputCls} type="number" step="any" value={form.initial_quote} onChange={(e) => setForm({ ...form, initial_quote: e.target.value })} /></div>
            <div><label className={labelCls}>Final price</label><input className={inputCls} type="number" step="any" value={form.final_price} onChange={(e) => setForm({ ...form, final_price: e.target.value })} /></div>
            <div><label className={labelCls}>Discount from list (%)</label><input className={inputCls} type="number" step="any" value={form.discount_from_list} onChange={(e) => setForm({ ...form, discount_from_list: e.target.value })} /></div>
            <div><label className={labelCls}>Observation date *</label><input className={inputCls} type="date" value={form.observation_date} onChange={(e) => setForm({ ...form, observation_date: e.target.value })} /></div>
            <div><label className={labelCls}>Verification</label><select className={inputCls} value={form.verification_level} onChange={(e) => setForm({ ...form, verification_level: e.target.value })}>{VERIFICATION.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>
            <div><label className={labelCls}>Confidence (0-100)</label><input className={inputCls} type="number" min={0} max={100} value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value })} /></div>
            <div className="col-span-2 md:col-span-3"><label className={labelCls}>Notes</label><input className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-[12.5px] text-ink-2 h-9 self-end"><input type="checkbox" checked={!!form.is_test} onChange={(e) => setForm({ ...form, is_test: e.target.checked })} />Test data</label>
          </div>
          {err && <p className="text-[12.5px] text-risk mt-3">{err}</p>}
          <div className="flex items-center gap-2 mt-4">
            <Btn variant="primary" size="sm" onClick={submitObs} disabled={busy || !form.source_id || !form.vendor_name}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create observation'}</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setPanel('none')}>Cancel</Btn>
            <p className="text-[11.5px] text-ink-3 ml-auto">EUR values and the FX rate are recorded automatically on save.</p>
          </div>
        </div>
      )}

      {/* Observations table */}
      <div className="bg-surface border border-line rounded-[14px] overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead><tr className="text-left border-b border-line">
            {['Vendor / product', 'Price', 'Qty · term', 'Type', 'Date', 'Source', 'Conf', ''].map((h) => <th key={h} className="tl-label text-ink-3 font-normal px-4 py-2.5 whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-line-2">
            {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-3">No observations{observations.length ? ' match the filters' : ' yet — add a source, then an observation'}.</td></tr>}
            {rows.map((o) => (
              <tr key={o.id} className={cn(o.is_test && 'bg-warn-soft/40')}>
                <td className="px-4 py-2.5 min-w-[180px]"><p className="font-semibold text-ink">{o.vendor_name}{o.is_test && <Chip tone="warn" mono className="ml-2">TEST</Chip>}</p><p className="text-ink-3">{o.product_name || '—'}{o.sku ? ` · ${o.sku}` : ''}{o.category ? ` · ${o.category}` : ''}</p></td>
                <td className="px-4 py-2.5 whitespace-nowrap tl-num">
                  {o.unit_price != null ? <p className="text-ink">{fmt(o.unit_price, o.currency)} <span className="text-ink-3">{o.pricing_metric}</span></p> : null}
                  {o.annualized_price != null ? <p className="text-ink-2">{fmt(o.annualized_price, o.currency)} /yr</p> : null}
                  {o.total_contract_value != null ? <p className="text-ink-2">{fmt(o.total_contract_value, o.currency)} TCV</p> : null}
                  {o.discount_from_list != null ? <p className="text-ink-3">{o.discount_from_list}% off list</p> : null}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-ink-2 tl-num">{o.quantity ?? '—'} · {o.term_months ? `${o.term_months} mo` : '—'}<p className="text-ink-3">{o.deal_type || 'unknown'}{o.region ? ` · ${o.region}` : ''}</p></td>
                <td className="px-4 py-2.5"><Chip tone={typeTone(o.price_type) as any} mono>{o.price_type}</Chip></td>
                <td className="px-4 py-2.5 whitespace-nowrap tl-num text-ink-2">{o.observation_date}<p className="text-ink-3">{ageMonths(o.observation_date)} mo ago</p></td>
                <td className="px-4 py-2.5 min-w-[160px]">
                  <p className="text-ink">{o.benchmark_sources?.url ? <a href={o.benchmark_sources.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 no-underline text-ink hover:text-green-deep">{o.benchmark_sources?.name}<ExternalLink className="w-3 h-3 text-ink-3" /></a> : o.benchmark_sources?.name}</p>
                  <Chip tone={verTone(o.verification_level) as any} mono>{o.verification_level}</Chip>
                </td>
                <td className="px-4 py-2.5 tl-num text-ink-2">{o.confidence}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(o)} className="p-1.5 rounded-[6px] text-ink-3 hover:text-ink hover:bg-surface-2" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                    {confirmDel === o.id ? (
                      <><button onClick={() => del(o.id)} disabled={busy} className="px-2 py-1 rounded-[6px] text-[12px] font-semibold text-white bg-risk">Confirm</button><button onClick={() => setConfirmDel(null)} className="px-2 py-1 text-[12px] text-ink-3">Cancel</button></>
                    ) : (
                      <button onClick={() => setConfirmDel(o.id)} className="p-1.5 rounded-[6px] text-ink-3 hover:text-risk hover:bg-risk-soft" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sources & products reference lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-line rounded-[14px]">
          <button onClick={() => setShowSources(!showSources)} className="w-full flex items-center justify-between px-5 py-3 text-left"><span className="font-display font-bold text-[14px] text-ink">Sources <span className="text-ink-3 font-normal">· {sources.length}</span></span><span className="text-[12px] text-ink-3">{showSources ? 'Hide' : 'Show'}</span></button>
          {showSources && (
            <ul className="m-0 p-0 list-none divide-y divide-line-2 border-t border-line-2">
              {sources.map((s) => (
                <li key={s.id} className="px-5 py-2.5 text-[12.5px] flex items-start justify-between gap-3">
                  <div><p className="text-ink font-medium">{s.name}{s.is_test && <Chip tone="warn" mono className="ml-2">TEST</Chip>}</p><p className="text-ink-3">{s.source_type} · {s.source_date || 'no date'}{s.url ? <> · <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-green-deep">link</a></> : null}</p></div>
                  <Chip tone={verTone(s.verification_level) as any} mono>{s.verification_level}</Chip>
                </li>
              ))}
              {sources.length === 0 && <li className="px-5 py-3 text-ink-3 text-[12.5px]">None yet.</li>}
            </ul>
          )}
        </div>
        <div className="bg-surface border border-line rounded-[14px]">
          <button onClick={() => setShowProducts(!showProducts)} className="w-full flex items-center justify-between px-5 py-3 text-left"><span className="font-display font-bold text-[14px] text-ink">Curated products <span className="text-ink-3 font-normal">· {products.length}</span></span><span className="text-[12px] text-ink-3">{showProducts ? 'Hide' : 'Show'}</span></button>
          {showProducts && (
            <ul className="m-0 p-0 list-none divide-y divide-line-2 border-t border-line-2">
              {products.map((p) => (
                <li key={p.id} className="px-5 py-2.5 text-[12.5px]"><p className="text-ink font-medium">{p.vendor_name} / {p.product_name}{p.is_test && <Chip tone="warn" mono className="ml-2">TEST</Chip>}</p><p className="text-ink-3">{p.pricing_metric}{p.sku ? ` · ${p.sku}` : ''}{p.category ? ` · ${p.category}` : ''}{p.aliases?.length ? ` · aliases: ${p.aliases.join(', ')}` : ''}</p></li>
              ))}
              {products.length === 0 && <li className="px-5 py-3 text-ink-3 text-[12.5px]">None yet.</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function SourceForm({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const [f, setF] = useState<any>({ name: '', source_type: 'vendor_quote', url: '', source_date: '', verification_level: 'unverified', notes: '', is_test: false })
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null)
  const submit = async () => {
    setBusy(true); setErr(null)
    const res = await fetch('/api/admin/benchmarks/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, url: f.url || null, source_date: f.source_date || null, notes: f.notes || null }) })
    const d = await res.json().catch(() => ({})); setBusy(false)
    if (!res.ok) { setErr(d.error || 'Save failed'); return }
    onDone()
  }
  return (
    <div className="bg-surface border border-line rounded-[14px] px-5 py-4">
      <div className="flex items-center justify-between mb-3"><p className="font-display font-bold text-[15px] text-ink">New source</p><button onClick={onClose} className="text-ink-3 hover:text-ink"><X className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2"><label className={labelCls}>Name *</label><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Datadog pricing page, Client X signed order form" /></div>
        <div><label className={labelCls}>Type *</label><select className={inputCls} value={f.source_type} onChange={(e) => setF({ ...f, source_type: e.target.value })}>{SOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className={labelCls}>Verification</label><select className={inputCls} value={f.verification_level} onChange={(e) => setF({ ...f, verification_level: e.target.value })}>{VERIFICATION.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>
        <div className="col-span-2"><label className={labelCls}>URL</label><input className={inputCls} value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} /></div>
        <div><label className={labelCls}>Source date</label><input className={inputCls} type="date" value={f.source_date} onChange={(e) => setF({ ...f, source_date: e.target.value })} /></div>
        <label className="flex items-center gap-2 text-[12.5px] text-ink-2 h-9 self-end"><input type="checkbox" checked={f.is_test} onChange={(e) => setF({ ...f, is_test: e.target.checked })} />Test data</label>
        <div className="col-span-2 md:col-span-4"><label className={labelCls}>Notes</label><input className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      {err && <p className="text-[12.5px] text-risk mt-3">{err}</p>}
      <div className="flex items-center gap-2 mt-4"><Btn variant="primary" size="sm" onClick={submit} disabled={busy || !f.name}>{busy ? 'Saving…' : 'Create source'}</Btn><Btn variant="ghost" size="sm" onClick={onClose}>Cancel</Btn></div>
    </div>
  )
}

function ProductForm({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const [f, setF] = useState<any>({ vendor_name: '', product_name: '', sku: '', category: '', pricing_metric: 'flat_total', aliases: '', is_test: false })
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null)
  const submit = async () => {
    setBusy(true); setErr(null)
    const res = await fetch('/api/admin/benchmarks/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, sku: f.sku || null, category: f.category || null, aliases: String(f.aliases).split(',').map((s: string) => s.trim()).filter(Boolean) }) })
    const d = await res.json().catch(() => ({})); setBusy(false)
    if (!res.ok) { setErr(d.error || 'Save failed'); return }
    onDone()
  }
  return (
    <div className="bg-surface border border-line rounded-[14px] px-5 py-4">
      <div className="flex items-center justify-between mb-3"><p className="font-display font-bold text-[15px] text-ink">New curated product</p><button onClick={onClose} className="text-ink-3 hover:text-ink"><X className="w-4 h-4" /></button></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className={labelCls}>Vendor *</label><input className={inputCls} value={f.vendor_name} onChange={(e) => setF({ ...f, vendor_name: e.target.value })} /></div>
        <div><label className={labelCls}>Product *</label><input className={inputCls} value={f.product_name} onChange={(e) => setF({ ...f, product_name: e.target.value })} /></div>
        <div><label className={labelCls}>SKU</label><input className={inputCls} value={f.sku} onChange={(e) => setF({ ...f, sku: e.target.value })} /></div>
        <div><label className={labelCls}>Category</label><select className={inputCls} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}><option value="">—</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className={labelCls}>Pricing metric *</label><select className={inputCls} value={f.pricing_metric} onChange={(e) => setF({ ...f, pricing_metric: e.target.value })}>{METRICS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
        <div className="col-span-2"><label className={labelCls}>Aliases (comma-separated)</label><input className={inputCls} value={f.aliases} onChange={(e) => setF({ ...f, aliases: e.target.value })} placeholder="Infra Pro, Infrastructure Pro plan" /></div>
        <label className="flex items-center gap-2 text-[12.5px] text-ink-2 h-9 self-end"><input type="checkbox" checked={f.is_test} onChange={(e) => setF({ ...f, is_test: e.target.checked })} />Test data</label>
      </div>
      {err && <p className="text-[12.5px] text-risk mt-3">{err}</p>}
      <div className="flex items-center gap-2 mt-4"><Btn variant="primary" size="sm" onClick={submit} disabled={busy || !f.vendor_name || !f.product_name}>{busy ? 'Saving…' : 'Create product'}</Btn><Btn variant="ghost" size="sm" onClick={onClose}>Cancel</Btn></div>
    </div>
  )
}
