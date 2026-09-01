import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analyze a Supplier Quote',
  description: 'Drop in a vendor quote and see your negotiation opportunity — red flags, savings, and where you have leverage.',
  openGraph: {
    title: 'Analyze a Supplier Quote — TermLift',
    description: 'Drop in a vendor quote and see your negotiation opportunity — red flags, savings, and where you have leverage.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
