'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Mail, Send, Shield, Trash2,
  Upload, FileText, AlertTriangle, Sparkles, Zap, TrendingDown, TrendingUp,
  Heart, Scale, Swords, Target, BarChart3, Calendar, Building2, Eye,
  ChevronRight,
} from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"
const green = '#1DB954'
const greenDark = '#15a047'

// ─── Browser-frame wrapper ────────────────────────────────
function BrowserFrame({ children, url = 'termlift.com/app/deal', className = '' }: { children: React.ReactNode; url?: string; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-slate-200/70 ${className}`} style={{ boxShadow: '0 40px 80px -20px rgba(15,23,42,0.25), 0 16px 32px -12px rgba(15,23,42,0.1)' }}>
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 px-3 py-1 rounded-md bg-white border border-slate-100 text-[11px] text-slate-500" style={{ fontFamily: mono }}>{url}</span>
      </div>
      {children}
    </div>
  )
}

// ─── Score ring ───────────────────────────────────────────
function ScoreRing({ score, size = 92 }: { score: number; size?: number }) {
  const stroke = Math.max(4, Math.round(size * 0.075))
  const r = (size - stroke - 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const showSubLabel = size >= 80
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" dy={showSubLabel ? '-0.18em' : '0.03em'} style={{ fontFamily: sora, fontSize: size * 0.34, fontWeight: 800, fill: '#0f172a' }}>{score}</text>
      {showSubLabel && (
        <text x={size / 2} y={size / 2 + size * 0.22} textAnchor="middle" style={{ fontFamily: mono, fontSize: Math.max(8, size * 0.09), fill: '#94a3b8', letterSpacing: '0.1em' }}>/ 100</text>
      )}
    </svg>
  )
}

// ─── Hero product surface (analysis preview) ──────────────
function HeroAnalysisCard() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
        <ScoreRing score={62} size={104} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600" style={{ fontFamily: mono }}>RENEWAL</span>
            <span className="text-[11px] text-slate-400" style={{ fontFamily: mono }}>DocuSign &middot; Business Pro</span>
          </div>
          <p className="text-[20px] font-bold text-slate-900 leading-tight" style={{ fontFamily: sora }}>Push harder</p>
          <p className="text-[12.5px] text-slate-500 mt-0.5">Good base terms but savings on the table</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {[
          { sev: 'HIGH', issue: '15 unused seats billed at full price', impact: '€6,000/yr' },
          { sev: 'MED', issue: 'No loyalty discount after 2 years', impact: '€1,800/yr' },
        ].map((f, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: f.sev === 'HIGH' ? 'rgba(254,226,226,0.5)' : 'rgba(254,243,199,0.4)', borderColor: f.sev === 'HIGH' ? 'rgba(254,202,202,0.7)' : 'rgba(253,230,138,0.6)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: f.sev === 'HIGH' ? '#dc2626' : '#d97706' }} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: f.sev === 'HIGH' ? '#fecaca' : '#fde68a', color: f.sev === 'HIGH' ? '#991b1b' : '#92400e', fontFamily: mono }}>{f.sev}</span>
                <span className="text-[12.5px] text-slate-800 font-medium">{f.issue}</span>
              </div>
            </div>
            <span className="text-[12.5px] font-bold whitespace-nowrap" style={{ fontFamily: sora, color: '#047857' }}>{f.impact}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100" style={{ fontFamily: mono }}>
        <span>3 flags &middot; 3 asks &middot; 3 email drafts</span>
        <span className="inline-flex items-center gap-1.5"><Zap className="w-3 h-3" style={{ color: green }} />Analysed in 47s</span>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════
//  PAGE
// ═════════════════════════════════════════════════════════
export default function LandingV2() {
  const [prefTone, setPrefTone] = useState<'friendly' | 'direct' | 'firm'>('friendly')
  const [prefStyle, setPrefStyle] = useState<'collaborative' | 'balanced' | 'aggressive'>('balanced')
  const [prefPriority, setPrefPriority] = useState<'lowest_price' | 'best_terms' | 'max_flexibility'>('lowest_price')

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <MarketingHeader />

      {/* ═══════════════════════════════════════════════════
          HERO — dramatic, real product surfaces stacked
         ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 pt-12 lg:pt-20 pb-20 lg:pb-32 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 80% 20%, rgba(29,185,84,0.18) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 20% 60%, rgba(16,185,129,0.10) 0%, transparent 70%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-7 px-3.5 py-1.5 rounded-full border border-emerald-200/80 bg-white shadow-sm">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" style={{ background: green }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: green }} />
              </span>
              <span className="text-[11.5px] text-slate-700 font-semibold tracking-wide" style={{ fontFamily: mono }}>THE PROCUREMENT EXPERT YOUR BUSINESS NEVER HAD</span>
            </div>

            <h1 className="text-slate-900 mb-6" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(44px, 5.8vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.032em' }}>
              Get a better deal on{' '}
              <span style={{ background: `linear-gradient(135deg, ${green} 0%, #10b981 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                every vendor quote.
              </span>
            </h1>

            <p className="text-[18px] text-slate-500 leading-relaxed max-w-[500px] mb-9">
              You don&apos;t have a procurement team. The vendor does. <span className="text-slate-700 font-semibold">TermLift gives you the edge</span> &mdash; paste any quote and get the red flags, the savings number, and the email that gets you a better deal. In about two minutes.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-6">
              <Link href="/try" className="inline-flex items-center justify-center sm:justify-start gap-2 px-7 py-4 rounded-xl text-[15px] font-bold text-white no-underline transition-all hover:shadow-xl hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${green} 0%, ${greenDark} 100%)`, boxShadow: '0 12px 32px -8px rgba(29,185,84,0.55)' }}>
                Analyse my quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/demo" className="text-[14.5px] font-bold text-slate-800 no-underline hover:text-slate-900 inline-flex items-center gap-1.5 underline decoration-2 underline-offset-4" style={{ textDecorationColor: green }}>
                See a real example
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: mono }}>
              <span className="inline-flex items-center gap-1.5"><Shield className="w-3 h-3" style={{ color: green }} />Deleted instantly</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>No card</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>~2 min analysis</span>
            </div>
          </div>

          {/* Right: clean product surface */}
          <div className="relative">
            {/* Main analysis card */}
            <div className="relative z-20 animate-hero-float">
              <BrowserFrame url="termlift.com/app/deal/docusign">
                <HeroAnalysisCard />
              </BrowserFrame>
            </div>

            {/* Refined savings indicator — small, professional, top-right */}
            <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-5 z-30 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-xl" style={{ background: 'white', border: `2px solid ${green}`, boxShadow: '0 20px 40px -10px rgba(29,185,84,0.35)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: green }}>
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-widest font-bold text-slate-500" style={{ fontFamily: mono }}>You can save</p>
                  <p style={{ fontFamily: sora, fontSize: 22, fontWeight: 800, lineHeight: 1, color: '#047857' }}>
                    &euro;7,800<span className="text-[12px] text-slate-400 font-normal">/yr</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MARQUEE — what we catch
         ═══════════════════════════════════════════════════ */}
      <div className="overflow-hidden whitespace-nowrap py-5 bg-slate-900 border-y border-slate-800/50">
        <div className="inline-block" style={{ animation: 'marquee 38s linear infinite', fontFamily: sora, fontStyle: 'italic', fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 500 }}>
          {[
            'Auto-renewal traps', 'Hidden price hikes', 'Phantom seat fees', 'Vague SLAs',
            'Multi-year lock-ins', 'Missing loyalty discounts', 'Uncapped fuel surcharges',
            'Exclusive clauses', 'Notice-window gotchas', 'Bundled support waivers',
          ].concat([
            'Auto-renewal traps', 'Hidden price hikes', 'Phantom seat fees', 'Vague SLAs',
            'Multi-year lock-ins', 'Missing loyalty discounts', 'Uncapped fuel surcharges',
            'Exclusive clauses', 'Notice-window gotchas', 'Bundled support waivers',
          ]).flatMap((t, i) => [
            <span key={`t${i}`} className="mx-8" style={{ color: i % 2 === 0 ? '#475569' : green }}>{t}</span>,
            <span key={`s${i}`} className="mx-2" style={{ color: green, fontSize: 14 }}>&#9733;</span>,
          ])}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          WHAT YOU GET — 3 real product surfaces
         ═══════════════════════════════════════════════════ */}
      <section id="product" className="relative px-6 py-16 sm:py-28 bg-gradient-to-b from-white to-slate-50/60">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>One paste &middot; Three outputs</p>
            <h2 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              Everything a procurement team would do. <br /><span style={{ color: green }}>Without the procurement team.</span>
            </h2>
            <p className="text-[17px] text-slate-500 leading-relaxed">
              A score, the red flags, the savings number, and three email drafts &mdash; in one analysis. The leverage vendors expect from enterprise buyers, now in your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Analysis */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.15) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold mb-1 tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>01 &middot; Analyse</p>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2" style={{ fontFamily: sora }}>Score + Red flags</h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">Every clause stress-tested. Score 0&ndash;100, severity-tagged flags, what to push on first.</p>
                {/* Mini surface */}
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-3">
                    <ScoreRing score={62} size={48} />
                    <div>
                      <p className="text-[12px] font-bold text-amber-600" style={{ fontFamily: sora }}>Push harder</p>
                      <p className="text-[10px] text-slate-500">3 flags, 2 high-impact</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { sev: 'HIGH', text: '15 unused seats' },
                      { sev: 'MED', text: 'Missing loyalty discount' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white border border-slate-100">
                        <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: f.sev === 'HIGH' ? '#fecaca' : '#fde68a', color: f.sev === 'HIGH' ? '#991b1b' : '#92400e', fontFamily: mono }}>{f.sev}</span>
                        <span className="text-[10.5px] text-slate-700">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Strategy + Savings */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.15) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                  <TrendingDown className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold mb-1 tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>02 &middot; Strategise</p>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2" style={{ fontFamily: sora }}>Asks + Savings</h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">Specific asks tied to specific amounts. Must-haves, nice-to-haves, fallbacks if they push back.</p>
                {/* Mini surface */}
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold" style={{ fontFamily: mono }}>Annual impact</span>
                    <span className="text-[18px] font-bold" style={{ fontFamily: sora, color: '#047857' }}>&euro;7,800</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-emerald-100 overflow-hidden mb-3">
                    <div className="h-full rounded-full" style={{ width: '32.5%', background: green }} />
                  </div>
                  {[
                    { ask: 'Right-size to 30 seats', amt: '€6,000' },
                    { ask: '10% loyalty discount', amt: '€1,800' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-1 text-[10.5px]">
                      <span className="text-slate-700">{s.ask}</span>
                      <span className="font-bold text-emerald-700" style={{ fontFamily: sora }}>{s.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Email drafts */}
            <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.15) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold mb-1 tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>03 &middot; Send</p>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2" style={{ fontFamily: sora }}>Email drafts</h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">Three tones &mdash; Warm, Direct, Firm. Every flag addressed, your numbers in. Copy and send.</p>
                {/* Mini surface */}
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex gap-1 mb-2">
                    {['Warm', 'Direct', 'Firm'].map((t, i) => (
                      <span key={t} className={`text-[9px] font-bold px-2 py-1 rounded`} style={{ background: i === 0 ? 'rgba(29,185,84,0.15)' : 'white', color: i === 0 ? '#047857' : '#64748b', border: i === 0 ? `1px solid ${green}` : '1px solid #e2e8f0', fontFamily: sora }}>{t}</span>
                    ))}
                  </div>
                  <div className="bg-white rounded-md border border-slate-100 p-2.5 text-[10.5px] leading-relaxed text-slate-600">
                    Hi Sarah, thanks for the renewal&mdash;<br />
                    we&apos;re only using 25 of 40 seats. <span className="bg-emerald-100/60 px-1 rounded">Could we right-size...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PERSONALISED — Negotiation preferences
         ═══════════════════════════════════════════════════ */}
      <section id="preferences" className="relative px-6 py-16 sm:py-28 bg-slate-900 text-white overflow-hidden">
        {/* Background flair */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Tailored to you</p>
            <h2 className="mb-6" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.025em', color: 'white' }}>
              Your business. <br /><span style={{ color: green }}>Your edge.</span>
            </h2>
            <p className="text-[17px] text-slate-300 leading-relaxed mb-7">
              Set your priorities once &mdash; tone, style, payment terms, industry. Every analysis is then calibrated to how <span className="text-white font-semibold">you</span> negotiate, not generic procurement-speak. The result sounds like you, just sharper.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { icon: Heart, t: 'Tone profile', d: 'Warm, Direct, or Firm — applied to every draft' },
                { icon: Scale, t: 'Top priority', d: 'Lowest price, best terms, or maximum flexibility' },
                { icon: Building2, t: 'Company context', d: 'Size, industry, and signature baked into every email' },
                { icon: Swords, t: 'Negotiation style', d: 'Collaborative, balanced, or aggressive' },
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(29,185,84,0.15)', color: green }}>
                    <it.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[14.5px] font-bold text-white" style={{ fontFamily: sora }}>{it.t}</p>
                    <p className="text-[13px] text-slate-400">{it.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/login" className="inline-flex items-center gap-2 text-[14px] font-bold no-underline hover:gap-3 transition-all" style={{ color: green }}>
              Set up your profile <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive preferences mock */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(29,185,84,0.15) 0%, transparent 60%)' }} />
            <BrowserFrame url="termlift.com/app/settings/negotiation" className="relative !rounded-2xl">
              <div className="p-6 space-y-6">
                {/* Top priority */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />Top priority
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'lowest_price' as const, icon: Zap, label: 'Lowest price' },
                      { val: 'best_terms' as const, icon: Scale, label: 'Best terms' },
                      { val: 'max_flexibility' as const, icon: Sparkles, label: 'Flexibility' },
                    ].map(opt => {
                      const sel = prefPriority === opt.val
                      return (
                        <button key={opt.val} onClick={() => setPrefPriority(opt.val)} className={`p-3 rounded-xl border-2 transition-all ${sel ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300'}`} style={{ borderColor: sel ? green : undefined, background: sel ? 'rgba(29,185,84,0.06)' : 'white' }}>
                          <opt.icon className="w-4 h-4 mb-1" style={{ color: sel ? green : '#64748b' }} />
                          <p className="text-[11.5px] font-semibold text-left" style={{ color: sel ? '#065f46' : '#0f172a', fontFamily: sora }}>{opt.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Email tone */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />Default email tone
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'friendly' as const, icon: Heart, label: 'Warm', desc: 'Relationship-first' },
                      { val: 'direct' as const, icon: Send, label: 'Direct', desc: 'Clear, concise' },
                      { val: 'firm' as const, icon: Shield, label: 'Firm', desc: 'Strong position' },
                    ].map(opt => {
                      const sel = prefTone === opt.val
                      return (
                        <button key={opt.val} onClick={() => setPrefTone(opt.val)} className={`p-3 rounded-xl border-2 transition-all text-left ${sel ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300'}`} style={{ borderColor: sel ? green : undefined, background: sel ? 'rgba(29,185,84,0.06)' : 'white' }}>
                          <opt.icon className="w-4 h-4 mb-1" style={{ color: sel ? green : '#64748b' }} />
                          <p className="text-[11.5px] font-semibold" style={{ color: sel ? '#065f46' : '#0f172a', fontFamily: sora }}>{opt.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Negotiation style */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-2">
                    <Swords className="w-3.5 h-3.5" />Negotiation style
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'collaborative' as const, icon: Heart, label: 'Collaborative' },
                      { val: 'balanced' as const, icon: Scale, label: 'Balanced' },
                      { val: 'aggressive' as const, icon: Swords, label: 'Aggressive' },
                    ].map(opt => {
                      const sel = prefStyle === opt.val
                      return (
                        <button key={opt.val} onClick={() => setPrefStyle(opt.val)} className={`p-3 rounded-xl border-2 transition-all text-left ${sel ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300'}`} style={{ borderColor: sel ? green : undefined, background: sel ? 'rgba(29,185,84,0.06)' : 'white' }}>
                          <opt.icon className="w-4 h-4 mb-1" style={{ color: sel ? green : '#64748b' }} />
                          <p className="text-[11.5px] font-semibold" style={{ color: sel ? '#065f46' : '#0f172a', fontFamily: sora }}>{opt.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Company */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />Company
                  </p>
                  <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2">
                    <input readOnly value="Acme Corp" className="px-3 py-2.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50/50 text-slate-700 font-medium" />
                    <input readOnly value="51-200" className="px-3 py-2.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50/50 text-slate-700" />
                    <input readOnly value="SaaS" className="px-3 py-2.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50/50 text-slate-700" />
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          REAL WINS — from /example data
         ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-16 sm:py-28 bg-white">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Real wins</p>
            <h2 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              Six quotes. <span style={{ color: green }}>Forty grand back in pocket.</span>
            </h2>
            <p className="text-[17px] text-slate-500 leading-relaxed">
              Click into any of these to see the full analysis &mdash; every red flag, every ask, the exact email that closed it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { vendor: 'DocuSign', cat: 'SaaS', original: '€24,000', final: '€17,100', saved: '€6,900', pct: '29%', tags: ['Seats right-sized', 'Loyalty discount'] },
              { vendor: 'Salesforce', cat: 'CRM', original: '€36,000', final: '€27,360', saved: '€8,640', pct: '24%', tags: ['Multi-year disc.', 'Price locked'] },
              { vendor: 'FedEx', cat: 'Shipping', original: '$51,960', final: '$41,160', saved: '$10,800', pct: '21%', tags: ['Base rate cut', 'Fuel capped'] },
              { vendor: 'Konica Minolta', cat: 'Lease', original: '€35,370', final: '€29,610', saved: '€5,760', pct: '16%', tags: ['Lease reduced', 'Exit clause'] },
              { vendor: 'BDO', cat: 'Advisory', original: '€24,150', final: '€20,650', saved: '€3,500', pct: '14.5%', tags: ['Hourly cut', 'Hours capped'] },
              { vendor: 'Microsoft 365', cat: 'SaaS', original: '€22,800', final: '€22,116', saved: '€684', pct: '3%', tags: ['Price locked'] },
            ].map(d => (
              <Link key={d.vendor} href="/demo" className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all no-underline">
                {/* Won banner */}
                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100" style={{ background: `linear-gradient(90deg, ${green} 0%, ${greenDark} 100%)` }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-[14px] font-bold text-white" style={{ fontFamily: sora }}>{d.vendor}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/80" style={{ fontFamily: mono }}>{d.cat}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5" style={{ fontFamily: mono }}>Original</p>
                      <p className="text-[15px] font-bold text-slate-400 line-through" style={{ fontFamily: sora }}>{d.original}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 mb-1.5" />
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-600 mb-0.5" style={{ fontFamily: mono }}>Final</p>
                      <p className="text-[15px] font-bold text-slate-900" style={{ fontFamily: sora }}>{d.final}</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-3 text-center mb-3 border border-emerald-200" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(16,185,129,0.04) 100%)' }}>
                    <p className="text-[22px] font-bold" style={{ fontFamily: sora, color: '#047857' }}>{d.saved}</p>
                    <p className="text-[11px] font-semibold text-emerald-600">{d.pct} saved</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {d.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500 group-hover:text-emerald-700 transition-colors">
                    <span className="font-semibold">Read the full analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DASHBOARD REVEAL
         ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-16 sm:py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(29,185,84,0.08) 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Your spend, tracked</p>
            <h2 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              The full procurement view. <br /><span style={{ color: green }}>Without the procurement headcount.</span>
            </h2>
            <p className="text-[17px] text-slate-500 leading-relaxed">
              Every analysis lands in your dashboard. Pipeline value, savings captured, spend by category, upcoming renewals &mdash; everything an enterprise procurement function has, in a single screen.
            </p>
          </div>

          {/* Dashboard surface */}
          <BrowserFrame url="termlift.com/app/dashboard" className="max-w-[1100px] mx-auto">
            <div className="bg-slate-50/40 p-6">
              {/* KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: green }}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Saved</p>
                  </div>
                  <p className="text-[22px] font-bold text-emerald-800 leading-none" style={{ fontFamily: sora }}>
                    &euro;24,600
                  </p>
                  <p className="text-[11px] text-emerald-500 mt-1">4 won deals</p>
                </div>
                {[
                  { label: 'Pipeline', val: '€38k', sub: '7 active', icon: <Target className="w-4 h-4 text-slate-600" /> },
                  { label: 'Spend tracked', val: '€186k', sub: '13 deals', icon: <BarChart3 className="w-4 h-4 text-slate-600" /> },
                  { label: 'Win rate', val: '67%', sub: '4 of 6 closed', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
                ].map(k => (
                  <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">{k.icon}</div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k.label}</p>
                    </div>
                    <p className={`text-[22px] font-bold leading-none ${k.label === 'Win rate' ? 'text-emerald-700' : 'text-slate-900'}`} style={{ fontFamily: sora }}>{k.val}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Two-col grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Spend by category */}
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-wide">Spend by category</p>
                    <p className="text-[11px] text-slate-400">€186k total</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'SaaS & Software', spend: '€82k', pct: 44 },
                      { name: 'Professional Services', spend: '€48k', pct: 26 },
                      { name: 'Logistics & Delivery', spend: '€36k', pct: 19 },
                      { name: 'Office & Facilities', spend: '€20k', pct: 11 },
                    ].map(c => (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11.5px] font-semibold text-slate-700">{c.name}</span>
                          <span className="text-[11.5px] font-bold text-slate-900">{c.spend}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: green }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming renewals */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-[12px] font-bold text-slate-900 uppercase tracking-wide mb-4">Upcoming renewals</p>
                  <div className="space-y-2.5">
                    {[
                      { v: 'DocuSign', d: 'Mar 12', days: 38, near: true },
                      { v: 'FedEx', d: 'May 4', days: 91, near: false },
                      { v: 'BDO', d: 'Jul 22', days: 170, near: false },
                    ].map(r => (
                      <div key={r.v} className={`flex items-center gap-3 rounded-lg p-2.5 border ${r.near ? 'bg-amber-50 border-amber-200' : 'bg-slate-50/60 border-slate-100'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.near ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                          <Calendar className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-slate-900">{r.v}</p>
                          <p className="text-[10.5px] text-slate-500">{r.d}</p>
                        </div>
                        <span className={`text-[11px] font-bold ${r.near ? 'text-amber-700' : 'text-slate-500'}`}>{r.days}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PULL QUOTE
         ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-16 sm:py-28 bg-slate-900 text-white overflow-hidden border-y border-slate-800">
        <div className="absolute -top-16 sm:-top-32 -right-8 sm:-right-12 select-none pointer-events-none" style={{ fontFamily: sora, fontSize: 'clamp(280px, 50vw, 600px)', fontWeight: 800, color: green, opacity: 0.05, lineHeight: 1 }}>&euro;</div>

        <div className="relative max-w-5xl mx-auto">
          <h2 className="max-w-[900px]" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
            That quote in your inbox? <br /><span style={{ color: green }}>You&apos;re probably leaving money on the table.</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 mt-14 border-t border-b border-slate-800">
            {[
              { label: 'Avg analysis', val: '~2 min' },
              { label: 'Email tones', val: '3' },
              { label: 'Formats', val: 'Any' },
              { label: 'Signup', val: 'None' },
            ].map((s, i) => (
              <div key={s.label} className="py-7 px-5" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div className="text-[11px] uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: mono }}>{s.label}</div>
                <div style={{ fontFamily: sora, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1, color: green }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECURITY — privacy process flow
         ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-20 bg-slate-950 text-slate-300 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(29,185,84,0.08) 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{ background: 'rgba(29,185,84,0.15)' }}>
              <Shield className="w-5 h-5" style={{ color: green }} />
            </div>
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Privacy first</p>
            <h2 className="text-white" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(30px, 4.2vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}>
              Your documents are <span style={{ color: green }}>safe.</span> Here&apos;s how.
            </h2>
          </div>

          {/* Flow */}
          <div className="relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-slate-800">
              {[
                { icon: <Upload className="w-5 h-5" style={{ color: green }} />, label: 'You upload', sub: 'PDF, image, or paste text', step: '01' },
                { icon: <Eye className="w-5 h-5" style={{ color: green }} />, label: 'AI reads it', sub: 'Text extracted in memory', step: '02' },
                { icon: <Trash2 className="w-5 h-5 text-red-400" />, label: 'File deleted', sub: 'Instantly. Permanently.', step: '03', destructive: true },
                { icon: <CheckCircle2 className="w-5 h-5" style={{ color: green }} />, label: 'You get results', sub: 'Score, flags, savings, email', step: '04' },
              ].map((s, i) => (
                <div key={s.label} className="py-10 px-6 text-center relative" style={{ background: s.destructive ? 'rgba(239,68,68,0.05)' : '#0f172a', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ fontFamily: mono, color: s.destructive ? '#fca5a5' : green }}>{s.step}</div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: s.destructive ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {s.icon}
                  </div>
                  <p className="text-[14px] font-bold text-white mb-1" style={{ fontFamily: sora }}>{s.label}</p>
                  <p className="text-[12.5px] text-slate-400 leading-snug">{s.sub}</p>
                  {/* Arrow between */}
                  {i < 3 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-slate-700 z-10 bg-slate-950 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRICING — HIDDEN. Reactivate by removing the {false && wrapper.
         ═══════════════════════════════════════════════════ */}
      {false && (
      <section id="pricing" className="relative px-6 py-16 sm:py-28 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(29,185,84,0.08) 0%, transparent 60%)' }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Pricing</p>
            <h2 className="text-slate-900 mb-3" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.5vw, 52px)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              One quote can pay for <span style={{ color: green }}>a year of Pro.</span>
            </h2>
            <p className="text-[16px] text-slate-500">Start free. Upgrade when it pays for itself.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { tier: 'Starter', price: '€0', per: '', tagline: 'No card. Just try it.', features: ['1 free analysis, no signup', '3 more after account', 'Red flags + strategy'], cta: 'Try free', href: '/try', featured: false },
              { tier: 'Essentials', price: '€15', per: '/mo', tagline: 'Steady stream of quotes.', features: ['10 analyses / month', 'Save and revisit deals', '2 negotiation rounds', '30-day deal history'], cta: 'Get Essentials', href: '/login?from=pricing', featured: true },
              { tier: 'Pro', price: '€39', per: '/mo', tagline: 'Running everything.', features: ['Unlimited analyses', 'Unlimited rounds', 'Full spend dashboard', 'PDF export & history'], cta: 'Get Pro', href: '/login?from=pricing', featured: false },
            ].map(p => (
              <div
                key={p.tier}
                className={`relative rounded-2xl p-7 border transition-all hover:-translate-y-1 ${p.featured ? 'text-white border-transparent md:-translate-y-2 md:hover:-translate-y-3' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl'}`}
                style={{ background: p.featured ? 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' : undefined, boxShadow: p.featured ? '0 24px 60px -12px rgba(15,23,42,0.4)' : undefined }}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md" style={{ background: green, color: '#0f172a', fontFamily: mono }}>
                    Most popular
                  </div>
                )}
                <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: mono, color: p.featured ? '#94a3b8' : '#94a3b8' }}>{p.tier}</p>
                <div className="mb-1" style={{ fontFamily: sora, fontSize: 46, fontWeight: 800, lineHeight: 1, color: p.featured ? green : '#0f172a' }}>
                  {p.price}<span className="text-[15px] font-normal opacity-50" style={{ color: p.featured ? '#94a3b8' : '#64748b' }}>{p.per}</span>
                </div>
                <p className="text-[13px] mb-5" style={{ color: p.featured ? '#94a3b8' : '#64748b' }}>{p.tagline}</p>
                <ul className="list-none p-0 mb-6 space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: p.featured ? '#cbd5e1' : '#334155' }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: green }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`block text-center py-3 rounded-xl no-underline text-[14px] font-bold transition-all hover:shadow-md ${p.featured ? 'text-slate-900' : 'text-white hover:bg-slate-800'}`}
                  style={{ background: p.featured ? green : '#0f172a' }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-10">
            <Link href="/pricing" className="text-[13.5px] text-slate-500 hover:text-slate-900 no-underline inline-flex items-center gap-1.5 font-semibold">
              See full pricing details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </section>
      )}

      {/* ─── FINAL CTA — quiet white band ─── */}
      <section className="px-6 py-20 bg-white border-t border-slate-200 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(28px, 3.8vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
            Try it on your next quote.
          </h2>
          <p className="text-[15.5px] text-slate-500 mb-7 leading-relaxed">
            One free analysis. No card, no signup. About two minutes.
          </p>
          <Link href="/try" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}>
            Analyse my quote &mdash; free <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-5" style={{ fontFamily: mono }}>
            ~2 min &middot; No signup &middot; No card
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════ */}
      <MarketingFooter />

      <style>{`
        @keyframes hero-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-hero-float { animation: hero-float 6s ease-in-out infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}
