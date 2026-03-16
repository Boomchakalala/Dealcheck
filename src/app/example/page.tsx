'use client'

import { useState } from 'react'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { OutputDisplay } from '@/components/OutputDisplay'
import { MarketingFooter } from '@/components/MarketingFooter'
import { examples, type ExampleType } from '@/lib/examples'
import { examplesFr } from '@/lib/examples-fr'
import { useI18n } from '@/i18n/context'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function ExamplePage() {
  const { locale, t } = useI18n()
  const [selectedExample, setSelectedExample] = useState<ExampleType>('marketing')

  const currentExamples = locale === 'fr' ? examplesFr : examples

  const closedDeals: Record<ExampleType, { original: string; final: string; savings: string; savingsPct: string; date: string; tags: string[]; wins: { type: string; label: string; amount?: string }[] }> = {
    marketing: {
      original: '€111,600', final: '€94,800', savings: '€16,800', savingsPct: '15.1%', date: 'Mar 18, 2026',
      tags: ['Price reduced', 'Ad fee cut', 'Cancellation updated', 'Deliverables added'],
      wins: [
        { type: 'Price', label: 'Monthly retainer reduced from €7,500 to €7,000', amount: '€6,000/yr' },
        { type: 'Price', label: 'Ad management fee cut from 20% to 10%', amount: '€10,800/yr' },
        { type: 'Terms', label: 'Cancellation notice cut from 60 to 30 days' },
      ],
    },
    saas: {
      original: '€36,000', final: '€26,496', savings: '€9,504', savingsPct: '26.4%', date: 'Apr 2, 2026',
      tags: ['Seats right-sized', 'Multi-year discount', 'Price locked'],
      wins: [
        { type: 'Price', label: 'Right-sized from 40 to 32 seats', amount: '€7,200/yr' },
        { type: 'Price', label: '2-year commitment at 8% discount', amount: '€2,304/yr' },
        { type: 'Terms', label: 'Price locked for full 2-year term' },
      ],
    },
    supplies: {
      original: '€42,750', final: '€37,170', savings: '€5,580', savingsPct: '13.1%', date: 'Apr 10, 2026',
      tags: ['Volume discount', 'Delivery fees waived', 'Pricing locked'],
      wins: [
        { type: 'Price', label: 'Discount increased from 5% to 15%', amount: '€4,500/yr' },
        { type: 'Price', label: 'Delivery fees waived on all orders', amount: '€1,080/yr' },
        { type: 'Terms', label: 'Top 20 item prices locked for 12 months' },
      ],
    },
  }

  const exampleTypes = [
    { id: 'marketing' as ExampleType, label: locale === 'fr' ? 'Agence Marketing' : 'Marketing Agency', description: locale === 'fr' ? '112K € — économies 16,8K €/an' : '€112K retainer — saves €16.8K/yr' },
    { id: 'saas' as ExampleType, label: locale === 'fr' ? 'CRM SaaS' : 'SaaS CRM', description: locale === 'fr' ? '36K € — économies 9,5K €/an' : '€36K renewal — saves €9.5K/yr' },
    { id: 'supplies' as ExampleType, label: locale === 'fr' ? 'Fournitures Bureau' : 'Office Supplies', description: locale === 'fr' ? '43K € — économies 5,5K €/an' : '€43K contract — saves €5.6K/yr' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UnifiedHeader variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12">
        {/* Demo Banner */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-1">Example Analyses</h2>
              <p className="text-xs sm:text-sm text-blue-800 mb-3">
                See how TermLift evaluates different types of vendor quotes. All data is fictional but representative of real scenarios.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze Your Own Quote
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Example Type Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Choose Quote Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exampleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedExample(type.id)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  selectedExample === type.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900">{type.label}</h4>
                  {selectedExample === type.id && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-600">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        <OutputDisplay output={currentExamples[selectedExample]} />

        {/* Deal Closed — Win Summary */}
        {(() => {
          const deal = closedDeals[selectedExample]
          return (
            <div className="mt-8 mb-2">
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
