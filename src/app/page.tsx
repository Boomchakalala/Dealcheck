'use client'

import Link from 'next/link'
import { ArrowRight, Upload, Search, Send, Lock, ShieldCheck, Globe, Check, Users, Building2, ShoppingCart, Zap, FileText, Mail, CreditCard } from 'lucide-react'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal'
import { useT } from '@/i18n/context'

export default function LandingPage() {
  const t = useT()

  // Scroll reveal for each section
  const statsReveal = useScrollReveal()
  const whoReveal = useScrollReveal()
  const howReveal = useScrollReveal()
  const privacyReveal = useScrollReveal()
  const pricingReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  // Counter animations for stats bar
  const counter60 = useCountUp(60)
  const counter3 = useCountUp(3)

  return (
    <div className="min-h-screen bg-white relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <UnifiedHeader variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-5 sm:mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">{t('hero.badge')}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight mb-4 sm:mb-6 leading-[1.15]">
                {t('hero.title1')}<br className="hidden sm:block" />
                <span className="text-emerald-600">{t('hero.title2')}</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-lg">
                {t('hero.subtitle')}
              </p>

              {/* Benefits */}
              <div className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
                {[
                  t('hero.check1'),
                  t('hero.check2'),
                  t('hero.check3'),
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm sm:text-base text-slate-700">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/try"
                  className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/example"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl text-slate-500 hover:text-emerald-600 transition-all"
                >
                  {t('hero.ctaSecondary')}
                </Link>
              </div>

              <p className="text-xs text-slate-500 mt-3 sm:mt-4">{t('hero.noSignup')}</p>
            </div>

            {/* Right: Product Preview — real content */}
            <div className="relative lg:pl-8 mt-8 lg:mt-0 animate-hero-card">
              {/* Decorative blur orbs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-64 sm:h-64 bg-teal-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden hover:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] transition-shadow duration-500">
                {/* Mock browser chrome */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500">{t('example.quoteVendor')} — €110,000</p>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Verdict */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{t('hero.verdict')}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                      {t('hero.verdictDesc')}
                    </p>
                  </div>

                  {/* Red flag */}
                  <div className="border border-red-200 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">{t('hero.redFlagLabel')}</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-900 mb-1">{t('hero.redFlagTitle')}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed">{t('hero.redFlagDesc')}</p>
                  </div>

                  {/* Savings */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">{t('example.savingsLabel')}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-600">{t('hero.savingsDesc')}</p>
                      </div>
                      <span className="text-sm sm:text-base font-bold text-emerald-700">{t('example.savingsAmount')}</span>
                    </div>
                  </div>

                  {/* Email preview */}
                  <div className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('example.emailLabel')}</p>
                      <div className="flex gap-1">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">{t('hero.emailToneFriendly')}</span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded text-slate-400">{t('hero.emailToneDirect')}</span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded text-slate-400">{t('hero.emailToneFirm')}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {t('hero.emailSnippet')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section
        ref={statsReveal.ref}
        className={`py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200/60 transition-all duration-700 ${
          statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            <div ref={counter60.ref} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{counter60.count}s</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{t('stats.analysisTime')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-600">{t('stats.anyFormat')}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{t('stats.pdfEmailImage')}</p>
            </div>
            <div ref={counter3.ref} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{counter3.count}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{t('stats.emailTones')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{t('stats.free')}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{t('stats.noCard')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        ref={whoReveal.ref}
        className={`py-20 sm:py-28 bg-white relative transition-all duration-700 ${
          whoReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('builtFor.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {t('builtFor.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Building2,
                title: t('builtFor.founders'),
                desc: t('builtFor.foundersDesc'),
              },
              {
                icon: Users,
                title: t('builtFor.ops'),
                desc: t('builtFor.opsDesc'),
              },
              {
                icon: ShoppingCart,
                title: t('builtFor.buyers'),
                desc: t('builtFor.buyersDesc'),
              },
            ].map((persona) => (
              <div key={persona.title} className="bg-white border-2 border-slate-100 rounded-xl p-6 sm:p-8 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 mb-5 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <persona.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{persona.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{persona.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How TermLift Works */}
      <section
        ref={howReveal.ref}
        id="how-it-works"
        className={`py-20 sm:py-28 bg-gradient-to-b from-slate-50/80 via-slate-50/30 to-white relative overflow-hidden transition-all duration-700 ${
          howReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              { step: '1', title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc'), icon: Upload },
              { step: '2', title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc'), icon: Search },
              { step: '3', title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc'), icon: Send },
            ].map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center relative">
                  <item.icon className="w-7 h-7 text-emerald-700" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <p className="text-base font-semibold text-slate-900 mb-1.5">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 max-w-[250px]">
                  {item.desc}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-slate-300 text-2xl">
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Before / After Visual */}
          <div className="max-w-5xl mx-auto px-4 sm:px-0">
            <div className="text-center mb-10">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{t('example.headline')}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* LEFT: Before — Vendor Quote */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">1</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{t('example.youPaste')}</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400">vendor-quote.pdf</span>
                  </div>
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3.5">
                    <p className="text-base sm:text-lg font-semibold text-slate-800">{t('example.quoteVendor')}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">{t('example.quoteTitle')}</p>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between"><span>{t('example.quoteRetainer')}</span><span className="font-semibold text-slate-800">€7,500/mo</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteAdFee')}</span><span className="font-semibold text-slate-800">20%</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteAdBudget')}</span><span className="font-semibold text-slate-800">€9,000/mo</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteTerm')}</span><span className="font-semibold text-slate-800">12 months</span></div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5"><span className="font-medium text-slate-700">{t('example.quoteTotal')}</span><span className="font-bold text-slate-900">€110,000</span></div>
                    </div>
                    <p className="pt-1">{t('example.quoteDeliverables')}</p>
                    <p className="text-slate-400">{t('example.quoteCancellation')}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: After — TermLift Output */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{t('example.termliftReturns')}</p>
                </div>
                <div className="space-y-3">
                  {/* Red Flag 1 */}
                  <div className="bg-white rounded-xl border border-red-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t('example.commercial')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">{t('example.redFlag1Title')}</p>
                    <p className="text-xs text-slate-500">{t('example.redFlag1Desc')}</p>
                  </div>

                  {/* Red Flag 2 */}
                  <div className="bg-white rounded-xl border border-red-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t('example.commercial')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">{t('example.redFlag2Title')}</p>
                    <p className="text-xs text-slate-500">{t('example.redFlag2Desc')}</p>
                  </div>

                  {/* Savings */}
                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">{t('example.savingsLabel')}</p>
                        <p className="text-xs text-slate-600">{t('example.savingsDesc')}</p>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-emerald-700">{t('example.savingsAmount')}</span>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('example.emailLabel')}</p>
                      <div className="flex gap-1">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">{t('hero.emailToneFriendly')}</span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded text-slate-400">{t('hero.emailToneDirect')}</span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded text-slate-400">{t('hero.emailToneFirm')}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed">
                        {t('hero.emailSnippet')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA below the before/after */}
            <div className="text-center mt-10">
              <Link
                href="/try"
                className="group inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('example.cta')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-slate-500 mt-3">
                <Link href="/example" className="text-emerald-600 hover:text-emerald-700 font-medium">See a full example</Link>
                {' '}{t('example.withAllDetails')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section
        ref={privacyReveal.ref}
        id="data-privacy"
        className={`py-20 sm:py-28 bg-white relative transition-all duration-700 ${
          privacyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('privacy.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {t('privacy.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{t('privacy.encryption')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.encryptionDesc')}</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{t('privacy.noTraining')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.noTrainingDesc')}</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{t('privacy.gdpr')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.gdprDesc')}</p>
            </div>
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <Link href="/security" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group">
              {t('privacy.learnMore')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section
        ref={pricingReveal.ref}
        id="pricing"
        className={`py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-slate-50/50 to-white relative transition-all duration-700 ${
          pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-7">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('pricing.starter')}</h3>
                <p className="text-sm text-slate-500">{t('pricing.starterDesc')}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">€0</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {[
                  t('pricing.starterFeature1'),
                  t('pricing.starterFeature2'),
                  t('pricing.starterFeature3'),
                  t('pricing.starterFeature4'),
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/try"
                className="block w-full text-center px-6 py-3 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                {t('pricing.starterCta')}
              </Link>
            </div>

            {/* Pro — Highlighted */}
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 sm:p-7 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">{t('pricing.mostPopular')}</span>
              </div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('pricing.pro')}</h3>
                <p className="text-sm text-slate-500">{t('pricing.proDesc')}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">€39</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {[
                  t('pricing.proFeature1'),
                  t('pricing.proFeature2'),
                  t('pricing.proFeature3'),
                  t('pricing.proFeature4'),
                  t('pricing.proFeature5'),
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md"
              >
                {t('pricing.getPro')}
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-7">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('pricing.business')}</h3>
                <p className="text-sm text-slate-500">{t('pricing.businessDesc')}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">€149</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {[
                  t('pricing.businessFeature1'),
                  t('pricing.businessFeature2'),
                  t('pricing.businessFeature3'),
                  t('pricing.businessFeature4'),
                  t('pricing.businessFeature5'),
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full text-center px-6 py-3 text-sm font-semibold rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed transition-all"
              >
                {t('pricing.comingSoon')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        ref={ctaReveal.ref}
        className={`relative bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 py-20 sm:py-28 overflow-hidden transition-all duration-700 ${
          ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {t('cta.title')}
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-xl bg-white text-emerald-700 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('cta.button')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
