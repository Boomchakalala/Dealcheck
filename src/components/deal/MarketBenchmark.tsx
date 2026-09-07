'use client'

import { useState } from 'react'
import { BarChart3, ChevronDown, ExternalLink, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/system'
import type { BenchmarkResult } from '@/lib/benchmark/types'
import type { BenchmarkInterpretation } from '@/types'

interface Props {
  benchmark: BenchmarkResult
  interpretation?: BenchmarkInterpretation | null
  fmt: (n: number) => string
  locale: string
  /** The section sits inside the Step 2 block, which already carries the step eyebrow. */
  showEyebrow?: boolean
}

const PRICE_TYPE_LABEL: Record<string, { en: string; fr: string }> = {
  executed_contract: { en: 'Executed contract', fr: 'Contrat signé' },
  negotiated_offer: { en: 'Negotiated offer', fr: 'Offre négociée' },
  initial_customer_quote: { en: 'Initial quote', fr: 'Devis initial' },
  third_party_aggregate: { en: 'Third-party aggregate', fr: 'Agrégat tiers' },
  public_list_price: { en: 'Public list price', fr: 'Prix public' },
}

/**
 * Market Benchmark section of the deal page. Every number here comes from the
 * deterministic engine result; the model's text is shown as commentary only.
 */
export function MarketBenchmark({ benchmark: b, interpretation, fmt, locale, showEyebrow = true }: Props) {
  const fr = locale === 'fr'
  const [showSources, setShowSources] = useState(false)
  // Only a published range is evidence. Anything else is the caller's one-line note, not this section.
  if (!b.benchmark_available) return null
  const confTone = b.confidence === 'high' ? 'green' : b.confidence === 'medium' ? 'warn' : 'neutral'
  const confLabel = b.confidence === 'high' ? (fr ? 'Confiance élevée' : 'High confidence') : b.confidence === 'medium' ? (fr ? 'Confiance moyenne' : 'Medium confidence') : (fr ? 'Confiance faible' : 'Low confidence')

  return (
    <section id="benchmark" className="scroll-mt-[196px]">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-[10px] grid place-items-center shrink-0 bg-info-soft text-info"><BarChart3 className="w-4 h-4" /></span>
        <div className="min-w-0 flex-1">
          {showEyebrow && <p className="tl-label text-[11.5px] text-green-deep mb-0.5">{fr ? 'Étape 2 · Analyse approfondie' : 'Step 2 · Deep Analysis'}</p>}
          <h3 className="tl-h3 text-ink">{fr ? 'Benchmark marché' : 'Market benchmark'}</h3>
          <p className="text-[12.5px] text-ink-2 mt-0.5">{fr ? 'Votre devis face aux prix observés pour ce fournisseur' : 'Your quote against observed prices for this vendor'}</p>
        </div>
        <Chip tone={confTone}>{confLabel}</Chip>
      </div>

      {b.benchmark_available ? (
        <div className="bg-surface border border-line rounded-[14px] overflow-hidden">
          {/* Headline numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line-2 border-b border-line-2">
            <Tile label={fr ? 'Votre devis' : 'Your quote'} value={fmt(b.quoted_price)} sub={basisLabel(b.basis, fr)} />
            <Tile label={fr ? 'Marché estimé' : 'Estimated fair market'} value={`${fmt(b.fair_market_low)} – ${fmt(b.fair_market_high)}`} sub={fr ? 'percentiles 30–60 pondérés' : 'weighted 30th–60th percentile'} />
            <Tile label={fr ? 'Résultat fort' : 'Strong outcome'} value={`${fmt(b.strong_outcome_low)} – ${fmt(b.strong_outcome_high)}`} sub={fr ? 'percentiles 10–30 pondérés' : 'weighted 10th–30th percentile'} tone="green" />
            <Tile
              label={fr ? 'Position marché' : 'Market position'}
              value={`${b.quote_vs_market_percent > 0 ? '+' : ''}${b.quote_vs_market_percent}%`}
              sub={b.quote_vs_market_percent > 0 ? (fr ? 'au-dessus de la médiane observée' : 'above observed median') : b.quote_vs_market_percent < 0 ? (fr ? 'sous la médiane observée' : 'below observed median') : (fr ? 'à la médiane observée' : 'at observed median')}
              tone={b.quote_vs_market_percent >= 10 ? 'risk' : b.quote_vs_market_percent <= 0 ? 'green' : 'neutral'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5 py-5">
            {/* Based on */}
            <div>
              <p className="tl-label text-ink-3 mb-2">{fr ? 'Basé sur' : 'Based on'}</p>
              <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                {b.evidence_summary.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink leading-snug"><span className="w-1.5 h-1.5 rounded-full bg-info shrink-0 mt-[7px]" />{e}</li>
                ))}
              </ul>
              {(interpretation?.target_price || interpretation?.opening_ask) && (
                <div className="mt-4 rounded-[10px] border border-green-line bg-green-soft px-4 py-3 grid grid-cols-2 gap-3">
                  {interpretation.target_price != null && (
                    <div><p className="tl-label text-green-deep">{fr ? 'Cible proposée' : 'Proposed target'}</p><p className="font-display font-bold text-[17px] text-ink tl-num mt-0.5">{fmt(interpretation.target_price)}</p></div>
                  )}
                  {interpretation.opening_ask != null && (
                    <div><p className="tl-label text-green-deep">{fr ? 'Demande d’ouverture' : 'Opening ask'}</p><p className="font-display font-bold text-[17px] text-ink tl-num mt-0.5">{fmt(interpretation.opening_ask)}</p></div>
                  )}
                  {interpretation.target_rationale && <p className="col-span-2 text-[12.5px] text-ink-2 leading-snug">{interpretation.target_rationale}</p>}
                </div>
              )}
            </div>

            {/* Why TermLift believes this */}
            <div>
              <p className="tl-label text-ink-3 mb-2">{fr ? 'Pourquoi TermLift le pense' : 'Why TermLift believes this'}</p>
              {interpretation?.summary && <p className="text-[13.5px] text-ink leading-relaxed mb-2">{interpretation.summary}</p>}
              {interpretation && interpretation.why_bullets.length > 0 ? (
                <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                  {interpretation.why_bullets.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-ink-2 leading-snug"><span className="text-ink-3 shrink-0">•</span>{w}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-ink-2 leading-snug">
                  {fr
                    ? `Le devis se situe ${Math.abs(b.quote_vs_market_percent)}% ${b.quote_vs_market_percent >= 0 ? 'au-dessus' : 'en dessous'} de la médiane pondérée de ${b.comparable_count} observations comparables.`
                    : `The quote sits ${Math.abs(b.quote_vs_market_percent)}% ${b.quote_vs_market_percent >= 0 ? 'above' : 'below'} the weighted median of ${b.comparable_count} comparable observations.`}
                </p>
              )}
              {interpretation?.limitations_note && <p className="text-[12.5px] text-ink-3 mt-2 leading-snug">{interpretation.limitations_note}</p>}
            </div>
          </div>

          {b.confidence === 'low' && (
            <p className="mx-5 mb-4 flex items-start gap-2 rounded-[10px] bg-warn-soft border border-warn-line px-3.5 py-2.5 text-[12.5px] text-ink"><Info className="w-3.5 h-3.5 text-warn shrink-0 mt-0.5" />{fr ? 'Confiance faible : traitez cette fourchette comme directionnelle, pas comme un prix de référence.' : 'Low confidence: treat this range as directional, not as a reference price.'}</p>
          )}

          <SourcesPanel b={b} fr={fr} open={showSources} onToggle={() => setShowSources(!showSources)} />
        </div>
      ) : null}
    </section>
  )
}

