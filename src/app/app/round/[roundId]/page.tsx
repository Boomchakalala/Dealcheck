import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { OutputDisplay } from '@/components/OutputDisplay'
import { OutputDisplayV2 } from '@/components/OutputDisplayV2'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { DealOutput, DealOutputV2 } from '@/types'

export default async function RoundPage({
  params,
}: {
  params: Promise<{ roundId: string }>
}) {
  const { roundId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get round with deal info
  const { data: round } = await supabase
    .from('rounds')
    .select(`
      *,
      deals (*)
    `)
    .eq('id', roundId)
    .eq('user_id', user.id)
    .single()

  if (!round || !round.deals) {
    notFound()
  }

  const deal = Array.isArray(round.deals) ? round.deals[0] : round.deals
  const schemaVersion = round.schema_version || 'v1'
  const isV2 = schemaVersion === 'v2'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/app/deal/${deal.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Deal
          </Button>
        </Link>
      </div>

      {/* Round Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Round {round.round_number}
              </h1>
              <Badge variant={round.status === 'done' ? 'default' : 'destructive'}>
                {round.status}
              </Badge>
            </div>
            <p className="text-gray-600">{deal.title}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          {round.note && (
            <p>
              <span className="font-semibold">Note:</span> {round.note}
            </p>
          )}
          <p>
            <span className="font-semibold">Created:</span>{' '}
            {new Date(round.created_at).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Model:</span> {round.model_version || 'gpt-4o'}
          </p>
          {isV2 && (
            <p>
              <span className="font-semibold">Schema:</span> V2 (Selective, issue-driven)
            </p>
          )}
        </div>

        {round.error_message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {round.error_message}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Output */}
      {round.status === 'done' && round.output_json && (
        isV2 ? (
          <OutputDisplayV2 output={round.output_json as DealOutputV2} roundId={roundId} />
        ) : (
          <OutputDisplay output={round.output_json as DealOutput} roundId={roundId} />
        )
      )}

      {/* Extracted Text (if saved) */}
      {round.extracted_text && (
        <details className="bg-white p-6 rounded-lg border border-gray-200">
          <summary className="cursor-pointer font-semibold text-gray-900">
            View Extracted Text
          </summary>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {round.extracted_text}
            </pre>
          </div>
        </details>
      )}
    </div>
  )
}
