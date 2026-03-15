import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — TermLift',
  description: 'Get in touch with the TermLift team. Questions, feedback, or partnership enquiries.',
  openGraph: {
    title: 'Contact — TermLift',
    description: 'Get in touch with the TermLift team. Questions, feedback, or partnership enquiries.',
  },
  alternates: { canonical: 'https://www.termlift.com/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
