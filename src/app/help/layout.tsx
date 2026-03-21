import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & FAQ — TermLift | Vendor Quote Analysis Tool',
  description: 'Frequently asked questions about TermLift. How vendor quote analysis works, supported file formats, pricing plans, data privacy, and what you get from each analysis.',
  openGraph: {
    title: 'Help & FAQ — TermLift',
    description: 'Frequently asked questions about TermLift. How vendor quote analysis works, supported file formats, pricing plans, and data privacy.',
  },
  alternates: { canonical: 'https://www.termlift.com/help' },
}

const faqItems = [
  { q: "What is TermLift?", a: "TermLift is an AI-powered tool that helps you negotiate better vendor deals. Upload a quote or contract, and it finds red flags, estimates potential savings, builds a negotiation plan with specific asks, and drafts ready-to-send reply emails — all in about 60 seconds." },
  { q: "How does the AI analysis work?", a: "Text is extracted from your document (PDF, image, or pasted text) and sent to Anthropic's Claude AI, which is prompted specifically for procurement analysis. It reads the full content, identifies risks, builds a negotiation strategy, and generates structured output — typically in under 60 seconds." },
  { q: "What file formats are supported?", a: "PDF, PNG, JPG, WEBP, or plain text paste. Maximum file size is 10 MB. For best results with images, make sure the text in the image is clearly readable." },
  { q: "What do I get back from an analysis?", a: "You get a complete negotiation package: a verdict summary, red flags with suggested mitigations, a negotiation plan split into must-have and nice-to-have asks, estimated potential savings, and ready-to-send email drafts in three different tones." },
  { q: "Is my data private?", a: "Yes. Uploaded files are deleted immediately after text extraction. Your text is not stored unless you explicitly save the deal to your account. All data is encrypted in transit and at rest. Your documents are never used for AI training." },
  { q: "What's the free plan?", a: "You get 1 free analysis with no signup required. Create an account and you get 3 more — 4 total on the Starter plan. No credit card needed." },
  { q: "How much is Pro?", a: "€39/month for unlimited analyses, plus features like saved deals and analysis history." },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(item => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
      {children}
    </>
  )
}
