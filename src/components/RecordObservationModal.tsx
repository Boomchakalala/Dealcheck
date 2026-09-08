'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Database } from 'lucide-react'
import { toast } from 'sonner'
import { Btn, Chip } from '@/components/system'
import { cn } from '@/lib/utils'
import type { ObservationCandidate, OutcomeMapping } from '@/lib/benchmark/outcome-mapper'

interface Props {
  dealId: string
  onClose: () => void
}

const field = 'w-full h-9 px-3 text-[13px] text-ink bg-surface border border-line rounded-[10px] outline-none focus:border-green disabled:opacity-50 tl-num'
const TIER_LABEL: Record<string, string> = { inferred: 'Inferred', user_confirmed: 'User-confirmed', document_verified: 'Document-verified' }
const LEVEL_LABEL: Record<string, string> = { unverified: 'unverified', plausible: 'plausible', verified: 'verified' }

type Preview = { mapping: OutcomeMapping; provenance: string; maxVerification: 'unverified' | 'plausible' | 'verified'; extractionPresent: boolean; benchmarkInputPresent: boolean; historical?: boolean }

/**
 * Admin review before a closed-won deal becomes one benchmark observation.
 * Shows exactly what the deterministic mapper produced, lets the admin correct
 * structured values, and writes nothing until "Save observation" is clicked.
 */
