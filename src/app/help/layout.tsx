import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help — TermLift',
  description: 'Frequently asked questions about TermLift. How it works, what to expect, and how we handle your data.',
  openGraph: {
    title: 'Help — TermLift',
    description: 'Frequently asked questions about TermLift. How it works, what to expect, and how we handle your data.',
  },
  alternates: { canonical: 'https://www.termlift.com/help' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
