import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/AppSidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile for usage tracking
  const { data: profile } = await supabase
    .from('profiles')
    .select('usage_count, plan, is_admin')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.plan === 'essentials' || profile?.plan === 'pro' || profile?.plan === 'business'
  const isAdmin = profile?.is_admin || false
  const usageCount = profile?.usage_count || 0

  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, type, title, body, link, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-25 to-white">
      <AppSidebar
        userEmail={user.email || 'user@example.com'}
        isUpgraded={isPaid}
        usageCount={usageCount}
        isAdmin={isAdmin}
        plan={profile?.plan || 'free'}
        notifications={notifications || []}
      />
      {/* Main content — offset by sidebar on desktop, full-width on mobile */}
      <main className="min-h-screen overflow-x-hidden transition-all duration-200 md:ml-[var(--sidebar-width,210px)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
