export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PipelineCompareClient } from './PipelineCompareClient'

export default async function PipelineComparePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-ink mb-1 font-display">Pipeline comparison</h1>
      <p className="text-[13px] text-ink-3 mb-6">
        Runs a quote through the live analyzeDeal() (old monolith) and the new Step 1-3 pipeline
        side by side. Admin-only, not wired into any customer-facing flow.
      </p>
      <PipelineCompareClient />
    </div>
  )
}
