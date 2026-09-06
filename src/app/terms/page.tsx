'use client'

import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Scale } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TermsPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <MarketingHeader />

      <main className="flex-1">
        <div className="relative overflow-hidden px-6 pt-20 sm:pt-24 pb-12 bg-[#FAFAF7] border-b border-line-2">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 600px 280px at 50% 0%, rgba(29,185,84,0.10) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-5">
              <Scale className="w-4 h-4 text-green-deep" />
              <span className="text-[12px] font-bold tracking-widest uppercase text-green-deep" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{t('termsPage.badge')}</span>
            </div>
            <h1 className="text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.06, letterSpacing: '-0.028em' }}>
              {t('termsPage.title')}
            </h1>
            <p className="text-[13px] text-ink-3">{t('termsPage.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-ink-2 leading-relaxed">

            {/* 1. Acceptance */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s1Title')}</h2>
              <p>{t('termsPage.s1Text')}</p>
            </section>

            {/* 2. What the Service Is */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s2Title')}</h2>
              <p className="mb-2">{t('termsPage.s2Intro')}</p>
              <ul className="space-y-2 ml-4">
                <li>• {t('termsPage.s2Item1')}</li>
                <li>• {t('termsPage.s2Item2')}</li>
                <li>• {t('termsPage.s2Item3')}</li>
                <li>• {t('termsPage.s2Item4')}</li>
                <li>• {t('termsPage.s2Item5')}</li>
              </ul>
            </section>

            {/* 3. What the Service Is NOT */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s3Title')}</h2>
              <div className="rounded-[10px] border border-warn-line/80 bg-gradient-to-br from-amber-50/60 to-white p-6">
                <p className="font-semibold text-amber-900 mb-3">{t('termsPage.s3Important')}</p>
                <ul className="space-y-2 text-sm">
                  {[
                    t('termsPage.s3Item1'),
                    t('termsPage.s3Item2'),
                    t('termsPage.s3Item3'),
                    t('termsPage.s3Item4'),
                    t('termsPage.s3Item5'),
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-warn">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. Your Responsibilities */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s4Title')}</h2>
              <p className="mb-3">{t('termsPage.s4Intro')}</p>
              <ul className="space-y-2 ml-4">
                <li>• {t('termsPage.s4Item1')}</li>
                <li>• {t('termsPage.s4Item2')}</li>
                <li>• {t('termsPage.s4Item3')}</li>
                <li>• {t('termsPage.s4Item4')}</li>
                <li>• {t('termsPage.s4Item5')}</li>
                <li>• {t('termsPage.s4Item6')}</li>
                <li>• {t('termsPage.s4Item7')}</li>
              </ul>
            </section>

            {/* 5. Pricing & Payment */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s5Title')}</h2>

              <div className="space-y-3 mb-4">
                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('termsPage.s5StarterTitle')}</p>
                  <p className="text-sm">{t('termsPage.s5StarterDesc')}</p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('termsPage.s5EssentialsTitle')}</p>
                  <p className="text-sm">{t('termsPage.s5EssentialsDesc')}</p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('termsPage.s5ProTitle')}</p>
                  <p className="text-sm">{t('termsPage.s5ProDesc')}</p>
                </div>
              </div>

              <ul className="space-y-2 ml-4">
                <li>• {t('termsPage.s5Item1')}</li>
                <li>• {t('termsPage.s5Item2')}</li>
                <li>• {t('termsPage.s5Item3')}</li>
                <li>• {t('termsPage.s5Item4')}</li>
                <li>• {t('termsPage.s5Item5')}</li>
                <li>• {t('termsPage.s5Item6')}</li>
              </ul>
            </section>

            {/* 6. Intellectual Property */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s6Title')}</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-ink mb-1">{t('termsPage.s6YourContent')}</p>
                  <p>{t('termsPage.s6YourContentDesc')}</p>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('termsPage.s6OurContent')}</p>
                  <p>{t('termsPage.s6OurContentDesc')}</p>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('termsPage.s6AiOutputs')}</p>
                  <p>{t('termsPage.s6AiOutputsDesc')}</p>
                </div>
              </div>
            </section>

            {/* 7. Service Availability */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s7Title')}</h2>
              <p className="mb-2">{t('termsPage.s7Intro')}</p>
              <ul className="space-y-2 ml-4">
                <li>• {t('termsPage.s7Item1')}</li>
                <li>• {t('termsPage.s7Item2')}</li>
                <li>• {t('termsPage.s7Item3')}</li>
                <li>• {t('termsPage.s7Item4')}</li>
              </ul>
            </section>

            {/* 8. Account Termination */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s8Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• {t('termsPage.s8Item1')}</li>
                <li>• {t('termsPage.s8Item2')}</li>
                <li>• {t('termsPage.s8Item3')}</li>
                <li>• {t('termsPage.s8Item4')}</li>
              </ul>
            </section>

            {/* 9. Limitation of Liability */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s9Title')}</h2>
              <div className="rounded-[10px] border border-line/80 bg-gradient-to-br from-ground/60 to-white p-6">
                <p className="font-semibold text-ink mb-3">{t('termsPage.s9Intro')}</p>
                <ul className="space-y-2 text-sm">
                  {[
                    t('termsPage.s9Item1'),
                    t('termsPage.s9Item2'),
                    t('termsPage.s9Item3'),
                    t('termsPage.s9Item4'),
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ink-3">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 10. Indemnification */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s10Title')}</h2>
              <p>{t('termsPage.s10Text')}</p>
            </section>

            {/* 11. Dispute Resolution */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s11Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">{t('termsPage.s11Item1Prefix')}</span> {t('termsPage.s11Item1', { email: 'hello@termlift.com' })}</li>
                <li>• <span className="font-medium">{t('termsPage.s11Item2Prefix')}</span> {t('termsPage.s11Item2')}</li>
                <li>• <span className="font-medium">{t('termsPage.s11Item3Prefix')}</span> {t('termsPage.s11Item3')}</li>
                <li>• <span className="font-medium">{t('termsPage.s11Item4Prefix')}</span> {t('termsPage.s11Item4')}</li>
              </ul>
              <p className="mt-3 text-sm text-ink-3">{t('termsPage.s11Note')}</p>
            </section>

            {/* 12. Changes to These Terms */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s12Title')}</h2>
              <p>{t('termsPage.s12Text')}</p>
            </section>

            {/* 13. General */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s13Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">{t('termsPage.s13Item1Prefix')}</span> {t('termsPage.s13Item1')}</li>
                <li>• <span className="font-medium">{t('termsPage.s13Item2Prefix')}</span> {t('termsPage.s13Item2')}</li>
                <li>• <span className="font-medium">{t('termsPage.s13Item3Prefix')}</span> {t('termsPage.s13Item3')}</li>
                <li>• <span className="font-medium">{t('termsPage.s13Item4Prefix')}</span> {t('termsPage.s13Item4')}</li>
              </ul>
            </section>

            {/* 14. Contact */}
            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('termsPage.s14Title')}</h2>
              <div className="bg-ground rounded-lg border border-line p-5">
                <p className="text-sm">{t('termsPage.s14Text', { email: 'hello@termlift.com' })}</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
