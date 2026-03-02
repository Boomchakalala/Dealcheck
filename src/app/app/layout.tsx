import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UnifiedHeader } from '@/components/UnifiedHeader'

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

  // For now, everyone is on Free plan - can be enhanced later
  const isUpgraded = false

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <UnifiedHeader
        variant="app"
        userEmail={user.email || 'user@example.com'}
        isUpgraded={isUpgraded}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  )
}
