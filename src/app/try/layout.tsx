import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try Free — TermLift',
  description: 'Drop in any vendor quote and get back red flags, savings opportunities, and a ready-to-send negotiation email in minutes.',
  openGraph: {
    title: 'Try Free — TermLift',
    description: 'Drop in any vendor quote and get back red flags, savings opportunities, and a ready-to-send negotiation email in minutes.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
