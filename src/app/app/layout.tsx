import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: notifications }, { data: requests }] = await Promise.all([
    supabase.from('profiles').select('usage_count, plan, is_admin').eq('id', user.id).single(),
    supabase.from('notifications').select('id, type, title, body, link, read_at, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('negotiation_requests').select('deal_id, status').eq('user_id', user.id),
  ])

  const isPaid = profile?.plan === 'essentials' || profile?.plan === 'pro' || profile?.plan === 'business'
  const isAdmin = profile?.is_admin || false

  // Badge = negotiations where TermLift is waiting on the user. Nothing else counts.
  const needsYou = (requests || []).filter((r) => r.status === 'waiting_for_client_info').length

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
