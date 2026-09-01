export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Calendar, PhoneCall, FileCheck } from 'lucide-react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { NegotiationRequestForm } from '@/components/NegotiationRequestForm'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"
const green = '#1DB954'

export default async function NegotiatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <MarketingHeader />

      <section className="relative px-6 pt-14 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 80% 20%, rgba(29,185,84,0.14) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[11.5px] mb-3 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>Renewal coming up?</p>
          <h1 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.06, letterSpacing: '-0.025em' }}>
            Let TermLift negotiate it.
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed">
            Already know you want help? You don&apos;t need to run the free analysis first — tell us what&apos;s renewing and a negotiator picks it up from here.
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: FileCheck, label: 'Tell us the details', sub: 'Vendor, spend, deadline — a couple minutes' },
            { icon: PhoneCall, label: 'We review it', sub: 'A negotiator gets in touch to confirm scope' },
            { icon: Calendar, label: 'We run the negotiation', sub: 'You follow progress, approve the outcome' },
          ].map((s) => (
            <div key={s.label} className="text-center p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-[13.5px] font-bold text-slate-900" style={{ fontFamily: sora }}>{s.label}</p>
              <p className="text-[12px] text-slate-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Prefer a call first — routes to email until a scheduler is wired up */}
        <div className="max-w-3xl mx-auto mb-10 rounded-2xl border-2 border-slate-200 p-5 text-center">
          <p className="text-[13.5px] font-semibold text-slate-600">Prefer to talk it through first?</p>
          <a
            href="mailto:hello@termlift.com?subject=Let's%20talk%20negotiation"
            className="text-[12.5px] text-emerald-600 hover:text-emerald-700 font-semibold mt-1 inline-block transition-colors"
          >
            Email hello@termlift.com and we'll set up a call
          </a>
        </div>

        <div className="max-w-3xl mx-auto">
          <NegotiationRequestForm source="direct" isAuthenticated={!!user} />
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