export function RecordObservationModal({ dealId, onClose }: Props) {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [c, setC] = useState<ObservationCandidate | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/admin/benchmarks/outcome?dealId=${dealId}`)
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Failed to load'); return d as Preview })
      .then((d) => { if (!alive) return; setPreview(d); setC(d.mapping.candidate) })
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'Failed to load'))
    return () => { alive = false }
  }, [dealId])

  const set = <K extends keyof ObservationCandidate>(k: K, v: ObservationCandidate[K]) => setC((p) => (p ? { ...p, [k]: v } : p))
  const num = (v: string) => (v.trim() === '' ? null : Number(v))

  const save = async () => {
    if (!c || !preview) return
    setSaving(true); setError(null)
    try {
      const { levers, vendor_key: _vk, product_match: _pm, verification_level, confidence: _c, ...observation } = c
      void _vk; void _pm; void _c
      const res = await fetch('/api/admin/benchmarks/outcome', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, observation, verification_level, levers }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed to save')
      toast.success(`Observation recorded (${d.verification_level})`)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const tier = preview?.provenance ?? 'inferred'
  const tierTone: 'green' | 'info' | 'warn' = tier === 'document_verified' ? 'green' : tier === 'user_confirmed' ? 'info' : 'warn'

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-[14px] border border-line shadow-[0_24px_60px_-20px_rgba(16,26,23,0.35)] w-full max-w-[640px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 sm:px-6 py-4 border-b border-line sticky top-0 bg-surface z-10 flex items-start justify-between gap-4">
          <div>
            <p className="tl-label text-ink-3">Admin · benchmark</p>
            <h3 className="font-display font-bold text-[17px] leading-tight mt-1 inline-flex items-center gap-2"><Database className="w-4 h-4 text-ink-3" />Record as benchmark observation</h3>
            <p className="text-[12.5px] text-ink-2 mt-0.5">Review the structured facts. Nothing is written until you save.</p>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-ground" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-5 sm:px-6 py-5 flex flex-col gap-5">
          {!preview && !error && <p className="text-[13px] text-ink-3 inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Building the candidate…</p>}
          {error && <p className="text-[13.5px] text-risk bg-risk-soft border border-risk-line rounded-[10px] px-3.5 py-3">{error}</p>}

          {preview && (
            <>
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2">
                <Chip tone={tierTone}>{TIER_LABEL[tier] ?? tier}</Chip>
                <span>→ saved as <b className="text-ink">{LEVEL_LABEL[preview.maxVerification]}</b>. The tier comes from how the final total was established and cannot be raised here.</span>
              </div>

              {preview.historical && (
                <p className="text-[13px] text-ink bg-warn-soft border border-warn-line rounded-[10px] px-3.5 py-3"><b>Historical deal.</b> Analysed before quote totals were cross-checked against printed line totals. Verify the initial quote and final price against the source document by hand before saving.</p>
              )}
              {preview.mapping.blockers.length > 0 && (
                <p className="text-[13.5px] text-risk bg-risk-soft border border-risk-line rounded-[10px] px-3.5 py-3">Cannot build an observation: missing {preview.mapping.blockers.join(', ')}. Reopen the deal and close it with a confirmed final total.</p>
              )}

              {c && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <L label="Vendor"><input className={field} value={c.vendor_name} onChange={(e) => set('vendor_name', e.target.value)} /></L>
                    <L label={`Product (${c.product_match} match)`}><input className={field} value={c.product_name ?? ''} onChange={(e) => set('product_name', e.target.value || null)} /></L>
                    <L label="Pricing metric"><input className={field} value={c.pricing_metric} onChange={(e) => set('pricing_metric', e.target.value)} /></L>
                    <L label="Currency"><input className={field} value={c.currency} onChange={(e) => set('currency', e.target.value.toUpperCase())} /></L>
                    <L label="Initial quote"><input className={field} type="number" value={c.initial_quote ?? ''} onChange={(e) => set('initial_quote', num(e.target.value))} /></L>
                    <L label="Final price"><input className={field} type="number" value={c.final_price ?? ''} onChange={(e) => { const v = num(e.target.value); set('final_price', v); set('total_contract_value', v) }} /></L>
                    <L label="Quantity / seats"><input className={field} type="number" value={c.quantity ?? ''} onChange={(e) => set('quantity', num(e.target.value))} /></L>
                    <L label="Unit price (executed)"><input className={field} type="number" step="0.01" value={c.unit_price ?? ''} onChange={(e) => set('unit_price', num(e.target.value))} /></L>
                    <L label="Term (months)"><input className={field} type="number" value={c.term_months ?? ''} onChange={(e) => set('term_months', num(e.target.value))} /></L>
                    <L label="Annualised price"><input className={field} type="number" value={c.annualized_price ?? ''} onChange={(e) => set('annualized_price', num(e.target.value))} /></L>
                    <L label="Deal type">
                      <select className={field} value={c.deal_type} onChange={(e) => set('deal_type', e.target.value as ObservationCandidate['deal_type'])}>
                        {['new', 'renewal', 'expansion', 'unknown'].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </L>
                    <L label="Observation date"><input className={field} type="date" value={c.observation_date} onChange={(e) => set('observation_date', e.target.value)} /></L>
                  </div>

                  <div className="text-[12.5px] text-ink-2">
                    <span className="tl-label text-ink-3 mr-2">Levers</span>{c.levers.length ? c.levers.join(' · ') : <span className="text-ink-3">none recorded</span>}
                  </div>

                  {preview.mapping.missing.length > 0 && (
                    <p className="text-[12.5px] text-ink-2 bg-ground border border-line rounded-[10px] px-3.5 py-2.5">
                      <span className="font-semibold text-ink">Not available from this deal:</span> {preview.mapping.missing.join(', ')}.
                      {!preview.benchmarkInputPresent && ' Quantity and unit price come from the Negotiation Playbook; this deal was closed from the quick analysis.'}
                    </p>
                  )}
                </>
              )}
            </>
          )}

          <div className={cn('flex items-center justify-end gap-2.5 pt-4 border-t border-line')}>
            <Btn variant="ghost" onClick={onClose} disabled={saving}>Cancel</Btn>
            <Btn variant="primary" onClick={save} disabled={saving || !c || !preview || preview.mapping.blockers.length > 0}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save observation'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="tl-label text-ink-3 block mb-1">{label}</span>{children}</label>
}
