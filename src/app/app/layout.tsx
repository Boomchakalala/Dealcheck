import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import Link from 'next/link'

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

  const isPro = profile?.plan === 'pro'
  const isAdmin = profile?.is_admin || false
  const usageCount = profile?.usage_count || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white flex flex-col">
      <UnifiedHeader
        variant="app"
        userEmail={user.email || 'user@example.com'}
        isUpgraded={isPro}
        usageCount={usageCount}
        isAdmin={isAdmin}
      />
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex-1 w-full">
        {children}
      </main>
    </div>
  )
}
