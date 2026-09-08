'use client'

import { useState, useRef } from 'react'
import { Loader2, Upload, X, CheckCircle2, Paperclip, Pencil } from 'lucide-react'
import type { InferredDealType } from '@/lib/deal-type-inference'
import { dealTypeLabel } from '@/lib/deal-type-inference'
import { Btn, Chip } from '@/components/system'
import { cn } from '@/lib/utils'
import { NEGOTIATION_DOC_GRACE_DAYS, NEGOTIATION_DOC_MAX_AGE_DAYS } from '@/lib/retention'

export interface NegotiationAnalysisContext {
  verdict?: string | null
  targetPriceLow?: number | null
  targetPriceHigh?: number | null
  potentialSavings?: number | null
  currency?: string | null
  topRedFlags?: string[]
}

interface NegotiationRequestFormProps {
  source: 'post_analysis' | 'direct'
  dealId?: string
  roundId?: string
  defaultVendor?: string
  defaultCategory?: string
  defaultRenewalDate?: string
  defaultCurrentTotal?: string
  defaultDealType?: InferredDealType
  defaultDealTypeConfidence?: 'high' | 'low'
  analysisContext?: NegotiationAnalysisContext
  /** Whether this deal already has a persisted source document (extracted_text
   *  on the round) — when true, the full uploader stays collapsed behind a
   *  subtle "Add or replace document" action instead of showing by default. */
  hasStoredDocument?: boolean
  /** When false (anonymous visitor on the public /negotiate page), submitting routes through login and back. */
  isAuthenticated?: boolean
  /** Prefill from what the user already told the email generator (rounds.output_json.email_context) and their profile. */
  defaultObjective?: string
  defaultWalkAway?: string
  defaultCompetitor?: string
  defaultContactName?: string
  feePercent?: number
  locale?: string
}

// Same field styling as the rest of the app (deal page email context panel).
const inputCls = 'w-full h-10 px-3.5 rounded-[10px] border border-line bg-surface text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-green disabled:opacity-60'
const labelCls = 'text-[13px] font-semibold text-ink mb-1 block'
const helpCls = 'text-[12px] text-ink-3 mt-1'

