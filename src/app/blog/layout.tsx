import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — TermLift',
  description: 'Procurement tips, negotiation strategies, and vendor management advice. Learn how to get better terms on every deal.',
  alternates: { canonical: 'https://www.termlift.com/blog' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
