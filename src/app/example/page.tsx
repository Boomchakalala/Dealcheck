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
import { ScoreCircle } from '@/components/ScoreCircle'

export default function ExamplePage() {
  const { locale, t } = useI18n()
  const [selectedExample, setSelectedExample] = useState<ExampleType>('docusign')

  const currentExamples = locale === 'fr' ? examplesFr : examples

  const closedDeals: Record<ExampleType, { original: string; final: string; savings: string; savingsPct: string; date: string; tags: string[]; wins: { type: string; label: string; amount?: string }[] }> = {
    docusign: {
      original: '€24,000', final: '€17,100', savings: '€6,900', savingsPct: '29%', date: 'Apr 5, 2026',
      tags: ['Seats right-sized', 'Loyalty discount', 'Notice extended'],
      wins: [
        { type: 'Price', label: 'Right-sized from 40 to 30 seats', amount: '€6,000/yr' },
        { type: 'Price', label: '5% loyalty discount on adjusted contract', amount: '€900/yr' },
        { type: 'Terms', label: 'Auto-renew notice extended from 30 to 60 days' },
      ],
    },
    salesforce: {
      original: '€36,000', final: '€27,360', savings: '€8,640', savingsPct: '24%', date: 'May 15, 2026',
      tags: ['Seats right-sized', 'Multi-year discount', 'Price locked'],
      wins: [
        { type: 'Price', label: 'Right-sized from 40 to 32 seats', amount: '€7,200/yr' },
        { type: 'Price', label: '2-year commitment at 5% discount', amount: '€1,440/yr' },
        { type: 'Terms', label: 'Price locked for 2-year term' },
      ],
    },
    microsoft365: {
      original: '€22,800', final: '€22,116', savings: '€684', savingsPct: '3%', date: 'Apr 20, 2026',
      tags: ['Price locked', 'Notice extended'],
      wins: [
        { type: 'Price', label: '3% loyalty discount on 2-year commit', amount: '€684/yr' },
        { type: 'Terms', label: 'Auto-renew notice extended to 60 days' },
        { type: 'Terms', label: 'Pricing locked for 2 years' },
      ],
    },
    fedex: {
      original: '$51,960', final: '$41,160', savings: '$10,800', savingsPct: '21%', date: 'Mar 25, 2026',
      tags: ['Base rate reduced', 'Fuel capped', 'GRI capped'],
      wins: [
        { type: 'Price', label: 'Base rate reduced from $4.20 to $3.60/parcel', amount: '$7,200/yr' },
        { type: 'Price', label: 'Fuel surcharge capped at 14%', amount: '$3,600/yr' },
        { type: 'Terms', label: 'GRI capped at 4% annually' },
      ],
    },
    konica: {
      original: '€35,370', final: '€29,610', savings: '€5,760', savingsPct: '16%', date: 'Apr 12, 2026',
      tags: ['Lease reduced', 'Toner clause removed', 'Exit clause added'],
      wins: [
        { type: 'Price', label: 'Lease reduced from €870 to €750/month', amount: '€4,320/3yr' },
        { type: 'Terms', label: 'Exclusive toner clause removed — open sourcing allowed' },
        { type: 'Terms', label: '24-month exit clause with 3-month buyout added' },
      ],
    },
    bdo: {
      original: '€24,150', final: '€20,650', savings: '€3,500', savingsPct: '14.5%', date: 'Mar 30, 2026',
      tags: ['Hourly rate reduced', 'Hours capped', 'Increase capped'],
      wins: [
        { type: 'Price', label: 'Hourly rate reduced from €210 to €170', amount: '€1,400/yr' },
        { type: 'Price', label: 'Annual increase capped at 4%', amount: '€1,344/yr' },
        { type: 'Terms', label: 'Hard annual cap of 40 hours with pre-approval' },
      ],
    },
  }

  const exampleTypes = [
    { id: 'docusign' as ExampleType, label: 'DocuSign', description: locale === 'fr' ? '24K € — économies ~6-8K €/an' : '€24K renewal — saved €6.9K/yr' },
    { id: 'salesforce' as ExampleType, label: 'Salesforce', description: locale === 'fr' ? '36K € — économies ~7-9K €/an' : '€36K renewal — saved €8.6K/yr' },
    { id: 'microsoft365' as ExampleType, label: 'Microsoft 365', description: locale === 'fr' ? '23K € — contrat propre' : '€23K renewal — clean deal' },
    { id: 'fedex' as ExampleType, label: 'FedEx', description: locale === 'fr' ? '52K $ — économies ~10-12K $/an' : '$52K contract — saved $10.8K/yr' },
    { id: 'konica' as ExampleType, label: 'Konica Minolta', description: locale === 'fr' ? '35K € — économies ~5-7K €/3 ans' : '€35K lease — saved €5.8K/3yr' },
    { id: 'bdo' as ExampleType, label: 'BDO', description: locale === 'fr' ? '24K € — économies ~3-5K €/an' : '€24K retainer — saved €3.5K/yr' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UnifiedHeader variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12">
        {/* Hero headline */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {t('examplePage.heroTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-6">
            {t('examplePage.heroSubtitle')}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/try"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {t('examplePage.analyzeOwn')}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('examplePage.createAccount')}
            </Link>
          </div>
        </div>

        {/* Example Type Selector — visual tabs with scores and savings */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exampleTypes.map((type) => {
              const exScore = currentExamples[type.id]?.score ?? 0
              const scoreColor = exScore >= 80 ? 'text-emerald-600' : exScore >= 60 ? 'text-amber-600' : 'text-orange-600'
              return (
              <button
                key={type.id}
                onClick={() => setSelectedExample(type.id)}
                className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all relative ${
                  selectedExample === type.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{type.label}</h4>
                  <div className="flex-shrink-0 ml-2">
                    <ScoreCircle
                      score={exScore}
                      size={36}
                      strokeWidth={3}
                      trackClass={exScore >= 80 ? 'stroke-emerald-100' : exScore >= 60 ? 'stroke-amber-100' : 'stroke-orange-100'}
                      ringClass={exScore >= 80 ? 'stroke-emerald-500' : exScore >= 60 ? 'stroke-amber-500' : 'stroke-orange-500'}
                      textClass={scoreColor}
                      showOutOf={false}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">{type.description}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  {closedDeals[type.id].savings} saved
                </div>
              </button>
              )
            })}
          </div>
        </div>

        {/* Closed Deal Banner — compact, eye-catching */}
        <div className="mb-8 bg-emerald-600 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm sm:text-base font-bold text-white">
              {t('examplePage.dealWon')} — {closedDeals[selectedExample].savings} {t('examplePage.saved')}
            </span>
          </div>
          <button
            onClick={() => document.getElementById('negotiation-outcome')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            {t('examplePage.seeOutcome')} →
          </button>
        </div>

        <OutputDisplay key={selectedExample} output={currentExamples[selectedExample]} />

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
                  {t('examplePage.negotiationOutcome')}
                </h2>
              </div>

              <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
                {/* Green header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-bold text-white">{t('examplePage.dealClosed')}</span>
                  </div>
                  <span className="text-xs text-white/70 font-medium">{deal.date}</span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Stats: Original → Final → Savings */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{t('examplePage.originalQuote')}</p>
                      <p className="text-lg font-bold text-slate-900">{deal.original}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{t('examplePage.finalAgreed')}</p>
                      <p className="text-lg font-bold text-slate-900">{deal.final}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
                      <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">{t('examplePage.savingsCapture')}</p>
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
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">{t('examplePage.winsSecured')}</p>
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('examplePage.readyToAnalyze')}</h3>
            <p className="text-sm text-slate-600 mb-5">{t('examplePage.readySubtitle')}</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/try"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                {t('examplePage.tryOwn')}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                {t('examplePage.createAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
