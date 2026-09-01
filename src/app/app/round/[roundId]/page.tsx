import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { OutputDisplay } from '@/components/OutputDisplay'
import { OutputDisplayV2 } from '@/components/OutputDisplayV2'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { DealOutput, DealOutputV2 } from '@/types'
import { stripAdvancedOutput, SHOW_FULL_NEGOTIATION_PLAYBOOK } from '@/lib/negotiation-gating'

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

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  const showFullPlaybook = !!profile?.is_admin || SHOW_FULL_NEGOTIATION_PLAYBOOK

  const deal = Array.isArray(round.deals) ? round.deals[0] : round.deals
  const schemaVersion = round.schema_version || 'v1'
  const isV2 = schemaVersion === 'v2'
  const output = round.output_json && !showFullPlaybook
    ? stripAdvancedOutput(round.output_json as DealOutput | DealOutputV2)
    : round.output_json

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/app/deal/${deal.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Deal
          </Button>
        </Link>
      </div>

      {/* Round Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-slate-900">
                Round {round.round_number}
              </h1>
              <Badge variant={round.status === 'done' ? 'default' : 'destructive'}>
                {round.status}
              </Badge>
            </div>
            <p className="text-slate-600 text-base">{deal.title}</p>
          </div>
        </div>

        <div className="space-y-2.5 text-sm text-slate-600">
          {round.note && (
            <p>
              <span className="font-semibold text-slate-700">Note:</span> {round.note}
            </p>
          )}
          <p>
            <span className="font-semibold text-slate-700">Created:</span>{' '}
            {new Date(round.created_at).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Model:</span> {round.model_version || 'gpt-4o'}
          </p>
          {isV2 && (
            <p>
              <span className="font-semibold text-slate-700">Schema:</span> V2 (Selective, issue-driven)
            </p>
          )}
        </div>

        {round.error_message && (
          <div className="mt-6 p-4 bg-red-50/80 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {round.error_message}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Output */}
      {round.status === 'done' && output && (
        isV2 ? (
          <OutputDisplayV2 output={output as DealOutputV2} roundId={roundId} />
        ) : (
          <OutputDisplay output={output as DealOutput} roundId={roundId} />
        )
      )}

      {/* Extracted Text (if saved) */}
      {round.extracted_text && (
        <details className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <summary className="cursor-pointer font-semibold text-slate-900 hover:text-slate-700 transition-colors py-2">
            View Extracted Text
          </summary>
          <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {round.extracted_text}
            </pre>
          </div>
        </details>
      )}
    </div>
  )
}
