'use client'

import Link from 'next/link'
import { type Round } from '@/types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight, AlertTriangle } from 'lucide-react'

interface RoundCardProps {
  round: Round
  dealId: string
}

export function RoundCard({ round, dealId }: RoundCardProps) {
  const formattedDate = new Date(round.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const output = round.output_json as any
  const redFlagCount = output?.red_flags?.length || 0
  const conclusion = output?.quick_read?.conclusion || null

  return (
    <Link href={`/app/round/${round.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                Round {round.round_number}
              </div>
              <Badge variant={round.status === 'done' ? 'default' : 'destructive'}>
                {round.status}
              </Badge>
              {redFlagCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  {redFlagCount}
                </span>
              )}
            </div>

            {conclusion && (
              <p className="text-sm text-gray-700 mb-2 line-clamp-1">{conclusion}</p>
            )}

            {round.note && (
              <p className="text-sm text-gray-600 mb-2">{round.note}</p>
            )}

            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
        </div>
      </Card>
    </Link>
  )
}
