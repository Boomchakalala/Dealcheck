import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — TermLift',
  description: 'Start free with 4 analyses. Upgrade to Pro for €39/mo for unlimited AI analyses, deal tracking, and spend dashboards.',
  openGraph: {
    title: 'Pricing — TermLift',
    description: 'Start free with 4 analyses. Upgrade to Pro for €39/mo for unlimited AI analyses, deal tracking, and spend dashboards.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
