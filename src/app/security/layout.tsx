import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security — TermLift',
  description: 'How TermLift handles your data. Files deleted after analysis, encrypted in transit and at rest, never used for AI training.',
  openGraph: {
    title: 'Security — TermLift',
    description: 'How TermLift handles your data. Files deleted after analysis, encrypted in transit and at rest, never used for AI training.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
