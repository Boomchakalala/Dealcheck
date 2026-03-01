import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      q: 'What can I upload?',
      a: 'PDFs, images (PNG, JPG, WEBP), or just paste text directly. Forward a vendor email, drop in a quote PDF, or screenshot a pricing page — all work.',
    },
    {
      q: 'How does the analysis work?',
      a: 'Your document is sent to an AI model prompted specifically for procurement analysis. It reads the full text, identifies pricing risks and contract traps, builds a negotiation strategy with specific asks, and drafts reply emails — all in one pass. The analysis is based solely on what\'s in your document. We do not use proprietary benchmark data.',
    },
    {
      q: 'Is my data private?',
      a: 'Your document is processed securely over encrypted connections (TLS) and is not stored permanently unless you sign in and explicitly save a deal. We do not sell your data or use it for advertising. See our Privacy Policy for details on sub-processors.',
    },
    {
      q: 'Do I need procurement experience?',
      a: 'No. DealCheck is built for founders, ops leads, and finance teams who negotiate vendor deals but don\'t do it full-time. The output is plain English with specific, copy-paste actions — not generic advice.',
    },
    {
      q: 'What happens after the free runs?',
      a: 'You get 2 free analysis rounds with no signup. Sign in to save deals and access your history. Pro (unlimited rounds) is launching soon — join the waitlist on our Pricing page.',
    },
    {
      q: 'Can I export the analysis?',
      a: 'You can copy individual sections (red flags, email drafts, asks) using the copy buttons in the output. Full PDF export is planned for the Pro tier.',
    },
    {
      q: 'Is the AI always accurate?',
      a: 'No. AI analysis can contain errors, miss details, or misinterpret terms. DealCheck is a starting point for negotiation — not a substitute for legal or financial advice. Always review outputs before acting on them.',
    },
    {
      q: 'What if I upload confidential documents?',
      a: 'Treat DealCheck like any cloud-based tool: don\'t upload documents you\'re contractually prohibited from sharing with third-party services. Your text is sent to our AI provider (OpenAI) for processing. See our Terms for full details.',
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
            DealCheck
          </Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-20">
          <p className="text-sm font-medium text-emerald-600 mb-5 tracking-wide">Help</p>
          <h1 className="text-[2.25rem] sm:text-[2.75rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4">
            Frequently asked questions
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
            How DealCheck works, what to expect, and how we handle your data.
          </p>

          <div className="space-y-0 border-t border-slate-200">
            {faqs.map((item, i) => (
              <details key={i} className="group border-b border-slate-200">
                <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                  <span className="text-base font-medium text-slate-900 pr-8">{item.q}</span>
                  <span className="text-slate-300 group-open:rotate-45 transition-transform duration-200 text-xl leading-none flex-shrink-0">+</span>
                </summary>
                <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3">Still have questions?</p>
            <a
              href="mailto:support@dealcheck.app"
              className="text-sm font-medium text-slate-900 underline underline-offset-2 decoration-slate-300 hover:decoration-slate-500 transition-colors"
            >
              support@dealcheck.app
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">DealCheck</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
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
