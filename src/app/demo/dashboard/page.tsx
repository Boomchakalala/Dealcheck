import { redirect } from 'next/navigation'

export default function DemoDashboardRedirect() {
  redirect('/demo?tab=insights')
}
