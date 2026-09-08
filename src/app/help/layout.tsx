import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & FAQ',
  description: 'Frequently asked questions about TermLift. How vendor quote analysis works, supported file formats, Deep Analysis, data privacy, and the success-based negotiation service.',
  openGraph: {
    title: 'Help & FAQ — TermLift',
    description: 'Frequently asked questions about TermLift. How vendor quote analysis works, supported file formats, and data privacy.',
  },
  alternates: { canonical: 'https://www.termlift.com/help' },
}

const faqItems = [
  { q: "What is TermLift?", a: "TermLift helps you negotiate better supplier deals. Upload a quote and get a fast initial assessment — deal score, red flags, and potential savings. From there, unlock Deep Analysis for deeper negotiation levers, recommended asks, and strategy — then negotiate the deal yourself, or have TermLift negotiate it for you." },
  { q: "How does the AI analysis work?", a: "Text is extracted from your document (PDF, image, or pasted text) and sent to Anthropic's Claude AI, which is prompted specifically for procurement analysis. It reads the full content, identifies risks, builds a negotiation strategy, and generates structured output." },
  { q: "What file formats are supported?", a: "PDF, PNG, JPG, WEBP, or plain text paste. Maximum file size is 10 MB. For best results with images, make sure the text in the image is clearly readable." },
  { q: "What do I get back from an analysis?", a: "First, a fast initial assessment — a deal score, red flags, and an estimate of potential savings. From there, Deep Analysis goes deeper: negotiation levers, recommended asks, priorities, and strategy, plus a ready-to-send negotiation email once you're ready to act." },
  { q: "Is my data private?", a: "Yes. Quote files are read in memory and never stored. The extracted text stays with the deal only until Deep Analysis has run, the deal closes, or 90 days pass; the analysis stays until you delete the deal. All data is encrypted in transit and at rest. Your documents are never used for AI training." },
  { q: "Is analyzing a quote free?", a: "Yes — analyze a quote with no signup required, and no credit card." },
  { q: "How does TermLift Negotiate pricing work?", a: "It's a success-based fee — a percentage of the verified savings TermLift negotiates for you, and nothing if we don't save you money." },
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
