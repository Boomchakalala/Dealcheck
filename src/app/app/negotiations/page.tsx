import { redirect } from 'next/navigation'

/** A negotiation is a deal in the "TermLift negotiates" stage — the list lives on Home as a filter. */
export default function NegotiationsRedirect() {
  redirect('/app?filter=termlift')
}
