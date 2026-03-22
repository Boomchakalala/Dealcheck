import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — TermLift',
  description: 'Questions about TermLift? Feedback on an analysis? Want to partner? We would love to hear from you.',
  openGraph: {
    title: 'Contact — TermLift',
    description: 'Questions about TermLift? Feedback on an analysis? Want to partner? We would love to hear from you.',
  },
  alternates: { canonical: 'https://www.termlift.com/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
