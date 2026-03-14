import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — TermLift',
  description: 'Built by a procurement professional with 8 years of experience. TermLift makes negotiation expertise available to everyone.',
  openGraph: {
    title: 'About — TermLift',
    description: 'Built by a procurement professional with 8 years of experience. TermLift makes negotiation expertise available to everyone.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
