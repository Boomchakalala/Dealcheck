'use client'

import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { ArrowRight, Shield, Eye, Target, Sparkles, Lock, Users, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_65%)] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/60 shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('footer.about')}</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.12] font-bold text-slate-900 tracking-tight mb-5">
              {t('about.heroTitle')}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>

        {/* Why TermLift Exists */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-6">
            {t('about.whyTitle')}
          </h2>
          <div className="text-base text-slate-600 leading-relaxed space-y-4">
            {(t('about.whyContent') as string).split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* What Makes Us Different — 3 cards */}
        <div className="bg-slate-50/60 border-y border-slate-200/60">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-10 text-center">
              {t('about.differenceTitle')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t('about.card1Title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t('about.card1Desc')}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t('about.card2Title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t('about.card2Desc')}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{t('about.card3Title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t('about.card3Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Built This */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-8 text-center">
            {t('about.founderTitle')}
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <span className="text-xl font-bold text-white">KO</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              {t('about.founderBio')}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-slate-50/60 border-y border-slate-200/60">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-10 text-center">
              {t('about.valuesTitle')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t('about.value1Title')}</h3>
                <p className="text-sm text-slate-600">{t('about.value1Desc')}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t('about.value2Title')}</h3>
                <p className="text-sm text-slate-600">{t('about.value2Desc')}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t('about.value3Title')}</h3>
                <p className="text-sm text-slate-600">{t('about.value3Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {t('about.ctaTitle')}
            </h2>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              {t('about.ctaButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link href="/example" className="text-sm font-medium text-emerald-200 hover:text-white">See examples</Link>
              <span className="text-emerald-400">|</span>
              <Link href="/pricing" className="text-sm font-medium text-emerald-200 hover:text-white">View pricing</Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
