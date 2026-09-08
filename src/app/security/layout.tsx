import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security',
  description: 'How TermLift handles your data. Quote files never stored, extracted text kept only temporarily, encrypted in transit and at rest, never used for AI training.',
  openGraph: {
    title: 'Security — TermLift',
    description: 'How TermLift handles your data. Quote files never stored, extracted text kept only temporarily, encrypted in transit and at rest, never used for AI training.',
  },
  alternates: { canonical: 'https://www.termlift.com/security' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
