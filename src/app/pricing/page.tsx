import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { UpgradeButton } from '@/components/UpgradeButton'

export default async function PricingPage() {
  const t = await getTranslations()

  const starterFeatures = t.raw('pricingPage.starterFeatures') as string[]
  const proFeatures = t.raw('pricingPage.proFeatures') as string[]
  const businessFeatures = t.raw('pricingPage.businessFeatures') as string[]

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_65%)] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/60 shadow-sm mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('pricingPage.transparentPricing')}</span>
              </div>
              <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4 max-w-xl mx-auto">
                {t('pricing.title')}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
                {t('pricing.subtitle')}
              </p>
            </div>

            {/* 3-Tier Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

              {/* Starter (Free) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">{t('pricing.starter')}</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€0</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  {t('pricingPage.starterDesc')}
                </p>
                <ul className="space-y-3 mb-8">
                  {starterFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/try"
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm transition-all"
                >
                  {t('pricingPage.starterCta')}
                </Link>
              </div>

              {/* Pro (€39/mo) — Highlighted */}
              <div className="rounded-2xl border-2 border-emerald-500/60 p-7 relative bg-gradient-to-b from-emerald-50/50 to-white shadow-lg shadow-emerald-100/50 hover:shadow-2xl hover:shadow-emerald-100/60 transition-all duration-300">
                <div className="absolute -top-3.5 left-6">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full tracking-wide shadow-lg">
                    {t('pricing.mostPopular').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">{t('pricing.pro')}</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€39</span>
                  <span className="text-slate-500 ml-1.5 text-lg">{t('pricingPage.proPerMo')}</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  {t('pricingPage.proDesc')}
                </p>
                <ul className="space-y-3 mb-8">
                  {proFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <UpgradeButton
                  plan="pro"
                  label={t('nav.upgrade')}
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
                />
              </div>

              {/* Business (€149/mo) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">{t('pricing.business')}</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€149</span>
                  <span className="text-slate-500 ml-1.5 text-lg">{t('pricingPage.proPerMo')}</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  {t('pricingPage.businessDesc')}
                </p>
                <ul className="space-y-3 mb-8">
                  {businessFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-400 opacity-80 cursor-not-allowed transition-all"
                >
                  {t('pricing.comingSoon')}
                </button>
              </div>
            </div>
          </div>

          {/* Example link */}
          <div className="text-center mt-8 pb-8">
            <Link href="/example" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors group">
              {t('pricingPage.seeExample')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-10 text-center">{t('pricingPage.comparePlans')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 pr-4 font-semibold text-slate-900">{t('pricingPage.feature')}</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-900">{t('pricing.starter')}</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-700 bg-emerald-50/50 rounded-t-lg">{t('pricing.pro')}</th>
                  <th className="text-center py-4 pl-4 font-semibold text-slate-900">{t('pricing.business')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: t('pricingPage.aiAnalyses'), starter: t('pricingPage.fourTotal'), pro: t('pricingPage.unlimited'), business: t('pricingPage.unlimited') },
                  { feature: t('pricingPage.redFlagsNegotiation'), starter: true, pro: true, business: true },
                  { feature: t('pricingPage.emailDrafts3Tones'), starter: true, pro: true, business: true },
                  { feature: t('pricingPage.pdfImageTextInput'), starter: true, pro: true, business: true },
                  { feature: t('pricingPage.multiRoundTracking'), starter: false, pro: true, business: true },
                  { feature: t('pricingPage.personalDashboard'), starter: false, pro: true, business: true },
                  { feature: t('pricingPage.savingsTracking'), starter: false, pro: true, business: true },
                  { feature: t('pricingPage.dealHistory'), starter: t('pricingPage.none'), pro: t('pricingPage.ninetyDays'), business: t('pricingPage.oneYear') },
                  { feature: t('pricingPage.userSeats'), starter: t('pricingPage.one'), pro: t('pricingPage.one'), business: t('pricingPage.upTo3') },
                  { feature: t('pricingPage.sharedWorkspace'), starter: false, pro: false, business: true },
                  { feature: t('pricingPage.exportPdf'), starter: false, pro: false, business: true },
                  { feature: t('pricingPage.priorityAi'), starter: false, pro: false, business: true },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 text-slate-700 font-medium">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600">{row.starter}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-emerald-50/30">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600 font-medium">{row.pro}</span>}
                    </td>
                    <td className="py-3.5 pl-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600">{row.business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase mb-3 text-center">{t('pricingPage.commonQuestions')}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-12 text-center">{t('pricingPage.faqTitle')}</h2>
          <div className="space-y-0 border-t border-slate-200/60">
            {[
              { q: t('pricingPage.faq1q'), a: t('pricingPage.faq1a') },
              { q: t('pricingPage.faq2q'), a: t('pricingPage.faq2a') },
              { q: t('pricingPage.faq3q'), a: t('pricingPage.faq3a') },
              { q: t('pricingPage.faq4q'), a: t('pricingPage.faq4a') },
              { q: t('pricingPage.faq5q'), a: t('pricingPage.faq5a') },
            ].map((item, i) => (
              <details key={i} className="group border-b border-slate-200/60">
                <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                  <span className="text-sm font-medium text-slate-900 pr-8">{item.q}</span>
                  <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                </summary>
                <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
