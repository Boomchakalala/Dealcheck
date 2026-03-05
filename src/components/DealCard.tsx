'use client'

import Link from 'next/link'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight, AlertTriangle } from 'lucide-react'

type RoundData = {
  id: string
  output_json: any
  round_number: number
  status: string
}

interface DealCardProps {
  deal: {
    id: string
    vendor: string | null
    title: string
    deal_type: 'New' | 'Renewal'
    goal: string | null
    created_at: string
    updated_at: string
    rounds: RoundData[]
  }
}

function getConclusion(deal: DealCardProps['deal']): string | null {
  if (!deal.rounds || deal.rounds.length === 0) return null
  const sorted = [...deal.rounds].sort((a, b) => b.round_number - a.round_number)
  const latest = sorted[0]
  return latest?.output_json?.quick_read?.conclusion || null
}

function getLatestOutput(deal: DealCardProps['deal']): any | null {
  if (!deal.rounds || deal.rounds.length === 0) return null
  const sorted = [...deal.rounds].sort((a, b) => b.round_number - a.round_number)
  return sorted[0]?.output_json || null
}

function getConclusionColor(conclusion: string | null): string {
  if (!conclusion) return 'border-l-slate-300'
  const lower = conclusion.toLowerCase()
  if (lower.includes('overpay') || lower.includes('risk') || lower.includes('expensive')) {
    return 'border-l-red-500'
  }
  if (lower.includes('tighten') || lower.includes('needs') || lower.includes('caution')) {
    return 'border-l-amber-500'
  }
  return 'border-l-emerald-500'
}

export function DealCard({ deal }: DealCardProps) {
  const roundCount = deal.rounds?.length || 0
  const latestOutput = getLatestOutput(deal)
  const conclusion = getConclusion(deal)
  const totalCommitment = latestOutput?.snapshot?.total_commitment
  const redFlagCount = latestOutput?.red_flags?.length || 0

  const formattedDate = new Date(deal.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/app/deal/${deal.id}`}>
      <Card className={`p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getConclusionColor(conclusion)}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 truncate">{deal.title}</h3>
              <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                {deal.deal_type}
              </Badge>
            </div>

            {deal.vendor && (
              <p className="text-sm text-slate-600 mb-2">{deal.vendor}</p>
            )}

            <div className="flex items-center gap-4 flex-wrap mb-3">
              {totalCommitment && (
                <span className="text-sm font-semibold text-slate-900">{totalCommitment}</span>
              )}
              {redFlagCount > 0 && (
                <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {redFlagCount} red flag{redFlagCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {conclusion && (
              <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                {conclusion}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{roundCount} round{roundCount !== 1 ? 's' : ''}</span>
              <span>&middot;</span>
              <span>Updated {formattedDate}</span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
        </div>
      </Card>
    </Link>
  )
}
