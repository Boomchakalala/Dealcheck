import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, CreditCard, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const usageCount = profile?.usage_count || 0
  const isFreePlan = profile?.plan !== 'pro'
  const analysesRemaining = isFreePlan ? Math.max(0, 2 - usageCount) : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Profile</h2>
              <p className="text-xs text-slate-500">Your account details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Member since</span>
              <span className="text-sm font-medium text-slate-900">
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">Analyses run</span>
              <span className="text-sm font-medium text-slate-900">{profile?.usage_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Plan</h2>
              <p className="text-xs text-slate-500">Your current subscription</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Current plan</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
              {(profile?.plan || 'free').toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500">Analysis rounds</span>
            <span className="text-sm font-medium text-emerald-700">
              {isFreePlan ? `${analysesRemaining} of 2 remaining` : 'Unlimited'}
            </span>
          </div>
          {profile?.plan === 'free' && (
            <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-200/60 p-5">
              <p className="text-sm text-slate-700 mb-3">
                Pro features coming soon: PDF export, team seats, and priority analysis speed.
              </p>
              <a href="/pricing" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                View pricing &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Security</h2>
              <p className="text-xs text-slate-500">Account security settings</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Authentication</span>
            <span className="text-sm font-medium text-slate-900">Email + Password</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500">Data protection</span>
            <span className="text-sm font-medium text-slate-900">TLS + RLS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
