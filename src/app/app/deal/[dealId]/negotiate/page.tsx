export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileCheck, PhoneCall, Calendar } from 'lucide-react'
import { NegotiationRequestForm } from '@/components/NegotiationRequestForm'
import { formatCurrency, detectCurrency, parseMoney } from '@/lib/currency'
import { inferDealType, dealTypeLabel } from '@/lib/deal-type-inference'
import { NEGOTIATION_FEE_PERCENT } from '@/lib/pricing'
import type { DealOutput, DealOutputV2 } from '@/types'

const green = '#1DB954'
const sora = "'Sora', sans-serif"

export default async function NegotiateDealPage({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deal } = await supabase.from('deals').select(`*, rounds (*)`).eq('id', dealId).eq('user_id', user.id).single()
  if (!deal) notFound()

  const { data: existingRequest } = await supabase
    .from('negotiation_requests')
    .select('id')
    .eq('deal_id', dealId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingRequest) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <Link href={`/app/deal/${dealId}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800 mb-6 no-underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to deal
        </Link>
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-[19px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Already requested</h1>
          <p className="text-[14px] text-slate-500 max-w-sm mx-auto mb-6">
            This deal already has a negotiation request in progress.
          </p>
          <Link href={`/app/negotiations/${existingRequest.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13.5px] font-bold text-white no-underline" style={{ background: '#1DB954' }}>
            View progress
          </Link>
        </div>
      </div>
    )
  }

  const sortedRounds = (deal.rounds || []).slice().sort((a: { round_number: number }, b: { round_number: number }) => b.round_number - a.round_number)
  const latestRound = sortedRounds[0]
  const latestOutput = latestRound?.output_json as DealOutput | DealOutputV2 | undefined
  const isV2 = (latestRound?.schema_version || 'v1') === 'v2'

  const defaultVendor = deal.vendor || (isV2 ? (latestOutput as DealOutputV2)?.commercial_facts?.supplier : (latestOutput as DealOutput)?.vendor) || ''
  const defaultCategory = (latestOutput as DealOutput)?.category || ''
  const rawRenewalDate = (isV2 ? undefined : (latestOutput as DealOutput)?.snapshot?.renewal_date)
  const defaultRenewalDate = rawRenewalDate && !isNaN(Date.parse(rawRenewalDate)) ? new Date(rawRenewalDate).toISOString().slice(0, 10) : ''
  const defaultCurrentTotal = isV2 ? (latestOutput as DealOutputV2)?.commercial_facts?.total_value : (latestOutput as DealOutput)?.snapshot?.total_commitment

  const redFlagCount = isV2 ? (latestOutput as DealOutputV2)?.priority_points?.length || 0 : (latestOutput as DealOutput)?.red_flags?.length || 0
  const ps = (latestOutput as DealOutput)?.potential_savings as any
  const potentialSavings = ps?.must_have
    ? (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : parseMoney(String(item.amount || '0')).amount), 0)
    : ps?.total !== undefined ? (typeof ps.total === 'number' ? ps.total : parseMoney(String(ps.total || '0')).amount)
    : Array.isArray(ps) ? ps.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoney(s.annual_impact || '').amount, 0) : 0
  const dealCurrency = detectCurrency(defaultCurrentTotal || '')

  // Deal type + a small analysis-context snapshot — both derived server-side
  // from data already on the round. extracted_text (available on
  // latestRound.extracted_text) is used ONLY to compute the inference below;
  // it is never passed to the client component, per the "don't send the raw
  // quote to the frontend just to populate a form" rule.
  const dealTypeInference = !isV2
    ? inferDealType((latestOutput as DealOutput)?.snapshot?.deal_type, undefined, latestRound?.extracted_text)
    : { type: 'unknown' as const, confidence: 'low' as const }

  const targetPriceRange = (latestOutput as any)?.target_price_range as { low: number; high: number } | null | undefined
  const topRedFlags = (!isV2 ? (latestOutput as DealOutput)?.red_flags : undefined)?.slice(0, 3).map((f: any) => f.issue).filter(Boolean) || []

  const analysisContext = {
    verdict: !isV2 ? (latestOutput as DealOutput)?.verdict : undefined,
    targetPriceLow: targetPriceRange?.low ?? null,
    targetPriceHigh: targetPriceRange?.high ?? null,
    potentialSavings: potentialSavings || null,
    currency: dealCurrency,
    topRedFlags,
  }

  const dealTypeText = dealTypeInference.type !== 'unknown' ? dealTypeLabel(dealTypeInference.type) : null
  const hasStoredDocument = !!latestRound?.extracted_text

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 sm:py-6">
      <Link href={`/app/deal/${dealId}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800 mb-3 no-underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to deal
      </Link>

      <h1 className="text-[24px] sm:text-[27px] font-bold text-slate-900 mb-1" style={{ fontFamily: sora }}>Get this deal negotiated</h1>
      <p className="text-[13.5px] text-slate-500 mb-3 max-w-2xl">
        We&apos;ve prefilled what the analysis already found — just add what we can&apos;t know.
      </p>

      {/* Compact summary strip — same data the sidebar/hero already compute, no new calls */}
      {(defaultCurrentTotal || potentialSavings > 0 || dealTypeText || redFlagCount > 0) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-[13px] text-slate-600">
          {defaultCurrentTotal && <span className="font-semibold text-slate-900">{defaultCurrentTotal} quote</span>}
          {potentialSavings > 0 && <><span className="text-slate-300">·</span><span className="font-semibold text-emerald-600">{formatCurrency(potentialSavings, dealCurrency)} potential savings</span></>}
          {dealTypeText && <><span className="text-slate-300">·</span><span>{dealTypeText}</span></>}
          {redFlagCount > 0 && <><span className="text-slate-300">·</span><span>{redFlagCount} {redFlagCount === 1 ? 'lever' : 'levers'} identified</span></>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2">
          <NegotiationRequestForm
            source="post_analysis"
            dealId={dealId}
            roundId={latestRound?.id}
            defaultVendor={defaultVendor}
            defaultCategory={defaultCategory}
            defaultRenewalDate={defaultRenewalDate}
            defaultCurrentTotal={defaultCurrentTotal}
            defaultDealType={dealTypeInference.type}
            defaultDealTypeConfidence={dealTypeInference.confidence}
            analysisContext={analysisContext}
            hasStoredDocument={hasStoredDocument}
          />
        </div>

        {/* Sidebar — lighter weight, tighter gaps, one visual unit rather than three */}
        <div className="space-y-3 lg:sticky lg:top-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-3">How it works</p>
            <div className="space-y-3">
              {[
                { icon: FileCheck, label: 'You submit', sub: 'A couple minutes, mostly prefilled' },
                { icon: PhoneCall, label: 'We review it', sub: 'A negotiator confirms scope' },
                { icon: Calendar, label: 'We negotiate', sub: 'You follow progress, approve the outcome' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(29,185,84,0.12)', color: green }}>
                    <s.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-slate-900">{s.label}</p>
                    <p className="text-[11.5px] text-slate-500">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4">
            <p className="text-[22px] font-bold text-white leading-tight" style={{ fontFamily: sora }}>{NEGOTIATION_FEE_PERCENT}%<span className="text-[13px] text-slate-400 font-normal"> of verified savings</span></p>
            <p className="text-[12px] text-slate-400 mt-1">No savings, no fee. Nothing is agreed without your approval.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
