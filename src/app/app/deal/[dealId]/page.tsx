import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { RoundCard } from '@/components/RoundCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { AddRoundForm } from './AddRoundForm'

export default async function DealPage({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get deal with rounds
  const { data: deal } = await supabase
    .from('deals')
    .select(`
      *,
      rounds (*)
    `)
    .eq('id', dealId)
    .eq('user_id', user.id)
    .single()

  if (!deal) {
    notFound()
  }

  // Sort rounds by number
  const sortedRounds = deal.rounds?.sort((a, b) => b.round_number - a.round_number) || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Deal Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{deal.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {deal.vendor && (
                <span className="text-gray-600">{deal.vendor}</span>
              )}
              <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                {deal.deal_type}
              </Badge>
              {deal.goal && (
                <span className="text-sm text-gray-500">Goal: {deal.goal}</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Created: {new Date(deal.created_at).toLocaleDateString()}</p>
          <p>Last updated: {new Date(deal.updated_at).toLocaleDateString()}</p>
          <p className="font-semibold mt-2">{sortedRounds.length} round{sortedRounds.length !== 1 ? 's' : ''}</p>
        </div>
      </Card>

      {/* Add Round Form */}
      <AddRoundForm dealId={dealId} />

      {/* Rounds List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rounds</h2>

        {sortedRounds.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No rounds yet. Add a round above to start.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedRounds.map((round) => (
              <RoundCard key={round.id} round={round} dealId={dealId} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
