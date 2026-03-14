'use client'

import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('privacyPage.badge')}</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-3">
              {t('privacyPage.title')}
            </h1>
            <p className="text-sm text-slate-400">{t('privacyPage.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

            {/* Quick Summary box */}
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6">
              <p className="font-semibold text-slate-900 mb-3">{t('privacyPage.quickSummary')}</p>
              <ul className="space-y-2 text-sm">
                {[
                  t('privacyPage.summary1'),
                  t('privacyPage.summary2'),
                  t('privacyPage.summary3'),
                  t('privacyPage.summary4'),
                  t('privacyPage.summary5'),
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s1Title')}</h2>
              <p className="mb-2">
                {t('privacyPage.s1p1')}
              </p>
              <p className="text-xs text-slate-600">
                {t('privacyPage.s1Contact')}{' '}
                <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s2Title')}</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s2AccountInfo')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Account1')}</li>
                    <li>• {t('privacyPage.s2Account2')}</li>
                    <li>• {t('privacyPage.s2Account3')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s2DealData')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Deal1')}</li>
                    <li>• {t('privacyPage.s2Deal2')}</li>
                    <li>• {t('privacyPage.s2Deal3')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s2PaymentInfo')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Payment1')}</li>
                    <li>• {t('privacyPage.s2Payment2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s2AutoCollected')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s2Auto1')}</li>
                    <li>• {t('privacyPage.s2Auto2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s3Title')}</h2>
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
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s4Title')}</h2>
              <p className="mb-4">{t('privacyPage.s4Intro')}</p>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s4Anthropic')}</p>
                  <p className="text-sm">{t('privacyPage.s4AnthropicDesc')}{' '}
                    <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">privacy policy</a>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s4Supabase')}</p>
                  <p className="text-sm">{t('privacyPage.s4SupabaseDesc')}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s4Vercel')}</p>
                  <p className="text-sm">{t('privacyPage.s4VercelDesc')}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s4PostHog')}</p>
                  <p className="text-sm">{t('privacyPage.s4PostHogDesc')}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s4Stripe')} <span className="text-xs text-slate-400 font-normal">({t('privacyPage.s4StripeSoon')})</span></p>
                  <p className="text-sm">{t('privacyPage.s4StripeDesc')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s5Title')}</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">{t('privacyPage.s5Item1Prefix')}</span> {t('privacyPage.s5Item1')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item2Prefix')}</span> {t('privacyPage.s5Item2')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item3Prefix')}</span> {t('privacyPage.s5Item3')}</li>
                <li>• <span className="font-medium">{t('privacyPage.s5Item4Prefix')}</span> {t('privacyPage.s5Item4')}</li>
              </ul>
              <p className="mt-3 text-sm">{t('privacyPage.s5Note')}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s6Title')}</h2>
              <p className="mb-3">{t('privacyPage.s6Intro')}</p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s6Session')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Session1')}</li>
                    <li>• {t('privacyPage.s6Session2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s6Analytics')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Analytics1')}</li>
                    <li>• {t('privacyPage.s6Analytics2')}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">{t('privacyPage.s6WhatWeDoNot')}</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• {t('privacyPage.s6Not1')}</li>
                    <li>• {t('privacyPage.s6Not2')}</li>
                    <li>• {t('privacyPage.s6Not3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s7Title')}</h2>
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
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s8Title')}</h2>
              <p>
                {t('privacyPage.s8Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s9Title')}</h2>
              <p>
                {t('privacyPage.s9Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s10Title')}</h2>
              <p>
                {t('privacyPage.s10Text')}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('privacyPage.s11Title')}</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                <p className="text-sm">
                  <span className="font-medium">{t('privacyPage.s11Privacy')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">{t('privacyPage.s11Data')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">{t('privacyPage.s11General')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
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
