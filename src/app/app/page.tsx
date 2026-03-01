import { createClient } from '@/lib/supabase/server'
import { DealCard } from '@/components/DealCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  // Get profile to show usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get deals with rounds
  const { data: deals } = await supabase
    .from('deals')
    .select(`
      *,
      rounds (id)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Deals</h1>
          <p className="text-gray-600 mt-1">
            Track your procurement negotiations and quotes
          </p>
        </div>
        <Link href="/app/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>

      {/* Usage indicator */}
      {profile && (
        <div className={`p-4 border rounded-xl ${profile.is_admin ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
          {profile.is_admin ? (
            <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Admin Account:</span> Unlimited rounds
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Free Plan:</span> {profile.usage_count} / 2 rounds used
              {profile.usage_count >= 2 && (
                <span className="ml-2 text-gray-600">• Upgrade to continue analyzing deals</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Deals list */}
      {!deals || deals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first deal to start analyzing supplier quotes and contracts
            </p>
            <Link href="/app/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Deal
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  )
}
