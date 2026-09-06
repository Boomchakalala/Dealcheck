'use client'

import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
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
              <Shield className="w-4 h-4 text-green-deep" />
              <span className="text-[12px] font-bold tracking-widest uppercase text-green-deep" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{t('privacyPage.badge')}</span>
            </div>
            <h1 className="text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.06, letterSpacing: '-0.028em' }}>
              {t('privacyPage.title')}
            </h1>
            <p className="text-[13px] text-ink-3">{t('privacyPage.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-ink-2 leading-relaxed">

            {/* Quick Summary box */}
            <div className="rounded-[10px] border border-green-line/60 bg-gradient-to-br from-green-soft/40 to-white p-6">
              <p className="font-semibold text-ink mb-3">{t('privacyPage.quickSummary')}</p>
              <ul className="space-y-2 text-sm">
                {[
                  t('privacyPage.summary1'),
                  t('privacyPage.summary2'),
                  t('privacyPage.summary3'),
                  t('privacyPage.summary4'),
                  t('privacyPage.summary5'),
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-deep">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s1Title')}</h2>
              <p className="mb-2">
                {t('privacyPage.s1p1')}
              </p>
              <p className="text-xs text-ink-2">
                {t('privacyPage.s1Contact')}{' '}
                <a href="mailto:hello@termlift.com" className="text-green-deep hover:underline">hello@termlift.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s2Title')}</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s2AccountInfo')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Account1')}</li>
                    <li>• {t('privacyPage.s2Account2')}</li>
                    <li>• {t('privacyPage.s2Account3')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s2DealData')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Deal1')}</li>
                    <li>• {t('privacyPage.s2Deal2')}</li>
                    <li>• {t('privacyPage.s2Deal3')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s2PaymentInfo')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Payment1')}</li>
                    <li>• {t('privacyPage.s2Payment2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s2AutoCollected')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Auto1')}</li>
                    <li>• {t('privacyPage.s2Auto2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s3Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• {t('privacyPage.s3Item1')}</li>
                <li>• {t('privacyPage.s3Item2')}</li>
                <li>• {t('privacyPage.s3Item3')}</li>
                <li>• {t('privacyPage.s3Item4')}</li>
                <li>• {t('privacyPage.s3Item5')}</li>
                <li>• {t('privacyPage.s3Item6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s4Title')}</h2>
              <p className="mb-4">{t('privacyPage.s4Intro')}</p>

              <div className="space-y-3">
                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s4Anthropic')}</p>
                  <p className="text-sm">{t('privacyPage.s4AnthropicDesc')}{' '}
                    <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-deep hover:underline">privacy policy</a>
                  </p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s4Supabase')}</p>
                  <p className="text-sm">{t('privacyPage.s4SupabaseDesc')}</p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s4Vercel')}</p>
                  <p className="text-sm">{t('privacyPage.s4VercelDesc')}</p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s4PostHog')}</p>
                  <p className="text-sm">{t('privacyPage.s4PostHogDesc')}</p>
                </div>

                <div className="bg-ground rounded-lg border border-line p-4">
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s4Stripe')}</p>
                  <p className="text-sm">{t('privacyPage.s4StripeDesc')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s5Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">{t('privacyPage.s5Item1Prefix')}</span> {t('privacyPage.s5Item1')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item2Prefix')}</span> {t('privacyPage.s5Item2')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item3Prefix')}</span> {t('privacyPage.s5Item3')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item4Prefix')}</span> {t('privacyPage.s5Item4')}</li>
              </ul>
              <p className="mt-3 text-sm">{t('privacyPage.s5Note')}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s6Title')}</h2>
              <p className="mb-3">{t('privacyPage.s6Intro')}</p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s6Session')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Session1')}</li>
                    <li>• {t('privacyPage.s6Session2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s6Analytics')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Analytics1')}</li>
                    <li>• {t('privacyPage.s6Analytics2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">{t('privacyPage.s6WhatWeDoNot')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Not1')}</li>
                    <li>• {t('privacyPage.s6Not2')}</li>
                    <li>• {t('privacyPage.s6Not3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s7Title')}</h2>
              <p className="mb-3">{t('privacyPage.s7Intro')}</p>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">{t('privacyPage.s7Access')}</span> {t('privacyPage.s7AccessDesc')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s7Delete')}</span> {t('privacyPage.s7DeleteDesc')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s7Correct')}</span> {t('privacyPage.s7CorrectDesc')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s7Export')}</span> {t('privacyPage.s7ExportDesc')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s7Object')}</span> {t('privacyPage.s7ObjectDesc')}</li>
              </ul>
              <p className="mt-3 text-sm">
                {t('privacyPage.s7Contact', { email: 'hello@termlift.com' })}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s8Title')}</h2>
              <p>
                {t('privacyPage.s8Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s9Title')}</h2>
              <p>
                {t('privacyPage.s9Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s10Title')}</h2>
              <p>
                {t('privacyPage.s10Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink mb-3" style={{ fontFamily: "var(--font-sora), sans-serif" }}>{t('privacyPage.s11Title')}</h2>
              <div className="bg-ground rounded-lg border border-line p-5">
                <p className="text-sm">
                  <span className="font-medium">{t('privacyPage.s11Privacy')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-green-deep hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">{t('privacyPage.s11Data')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-green-deep hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">{t('privacyPage.s11General')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-green-deep hover:underline">hello@termlift.com</a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
