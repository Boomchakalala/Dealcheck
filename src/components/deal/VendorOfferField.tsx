'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Pencil } from 'lucide-react'
import { Btn, Chip } from '@/components/system'
import { formatCurrency, type Currency } from '@/lib/currency'
import { offerChange, type VendorOffer } from '@/lib/vendor-offer'

interface Props {
  roundId: string
  offer: VendorOffer | null
  /** The figure this round moved from: the previous round's offer, or the opening quote for Round 2. */
  previous: { amount: number | null; currency: string | null } | null
  fr: boolean
}

const fmt = (amount: number, currency: string | null) => formatCurrency(Math.round(amount), ((currency || 'EUR') as Currency))

/**
 * One line under a Round 2+ entry: the vendor's offer, what it moved from,
 * and — while the figure is only AI-inferred — a small confirm/edit control.
 * Provenance is decided by the server; this component only sends the number.
 */
export function VendorOfferField({ roundId, offer, previous, fr }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(offer?.amount != null ? String(offer.amount) : '')
  const [currency, setCurrency] = useState(offer?.currency || previous?.currency || 'EUR')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = async (payload: { amount: string; currency: string } | null) => {
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/round/${roundId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vendorOffer: payload }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!offer || offer.amount == null) {
    if (!editing) {
      return <button type="button" onClick={() => setEditing(true)} className="text-[12px] text-ink-3 hover:text-ink mt-1 inline-flex items-center gap-1"><Pencil className="w-3 h-3" />{fr ? 'Saisir le montant proposé par le fournisseur' : 'Record the vendor’s offered total'}</button>
    }
  }

  const change = offer?.amount != null ? offerChange(offer.amount, previous?.amount ?? null) : null
  const inferred = !!offer && offer.provenance === 'inferred'
  const provenanceChip = offer?.provenance === 'document_verified'
    ? <Chip tone="green" mono>{fr ? 'Document' : 'Document'}</Chip>
    : offer?.provenance === 'user_confirmed'
      ? <Chip mono>{fr ? 'Confirmé' : 'Confirmed'}</Chip>
      : <Chip tone="warn" mono>{fr ? 'À confirmer' : 'To confirm'}</Chip>

  return (
    <div className="mt-1.5">
      {offer?.amount != null && !editing && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
          <span className="text-ink-3">{fr ? 'Offre fournisseur' : 'Vendor offer'}</span>
          <span className="font-semibold text-ink tl-num">{fmt(offer.amount, offer.currency)}</span>
          {provenanceChip}
          {previous?.amount != null && change && (
            <span className="text-ink-3 tl-num">
              {fr ? 'précédent' : 'previous'} {fmt(previous.amount, previous.currency)} · <span className={change.delta < 0 ? 'text-green-deep' : change.delta > 0 ? 'text-risk' : ''}>{change.delta > 0 ? '+' : ''}{fmt(change.delta, offer.currency)} / {change.pct > 0 ? '+' : ''}{change.pct}%</span>
            </span>
          )}
          {offer.checks.currency === 'mismatch' && <span className="text-[11.5px] text-warn">{fr ? 'devise différente du devis' : 'currency differs from the quote'}</span>}
          {inferred && (
            <span className="inline-flex items-center gap-1.5">
              <Btn variant="primary" size="sm" onClick={() => save({ amount: String(offer.amount), currency: offer.currency || currency })} disabled={saving}>{saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}{fr ? 'Confirmer' : 'Confirm'}</Btn>
              <button type="button" onClick={() => setEditing(true)} className="text-[12px] text-ink-3 hover:text-ink">{fr ? 'Modifier' : 'Edit'}</button>
            </span>
          )}
          {!inferred && <button type="button" onClick={() => setEditing(true)} className="text-ink-3 hover:text-ink" aria-label={fr ? 'Modifier' : 'Edit'}><Pencil className="w-3 h-3" /></button>}
        </div>
      )}
      {editing && (
        <form className="flex flex-wrap items-center gap-1.5 text-[12.5px]" onSubmit={(e) => { e.preventDefault(); save({ amount, currency }) }}>
          <span className="text-ink-3">{fr ? 'Total proposé par le fournisseur' : 'Vendor’s offered total'}</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="94000" className="h-7 w-28 px-2 rounded-md border border-line bg-surface text-ink tl-num focus:outline-none focus:border-green" disabled={saving} />
          <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} className="h-7 w-14 px-2 rounded-md border border-line bg-surface text-ink uppercase focus:outline-none focus:border-green" disabled={saving} />
          <Btn variant="primary" size="sm" type="submit" disabled={saving || !amount.trim()}>{saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}{fr ? 'Enregistrer' : 'Save'}</Btn>
          <button type="button" onClick={() => setEditing(false)} className="text-ink-3 hover:text-ink" disabled={saving}>{fr ? 'Annuler' : 'Cancel'}</button>
          {offer && <button type="button" onClick={() => save(null)} className="text-ink-3 hover:text-ink" disabled={saving}>{fr ? 'Pas de montant dans cette réponse' : 'No total in this reply'}</button>}
        </form>
      )}
      {error && <p className="text-[12px] text-risk mt-1">{error}</p>}
    </div>
  )
}
