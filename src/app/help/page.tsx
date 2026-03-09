import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { HelpCircle, Mail, ArrowRight } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    { q: 'What can I upload?', a: 'PDFs, images (PNG, JPG, WEBP), or just paste text directly. Forward a vendor email, drop in a quote PDF, or screenshot a pricing page — all work.' },
    { q: 'How does the analysis work?', a: 'Your document is sent to an AI model prompted specifically for procurement analysis. It reads the full text, identifies pricing risks and contract traps, builds a negotiation strategy with specific asks, and drafts reply emails — all in one pass. The analysis is based solely on what\'s in your document. We do not use proprietary benchmark data.' },
    { q: 'Is my data private?', a: 'Your document is processed securely over encrypted connections (TLS) and is not stored permanently unless you sign in and explicitly save a deal. We do not sell your data or use it for advertising. See our Privacy Policy for details on sub-processors.' },
    { q: 'Do I need procurement experience?', a: 'No. TermLift is built for founders, ops leads, and finance teams who negotiate vendor deals but don\'t do it full-time. The output is plain English with specific, copy-paste actions — not generic advice.' },
    { q: 'Is there a usage limit?', a: 'You get 2 free AI analyses to try TermLift. After that, you\'ll need a Pro plan for unlimited analyses. Sign in to save deals and track negotiations over time.' },
    { q: 'Can I export the analysis?', a: 'You can copy individual sections (red flags, email drafts, asks) using the copy buttons in the output. Full PDF export is planned for the Pro tier.' },
    { q: 'Is the AI always accurate?', a: 'No. AI analysis can contain errors, miss details, or misinterpret terms. TermLift is a starting point for negotiation — not a substitute for legal or financial advice. Always review outputs before acting on them.' },
    { q: 'What if I upload confidential documents?', a: 'Treat TermLift like any cloud-based tool: don\'t upload documents you\'re contractually prohibited from sharing with third-party services. Your text is sent to our AI provider (OpenAI) for processing. See our Terms for full details.' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Help center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Frequently asked questions
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
              How TermLift works, what to expect, and how we handle your data.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-8">
          <div className="space-y-0 border-t border-slate-200/60">
            {faqs.map((item, i) => (
              <details key={i} className="group border-b border-slate-200/60">
                <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                  <span className="text-base font-medium text-slate-900 pr-8">{item.q}</span>
                  <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                </summary>
                <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-10 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-2">Still have questions?</p>
            <p className="text-sm text-slate-500 mb-5">We're here to help.</p>
            <a
              href="mailto:support@termlift.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              support@termlift.com
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50/50 mt-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-400">TermLift</p>
          <div className="flex items-center gap-8 text-sm text-slate-400">
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
