import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — TermLift',
  description: 'Your quotes stay yours. Data encrypted, never trained on, deleted after analysis. GDPR compliant.',
  openGraph: {
    title: 'Privacy Policy — TermLift',
    description: 'Your quotes stay yours. Data encrypted, never trained on, deleted after analysis. GDPR compliant.',
  },
  alternates: { canonical: 'https://www.termlift.com/privacy' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
