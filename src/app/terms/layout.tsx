import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — TermLift',
  description: 'Terms of service for TermLift. How the service works, your responsibilities, and our limitations.',
  openGraph: {
    title: 'Terms of Service — TermLift',
    description: 'Terms of service for TermLift. How the service works, your responsibilities, and our limitations.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
