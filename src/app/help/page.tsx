import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { HelpCircle, Mail, ArrowRight } from 'lucide-react'

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'What TermLift does',
      faqs: [
        {
          q: 'What is TermLift?',
          a: 'TermLift is an AI-powered tool that helps you negotiate better vendor deals. Upload a quote or contract, and it finds red flags, estimates potential savings, builds a negotiation plan with specific asks, and drafts ready-to-send reply emails — all in about 60 seconds.',
        },
        {
          q: 'What TermLift is NOT',
          a: 'TermLift is not legal advice, not a guarantee of savings, and not a replacement for reading your contracts. It\'s a starting point that gives you leverage and structure — but you should always review the outputs yourself and consult a professional for legal or financial decisions.',
        },
        {
          q: 'How does the AI analysis work?',
          a: 'Text is extracted from your document (PDF, image, or pasted text) and sent to Anthropic\'s Claude AI, which is prompted specifically for procurement analysis. It reads the full content, identifies risks, builds a negotiation strategy, and generates structured output — typically in under 60 seconds.',
        },
      ],
    },
    {
      title: 'Uploading quotes',
      faqs: [
        {
          q: 'How do I upload a quote?',
          a: 'You have four options: paste text directly into the text box, upload a PDF file, upload an image (PNG, JPG, or WEBP), or take a screenshot of a pricing page or email. Just drag and drop or click the upload area on the analysis page.',
        },
        {
          q: 'What file formats are supported?',
          a: 'PDF, PNG, JPG, WEBP, or plain text paste. Maximum file size is 10 MB. For best results with images, make sure the text in the image is clearly readable.',
        },
        {
          q: 'Can I analyze an email from a vendor?',
          a: 'Yes. Just copy the email text and paste it directly into the text input. You can include the full email — subject line, body, pricing tables, terms — and TermLift will analyze all of it.',
        },
      ],
    },
    {
      title: 'Analysis output',
      faqs: [
        {
          q: 'What do I get back from an analysis?',
          a: 'You get a complete negotiation package: a verdict summary, red flags with suggested mitigations, a negotiation plan split into must-have and nice-to-have asks, estimated potential savings, and ready-to-send email drafts in three different tones.',
        },
        {
          q: 'What are the email drafts for?',
          a: 'They\'re ready-to-copy replies you can send directly to your vendor. Each analysis generates three versions — Friendly (collaborative tone), Direct (professional and to the point), and Firm (assertive with clear expectations). Pick the one that fits your relationship with the vendor and copy it.',
        },
        {
          q: 'Is the AI always accurate?',
          a: 'No. AI can miss details, misinterpret terms, or make errors. TermLift is a starting point for negotiation, not the final word. Always review the outputs against your original documents before acting on them. If something looks off, it probably is — trust your judgment.',
        },
      ],
    },
    {
      title: 'Privacy & data',
      faqs: [
        {
          q: 'Is my data private?',
          a: 'Yes. Uploaded files are deleted immediately after text extraction. Your text is not stored unless you explicitly save the deal to your account. All data is encrypted in transit (TLS) and at rest. Your documents are never used for AI training.',
        },
        {
          q: 'What if I upload confidential documents?',
          a: 'Treat TermLift like any cloud-based tool. Don\'t upload documents you\'re contractually prohibited from sharing with third-party services. Your text is sent to Anthropic\'s API for processing. See our Privacy Policy and Terms for full details.',
        },
      ],
    },
    {
      title: 'Account & billing',
      faqs: [
        {
          q: 'What\'s the free plan?',
          a: 'You get 1 free analysis with no signup required. Create an account and you get 3 more — 4 total on the Starter plan. No credit card needed.',
        },
        {
          q: 'How much is Pro?',
          a: '€39/month for unlimited analyses, plus features like saved deals and analysis history. Coming soon.',
        },
        {
          q: 'How much is Business?',
          a: '€149/month for a team workspace with up to 3 seats, shared deal history, and priority support. Coming soon.',
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes. Go to your profile settings and choose "Delete account." All your data — saved deals, analysis history, account info — is permanently removed. This cannot be undone.',
        },
      ],
    },
    {
      title: 'Troubleshooting',
      faqs: [
        {
          q: 'What if the analysis fails?',
          a: 'Try running it again. If it keeps failing, the document may be too long or in an unsupported format. Try pasting just the key sections as plain text instead. If the problem persists, email hello@termlift.com and we\'ll help.',
        },
        {
          q: 'The analysis doesn\'t match my document',
          a: 'AI can misinterpret content, especially from images or complex PDFs with tables and fine print. For better results, try pasting the key sections as plain text instead of uploading a file. If the analysis is way off, let us know at hello@termlift.com so we can improve.',
        },
      ],
    },
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
          {faqCategories.map((category, ci) => (
            <div key={ci} className={ci > 0 ? 'mt-12' : ''}>
              <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                {category.title}
              </h2>
              <div className="space-y-0 border-t border-slate-200/60">
                {category.faqs.map((item, i) => (
                  <details key={i} className="group border-b border-slate-200/60">
                    <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                      <span className="text-base font-medium text-slate-900 pr-8">{item.q}</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                    </summary>
                    <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-20 rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-10 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-2">Still have questions?</p>
            <p className="text-sm text-slate-500 mb-5">We're here to help.</p>
            <a
              href="mailto:hello@termlift.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              hello@termlift.com
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
