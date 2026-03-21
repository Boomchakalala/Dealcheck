import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Example Analyses — TermLift | See AI Quote Analysis in Action',
  description: 'See how TermLift analyzes real vendor quotes — DocuSign, Salesforce, Microsoft 365, FedEx, Konica Minolta, and BDO. Spot red flags, savings, and get negotiation emails in seconds.',
  alternates: { canonical: 'https://www.termlift.com/example' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
