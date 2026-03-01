import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { User, CreditCard, BarChart3 } from 'lucide-react'

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and subscription</p>
      </div>

      {/* Profile Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Account created</p>
            <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </Card>

      {/* Plan */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Plan</h2>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant={profile?.plan === 'pro' ? 'default' : 'secondary'}>
            {profile?.plan === 'pro' ? 'Pro' : 'Free'}
          </Badge>
          {profile?.is_admin && (
            <Badge variant="default">Admin</Badge>
          )}
        </div>

        {profile?.plan !== 'pro' && !profile?.is_admin && (
          <div className="mt-4">
            <Link href="/pricing">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Usage */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Usage</h2>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Analysis rounds used</p>
          {profile?.is_admin ? (
            <p className="text-gray-900">{profile.usage_count} rounds (unlimited)</p>
          ) : (
            <div>
              <p className="text-gray-900">{profile?.usage_count || 0} / 2 rounds</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(((profile?.usage_count || 0) / 2) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
