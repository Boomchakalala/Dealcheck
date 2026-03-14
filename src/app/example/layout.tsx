import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Example Analyses — TermLift',
  description: 'See how TermLift analyzes vendor quotes. Real examples with red flags, savings opportunities, and negotiation emails.',
  openGraph: {
    title: 'Example Analyses — TermLift',
    description: 'See how TermLift analyzes vendor quotes. Real examples with red flags, savings opportunities, and negotiation emails.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
