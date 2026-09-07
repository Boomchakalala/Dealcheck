import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Built by a procurement professional who watched too many good teams overpay their vendors. TermLift puts that playbook in your hands.',
  alternates: { canonical: 'https://www.termlift.com/about' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
