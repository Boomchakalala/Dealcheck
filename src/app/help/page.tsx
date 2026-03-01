import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HelpPage() {
  const faqs = [
    {
      question: 'What file types are supported?',
      answer:
        'DealCheck supports PDF documents, PNG, JPG, JPEG, and WEBP images. You can also paste text directly — just copy the quote from an email or document and paste it into the text area.',
    },
    {
      question: 'How does the AI analysis work?',
      answer:
        'When you upload or paste a quote, our AI reads the full document and produces a structured analysis: a deal snapshot, quick read assessment, red flags with specific asks, a negotiation plan, copy-paste email drafts, and a list of assumptions. The analysis is based solely on what is in your quote — we do not use external benchmark data.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Your uploaded documents are processed in real-time and are not stored permanently unless you explicitly choose to save the extracted text with a round. Saved deals are tied to your authenticated account and are only accessible by you. We use industry-standard encryption for data in transit and at rest.',
    },
    {
      question: 'How do I upgrade?',
      answer:
        'Pro plan subscriptions are coming soon. Currently, free accounts get 2 analysis rounds. Sign in to save your deals and be notified when Pro launches. Visit the Pricing page for details.',
    },
    {
      question: 'Can I export my analysis?',
      answer:
        'Currently, you can copy individual sections (red flags, email drafts, asks) using the copy buttons in the analysis output. Full export to PDF or email is planned for the Pro tier.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DealCheck</span>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Help & FAQ</h1>
          <p className="text-lg text-slate-600">
            Common questions about using DealCheck
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-slate-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                <span>{faq.question}</span>
                <span className="ml-4 text-slate-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <a href="mailto:support@dealcheck.app">
            <Button variant="outline">Contact Support</Button>
          </a>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
