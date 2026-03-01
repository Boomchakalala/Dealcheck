'use client'

import Link from 'next/link'
import { type Deal } from '@/types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight } from 'lucide-react'

interface DealCardProps {
  deal: Deal & { rounds?: Array<{ id: string }> }
}

export function DealCard({ deal }: DealCardProps) {
  const roundCount = deal.rounds?.length || 0
  const formattedDate = new Date(deal.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/app/deal/${deal.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
              <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                {deal.deal_type}
              </Badge>
            </div>

            {deal.vendor && (
              <p className="text-sm text-gray-600 mb-1">{deal.vendor}</p>
            )}

            {deal.goal && (
              <p className="text-sm text-gray-500 mb-3">{deal.goal}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{roundCount} round{roundCount !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Updated {formattedDate}</span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
        </div>
      </Card>
    </Link>
  )
}
