import { redirect } from 'next/navigation'

/** The dashboard is now the Insights tab on Home. */
export default function DashboardRedirect() {
  redirect('/app?tab=insights')
}
