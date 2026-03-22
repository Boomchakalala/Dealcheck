'use client'

import { useState } from 'react'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { OutputDisplay } from '@/components/OutputDisplay'
import { MarketingFooter } from '@/components/MarketingFooter'
import { examples, type ExampleType } from '@/lib/examples'
import { examplesFr } from '@/lib/examples-fr'
import { useI18n } from '@/i18n/context'
import Link from 'next/link'
import { Check, CheckCircle2 } from 'lucide-react'

export default function ExamplePage() {
  const { locale, t } = useI18n()
  const [selectedExample, setSelectedExample] = useState<ExampleType>('docusign')

  const currentExamples = locale === 'fr' ? examplesFr : examples

  const closedDeals: Record<ExampleType, { original: string; final: string; savings: string; savingsPct: string; date: string; tags: string[]; wins: { type: string; label: string; amount?: string }[] }> = {
    docusign: {
      original: '€24,000', final: '€16,200', savings: '€7,800', savingsPct: '32.5%', date: 'Apr 5, 2026',
      tags: ['Seats right-sized', 'Loyalty discount', 'Notice extended'],
      wins: [
        { type: 'Price', label: 'Right-sized from 40 to 30 seats', amount: '€6,000/yr' },
        { type: 'Price', label: '10% loyalty discount on adjusted contract', amount: '€1,800/yr' },
        { type: 'Terms', label: 'Auto-renew notice extended from 30 to 60 days' },
      ],
    },
    salesforce: {
      original: '€36,000', final: '€26,496', savings: '€9,504', savingsPct: '26%', date: 'May 15, 2026',
      tags: ['Seats right-sized', 'Multi-year discount', 'Price locked'],
      wins: [
        { type: 'Price', label: 'Right-sized from 40 to 32 seats', amount: '€7,200/yr' },
        { type: 'Price', label: '2-year commitment at 8% discount', amount: '€2,304/yr' },
        { type: 'Terms', label: 'Price locked for 2-year term' },
      ],
    },
    microsoft365: {
      original: '€28,800', final: '€21,312', savings: '€7,488', savingsPct: '26%', date: 'Apr 20, 2026',
      tags: ['Seats right-sized', 'Prepay discount', 'Billing simplified'],
      wins: [
        { type: 'Price', label: 'Right-sized from 60 to 48 seats', amount: '€5,760/yr' },
        { type: 'Price', label: 'Annual prepay rate €40 to €37/user', amount: '€1,728/yr' },
        { type: 'Terms', label: 'Auto-renew notice extended to 60 days' },
      ],
    },
    fedex: {
      original: '$51,960', final: '$39,408', savings: '$12,552', savingsPct: '24%', date: 'Mar 25, 2026',
      tags: ['Base rate reduced', 'Fuel capped', 'GRI capped'],
      wins: [
        { type: 'Price', label: 'Base rate reduced from $4.20 to $3.50/parcel', amount: '$8,400/yr' },
        { type: 'Price', label: 'Fuel surcharge capped at 12%', amount: '$4,152/yr' },
        { type: 'Terms', label: 'GRI capped at 3.5% annually' },
      ],
    },
    konica: {
      original: '€35,370', final: '€28,170', savings: '€7,200', savingsPct: '20%', date: 'Apr 12, 2026',
      tags: ['Lease reduced', 'Toner clause removed', 'Exit clause added'],
      wins: [
        { type: 'Price', label: 'Lease reduced from €870 to €700/month', amount: '€6,120/3yr' },
        { type: 'Terms', label: 'Exclusive toner clause removed' },
        { type: 'Terms', label: '18-month exit clause with 3-month buyout added' },
      ],
    },
    bdo: {
      original: '€24,150', final: '€19,038', savings: '€5,112', savingsPct: '21%', date: 'Mar 30, 2026',
      tags: ['Hourly rate reduced', 'Hours capped', 'Increase capped'],
      wins: [
        { type: 'Price', label: 'Hourly rate reduced from €210 to €150', amount: '€2,100/yr' },
        { type: 'Price', label: 'Annual increase capped at 3%', amount: '€1,512/yr' },
        { type: 'Terms', label: 'Hard annual cap of 35 hours with pre-approval' },
      ],
    },
  }

  const exampleTypes = [
    { id: 'docusign' as ExampleType, label: 'DocuSign', description: locale === 'fr' ? '24K € — économies 7,8K €/an' : '€24K renewal — saves €7.8K/yr' },
    { id: 'salesforce' as ExampleType, label: 'Salesforce', description: locale === 'fr' ? '36K € — économies 9,5K €/an' : '€36K renewal — saves €9.5K/yr' },
    { id: 'microsoft365' as ExampleType, label: 'Microsoft 365', description: locale === 'fr' ? '29K € — économies 7,5K €/an' : '€29K renewal — saves €7.5K/yr' },
    { id: 'fedex' as ExampleType, label: 'FedEx', description: locale === 'fr' ? '52K $ — économies 12,5K $/an' : '$52K contract — saves $12.5K/yr' },
    { id: 'konica' as ExampleType, label: 'Konica Minolta', description: locale === 'fr' ? '35K € — économies 7,2K €/3 ans' : '€35K lease — saves €7.2K/3yr' },
    { id: 'bdo' as ExampleType, label: 'BDO', description: locale === 'fr' ? '24K € — économies 5,1K €/an' : '€24K retainer — saves €5.1K/yr' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UnifiedHeader variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12">
        {/* Hero headline */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            See what TermLift finds in a real vendor quote.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-6">
            Pick a quote type below. Every analysis is based on realistic vendor scenarios.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/try"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Analyze your own quote
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Example Type Selector — visual tabs with savings */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exampleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedExample(type.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedExample === type.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-slate-900">{type.label}</h4>
                  {selectedExample === type.id && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">{type.description}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  {closedDeals[type.id].savings} saved
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Before/After summary card */}
        <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Original quote</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{closedDeals[selectedExample].original}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Red flags found</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">{currentExamples[selectedExample].red_flags?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">Savings identified</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-700">{closedDeals[selectedExample].savings}</p>
              <p className="text-[10px] font-semibold text-emerald-600">{closedDeals[selectedExample].savingsPct}</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            This quote looked clean. TermLift found {closedDeals[selectedExample].savings} in savings and {currentExamples[selectedExample].red_flags?.length || 0} red flags.
          </p>
        </div>

        {/* Closed Deal Banner — compact, eye-catching */}
        <div className="mb-8 bg-emerald-600 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm sm:text-base font-bold text-white">
              {locale === 'fr' ? 'Contrat gagné' : 'Deal Won'} — {closedDeals[selectedExample].savings} {locale === 'fr' ? 'économisés' : 'saved'}
            </span>
          </div>
          <button
            onClick={() => document.getElementById('negotiation-outcome')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            {locale === 'fr' ? 'Voir le résultat →' : 'See outcome →'}
          </button>
        </div>

        <OutputDisplay output={currentExamples[selectedExample]} />

        {/* Deal Closed — Win Summary (full outcome card) */}
        {(() => {
          const deal = closedDeals[selectedExample]
          return (
            <div id="negotiation-outcome" className="mt-10 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  {locale === 'fr' ? 'Résultat de la négociation' : 'Negotiation outcome'}
                </h2>
              </div>

              <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
                {/* Green header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-bold text-white">{locale === 'fr' ? 'Contrat clôturé' : 'Deal closed'}</span>
                  </div>
                  <span className="text-xs text-white/70 font-medium">{deal.date}</span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Stats: Original → Final → Savings */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Devis initial' : 'Original quote'}</p>
                      <p className="text-lg font-bold text-slate-900">{deal.original}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Montant final' : 'Final agreed'}</p>
                      <p className="text-lg font-bold text-slate-900">{deal.final}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Économies' : 'Savings captured'}</p>
                      <p className="text-lg font-bold text-emerald-800">{deal.savings}</p>
                      <p className="text-xs font-semibold text-emerald-600">{deal.savingsPct}</p>
                    </div>
                  </div>

                  {/* What changed pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {deal.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Wins secured */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">{locale === 'fr' ? 'Gains obtenus' : 'Wins secured'}</p>
                    <div className="space-y-2.5">
                      {deal.wins.map((win, idx) => (
                        <div key={idx} className={`flex items-start gap-3 pb-2.5 ${idx < deal.wins.length - 1 ? 'border-b border-slate-100' : ''}`}>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded flex-shrink-0 mt-0.5 ${
                            win.type === 'Price' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>{win.type}</span>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800">{win.label}</p>
                            {win.amount && <p className="text-xs font-semibold text-emerald-600 mt-0.5">{win.amount}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to analyze your own quote?</h3>
            <p className="text-sm text-slate-600 mb-5">Upload a PDF, image, or paste text. Get your analysis in under a minute.</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/try"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                Try with your own quote
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