function basisLabel(basis: 'unit' | 'annualized' | 'total', fr: boolean) {
  if (basis === 'unit') return fr ? 'prix unitaire' : 'unit price'
  if (basis === 'annualized') return fr ? 'annualisé' : 'annualised'
  return fr ? 'valeur totale du contrat' : 'total contract value'
}

function Tile({ label, value, sub, tone = 'neutral' }: { label: string; value: string; sub?: string; tone?: 'neutral' | 'green' | 'risk' }) {
  return (
    <div className="px-5 py-4 min-w-0">
      <p className="tl-label text-ink-3">{label}</p>
      <p className={cn('font-display font-bold text-[19px] tracking-[-0.02em] tl-num mt-1 break-words', tone === 'green' ? 'text-green-deep' : tone === 'risk' ? 'text-risk' : 'text-ink')}>{value}</p>
      {sub && <p className="text-[12px] text-ink-3 mt-0.5 leading-snug">{sub}</p>}
    </div>
  )
}

function SourcesPanel({ b, fr, open, onToggle }: { b: BenchmarkResult; fr: boolean; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-line-2">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-surface-2 transition-colors" aria-expanded={open}>
        <span className="text-[13px] font-semibold text-ink-2">{fr ? 'Sources & méthodologie' : 'Sources & methodology'} <span className="font-normal text-ink-3">· {b.sources.length} {fr ? 'source(s)' : `source${b.sources.length === 1 ? '' : 's'}`} · {b.comparable_count} {fr ? 'comparables' : 'comparables'}</span></span>
        <ChevronDown className={cn('w-4 h-4 text-ink-3 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 flex flex-col gap-4">
            {b.sources.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead><tr className="text-left">
                    <th className="tl-label text-ink-3 font-normal pb-1.5 pr-3">{fr ? 'Source' : 'Source'}</th>
                    <th className="tl-label text-ink-3 font-normal pb-1.5 pr-3">{fr ? 'Type' : 'Type'}</th>
                    <th className="tl-label text-ink-3 font-normal pb-1.5 pr-3">{fr ? 'Date' : 'Date'}</th>
                    <th className="tl-label text-ink-3 font-normal pb-1.5 pr-3">{fr ? 'Observations' : 'Observations'}</th>
                    <th className="tl-label text-ink-3 font-normal pb-1.5">{fr ? 'Vérification' : 'Verification'}</th>
                  </tr></thead>
                  <tbody className="divide-y divide-line-2">
                    {b.sources.map((s) => (
                      <tr key={s.id}>
                        <td className="py-1.5 pr-3 text-ink">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink hover:text-green-deep no-underline">{s.name}<ExternalLink className="w-3 h-3 text-ink-3" /></a> : s.name}</td>
                        <td className="py-1.5 pr-3 text-ink-2">{s.price_types.map((p) => (PRICE_TYPE_LABEL[p] ? (fr ? PRICE_TYPE_LABEL[p].fr : PRICE_TYPE_LABEL[p].en) : p)).join(', ')}</td>
                        <td className="py-1.5 pr-3 text-ink-2 tl-num">{s.source_date || '—'}</td>
                        <td className="py-1.5 pr-3 text-ink-2 tl-num">{s.observation_count}</td>
                        <td className="py-1.5"><Chip tone={s.verification_level === 'verified' ? 'green' : s.verification_level === 'plausible' ? 'info' : 'neutral'} mono>{s.verification_level}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[12.5px] text-ink-3">{fr ? 'Aucune observation pour ce fournisseur.' : 'No observations on file for this vendor.'}</p>
            )}
            {b.methodology && (
              <div>
                <p className="tl-label text-ink-3 mb-1">{fr ? 'Méthodologie' : 'Methodology'}</p>
                <p className="text-[12.5px] text-ink-2 leading-relaxed">{b.methodology}</p>
              </div>
            )}
            {b.limitations.length > 0 && (
              <div>
                <p className="tl-label text-ink-3 mb-1">{fr ? 'Limites' : 'Limitations'}</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-1">
                  {b.limitations.map((l, i) => <li key={i} className="text-[12.5px] text-ink-2 leading-snug flex items-start gap-2"><span className="text-ink-3 shrink-0">•</span>{l}</li>)}
                </ul>
              </div>
            )}
            <p className="text-[11.5px] text-ink-3">{fr ? 'Moteur' : 'Engine'} {b.engine_version} · {fr ? 'calculé le' : 'computed'} {b.computed_at}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