export function NegotiationRequestForm({
  source, dealId, roundId, defaultVendor = '', defaultCategory = '', defaultRenewalDate = '', defaultCurrentTotal = '',
  defaultDealType, defaultDealTypeConfidence, analysisContext, hasStoredDocument = false, isAuthenticated = true,
  defaultObjective = '', defaultWalkAway = '', defaultCompetitor = '', defaultContactName = '', feePercent = 20, locale = 'en',
}: NegotiationRequestFormProps) {
  const fr = locale === 'fr'
  const [vendor, setVendor] = useState(defaultVendor)
  const [category, setCategory] = useState(defaultCategory)
  const [renewalDate, setRenewalDate] = useState(defaultRenewalDate)
  const [currentTotal, setCurrentTotal] = useState(defaultCurrentTotal)
  const [dealType, setDealType] = useState<InferredDealType | undefined>(defaultDealType)
  const [dealTypeConfirmed, setDealTypeConfirmed] = useState(defaultDealTypeConfidence === 'high')
  const [seatOrUsageNotes, setSeatOrUsageNotes] = useState('')
  const [contactName, setContactName] = useState(defaultContactName)
  const [contactPhone, setContactPhone] = useState('')
  const [vendorContactName, setVendorContactName] = useState('')
  const [vendorContactEmail, setVendorContactEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [negotiationObjective, setNegotiationObjective] = useState(defaultObjective)
  const [walkAwayNotes, setWalkAwayNotes] = useState(defaultWalkAway)
  const [competitorContext, setCompetitorContext] = useState(defaultCompetitor)
  const [file, setFile] = useState<File | null>(null)
  const [documentConsent, setDocumentConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pure UI state — does not touch submission behavior or the payload shape.
  // The known facts start as a summary row; "Edit" reveals the inputs. With
  // nothing prefilled (public /negotiate page) the inputs show straight away.
  const [editingFacts, setEditingFacts] = useState(!defaultVendor)
  const [showUploader, setShowUploader] = useState(!hasStoredDocument)
  const [showSupplierContact, setShowSupplierContact] = useState(false)

  const dealTypeOptions: InferredDealType[] = ['renewal', 'new_purchase', 'expansion', 'unknown']

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated) {
      window.location.href = '/login?from=negotiate&next=/negotiate'
      return
    }

    if (!vendor.trim()) {
      setError(fr ? 'Le fournisseur est obligatoire' : 'Vendor is required')
      return
    }
    if (file && !documentConsent) {
      setError(fr ? 'Merci de confirmer que le document peut être conservé pour la négociation' : 'Please confirm you consent to the document being retained for the negotiation')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('payload', JSON.stringify({
        source,
        dealId: dealId || null,
        roundId: roundId || null,
        vendor: vendor.trim(),
        category: category.trim() || null,
        renewalDate: renewalDate || null,
        currentTotal: currentTotal.trim() || null,
        seatOrUsageNotes: seatOrUsageNotes.trim() || null,
        contactName: contactName.trim() || null,
        contactPhone: contactPhone.trim() || null,
        vendorContactName: vendorContactName.trim() || null,
        vendorContactEmail: vendorContactEmail.trim() || null,
        notes: notes.trim() || null,
        documentConsent,
        dealType: dealType || null,
        dealTypeConfidence: dealType ? (dealTypeConfirmed ? 'high' : 'low') : null,
        negotiationObjective: negotiationObjective.trim() || null,
        walkAwayNotes: walkAwayNotes.trim() || null,
        competitorContext: competitorContext.trim() || null,
        analysisContext: analysisContext ? {
          verdict: analysisContext.verdict || null,
          targetPriceLow: analysisContext.targetPriceLow ?? null,
          targetPriceHigh: analysisContext.targetPriceHigh ?? null,
          potentialSavings: analysisContext.potentialSavings ?? null,
          currency: analysisContext.currency || null,
          topRedFlags: analysisContext.topRedFlags || [],
        } : null,
      }))
      if (file) formData.append('document', file)

      const res = await fetch('/api/negotiation-requests', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit request')
      setSubmittedId(typeof data.negotiationRequestId === 'string' ? data.negotiationRequestId : null)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-soft border border-green-line rounded-[14px] px-6 py-8 text-center">
        <span className="w-12 h-12 rounded-[12px] bg-surface border border-green-line grid place-items-center mx-auto mb-3"><CheckCircle2 className="w-6 h-6 text-green-deep" /></span>
        <h2 className="font-display font-bold text-[18px] text-ink">{fr ? 'Demande reçue' : 'Request received'}</h2>
        <p className="text-[13.5px] text-ink-2 mt-1.5 max-w-[42ch] mx-auto leading-relaxed">
          {fr ? 'Un négociateur examine le dossier et revient vers vous rapidement.' : "A negotiator will review this and follow up with you. You'll hear from us shortly."}
        </p>
        {submittedId && (
          <div className="mt-4"><Btn href={`/app/negotiations/${submittedId}`} variant="ink">{fr ? 'Suivre la négociation' : 'Track this negotiation'}</Btn></div>
        )}
      </div>
    )
  }

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString(fr ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const knownFacts = [
    { label: fr ? 'Fournisseur' : 'Vendor', value: vendor },
    { label: fr ? 'Catégorie' : 'Category', value: category },
    { label: fr ? 'Dépense actuelle' : 'Current spend', value: currentTotal },
    { label: fr ? 'Échéance' : 'Deadline', value: renewalDate ? fmtDate(renewalDate) : '' },
  ].filter((f) => f.value)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* ── 1. What we already know — a summary row, editable on demand ── */}
      <section className="bg-surface border border-line rounded-[14px] px-5 py-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="tl-label text-green-deep">{fr ? 'Déjà connu' : 'Already known'}</p>
            <h2 className="font-display font-bold text-[15px] text-ink mt-0.5">{fr ? 'Le dossier' : 'The deal'}</h2>
          </div>
          {!editingFacts && knownFacts.length > 0 && (
            <button type="button" onClick={() => setEditingFacts(true)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2 hover:text-green-deep transition-colors"><Pencil className="w-3.5 h-3.5" />{fr ? 'Modifier' : 'Edit'}</button>
          )}
        </div>

        {!editingFacts && knownFacts.length > 0 ? (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 m-0">
            {knownFacts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="tl-label text-ink-3">{f.label}</dt>
                <dd className="m-0 text-[14px] font-semibold text-ink mt-0.5 break-words">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div><label className={labelCls}>{fr ? 'Fournisseur *' : 'Vendor *'}</label><input className={inputCls} value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. DocuSign" disabled={loading} /></div>
            <div><label className={labelCls}>{fr ? 'Catégorie' : 'Category'}</label><input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. SaaS & Software" disabled={loading} /></div>
            <div><label className={labelCls}>{fr ? 'Dépense / valeur actuelle' : 'Current spend / value'}</label><input className={inputCls} value={currentTotal} onChange={(e) => setCurrentTotal(e.target.value)} placeholder="e.g. €24,000/yr" disabled={loading} /></div>
            <div><label className={labelCls}>{fr ? 'Renouvellement / échéance de décision' : 'Renewal / decision deadline'}</label><input type="date" className={inputCls} value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} disabled={loading} /></div>
          </div>
        )}

        {/* Deal type — settled chip with Change, or the options when the document wasn't clear. */}
        {dealType && dealType !== 'unknown' && (
          <div className="mt-3.5 pt-3.5 border-t border-line-2 flex flex-wrap items-center gap-2">
            <span className="tl-label text-ink-3 mr-1">{fr ? 'Type' : 'Deal type'}</span>
            {dealTypeConfirmed ? (
              <>
                <Chip tone="green">{dealTypeLabel(dealType)}</Chip>
                <button type="button" onClick={() => setDealTypeConfirmed(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">{fr ? 'Changer' : 'Change'}</button>
              </>
            ) : (
              <>
                <span className="text-[12.5px] text-ink-2 w-full sm:w-auto">{fr ? <>Le document n’était pas clair — nous pensons à <strong>{dealTypeLabel(dealType).toLowerCase()}</strong> :</> : <>The document wasn’t fully clear — we think <strong>{dealTypeLabel(dealType).toLowerCase()}</strong>:</>}</span>
                {dealTypeOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => { setDealType(opt); setDealTypeConfirmed(true) }} className={cn('h-8 px-3 rounded-lg text-[12.5px] font-semibold border transition-colors', opt === dealType ? 'bg-green-soft border-green-line text-green-deep' : 'bg-surface border-line text-ink-2 hover:border-[#C9D3CE]')}>
                    {dealTypeLabel(opt)}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      {/* ── 2. What the quote can't tell us — the part that matters ── */}
      <section className="bg-surface border border-green-line rounded-[14px] px-5 py-4">
        <p className="tl-label text-green-deep">{fr ? 'Ce que le devis ne dit pas' : "What the quote can't tell us"}</p>
        <h2 className="font-display font-bold text-[15px] text-ink mt-0.5">{fr ? 'Dites-le au négociateur' : 'Tell the negotiator'}</h2>
        <p className="text-[12.5px] text-ink-2 mt-1 mb-4">{fr ? 'Tout est facultatif. Chaque ligne remplie rend la négociation plus précise.' : 'All optional. Every line you fill in makes the negotiation sharper.'}</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>{fr ? 'Quel résultat espérez-vous ?' : 'What outcome are you hoping for?'}</label>
            <input className={inputCls} value={negotiationObjective} onChange={(e) => setNegotiationObjective(e.target.value)} placeholder={fr ? 'ex. 15 % de remise et suppression du renouvellement auto' : 'e.g. 15% off and remove auto-renewal'} disabled={loading} />
            <p className={helpCls}>{fr ? 'Le prix, mais aussi les conditions : durée, paiement, renouvellement, périmètre.' : 'Price, but also terms: term length, payment, renewal, scope.'}</p>
          </div>
          <div>
            <label className={labelCls}>{fr ? 'Marge de manœuvre' : 'How much room do you have?'}</label>
            <input className={inputCls} value={walkAwayNotes} onChange={(e) => setWalkAwayNotes(e.target.value)} placeholder={fr ? 'ex. On changerait de fournisseur si le prix ne baisse pas' : "e.g. We'd switch if the price doesn't come down"} disabled={loading} />
            <p className={helpCls}>{fr ? 'Pouvez-vous partir, ou préférez-vous rester ? Cela change la posture.' : 'Can you walk away, or would you rather stay? It changes the posture we take.'}</p>
          </div>
          <div>
            <label className={labelCls}>{fr ? 'Devis concurrents ou alternatives' : 'Competing quotes or alternatives'}</label>
            <input className={inputCls} value={competitorContext} onChange={(e) => setCompetitorContext(e.target.value)} placeholder={fr ? 'ex. Devis concurrent à 41 000 €' : 'e.g. Also quoted by a competitor at €41,000'} disabled={loading} />
            <p className={helpCls}>{fr ? 'Le levier le plus fort que nous puissions utiliser, si vous en avez un.' : 'The strongest lever we can use, if you have one.'}</p>
          </div>
          <div>
            <label className={labelCls}>{fr ? 'Sièges / usage' : 'Seats / usage'} <span className="font-normal text-ink-3">({fr ? 'si pertinent' : 'if relevant'})</span></label>
            <input className={inputCls} value={seatOrUsageNotes} onChange={(e) => setSeatOrUsageNotes(e.target.value)} placeholder={fr ? 'ex. 40 licences, ~25 réellement utilisées' : 'e.g. 40 seats licensed, ~25 actually used'} disabled={loading} />
          </div>
        </div>
      </section>

      {/* ── 3. Handoff — light ── */}
      <section className="bg-surface border border-line rounded-[14px] px-5 py-4">
        <p className="tl-label text-ink-3">{fr ? 'Passation' : 'Handoff'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
          <div><label className={labelCls}>{fr ? 'Votre nom' : 'Your name'}</label><input className={inputCls} value={contactName} onChange={(e) => setContactName(e.target.value)} disabled={loading} /></div>
          <div><label className={labelCls}>{fr ? 'Votre téléphone' : 'Your phone'} <span className="font-normal text-ink-3">({fr ? 'facultatif' : 'optional'})</span></label><input className={inputCls} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} disabled={loading} /></div>
        </div>
        {!showSupplierContact ? (
          <button type="button" onClick={() => setShowSupplierContact(true)} className="mt-3 text-[12.5px] font-semibold text-ink-2 hover:text-green-deep transition-colors">+ {fr ? 'Contact chez le fournisseur' : 'Supplier contact'} <span className="font-normal text-ink-3">— {fr ? 'si connu' : 'if known'}</span></button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
            <div><label className={labelCls}>{fr ? 'Nom du contact fournisseur' : 'Supplier contact name'}</label><input className={inputCls} value={vendorContactName} onChange={(e) => setVendorContactName(e.target.value)} disabled={loading} /></div>
            <div><label className={labelCls}>{fr ? 'E-mail du contact fournisseur' : 'Supplier contact email'}</label><input className={inputCls} value={vendorContactEmail} onChange={(e) => setVendorContactEmail(e.target.value)} disabled={loading} /></div>
          </div>
        )}
        <div className="mt-3.5">
          <label className={labelCls}>{fr ? 'Relation, contexte, contraintes' : 'Relationship, context, constraints'}</label>
          <textarea className={cn(inputCls, 'h-auto py-2.5 resize-y')} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={fr ? 'Tout ce que le négociateur devrait savoir' : 'Anything else the negotiator should know'} disabled={loading} />
        </div>

        {/* Document — subtle when one's already stored; the uploader only appears on request. */}
        <div className="mt-3.5">
          {!showUploader ? (
            <button type="button" onClick={() => setShowUploader(true)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2 hover:text-green-deep transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> {fr ? 'Ajouter ou remplacer le document' : 'Add or replace document'}
            </button>
          ) : (
            <>
              <label className={labelCls}>{fr ? 'Devis ou contrat' : 'Quote or contract document'} <span className="font-normal text-ink-3">({hasStoredDocument ? (fr ? 'remplace celui enregistré' : 'replaces the stored one') : (fr ? 'facultatif' : 'optional')})</span></label>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={loading} />
              {!file ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[10px] border border-dashed border-line hover:border-green hover:bg-green-soft/40 transition-colors text-[13px] font-semibold text-ink-2">
                  <Upload className="w-4 h-4" /> {fr ? 'Importer un PDF ou une image' : 'Upload PDF or image'}
                </button>
              ) : (
                <div className="flex items-center justify-between px-3 py-2.5 bg-green-soft border border-green-line rounded-[10px]">
                  <span className="text-[13px] font-semibold text-ink truncate">{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); setDocumentConsent(false) }} className="p-1 rounded-md hover:bg-surface"><X className="w-4 h-4 text-green-deep" /></button>
                </div>
              )}
              {file && (
                <label className="flex items-start gap-2 mt-2 text-[12.5px] text-ink-2 leading-relaxed">
                  <input type="checkbox" checked={documentConsent} onChange={(e) => setDocumentConsent(e.target.checked)} className="mt-0.5" disabled={loading} />
                  {fr
                    ? `J’accepte que TermLift conserve ce document pour la négociation. Il est supprimé ${NEGOTIATION_DOC_GRACE_DAYS} jours après la clôture du dossier, ou au plus tard ${Math.round(NEGOTIATION_DOC_MAX_AGE_DAYS / 30)} mois après l’import.`
                    : `I consent to TermLift keeping this document for the negotiation. It is removed ${NEGOTIATION_DOC_GRACE_DAYS} days after the case closes, or ${Math.round(NEGOTIATION_DOC_MAX_AGE_DAYS / 30)} months after upload at the latest.`}
                </label>
              )}
            </>
          )}
        </div>
      </section>

      {error && <p role="alert" className="text-[13px] text-risk bg-risk-soft border border-risk-line rounded-[10px] px-3.5 py-2.5">{error}</p>}

      {/* ── Submit — sticky from tablet up so the action is never out of reach; on phones it would eat a fifth of the screen, so it stays in flow ── */}
      <div className="sm:sticky bottom-0 -mx-1 px-1 pb-1 pt-2 bg-ground/95 backdrop-blur-sm">
        <div className="bg-surface border border-line rounded-[14px] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <Btn type="submit" variant="primary" disabled={loading} className="w-full sm:w-auto">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {fr ? 'Envoi…' : 'Submitting…'}</> : (fr ? 'Envoyer la demande de négociation' : 'Submit negotiation request')}
          </Btn>
          <p className="text-[12.5px] text-ink-2">
            <strong className="text-ink">{feePercent}% {fr ? 'des économies vérifiées' : 'of verified savings'}</strong> · {fr ? "Pas d'économies, pas de frais." : 'No savings, no fee.'}
          </p>
        </div>
        {!isAuthenticated && (
          <p className="text-[12px] text-ink-3 mt-2 px-1">{fr ? 'Vous devrez d’abord créer un compte gratuit pour suivre la négociation.' : "You'll be asked to create a free account first so we can keep you updated on the negotiation."}</p>
        )}
      </div>
    </form>
  )
}
