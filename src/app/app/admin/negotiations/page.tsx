export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Flag } from 'lucide-react'
import { AppPage, PageHeader, PageBody, Chip, Table, TableHead, TableRow, HideM, NameCell } from '@/components/system'
import { isClosedStatus, needsAdminAction, statusLabel, statusTone } from '@/lib/negotiation-status'
import { cn } from '@/lib/utils'

type Row = {
  id: string
  vendor: string | null
  status: string
  source: string
  current_total: string | null
  renewal_date: string | null
  next_action: string | null
  created_at: string
  updated_at: string | null
  profiles: { email: string } | null
  deals: { vendor: string | null; title: string | null } | null
}

type Filter = 'action' | 'active' | 'closed' | 'all'
const COLS = 'minmax(0,2fr) 1.3fr 1.5fr 1fr minmax(0,1.6fr)'

export default async function AdminNegotiationsPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  const sp = await searchParams
  const filter: Filter = (['action', 'active', 'closed', 'all'] as Filter[]).includes(sp.f as Filter) ? (sp.f as Filter) : 'active'

  const { data: requests } = await supabase
    .from('negotiation_requests')
    .select('*, profiles(email), deals(vendor, title)')
    .order('created_at', { ascending: false })
  const rows = (requests || []) as unknown as Row[]

  const counts = {
    action: rows.filter((r) => needsAdminAction(r.status)).length,
    active: rows.filter((r) => !isClosedStatus(r.status)).length,
    closed: rows.filter((r) => isClosedStatus(r.status)).length,
    all: rows.length,
  }
  const visible = rows
    .filter((r) => filter === 'all' ? true : filter === 'closed' ? isClosedStatus(r.status) : filter === 'action' ? needsAdminAction(r.status) : !isClosedStatus(r.status))
    // The ones waiting on TermLift float to the top; then most recently touched.
    .sort((a, b) => Number(needsAdminAction(b.status)) - Number(needsAdminAction(a.status)) || (b.updated_at || b.created_at).localeCompare(a.updated_at || a.created_at))

  const filters: Array<{ key: Filter; label: string; count: number }> = [
    { key: 'action', label: 'Needs action', count: counts.action },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'closed', label: 'Closed', count: counts.closed },
    { key: 'all', label: 'All', count: counts.all },
  ]
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  // Server component: one clock read per request is fine (the purity lint targets client renders).
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now()
  const daysTo = (d: string) => Math.ceil((new Date(d).getTime() - nowMs) / 86400000)

  return (
    <AppPage>
      <PageHeader title="Negotiation requests" sub={`${counts.all} total · ${counts.action} need action · ${counts.active} active · ${counts.closed} closed`} />
      <PageBody>
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <Link key={f.key} href={`/app/admin/negotiations?f=${f.key}`} className={cn('h-8 px-3 rounded-lg text-[12.5px] font-semibold border transition-colors no-underline inline-flex items-center gap-1.5', filter === f.key ? 'bg-ink border-ink text-white' : 'bg-surface border-line text-ink-2 hover:border-[#C9D3CE]')}>
              {f.label}{f.count > 0 && <span className={cn('tl-label text-[10px] px-1.5 py-0.5 rounded-md', filter === f.key ? 'bg-white/15 text-white' : f.key === 'action' ? 'bg-risk-soft text-risk' : 'bg-line-2 text-ink-2')}>{f.count}</span>}
            </Link>
          ))}
        </div>

        <Table>
          <TableHead cols={COLS}><span>Vendor</span><span>Status</span><span>Client</span><span>Deadline</span><span>Next action</span></TableHead>
          {visible.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-[14px] font-semibold text-ink">{filter === 'action' ? 'Nothing waiting on you.' : 'No requests here.'}</p>
              <p className="text-[12.5px] text-ink-2 mt-0.5">{rows.length === 0 ? "They'll show up the moment a client submits one." : 'Try another filter.'}</p>
            </div>
          )}
          {visible.map((r) => {
            const closed = isClosedStatus(r.status)
            const days = r.renewal_date ? daysTo(r.renewal_date) : null
            return (
              <TableRow key={r.id} cols={COLS} href={`/app/admin/negotiations/${r.id}`}>
                <NameCell name={r.vendor || r.deals?.vendor || 'Unknown vendor'} sub={`${r.source === 'post_analysis' ? 'From analysis' : 'Direct'} · ${r.current_total || '—'}`} />
                <div className="min-w-0"><Chip tone={statusTone(r.status)} mono>{statusLabel(r.status)}</Chip></div>
                <HideM className="text-[12.5px] text-ink-2 truncate">{r.profiles?.email || 'Unknown user'}</HideM>
                <HideM className={cn('text-[12.5px] tl-num', days != null && !closed && days <= 14 ? 'text-warn font-semibold' : 'text-ink-2')}>{r.renewal_date ? `${fmtDate(r.renewal_date)}${days != null && !closed && days >= 0 ? ` · ${days}d` : ''}` : '—'}</HideM>
                <HideM className="text-[12.5px] text-ink truncate">{r.next_action ? <span className="inline-flex items-center gap-1.5"><Flag className="w-3 h-3 text-green-deep shrink-0" /><span className="truncate">{r.next_action}</span></span> : <span className="text-ink-3">—</span>}</HideM>
              </TableRow>
            )
          })}
        </Table>
      </PageBody>
    </AppPage>
  )
}
