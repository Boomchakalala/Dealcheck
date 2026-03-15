import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Example Analyses — TermLift | See AI Quote Analysis in Action',
  description: 'See how TermLift analyzes real vendor quotes — marketing agency retainers, SaaS renewals, and office supply contracts. Spot red flags and savings in seconds.',
  alternates: { canonical: 'https://www.termlift.com/example' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
