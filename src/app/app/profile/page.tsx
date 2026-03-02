import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Calendar, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user stats
  const { data: deals } = await supabase
    .from('deals')
    .select('id, status, created_at, savings_amount')
    .eq('user_id', user.id)

  const totalDeals = deals?.length || 0
  const closedDeals = deals?.filter(d => d.status?.startsWith('closed_')) || []
  const totalSavings = closedDeals.reduce((sum, d) => sum + (d.savings_amount || 0), 0)
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {profile?.full_name || user.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-600">
              {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Email</p>
              <p className="text-sm font-semibold text-slate-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Member Since</p>
              <p className="text-sm font-semibold text-slate-900">{memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Account Status</p>
              <p className="text-sm font-semibold text-emerald-700">Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div>
              <p className="text-xs text-emerald-700 font-medium">Total Savings</p>
              <p className="text-xl font-bold text-emerald-900">${totalSavings.toFixed(0)}</p>
              <p className="text-xs text-emerald-600">{totalDeals} deals analyzed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </Card>

      {/* Privacy Note */}
      <div className="text-center text-xs text-slate-500 leading-relaxed px-6">
        Your data is encrypted and stored securely. We never use your information for AI training.
      </div>
    </div>
  )
}
