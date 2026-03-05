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

  // For now, everyone is on Free plan - can be enhanced later
  const isUpgraded = false

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white flex flex-col">
      <UnifiedHeader
        variant="app"
        userEmail={user.email || 'user@example.com'}
        isUpgraded={isUpgraded}
      />
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-slate-200/60 mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
          <Link href="/security" className="hover:text-slate-600 transition-colors">Security</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
