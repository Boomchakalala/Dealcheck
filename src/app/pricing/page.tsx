import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { UpgradeButton } from '@/components/UpgradeButton'
import { PrimaryButton } from '@/components/PrimaryButton'

export const metadata: Metadata = {
  title: 'Pricing — TermLift | Free Vendor Quote Analysis Tool',
  description: 'Start analyzing vendor quotes for free. Essentials at EUR15/mo for 10 analyses. Pro at EUR39/mo for unlimited analyses, deal tracking, and negotiation history. Save thousands on vendor contracts.',
  alternates: { canonical: 'https://www.termlift.com/pricing' },
}

export default async function PricingPage() {
  const t = await getTranslations()

  const starterFeatures = t.raw('pricingPage.starterFeatures') as string[]
  const essentialsFeatures = t.raw('pricingPage.essentialsFeatures') as string[]
  const proFeatures = t.raw('pricingPage.proFeatures') as string[]

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      {/* Noise texture removed — caused GPU-intensive repaints and scroll freezing */}

      {/* Header */}
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          {/* Landing-style radial mesh + grid pattern */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 80% 20%, rgba(29,185,84,0.14) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 20% 60%, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-20">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/80 shadow-sm mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t('pricingPage.transparentPricing')}</span>
              </div>
              <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.04] font-bold text-slate-900 tracking-tight mb-4 max-w-xl mx-auto" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.025em' }}>
                {t('pricing.title')}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
                {t('pricing.subtitle')}
              </p>
            </div>

            {/* 3-Tier Grid */}
            <div className="relative">
              {/* Subtle gradient mesh background */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/20 via-transparent to-emerald-50/10 rounded-3xl pointer-events-none blur-2xl" />
              <div className="grid md:grid-cols-3 gap-6 lg:gap-7 max-w-4xl mx-auto relative">

              {/* Starter (Free) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t('pricing.starter')}</p>
                <div className="mb-4">
                  <span className="text-[44px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em' }}>{t('pricingPage.freePrice')}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {t('pricingPage.starterDesc')}
                </p>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {starterFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <PrimaryButton href="/try" variant="ghost" size="md" className="w-full">
                  {t('pricingPage.starterCta')}
                </PrimaryButton>
              </div>

              {/* Essentials (EUR15/mo) — NEW */}
              <div className="rounded-2xl border-2 border-emerald-500/60 p-7 sm:p-8 relative bg-gradient-to-b from-emerald-50/50 to-white shadow-xl shadow-emerald-100/60 hover:shadow-2xl hover:shadow-emerald-100/80 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="absolute -top-3.5 left-6">
                  <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full tracking-widest uppercase shadow-md" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {t('pricing.mostPopular')}
                  </span>
                </div>
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t('pricing.essentials')}</p>
                <div className="mb-4">
                  <span className="text-[44px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em' }}>{t('pricingPage.essentialsPrice')}</span>
                  <span className="text-slate-500 ml-1.5 text-lg">{t('pricingPage.proPerMo')}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {t('pricingPage.essentialsDesc')}
                </p>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {essentialsFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <UpgradeButton
                  plan="essentials"
                  label={t('pricingPage.essentialsCta')}
                  className="block w-full text-center px-5 py-3 text-sm font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:-translate-y-0.5 shadow-[0_8px_24px_-6px_rgba(29,185,84,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(29,185,84,0.55)]"
                />
              </div>

              {/* Pro (EUR39/mo) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t('pricing.pro')}</p>
                <div className="mb-4">
                  <span className="text-[44px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em' }}>{t('pricingPage.proPrice')}</span>
                  <span className="text-slate-500 ml-1.5 text-lg">{t('pricingPage.proPerMo')}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {t('pricingPage.proDesc')}
                </p>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {proFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <UpgradeButton
                  plan="pro"
                  label={t('pricingPage.proCta')}
                  className="block w-full text-center px-5 py-3 text-sm font-bold rounded-xl border-2 border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-[0_4px_12px_-4px_rgba(29,185,84,0.25)]"
                />
              </div>

              </div>
            </div>
          </div>

          {/* Example link */}
          <div className="text-center mt-8 pb-8">
            <Link href="/demo" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors group">
              {t('pricingPage.seeExample')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <h2 className="text-2xl sm:text-[34px] font-bold text-slate-900 mb-12 text-center" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.022em' }}>{t('pricingPage.comparePlans')}</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 pr-4 font-semibold text-slate-900">{t('pricingPage.feature')}</th>
                  <th className="text-center py-4 px-3 font-semibold text-slate-900">{t('pricing.starter')}</th>
                  <th className="text-center py-4 px-3 font-semibold text-emerald-700 bg-emerald-50/50 rounded-t-lg">{t('pricing.essentials')}</th>
                  <th className="text-center py-4 pl-3 font-semibold text-slate-900">{t('pricing.pro')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {([
                  { feature: t('pricingPage.aiAnalyses'), starter: t('pricingPage.fourTotal'), essentials: t('pricingPage.tenPerMonth'), pro: t('pricingPage.unlimited') },
                  { feature: t('pricingPage.redFlagsNegotiation'), starter: true, essentials: true, pro: true },
                  { feature: t('pricingPage.emailDrafts3Tones'), starter: true, essentials: true, pro: true },
                  { feature: t('pricingPage.pdfImageTextInput'), starter: true, essentials: true, pro: true },
                  { feature: t('pricingPage.saveDealHistory'), starter: false, essentials: t('pricingPage.thirtyDays'), pro: t('pricingPage.fullHistory') },
                  { feature: t('pricingPage.multiRoundTracking'), starter: false, essentials: t('pricingPage.twoRounds'), pro: t('pricingPage.unlimited') },
                  { feature: t('pricingPage.emailRegen'), starter: false, essentials: t('pricingPage.onePerRound'), pro: t('pricingPage.threePerRound') },
                  { feature: t('pricingPage.negotiationPrefs'), starter: false, essentials: true, pro: true },
                  { feature: t('pricingPage.personalDashboard'), starter: false, essentials: t('pricingPage.preview'), pro: t('pricingPage.full') },
                  { feature: t('pricingPage.savingsTracking'), starter: false, essentials: false, pro: true },
                  { feature: t('pricingPage.exportPdf'), starter: false, essentials: false, pro: true },
                ] as Array<{ feature: string; starter: string | boolean; essentials: string | boolean; pro: string | boolean }>).map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 text-slate-700 font-medium">{row.feature}</td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600">{row.starter}</span>}
                    </td>
                    <td className="py-3.5 px-3 text-center bg-emerald-50/30">
                      {typeof row.essentials === 'boolean' ? (
                        row.essentials ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600 font-medium">{row.essentials}</span>}
                    </td>
                    <td className="py-3.5 pl-3 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600 font-medium">{row.pro}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-[12px] font-bold tracking-widest text-emerald-600 uppercase mb-3 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t('pricingPage.commonQuestions')}</p>
          <h2 className="text-2xl sm:text-[34px] font-bold text-slate-900 mb-12 text-center" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.022em' }}>{t('pricingPage.faqTitle')}</h2>
          <div className="space-y-0 border-t border-slate-200/60">
            {[
              { q: t('pricingPage.faq1q'), a: t('pricingPage.faq1a') },
              { q: t('pricingPage.faq2q'), a: t('pricingPage.faq2a') },
              { q: t('pricingPage.faq3q'), a: t('pricingPage.faq3a') },
              { q: t('pricingPage.faq4q'), a: t('pricingPage.faq4a') },
              { q: t('pricingPage.faq5q'), a: t('pricingPage.faq5a') },
              { q: t('pricingPage.faq6q'), a: t('pricingPage.faq6a') },
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
