import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — TermLift',
  description: 'Built by a procurement professional who spent 8 years watching people overpay vendors. TermLift puts that expertise in your hands.',
  alternates: { canonical: 'https://www.termlift.com/about' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
