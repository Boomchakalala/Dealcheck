import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — TermLift',
  description: 'Sign in to TermLift to access your deals, analyses, and negotiation emails.',
  openGraph: {
    title: 'Sign In — TermLift',
    description: 'Sign in to TermLift to access your deals, analyses, and negotiation emails.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
