export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppPage, PageBody, PageHeader } from '@/components/system'
import { BenchmarksClient } from './BenchmarksClient'

/**
 * Admin — Market Benchmark data entry. Operational, not pretty: this is how
 * observations get into the DB before any automated ingestion exists.
 */
export default async function AdminBenchmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  const [{ data: sources }, { data: products }, { data: observations }] = await Promise.all([
    supabase.from('benchmark_sources').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('benchmark_products').select('*').order('vendor_name').order('product_name').limit(1000),
    supabase
      .from('benchmark_observations')
      .select('*, benchmark_sources ( id, name, source_type, url, source_date, verification_level ), benchmark_products ( id, product_name )')
      .order('observation_date', { ascending: false })
      .limit(500),
  ])

  const total = observations?.length || 0
  const test = observations?.filter((o) => o.is_test).length || 0
  return (
    <AppPage>
      <PageHeader title="Market benchmarks" sub={`${total} observation${total === 1 ? '' : 's'} · ${sources?.length || 0} sources · ${products?.length || 0} products${test ? ` · ${test} test rows` : ''}`} />
      <PageBody>
        <BenchmarksClient sources={sources || []} products={products || []} observations={observations || []} />
      </PageBody>
    </AppPage>
  )
}
