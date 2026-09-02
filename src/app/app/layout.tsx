import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'
import { deriveDealStage } from '@/lib/deal-stage'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: notifications }, { data: deals }, { data: requests }] = await Promise.all([
    supabase.from('profiles').select('usage_count, plan, is_admin').eq('id', user.id).single(),
    supabase.from('notifications').select('id, type, title, body, link, read_at, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    // Just enough to derive "needs you" for the sidebar badge — Home re-fetches the full rows.
    supabase.from('deals').select('id, status, rounds (round_number, output_json)').eq('user_id', user.id),
    supabase.from('negotiation_requests').select('deal_id, status').eq('user_id', user.id),
  ])

  const isPaid = profile?.plan === 'essentials' || profile?.plan === 'pro' || profile?.plan === 'business'
  const isAdmin = profile?.is_admin || false

  const reqByDeal = new Map<string, string>()
  for (const r of requests || []) if (r.deal_id) reqByDeal.set(r.deal_id, r.status)
  type BadgeDeal = { id: string; status: string | null; rounds: Array<{ round_number: number; output_json: unknown }> | null }
  const needsYou = ((deals || []) as unknown as BadgeDeal[]).reduce((n, d) => {
    const nr = reqByDeal.get(d.id)
    if (nr === 'waiting_for_client_info') return n + 1
    if (deriveDealStage({ status: d.status, rounds: d.rounds, negotiationRequestStatus: nr }) === 'quick') return n + 1
    return n
  }, 0)

  return (
    <div className="min-h-screen bg-ground">
      <AppSidebar
        userEmail={user.email || 'user@example.com'}
        isUpgraded={isPaid}
        usageCount={profile?.usage_count || 0}
        isAdmin={isAdmin}
        plan={profile?.plan || 'free'}
        notifications={notifications || []}
        needsYou={needsYou}
      />
      {/* Offset by the sidebar on desktop. The inner padding is what legacy pages
          escape with negative margins; redesigned pages use <AppPage> to go full-bleed. */}
      <main className="min-h-screen overflow-x-hidden transition-[margin] duration-200 md:ml-[var(--sidebar-width,220px)]">
        <div className="px-5 sm:px-8 py-8 pb-24 md:pb-8">{children}</div>
      </main>
    </div>
  )
}
