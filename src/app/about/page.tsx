'use client'

import Link from 'next/link'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { ArrowRight, Shield, Eye, Target, Lock, Users, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"
const green = '#1DB954'

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <MarketingHeader />

      <main className="flex-1">
        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="relative px-6 pt-20 sm:pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 360px at 50% 0%, rgba(29,185,84,0.13) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>
              {t('footer.about')}
            </p>
            <h1 className="text-slate-900 mb-5" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 54px)', lineHeight: 1.05, letterSpacing: '-0.028em' }}>
              {t('about.heroTitle')}
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </section>

        {/* ─── WHY TERMLIFT EXISTS ──────────────────────── */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-slate-900 mb-6" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.12, letterSpacing: '-0.022em' }}>
              {t('about.whyTitle')}
            </h2>
            <div className="text-[16px] text-slate-600 leading-relaxed space-y-4">
              {(t('about.whyContent') as string).split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT MAKES US DIFFERENT ──────────────────── */}
        <section className="px-6 py-20 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-slate-900 text-center mb-12" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.12, letterSpacing: '-0.022em' }}>
              {t('about.differenceTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: <Target className="w-6 h-6" />, title: t('about.card1Title'), desc: t('about.card1Desc') },
                { icon: <Users className="w-6 h-6" />, title: t('about.card2Title'), desc: t('about.card2Desc') },
                { icon: <Lock className="w-6 h-6" />, title: t('about.card3Title'), desc: t('about.card3Desc') },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                    {c.icon}
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 mb-2" style={{ fontFamily: sora }}>{c.title}</h3>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHO BUILT THIS ───────────────────────────── */}
        <section className="px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-slate-900 mb-8" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.12, letterSpacing: '-0.022em' }}>
              {t('about.founderTitle')}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `linear-gradient(135deg, ${green} 0%, #15a047 100%)`, boxShadow: '0 12px 28px -8px rgba(29,185,84,0.5)' }}>
                <span className="text-xl font-bold text-white" style={{ fontFamily: sora }}>KO</span>
              </div>
              <p className="text-[14.5px] text-slate-600 leading-relaxed max-w-lg mx-auto">
                {t('about.founderBio')}
              </p>
            </div>
          </div>
        </section>

        {/* ─── VALUES ───────────────────────────────────── */}
        <section className="px-6 py-20 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-slate-900 text-center mb-12" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.12, letterSpacing: '-0.022em' }}>
              {t('about.valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Eye className="w-5 h-5" />, title: t('about.value1Title'), desc: t('about.value1Desc') },
                { icon: <Heart className="w-5 h-5" />, title: t('about.value2Title'), desc: t('about.value2Desc') },
                { icon: <Shield className="w-5 h-5" />, title: t('about.value3Title'), desc: t('about.value3Desc') },
              ].map((v, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                    {v.icon}
                  </div>
                  <h3 className="text-[15.5px] font-bold text-slate-900 mb-1.5" style={{ fontFamily: sora }}>{v.title}</h3>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA — quiet white band ───────────────────── */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-slate-900 mb-6" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(28px, 3.8vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              {t('about.ctaTitle')}
            </h2>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
            >
              {t('about.ctaButton')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-4 text-[13px]">
              <Link href="/demo" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">See the demo</Link>
              <span className="text-slate-300">|</span>
              <Link href="/pricing" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">View pricing</Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
