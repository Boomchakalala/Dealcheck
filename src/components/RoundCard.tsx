'use client'

import Link from 'next/link'
import { type Round } from '@/types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight } from 'lucide-react'

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

  return (
    <Link href={`/app/round/${round.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900">Round {round.round_number}</h4>
              <Badge variant={round.status === 'done' ? 'default' : 'destructive'}>
                {round.status}
              </Badge>
            </div>

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
