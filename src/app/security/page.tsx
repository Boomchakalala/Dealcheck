'use client'

import Link from 'next/link'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Shield, Lock, Trash2, FileText, Database, ArrowRight, Upload, Eye, CheckCircle2, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

const sora = "'Sora', sans-serif"
const green = '#1DB954'

export default function SecurityPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="relative px-6 pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 360px at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] mb-6" style={{ background: 'rgba(29,185,84,0.12)' }}>
              <Shield className="w-7 h-7" style={{ color: green }} />
            </div>
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains), monospace", color: green }}>
              {t('securityPage.badge')}
            </p>
            <h1 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.04, letterSpacing: '-0.028em' }}>
              {t('securityPage.title')}
            </h1>
            <p className="text-[17px] text-ink-3 leading-relaxed max-w-2xl mx-auto">
              {t('securityPage.subtitle')}
            </p>
          </div>
        </section>

        {/* ─── KEY PRINCIPLE ────────────────────────────── */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto rounded-[14px] border-2 border-green-line p-7 sm:p-9 text-center" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(255,255,255,1) 100%)' }}>
            <p className="text-[19px] sm:text-[21px] text-ink font-semibold leading-snug max-w-2xl mx-auto font-display">
              {t('securityPage.keyPrinciple')}
            </p>
          </div>
        </section>

        {/* ─── THE FLOW — dark dramatic band ────────────── */}
        <section className="px-6 py-20 bg-ink text-ink-3">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-white text-center mb-10" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3.2vw, 34px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('securityPage.uploadTitle')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-[14px] overflow-hidden border border-ink mb-6">
              {[
                { icon: <Upload className="w-6 h-6" style={{ color: green }} />, title: t('securityPage.step1Title'), desc: t('securityPage.step1Desc'), step: '01' },
                { icon: <Eye className="w-6 h-6" style={{ color: green }} />, title: t('securityPage.step2Title'), desc: t('securityPage.step2Desc'), step: '02' },
                { icon: <Trash2 className="w-6 h-6 text-red-400" />, title: t('securityPage.step3Title'), desc: t('securityPage.step3Desc'), step: '03', destructive: true },
              ].map((s, i) => (
                <div key={i} className="py-9 px-6 text-center" style={{ background: s.destructive ? 'rgba(239,68,68,0.05)' : '#0f172a', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ fontFamily: "var(--font-jetbrains), monospace", color: s.destructive ? '#fca5a5' : green }}>{s.step}</div>
                  <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: s.destructive ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {s.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-1.5 font-display">{s.title}</h3>
                  <p className="text-[13px] text-ink-3 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[10px] border border-ink p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[13.5px] text-ink-3">
                <span className="font-bold text-white">{t('securityPage.bottomLine')}</span> {t('securityPage.bottomLineDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* ─── DATA HANDLING DETAIL ─────────────────────── */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Encryption */}
            <div>
              <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{t('securityPage.encryptionTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Lock className="w-5 h-5" />, title: t('securityPage.inTransit'), desc: t('securityPage.inTransitDesc') },
                  { icon: <Database className="w-5 h-5" />, title: t('securityPage.atRest'), desc: t('securityPage.atRestDesc') },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-[14px] border border-line p-5 hover:border-green-line transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-green-soft flex items-center justify-center text-green-deep flex-shrink-0">{c.icon}</div>
                      <h3 className="text-[15px] font-bold text-ink font-display">{c.title}</h3>
                    </div>
                    <p className="text-[13.5px] text-ink-3 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Four data-handling promises */}
            {[
              { icon: <Trash2 className="w-5 h-5" />, title: t('securityPage.fileDeletionTitle'), cardTitle: t('securityPage.originalsNeverStored'), d1: t('securityPage.fileDeletionDesc1'), d2: t('securityPage.fileDeletionDesc2') },
              { icon: <FileText className="w-5 h-5" />, title: t('securityPage.extractedTextTitle'), cardTitle: t('securityPage.onlySavedWhenYouSaySo'), d1: t('securityPage.extractedTextDesc1'), d2: t('securityPage.extractedTextDesc2') },
              { icon: <EyeOff className="w-5 h-5" />, title: t('securityPage.aiTrainingTitle'), cardTitle: t('securityPage.anthropicNoTrain'), d1: t('securityPage.aiTrainingDesc1'), d2: t('securityPage.aiTrainingDesc2') },
              { icon: <Shield className="w-5 h-5" />, title: t('securityPage.gdprTitle'), cardTitle: t('securityPage.rightsRespected'), d1: t('securityPage.gdprDesc1'), d2: t('securityPage.gdprDesc2') },
            ].map((s, i) => (
              <div key={i}>
                <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{s.title}</h2>
                <div className="bg-white rounded-[14px] border border-line p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-green-soft flex items-center justify-center text-green-deep flex-shrink-0">{s.icon}</div>
                    <h3 className="text-[15px] font-bold text-ink font-display">{s.cardTitle}</h3>
                  </div>
                  <p className="text-[13.5px] text-ink-3 leading-relaxed mb-2.5">{s.d1}</p>
                  <p className="text-[13.5px] text-ink-3 leading-relaxed">{s.d2}</p>
                </div>
              </div>
            ))}

            {/* Infrastructure */}
            <div>
              <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{t('securityPage.infraTitle')}</h2>
              <div className="space-y-3">
                {[
                  { icon: <Database className="w-5 h-5" />, title: t('securityPage.supabaseTitle'), desc: `${t('securityPage.supabaseDesc1')} ${t('securityPage.supabaseDesc2')}` },
                  { icon: <Shield className="w-5 h-5" />, title: t('securityPage.vercelTitle'), desc: t('securityPage.vercelDesc') },
                  { icon: <Lock className="w-5 h-5" />, title: t('securityPage.anthropicTitle'), desc: t('securityPage.anthropicDesc') },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-[14px] border border-line p-5 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-3 flex-shrink-0">{c.icon}</div>
                    <div>
                      <h3 className="text-[14.5px] font-bold text-ink mb-1 font-display">{c.title}</h3>
                      <p className="text-[13px] text-ink-3 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What we don't do */}
            <div>
              <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{t('securityPage.whatWeDontDoTitle')}</h2>
              <div className="rounded-[14px] border-2 border-green-line p-6" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.05) 0%, rgba(255,255,255,1) 100%)' }}>
                <ul className="space-y-3">
                  {[
                    t('securityPage.dontSell'),
                    t('securityPage.dontAdvertise'),
                    t('securityPage.dontTrain'),
                    t('securityPage.dontStore'),
                    t('securityPage.dontShareBeyond'),
                    t('securityPage.dontAccess'),
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-red-500 font-bold text-[15px] leading-6 flex-shrink-0">&#10005;</span>
                      <span className="text-[14px] text-ink-2 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Limitations — honest amber box */}
            <div>
              <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{t('securityPage.limitationsTitle')}</h2>
              <div className="bg-warn-soft border-2 border-warn-line rounded-[14px] p-6">
                <p className="text-[14px] text-ink-2 mb-4 leading-relaxed">{t('securityPage.limitationsIntro')}</p>
                <ul className="space-y-3">
                  {[
                    { tt: t('securityPage.limit1Title'), dd: t('securityPage.limit1Desc') },
                    { tt: t('securityPage.limit2Title'), dd: t('securityPage.limit2Desc') },
                    { tt: t('securityPage.limit3Title'), dd: t('securityPage.limit3Desc') },
                    { tt: t('securityPage.limit4Title'), dd: t('securityPage.limit4Desc') },
                    { tt: t('securityPage.limit5Title'), dd: t('securityPage.limit5Desc') },
                  ].map((l, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-warn font-bold flex-shrink-0">&#8226;</span>
                      <span className="text-[13.5px] text-ink-2 leading-relaxed"><span className="font-semibold text-ink">{l.tt}</span> {l.dd}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[14px] text-ink-2 mt-4 leading-relaxed">{t('securityPage.limitationsOutro')}</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em' }}>{t('securityPage.questionsTitle')}</h2>
              <div className="bg-white rounded-[14px] border border-line p-6">
                <p className="text-[13.5px] text-ink-3 mb-4 leading-relaxed">{t('securityPage.questionsIntro')}</p>
                <div className="space-y-2 text-[13.5px]">
                  {[
                    t('securityPage.securityQuestions'),
                    t('securityPage.privacyRequests'),
                    t('securityPage.generalSupport'),
                  ].map((label, i) => (
                    <p key={i}>
                      <span className="font-semibold text-ink">{label}</span>{' '}
                      <a href="mailto:hello@termlift.com" className="text-green-deep hover:text-green-deep font-medium">hello@termlift.com</a>
                    </p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── CTA — quiet white band ───────────────────── */}
        <section className="px-6 py-20 border-t border-line text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-ink mb-4" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.8vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              {t('securityPage.ctaTitle')}
            </h2>
            <p className="text-[15.5px] text-ink-3 mb-7 leading-relaxed">
              {t('securityPage.ctaSubtitle')}
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-[14.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
            >
              {t('securityPage.ctaButton')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
