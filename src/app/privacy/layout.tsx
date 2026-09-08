import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Your quotes stay yours. Quote files never stored, extracted text kept only temporarily, never trained on. GDPR compliant.',
  openGraph: {
    title: 'Privacy Policy — TermLift',
    description: 'Your quotes stay yours. Quote files never stored, extracted text kept only temporarily, never trained on. GDPR compliant.',
  },
  alternates: { canonical: 'https://www.termlift.com/privacy' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
