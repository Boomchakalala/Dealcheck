'use client'

import Link from 'next/link'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import type { DealOutput, DealOutputV2 } from '@/types'

type RoundData = {
  id: string
  output_json: DealOutput | DealOutputV2
  round_number: number
  status: string
  schema_version?: 'v1' | 'v2'
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

  if (!latest?.output_json) return null

  const schemaVersion = latest.schema_version || 'v1'
  if (schemaVersion === 'v2') {
    return (latest.output_json as DealOutputV2).dominant_issue?.title || null
  } else {
    return (latest.output_json as DealOutput).quick_read?.conclusion || null
  }
}

function getLatestOutput(deal: DealCardProps['deal']): { output: DealOutput | DealOutputV2 | null; version: 'v1' | 'v2' } {
  if (!deal.rounds || deal.rounds.length === 0) return { output: null, version: 'v1' }
  const sorted = [...deal.rounds].sort((a, b) => b.round_number - a.round_number)
  const latest = sorted[0]
  return {
    output: latest?.output_json || null,
    version: latest?.schema_version || 'v1'
  }
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
  const { output: latestOutput, version } = getLatestOutput(deal)
  const conclusion = getConclusion(deal)

  // Get values based on schema version
  const isV2 = version === 'v2'
  const totalCommitment = isV2
    ? `${(latestOutput as DealOutputV2)?.commercial_facts?.total_value} ${(latestOutput as DealOutputV2)?.commercial_facts?.currency}`
    : (latestOutput as DealOutput)?.snapshot?.total_commitment

  const flagCount = isV2
    ? (latestOutput as DealOutputV2)?.priority_points?.length || 0
    : (latestOutput as DealOutput)?.red_flags?.length || 0

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
              {isV2 && (
                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  V2
                </Badge>
              )}
            </div>

            {deal.vendor && (
              <p className="text-sm text-slate-600 mb-2">{deal.vendor}</p>
            )}

            <div className="flex items-center gap-4 flex-wrap mb-3">
              {totalCommitment && (
                <span className="text-sm font-semibold text-slate-900">{totalCommitment}</span>
              )}
              {flagCount > 0 && (
                <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {flagCount} {isV2 ? 'priority' : 'red flag'}{flagCount !== 1 ? (isV2 ? ' points' : 's') : ''}
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
