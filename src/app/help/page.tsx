'use client'

import { NEGOTIATION_FEE_PERCENT, NEGOTIATION_FEE_MINIMUM_EUR, deepAnalysisPriceLabel, earlyAccessUntilLabel } from '@/lib/pricing'
import { useState } from 'react'
import Link from 'next/link'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Info, Upload, CheckCircle2, Lock, CreditCard, Shield, Plus, ArrowRight } from 'lucide-react'

const sora = "'Sora', sans-serif"
const green = '#1DB954'

type Section = 'what' | 'upload' | 'output' | 'privacy' | 'billing' | 'trouble'

const sections: { key: Section; name: string; icon: React.ReactNode }[] = [
  { key: 'what', name: 'What TermLift does', icon: <Info className="w-4 h-4" /> },
  { key: 'upload', name: 'Uploading quotes', icon: <Upload className="w-4 h-4" /> },
  { key: 'output', name: 'Analysis output', icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'privacy', name: 'Privacy & data', icon: <Lock className="w-4 h-4" /> },
  { key: 'billing', name: 'Account & billing', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'trouble', name: 'Troubleshooting', icon: <Shield className="w-4 h-4" /> },
]

const faqData: Record<Section, { title: string; sub: string; items: { q: string; a: string }[] }> = {
  what: {
    title: 'What TermLift does',
    sub: 'Understanding how TermLift works and what to expect',
    items: [
      { q: 'What is TermLift?', a: "TermLift helps you negotiate better supplier deals. Upload a quote and you get a fast initial assessment — your deal score, red flags, and potential savings. From there, unlock the Deep Analysis for deeper negotiation levers, recommended asks, and strategy — then negotiate the deal yourself, or have TermLift negotiate it for you." },
      { q: 'What TermLift is NOT', a: "TermLift is not legal advice, not a guarantee of savings, and not a replacement for reading your contracts. It's a starting point that gives you leverage and structure — but you should always review the outputs yourself and consult a professional for legal or financial decisions." },
      { q: 'How does the AI analysis work?', a: "Text is extracted from your document (PDF, image, or pasted text) and sent to Anthropic's Claude AI, which is prompted specifically for procurement analysis. It reads the full content, identifies risks, builds a negotiation strategy, and generates structured output." },
    ],
  },
  upload: {
    title: 'Uploading quotes',
    sub: 'How to get your vendor quotes into TermLift',
    items: [
      { q: 'How do I upload a quote?', a: 'You have four options: paste text directly into the text box, upload a PDF file, upload an image (PNG, JPG, or WEBP), or take a screenshot of a pricing page or email. Just drag and drop or click the upload area on the analysis page.' },
      { q: 'What file formats are supported?', a: 'PDF, PNG, JPG, WEBP, or plain text paste. Maximum file size is 10 MB. For best results with images, make sure the text in the image is clearly readable.' },
      { q: 'Can I analyze an email from a vendor?', a: 'Yes. Just copy the email text and paste it directly into the text input. You can include the full email — subject line, body, pricing tables, terms — and TermLift will analyze all of it.' },
    ],
  },
  output: {
    title: 'Analysis output',
    sub: 'What you get back and how to use it',
    items: [
      { q: 'What do I get back from an analysis?', a: "First, a fast initial assessment — a deal score, red flags, and an estimate of potential savings, usually in under a minute. From there, the Deep Analysis goes deeper: negotiation levers, recommended asks, priorities, and strategy. Once you have what you need, generate a ready-to-send email yourself or have TermLift negotiate the deal for you." },
      { q: 'What are the email drafts for?', a: "They're ready-to-copy replies you can send directly to your supplier once you're ready to act on the analysis. Each one comes in three tones — Friendly, Direct, and Firm. Pick the one that fits your relationship with the supplier and copy it." },
      { q: 'Is the AI always accurate?', a: 'No. AI can miss details, misinterpret terms, or make errors. TermLift is a starting point for negotiation, not the final word. Always review the outputs against your original documents before acting on them. If something looks off, it probably is — trust your judgment.' },
    ],
  },
  privacy: {
    title: 'Privacy & data',
    sub: 'How we handle your documents and data',
    items: [
      { q: 'Is my data private?', a: 'Yes. Uploaded files are deleted immediately after text extraction. Your text is not stored unless you explicitly save the deal to your account. All data is encrypted in transit (TLS) and at rest. Your documents are never used for AI training.' },
      { q: 'What if I upload confidential documents?', a: "Treat TermLift like any cloud-based tool. Don't upload documents you're contractually prohibited from sharing with third-party services. Your text is sent to Anthropic's API for processing. See our Privacy Policy and Terms for full details." },
    ],
  },
  billing: {
    title: 'Account & billing',
    sub: 'Pricing and account management',
    items: [
      { q: "Is analyzing a quote free?", a: 'Yes — analyze a quote with no signup required, and no credit card. Create an account to save deals and keep going from there.' },
      { q: 'How much does Deep Analysis cost?', a: `${deepAnalysisPriceLabel()} per deal, one time — it covers the full playbook, the emails and every round on that deal. During early access (until ${earlyAccessUntilLabel('en')}) it is free, and the first Deep Analysis on any account stays free after that.` },
      { q: 'What does it cost to have TermLift negotiate for me?', a: `Nothing upfront. If you'd rather hand the negotiation over, our fee is ${NEGOTIATION_FEE_PERCENT}% of the verified savings with a €${NEGOTIATION_FEE_MINIMUM_EUR} minimum, invoiced after the signed deal — no savings, no fee.` },
      { q: 'Can I delete my account?', a: "Yes. Go to your profile settings and choose 'Delete account.' All your data — saved deals, analysis history, account info — is permanently removed. This cannot be undone." },
    ],
  },
  trouble: {
    title: 'Troubleshooting',
    sub: 'Common issues and how to fix them',
    items: [
      { q: 'What if the analysis fails?', a: 'Try running it again. If it keeps failing, the document may be too long or in an unsupported format. Try pasting just the key sections as plain text instead. If the problem persists, email hello@termlift.com and we\'ll help.' },
      { q: "The analysis doesn't match my document", a: "AI can misinterpret content, especially from images or complex PDFs with tables and fine print. For better results, try pasting the key sections as plain text instead of uploading a file. If the analysis is way off, let us know at hello@termlift.com so we can improve." },
    ],
  },
}

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const toggleItem = (key: string) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MarketingHeader />

      <main className="flex-1">
        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="relative px-6 pt-20 sm:pt-28 pb-14 overflow-hidden bg-[#FAFAF7] border-b border-line-2">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 340px at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains), monospace", color: green }}>Help center</p>
            <h1 className="text-ink mb-4" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.028em' }}>
              How can we help?
            </h1>
            <p className="text-[17px] text-ink-3 leading-relaxed max-w-xl mx-auto">
              Everything you need to get the most out of TermLift — quotes, output, privacy, billing, and fixes.
            </p>
          </div>
        </section>

        {/* ─── FAQ SECTIONS ─────────────────────────────── */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-12">
            {sections.map((section) => {
              const data = faqData[section.key]
              return (
                <div key={section.key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-[19px] font-bold text-ink leading-tight font-display">{data.title}</h2>
                      <p className="text-[12.5px] text-ink-3">{data.sub}</p>
                    </div>
                  </div>
                  <div className="rounded-[14px] border border-line overflow-hidden divide-y divide-line-2">
                    {data.items.map((item, i) => {
                      const key = `${section.key}-${i}`
                      const isOpen = !!openItems[key]
                      return (
                        <div key={key}>
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-2/70 transition-colors"
                          >
                            <span className="text-[14px] font-semibold text-ink">{item.q}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-green-soft text-green-deep' : 'bg-surface-2 text-ink-3'}`}>
                              <Plus className="w-3.5 h-3.5 transition-transform" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }} />
                            </div>
                          </button>
                          {isOpen && (
                            <p className="px-5 pb-4 -mt-1 text-[13.5px] text-ink-3 leading-relaxed">{item.a}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── STILL HAVE QUESTIONS ─────────────────────── */}
        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-[14px] border-2 border-green-line p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(255,255,255,1) 100%)' }}>
              <div>
                <h3 className="text-[18px] font-bold text-ink mb-1 font-display">Still have questions?</h3>
                <p className="text-[13.5px] text-ink-3">We&apos;re here to help — reach out anytime.</p>
              </div>
              <div className="flex gap-2.5 flex-shrink-0">
                <a href="mailto:hello@termlift.com" className="text-[13px] font-semibold px-4 py-2.5 rounded-[10px] border border-line text-ink-2 bg-white hover:border-[#C9D3CE] transition-colors">
                  hello@termlift.com
                </a>
                <Link
                  href="/try"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-[10px] text-white transition-all hover:-translate-y-0.5"
                  style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
                >
                  Analyze a quote <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
