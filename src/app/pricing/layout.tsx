import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — TermLift',
  description: 'Start free, scale when ready. Essentials at €39/mo for 15 analyses. Pro at €129/mo for unlimited. One good negotiation pays for months.',
  openGraph: {
    title: 'Pricing — TermLift',
    description: 'Start free, scale when ready. Essentials at €39/mo for 15 analyses. Pro at €129/mo for unlimited.',
  },
  alternates: { canonical: 'https://www.termlift.com/pricing' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
