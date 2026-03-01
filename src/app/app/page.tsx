'use client'

import { useEffect, useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { DealCard } from '@/components/DealCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Plus, Search, ArrowUpDown } from 'lucide-react'

type RoundData = {
  id: string
  output_json: any
  round_number: number
  status: string
}

type DealWithRounds = {
  id: string
  user_id: string
  vendor: string | null
  title: string
  deal_type: 'New' | 'Renewal'
  goal: string | null
  created_at: string
  updated_at: string
  rounds: RoundData[]
}

type SortOption = 'updated' | 'created' | 'vendor'

export default function DashboardPage() {
  const [deals, setDeals] = useState<DealWithRounds[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('updated')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, dealsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('deals')
          .select(`*, rounds (id, output_json, round_number, status)`)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
      ])

      setProfile(profileRes.data)
      setDeals((dealsRes.data as DealWithRounds[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = deals

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.vendor && d.vendor.toLowerCase().includes(q))
      )
    }

    result = [...result].sort((a, b) => {
      if (sort === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
      if (sort === 'created') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      // vendor a-z
      const va = (a.vendor || '').toLowerCase()
      const vb = (b.vendor || '').toLowerCase()
      return va.localeCompare(vb)
    })

    return result
  }, [deals, search, sort])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

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
                <span className="ml-2 text-gray-600">
                  &middot; <Link href="/pricing" className="text-emerald-600 font-medium hover:underline">Upgrade to continue</Link>
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Search & Sort */}
      {deals.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or vendor..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="updated">Last updated</option>
              <option value="created">Created</option>
              <option value="vendor">Vendor A-Z</option>
            </select>
          </div>
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
      ) : filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No deals match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSorted.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  )
}
