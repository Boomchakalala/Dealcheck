'use client'

import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { HelpCircle, Mail, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function HelpPage() {
  const t = useTranslations()

  const faqCategories = [
    {
      title: t('helpPage.cat1'),
      faqs: [
        { q: t('helpPage.cat1q1'), a: t('helpPage.cat1a1') },
        { q: t('helpPage.cat1q2'), a: t('helpPage.cat1a2') },
        { q: t('helpPage.cat1q3'), a: t('helpPage.cat1a3') },
      ],
    },
    {
      title: t('helpPage.cat2'),
      faqs: [
        { q: t('helpPage.cat2q1'), a: t('helpPage.cat2a1') },
        { q: t('helpPage.cat2q2'), a: t('helpPage.cat2a2') },
        { q: t('helpPage.cat2q3'), a: t('helpPage.cat2a3') },
      ],
    },
    {
      title: t('helpPage.cat3'),
      faqs: [
        { q: t('helpPage.cat3q1'), a: t('helpPage.cat3a1') },
        { q: t('helpPage.cat3q2'), a: t('helpPage.cat3a2') },
        { q: t('helpPage.cat3q3'), a: t('helpPage.cat3a3') },
      ],
    },
    {
      title: t('helpPage.cat4'),
      faqs: [
        { q: t('helpPage.cat4q1'), a: t('helpPage.cat4a1') },
        { q: t('helpPage.cat4q2'), a: t('helpPage.cat4a2') },
      ],
    },
    {
      title: t('helpPage.cat5'),
      faqs: [
        { q: t('helpPage.cat5q1'), a: t('helpPage.cat5a1') },
        { q: t('helpPage.cat5q2'), a: t('helpPage.cat5a2') },
        { q: t('helpPage.cat5q3'), a: t('helpPage.cat5a3') },
        { q: t('helpPage.cat5q4'), a: t('helpPage.cat5a4') },
      ],
    },
    {
      title: t('helpPage.cat6'),
      faqs: [
        { q: t('helpPage.cat6q1'), a: t('helpPage.cat6a1') },
        { q: t('helpPage.cat6q2'), a: t('helpPage.cat6a2') },
      ],
    },
  ]

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
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('helpPage.badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              {t('helpPage.title')}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
              {t('helpPage.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-8">
          {faqCategories.map((category, ci) => (
            <div key={ci} className={ci > 0 ? 'mt-12' : ''}>
              <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                {category.title}
              </h2>
              <div className="space-y-0 border-t border-slate-200/60">
                {category.faqs.map((item, i) => (
                  <details key={i} className="group border-b border-slate-200/60">
                    <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                      <span className="text-base font-medium text-slate-900 pr-8">{item.q}</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                    </summary>
                    <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-20 rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-10 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-2">{t('helpPage.stillHaveQuestions')}</p>
            <p className="text-sm text-slate-500 mb-5">{t('helpPage.wereHereToHelp')}</p>
            <a
              href="mailto:hello@termlift.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              hello@termlift.com
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
