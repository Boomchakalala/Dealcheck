'use client'

import Link from 'next/link'
import { ArrowRight, Upload, Search, Send, Lock, ShieldCheck, Globe, Check, Users, Building2, ShoppingCart, Zap, FileText, Mail, CreditCard } from 'lucide-react'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal'
import { useT, useI18n } from '@/i18n/context'

export default function LandingPage() {
  const t = useT()
  const { locale } = useI18n()

  // Scroll reveal for each section
  const statsReveal = useScrollReveal()
  const whoReveal = useScrollReveal()
  const howReveal = useScrollReveal()
  const socialReveal = useScrollReveal()
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
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500">{t('example.quoteVendor')} — €111,600</p>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Unified Score Hero Banner */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2.5">
                      <svg width="48" height="48" viewBox="0 0 100 100" className="-rotate-90 flex-shrink-0">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#fed7aa" strokeWidth="7" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f97316" strokeWidth="7"
                          strokeDasharray={`${(52/100) * 2 * Math.PI * 42} ${(1 - 52/100) * 2 * Math.PI * 42}`}
                          strokeLinecap="round"
                        />
                        <text x="50" y="44" textAnchor="middle" dominantBaseline="central"
                          className="fill-orange-700 text-[28px] font-extrabold rotate-90"
                          style={{ transformOrigin: 'center' }}
                        >52</text>
                        <text x="50" y="66" textAnchor="middle" dominantBaseline="central"
                          className="fill-slate-400 text-[11px] font-medium rotate-90"
                          style={{ transformOrigin: 'center' }}
                        >/ 100</text>
                      </svg>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('example.quoteScore')}</p>
                        <p className="text-[11px] font-bold text-orange-700">{t('example.quoteScoreLabel')}</p>
                      </div>
                    </div>
                    {/* Inline stats row */}
                    <div className="flex items-center gap-2 text-[9px]">
                      <div className="flex-1 text-center">
                        <p className="font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{t('output.totalCommitment')}</p>
                        <p className="text-[11px] font-bold text-slate-900">€111,600</p>
                      </div>
                      <div className="w-px h-6 bg-orange-200" />
                      <div className="flex-1 text-center">
                        <p className="font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{t('output.redFlags')}</p>
                        <p className="text-[11px] font-bold text-red-600">2</p>
                      </div>
                      <div className="w-px h-6 bg-orange-200" />
                      <div className="flex-1 text-center">
                        <p className="font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">{t('output.potentialSavings')}</p>
                        <p className="text-[11px] font-bold text-emerald-700">{t('example.savingsAmount')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="border border-slate-200 rounded-lg p-3">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">{t('example.quoteScore')}</p>
                    <div className="space-y-2">
                      {[
                        { label: t('example.scorePricing'), pct: 38, summary: 'Above market rate' },
                        { label: t('example.scoreTerms'), pct: 67, summary: 'Auto-renew clause' },
                        { label: t('example.scoreLeverage'), pct: 65, summary: 'Room to negotiate' },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] font-medium text-slate-600">{bar.label}</span>
                            <span className={`text-[9px] font-bold ${bar.pct >= 65 ? 'text-amber-600' : 'text-orange-600'}`}>{bar.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-0.5">
                            <div className={`h-full rounded-full ${bar.pct >= 65 ? 'bg-amber-500' : 'bg-orange-500'}`}
                              style={{ width: `${bar.pct}%` }} />
                          </div>
                          <p className="text-[8px] text-slate-400">{bar.summary}</p>
                        </div>
                      ))}
                    </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 items-start">
            {[
              { ref: counter60.ref, icon: Zap, value: `${counter60.count}s`, label: t('stats.analysisTime') },
              { icon: FileText, value: t('stats.anyFormat'), label: t('stats.pdfEmailImage') },
              { ref: counter3.ref, icon: Mail, value: `${counter3.count}`, label: t('stats.emailTones') },
              { icon: CreditCard, value: t('stats.free'), label: t('stats.noCard') },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
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
        className={`py-24 sm:py-36 bg-[#0f172a] relative overflow-hidden transition-all duration-700 ${
          howReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-bold text-white mb-4 tracking-tight">
              {t('howItWorks.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 mb-20 sm:mb-24 relative md:items-stretch">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px border-t-2 border-dashed border-emerald-500/30" />

            {[
              { step: '1', title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc'), icon: Upload },
              { step: '2', title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc'), icon: Search },
              { step: '3', title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc'), icon: Send },
            ].map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Mobile vertical arrow */}
                {index > 0 && (
                  <div className="md:hidden mb-4">
                    <svg className="w-5 h-5 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}

                <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:bg-white/[0.09] hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 w-full max-w-[300px] flex-1">
                  <div className="w-20 h-20 mb-5 bg-emerald-600 rounded-2xl flex items-center justify-center relative mx-auto shadow-lg shadow-emerald-500/20">
                    <item.icon className="w-9 h-9 text-white" />
                    <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-white text-[#0f172a] text-sm font-extrabold flex items-center justify-center shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-white mb-2">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Before / After Visual */}
          <div className="max-w-5xl mx-auto px-4 sm:px-0">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-white">
                {t('example.headline').split(/(wouldn't notice|n'auriez pas remarqué)/i).map((part, i) =>
                  /wouldn't notice|n'auriez pas remarqué/i.test(part)
                    ? <span key={i} className="text-red-400 italic">{part}</span>
                    : <span key={i}>{part}</span>
                )}
              </h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* LEFT: Before — Vendor Quote */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">1</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{t('example.youPaste')}</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col relative">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400">vendor-quote.pdf</span>
                  </div>
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3.5 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base sm:text-lg font-semibold text-slate-800">{t('example.quoteVendor')}</p>
                      <p className="text-[10px] text-slate-400">March 12, 2026</p>
                    </div>
                    <p className="text-slate-400 text-[10px] mb-2">{t('example.quotePreparedFor')}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">{t('example.quoteTitle')}</p>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between"><span>{t('example.quoteRetainer')}</span><span className="font-semibold text-slate-800">€7,500/mo</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteAdFee')}</span><span className="font-semibold text-slate-800">20%</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteAdBudget')}</span><span className="font-semibold text-slate-800">€9,000/mo</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteTerm')}</span><span className="font-semibold text-slate-800">12 months</span></div>
                      <div className="flex justify-between"><span>{t('example.quoteStartDate')}</span><span className="font-semibold text-slate-800">{t('example.quoteStartDateValue')}</span></div>
                      <div className="flex justify-between"><span>{t('example.quotePayment')}</span><span className="font-semibold text-slate-800">{t('example.quotePaymentValue')}</span></div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5"><span className="font-medium text-slate-700">{t('example.quoteTotal')}</span><span className="font-bold text-slate-900">€111,600</span></div>
                    </div>
                    <p className="pt-1">{t('example.quoteDeliverables')}</p>

                    <div className="border-t border-slate-100 pt-3 mt-1">
                      <p className="text-xs font-semibold text-slate-700 mb-1.5">{t('example.quoteContractTerms')}</p>
                      <div className="space-y-1 text-[11px] text-slate-500">
                        <p>• {t('example.quoteAutoRenewal')}</p>
                        <p>• {t('example.quotePriceReview')}</p>
                        <p>• {t('example.quoteCreativeAssets')}</p>
                        <p>• {t('example.quoteReportsMonthly')}</p>
                      </div>
                    </div>

                    <p className="text-slate-400 pt-1">{t('example.quoteCancellation')}</p>

                    <div className="border-t border-slate-100 pt-3 mt-1">
                      <p className="text-[10px] text-slate-300 italic">{t('example.quoteValidFor')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: After — TermLift Output */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{t('example.termliftReturns')}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {/* 1. Unified Score Hero */}
                  <div className="bg-orange-50 rounded-xl border border-orange-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90 flex-shrink-0">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#fed7aa" strokeWidth="3.5" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#f97316" strokeWidth="3.5"
                          strokeDasharray={`${(52/100) * 2 * Math.PI * 18} ${(1 - 52/100) * 2 * Math.PI * 18}`}
                          strokeLinecap="round"
                        />
                        <text x="22" y="22" textAnchor="middle" dominantBaseline="central"
                          className="fill-orange-700 text-xs font-extrabold rotate-90"
                          style={{ transformOrigin: 'center' }}
                        >52</text>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-orange-600 mb-1">{t('example.quoteScoreLabel')}</p>
                        <div className="flex items-center gap-1.5 flex-wrap text-[9px] text-slate-500">
                          <span className="font-semibold">{t('example.savingsAmount').replace(/[^\d.,€$£]/g, '') || '€111,600'} total</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-semibold">2 red flags</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-semibold text-emerald-600">{t('example.savingsAmount')} savings</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: t('example.scorePricing'), pct: 38 },
                        { label: t('example.scoreTerms'), pct: 67 },
                        { label: t('example.scoreLeverage'), pct: 65 },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-slate-500">{bar.label}</span>
                            <span className={`text-[9px] font-bold ${bar.pct >= 65 ? 'text-amber-600' : 'text-orange-600'}`}>{bar.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${bar.pct >= 65 ? 'bg-amber-500' : 'bg-orange-500'}`}
                              style={{ width: `${bar.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Red Flag 1 */}
                  <div className="bg-white rounded-xl border border-red-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t('example.commercial')}</span>
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">High</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">{t('example.redFlag1Title')}</p>
                    <p className="text-xs text-slate-500">{t('example.redFlag1Desc')}</p>
                  </div>

                  {/* 3. Red Flag 2 */}
                  <div className="bg-white rounded-xl border border-red-200 p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t('example.commercial')}</span>
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">High</span>
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

            {/* STEP 3: Deal Closed — Outcome */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  {locale === 'fr' ? 'Vous clôturez et mesurez les gains' : 'You close the deal and track the win'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Green closed header */}
                <div className="bg-emerald-600 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white/90" />
                    <span className="text-sm font-bold text-white">{locale === 'fr' ? 'Contrat clôturé' : 'Deal closed'}</span>
                  </div>
                  <span className="text-[11px] text-white/70 font-medium">Mar 18, 2026</span>
                </div>
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Stats: Original → Final → Savings */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-center">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{locale === 'fr' ? 'Devis initial' : 'Original quote'}</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900">€111,600</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-center">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{locale === 'fr' ? 'Montant final' : 'Final agreed'}</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900">€94,800</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
                      <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">{locale === 'fr' ? 'Économies' : 'Savings captured'}</p>
                      <p className="text-sm sm:text-base font-bold text-emerald-800">€16,800</p>
                      <p className="text-[10px] font-semibold text-emerald-600">15.1%</p>
                    </div>
                  </div>

                  {/* What changed pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      locale === 'fr' ? 'Prix réduit' : 'Price reduced',
                      locale === 'fr' ? 'Frais publicitaires réduits' : 'Ad fee cut',
                      locale === 'fr' ? 'Résiliation mise à jour' : 'Cancellation updated',
                      locale === 'fr' ? 'Livrables ajoutés' : 'Deliverables added',
                    ].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[9px] font-semibold text-slate-500 bg-slate-100 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Top wins */}
                  <div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{locale === 'fr' ? 'Gains obtenus' : 'Wins secured'}</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                        <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0 mt-0.5">Price</span>
                        <div>
                          <p className="text-xs text-slate-800">{locale === 'fr' ? 'Honoraires mensuels réduits de €7 500 à €7 000' : 'Monthly retainer reduced from €7,500 to €7,000'}</p>
                          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">€6,000/yr</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                        <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0 mt-0.5">Price</span>
                        <div>
                          <p className="text-xs text-slate-800">{locale === 'fr' ? 'Frais de gestion publicitaire réduits de 20% à 10%' : 'Ad management fee cut from 20% to 10%'}</p>
                          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">€10,800/yr</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0 mt-0.5">Terms</span>
                        <p className="text-xs text-slate-800">{locale === 'fr' ? 'Délai de résiliation réduit de 60 à 30 jours' : 'Cancellation notice cut from 60 to 30 days'}</p>
                      </div>
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
              <p className="text-xs text-slate-400 mt-3">
                <Link href="/example" className="text-emerald-400 hover:text-emerald-300 font-medium">{t('example.seeFullExampleLink')}</Link>
                {' '}{t('example.withAllDetails')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section
        ref={socialReveal.ref}
        className={`py-20 sm:py-28 bg-gradient-to-b from-slate-50/80 to-white relative transition-all duration-700 ${
          socialReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          {/* Stat bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-slate-200 mb-16 sm:mb-20">
            {[
              { value: t('social.stat1'), label: t('social.stat1Label') },
              { value: t('social.stat2'), label: t('social.stat2Label') },
              { value: t('social.stat3'), label: t('social.stat3Label') },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-8 sm:px-12">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: t('social.quote1'), name: t('social.name1'), title: t('social.title1'), initials: 'TL' },
              { quote: t('social.quote2'), name: t('social.name2'), title: t('social.title2'), initials: 'TL' },
              { quote: t('social.quote3'), name: t('social.name3'), title: t('social.title3'), initials: 'AI' },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                <div className="mb-4">
                  <svg className="w-6 h-6 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-5">{testimonial.quote}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-700">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
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
