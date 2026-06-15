import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { aggregateVendors } from '@/lib/vendor-aggregate'
import { VendorsListClient } from '@/components/VendorsListClient'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Vendors — TermLift' }

export default async function VendorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: vendors }, { data: deals }] = await Promise.all([
    supabase.from('vendors').select('id, canonical_name, aliases').eq('user_id', user.id),
    supabase
      .from('deals')
      .select('id, vendor_id, status, savings_amount, final_total, updated_at, created_at, rounds(output_json, round_number)')
      .eq('user_id', user.id)
      .not('vendor_id', 'is', null),
  ])

  const rows = aggregateVendors(vendors || [], (deals as any) || [])
  return <VendorsListClient rows={rows} />
}
