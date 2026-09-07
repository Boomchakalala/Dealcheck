import type { Metadata } from 'next'
import { NEGOTIATION_FEE_PERCENT, NEGOTIATION_FEE_MINIMUM_EUR, deepAnalysisPriceLabel, earlyAccessUntilLabel } from '@/lib/pricing'
import { Info, Upload, CheckCircle2, Lock, CreditCard, Shield, Plus } from 'lucide-react'
import { MarketingPage, PageHero, Section, wrap } from '@/components/marketing/MarketingPage'
import { Btn } from '@/components/system'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Help & FAQ',
  alternates: { canonical: 'https://www.termlift.com/help' },
}

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
  return (
    <MarketingPage>
      <PageHero
        eyebrow="Help center"
        title="How can we help?"
        lead="Everything you need to get the most out of TermLift — quotes, output, privacy, pricing, and fixes."
        narrow
      />

      <section className="py-10 sm:py-12">
        <div className={cn(wrap, 'grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 items-start')}>
          {/* Jump nav — sticky on desktop */}
          <nav className="hidden lg:block sticky top-[72px]" aria-label="Sections">
            <p className="tl-label text-ink-3 text-[10px] mb-3">On this page</p>
            <ol className="m-0 p-0 list-none flex flex-col gap-1">
              {sections.map((s) => (
                <li key={s.key}>
                  <a href={`#${s.key}`} className="flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink no-underline py-0.5 leading-snug">
                    <span className="text-ink-3">{s.icon}</span>{s.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* FAQ groups */}
          <div className="max-w-[72ch] flex flex-col gap-10">
            {sections.map((section) => {
              const data = faqData[section.key]
              return (
                <div key={section.key} id={section.key} className="scroll-mt-20">
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <h2 className="tl-h3 text-ink">{data.title}</h2>
                    <span className="text-[12.5px] text-ink-2 hidden sm:inline">{data.sub}</span>
                  </div>
                  <div className="border-y border-line divide-y divide-line">
                    {data.items.map((item, i) => (
                      <details key={i} className="group">
                        <summary className="flex items-center justify-between gap-4 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <span className="text-[14.5px] font-semibold text-ink leading-snug">{item.q}</span>
                          <Plus className="w-4 h-4 text-ink-3 shrink-0 transition-transform group-open:rotate-45" />
                        </summary>
                        <p className="text-[14px] text-ink-2 leading-[1.6] pb-4 -mt-1 max-w-[64ch]">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Still stuck — one flat band */}
      <Section tone="ground">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-display font-extrabold text-[22px] sm:text-[26px] leading-[1.08] tracking-[-0.03em]">Still have questions?</h2>
            <p className="text-[14.5px] text-ink-2 mt-1.5">We answer every email, usually the same day.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Btn href="mailto:hello@termlift.com" variant="ghost" size="lg">hello@termlift.com</Btn>
            <Btn href="/try" variant="primary" size="lg">Analyse a quote</Btn>
          </div>
        </div>
      </Section>
    </MarketingPage>
  )
}
