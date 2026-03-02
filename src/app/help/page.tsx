import Link from 'next/link'
import { Header } from '@/components/Header'
import { HelpCircle, Mail } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    { q: 'What can I upload?', a: 'PDFs, images (PNG, JPG, WEBP), or just paste text directly. Forward a vendor email, drop in a quote PDF, or screenshot a pricing page — all work.' },
    { q: 'How does the analysis work?', a: 'Your document is sent to an AI model prompted specifically for procurement analysis. It reads the full text, identifies pricing risks and contract traps, builds a negotiation strategy with specific asks, and drafts reply emails — all in one pass. The analysis is based solely on what\'s in your document. We do not use proprietary benchmark data.' },
    { q: 'Is my data private?', a: 'Your document is processed securely over encrypted connections (TLS) and is not stored permanently unless you sign in and explicitly save a deal. We do not sell your data or use it for advertising. See our Privacy Policy for details on sub-processors.' },
    { q: 'Do I need procurement experience?', a: 'No. DealCheck is built for founders, ops leads, and finance teams who negotiate vendor deals but don\'t do it full-time. The output is plain English with specific, copy-paste actions — not generic advice.' },
    { q: 'Is there a usage limit?', a: 'No. DealCheck is completely free with unlimited analysis rounds. Sign in to save deals and track negotiations over time. Pro features (PDF export, team seats) are launching soon.' },
    { q: 'Can I export the analysis?', a: 'You can copy individual sections (red flags, email drafts, asks) using the copy buttons in the output. Full PDF export is planned for the Pro tier.' },
    { q: 'Is the AI always accurate?', a: 'No. AI analysis can contain errors, miss details, or misinterpret terms. DealCheck is a starting point for negotiation — not a substitute for legal or financial advice. Always review outputs before acting on them.' },
    { q: 'What if I upload confidential documents?', a: 'Treat DealCheck like any cloud-based tool: don\'t upload documents you\'re contractually prohibited from sharing with third-party services. Your text is sent to our AI provider (OpenAI) for processing. See our Terms for full details.' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Help center</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
              Frequently asked questions
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
              How DealCheck works, what to expect, and how we handle your data.
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

          <div className="mt-20 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-10 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-2">Still have questions?</p>
            <p className="text-sm text-slate-500 mb-4">We&apos;re here to help.</p>
            <a
              href="mailto:support@dealcheck.app"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              support@dealcheck.app
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50/50 mt-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-400">DealCheck</p>
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
