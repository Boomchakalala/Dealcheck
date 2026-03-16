'use client'

import { type DealOutput } from '@/types'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Mail, TrendingDown, TrendingUp, Zap, Loader2, Sparkles, Clock, DollarSign, Calendar, Target, Layers, Info, AlertCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useT, useI18n } from '@/i18n/context'
import { normalizeAmount, detectCurrency, formatCurrency } from '@/lib/currency'

interface OutputDisplayProps {
  output: DealOutput
  roundId?: string // Optional - only available in authenticated flow
  hideHeader?: boolean // Hide title + metric cards when rendered inside deal page
}

export function OutputDisplay({ output, roundId, hideHeader = false }: OutputDisplayProps) {
  const { locale } = useI18n()
  const [expandedFlags, setExpandedFlags] = useState<number[]>(
    // Expand all flags by default
    Array.from({ length: output.red_flags?.length || 0 }, (_, i) => i)
  )
  const [showAssumptions, setShowAssumptions] = useState(true)
  const [showSolid, setShowSolid] = useState(true)
  const [showRedFlags, setShowRedFlags] = useState(true) // Always visible by default
  const [showStrategy, setShowStrategy] = useState(true)
  const [showSavings, setShowSavings] = useState(true)
  const [showEmails, setShowEmails] = useState(true)
  const [activeEmailTab, setActiveEmailTab] = useState(0)
  const [selectedFlagTab, setSelectedFlagTab] = useState<Record<number, 'ask' | 'fallback'>>({})
  const [addressedFlags, setAddressedFlags] = useState<number[]>([])
  const [showAllFlags, setShowAllFlags] = useState(false)
  const [copiedAsk, setCopiedAsk] = useState<number | null>(null)
  const [copiedCol, setCopiedCol] = useState<string | null>(null)
  const t = useT()

  // Helper: replace [DATE] placeholders with a real business date
  function getNextBusinessDate(daysOut: number = 5): string {
    const date = new Date()
    let added = 0
    while (added < daysOut) {
      date.setDate(date.getDate() + 1)
      const day = date.getDay()
      if (day !== 0 && day !== 6) added++
    }
    const dayNum = date.getDate()
    const suffix = dayNum === 1 || dayNum === 21 || dayNum === 31 ? 'st' : dayNum === 2 || dayNum === 22 ? 'nd' : dayNum === 3 || dayNum === 23 ? 'rd' : 'th'
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long' }) + ' ' + dayNum + suffix
  }

  // Email editing state
  const [emailSubjects, setEmailSubjects] = useState([
    output.email_drafts.neutral.subject.replace(/\[DATE\]/gi, getNextBusinessDate()),
    output.email_drafts.firm.subject.replace(/\[DATE\]/gi, getNextBusinessDate()),
    output.email_drafts.final_push.subject.replace(/\[DATE\]/gi, getNextBusinessDate())
  ])
  const [emailBodies, setEmailBodies] = useState([
    output.email_drafts.neutral.body.replace(/\[DATE\]/gi, getNextBusinessDate()),
    output.email_drafts.firm.body.replace(/\[DATE\]/gi, getNextBusinessDate()),
    output.email_drafts.final_push.body.replace(/\[DATE\]/gi, getNextBusinessDate())
  ])

  // Regeneration state
  const [customPrompt, setCustomPrompt] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [remainingRegens, setRemainingRegens] = useState(3)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)

  const emailTabs = [
    { label: t('output.friendly'), desc: t('output.warmAndCollaborative') },
    { label: t('output.direct'), desc: t('output.clearAndFocused') },
    { label: t('output.firm'), desc: t('output.urgentAndDeadlineDriven') }
  ]

  // Parse a single annual_impact string to a number
  // Handles: "$1,000", "€2 000", "2.5K", "1.2M", "3,000 saved", "16 800 €/an"
  // For ranges like "$3,000-6,000", takes the midpoint
  const parseSavingsAmount = (text: string): number => {
    if (!text || typeof text !== 'string') return 0
    // Remove currency symbols
    let cleaned = text.replace(/[€$£¥]/g, '').trim()

    // Handle K/M suffixes first (e.g., "2.5K", "1.2M")
    const kmMatch = cleaned.match(/([\d.,\s]+)\s*([KkMm])/)
    if (kmMatch) {
      const num = parseFloat(kmMatch[1].replace(/[\s,]/g, ''))
      const suffix = kmMatch[2].toUpperCase()
      if (suffix === 'K') return num * 1000
      if (suffix === 'M') return num * 1000000
    }

    // Check for range pattern FIRST: "3,000-6,000" or "3 000-6 000" — take midpoint
    const rangeMatch = text.match(/[\d.,\s]+[-–—to]+\s*[\d.,\s]+/)
    if (rangeMatch) {
      const parts = rangeMatch[0].split(/[-–—]|to/i).map(p => {
        let n = p.replace(/[€$£¥]/g, '').replace(/\s/g, '').replace(/,/g, '')
        if (/^\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, '')
        return parseFloat(n)
      }).filter(n => !isNaN(n) && n > 0)
      if (parts.length >= 2) return (parts[0] + parts[1]) / 2
      if (parts.length === 1) return parts[0]
    }

    // Single number: strip everything non-numeric
    // Remove text suffixes
    cleaned = cleaned.replace(/saved|économisés?|potentiel|per year|\/year|\/yr|\/an|over contract life/gi, '').trim()
    // Remove spaces (French thousands), handle dots as thousands sep
    cleaned = cleaned.replace(/\s/g, '')
    if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '')
    cleaned = cleaned.replace(/,/g, '')
    // Only parse if it looks like a clean number now
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }

  // Calculate total savings from all savings breakdown items
  const totalSavings = useMemo(() => {
    if (!output.potential_savings || output.potential_savings.length === 0) return 0
    return output.potential_savings.reduce((sum, saving) => sum + parseSavingsAmount(saving.annual_impact), 0)
  }, [output.potential_savings])

  const formatSavings = (amount: number) => {
    const dealTotal = output.snapshot?.total_commitment || ''
    const currency = detectCurrency(dealTotal)
    return formatCurrency(amount, currency)
  }

  const handleRegenerateEmails = async () => {
    if (!roundId) {
      setRegenError(t('output.regenErrorNotSaved'))
      return
    }

    if (remainingRegens <= 0) {
      setRegenError(t('output.regenErrorUsedAll'))
      return
    }

    setRegenerating(true)
    setRegenError(null)
    try {
      const res = await fetch('/api/deal/regenerate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId,
          customPrompt: customPrompt.trim() || null,
          vendor: output.vendor || output.snapshot?.vendor_product,
          totalCommitment: output.snapshot?.total_commitment,
          mustHaveAsks: output.what_to_ask_for?.must_have || [],
          niceToHaveAsks: output.what_to_ask_for?.nice_to_have || [],
          redFlags: output.red_flags?.map(f => f.issue) || [],
          leverage: output.negotiation_plan?.leverage_you_have,
          conclusion: output.quick_read?.conclusion,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate')

      // Update email state with new generated emails
      setEmailSubjects(data.emails.map((e: any) => e.subject))
      setEmailBodies(data.emails.map((e: any) => e.body))
      setRemainingRegens(data.remainingRegenerations)
      setCustomPrompt('') // Clear prompt after success
      setShowCustomPrompt(false)
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Failed to regenerate emails')
    } finally {
      setRegenerating(false)
    }
  }

  const toggleFlag = (idx: number) => {
    setExpandedFlags(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  // Verdict styling
  const verdictType = output.verdict_type || 'negotiate'
  const verdictConfig = {
    negotiate: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      label: t('output.negotiateBeforeSigning'),
    },
    competitive: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      label: t('output.competitiveDeal'),
    },
    overpay_risk: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800 border-red-200',
      icon: <TrendingDown className="w-5 h-5 text-red-600" />,
      label: t('output.overpayRisk'),
    },
  }

  const vc = verdictConfig[verdictType]

  return (
    <div className="max-w-7xl mx-auto pb-6">
      {/* TOP SECTION: Title + Metadata — hidden when inside deal page */}
      {!hideHeader && <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {output.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              {output.vendor && (
                <span className="font-medium">{output.vendor}</span>
              )}
              {output.snapshot?.deal_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {output.snapshot.deal_type}
                </span>
              )}
              {(output.category || output.description) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {output.category || output.description}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold">{t('output.roundOfAnalysis')}</span>
        </p>
      </div>}

      {/* METRIC CARDS ROW — hidden when inside deal page */}
      {!hideHeader && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Quote Score Card — always first */}
        {output.score != null && (() => {
          const score = output.score
          const scoreColor = score >= 80 ? { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'stroke-emerald-500', track: 'stroke-emerald-100', label: 'bg-emerald-100 text-emerald-700' }
            : score >= 65 ? { bg: 'from-blue-50 to-sky-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'stroke-blue-500', track: 'stroke-blue-100', label: 'bg-blue-100 text-blue-700' }
            : score >= 45 ? { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'stroke-amber-500', track: 'stroke-amber-100', label: 'bg-amber-100 text-amber-700' }
            : score >= 25 ? { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'stroke-orange-500', track: 'stroke-orange-100', label: 'bg-orange-100 text-orange-700' }
            : { bg: 'from-red-50 to-pink-50', border: 'border-red-200', text: 'text-red-700', ring: 'stroke-red-500', track: 'stroke-red-100', label: 'bg-red-100 text-red-700' }

          const circumference = 2 * Math.PI * 34
          const dashLength = (score / 100) * circumference

          return (
            <div className={`bg-gradient-to-br ${scoreColor.bg} rounded-xl border-2 ${scoreColor.border} p-5 shadow-sm flex flex-col`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${scoreColor.label} flex items-center justify-center`}>
                  <Target className="w-4 h-4" />
                </div>
                <p className={`text-xs font-semibold ${scoreColor.text} uppercase tracking-wide`}>{t('output.quoteScore')}</p>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90 flex-shrink-0">
                  <circle cx="40" cy="40" r="34" fill="none" className={scoreColor.track} strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" className={scoreColor.ring} strokeWidth="6"
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeLinecap="round"
                  />
                  <text x="40" y="40" textAnchor="middle" dominantBaseline="central"
                    className={`${scoreColor.text} text-2xl font-extrabold rotate-90 fill-current`}
                    style={{ transformOrigin: 'center' }}
                  >
                    {score}
                  </text>
                </svg>
                <div className="min-w-0">
                  <p className={`text-base font-extrabold ${scoreColor.text} mb-0.5`}>{output.score_label}</p>
                  {output.score_rationale && (
                    <p className="text-xs text-slate-500 leading-relaxed">{output.score_rationale}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Total Commitment Card */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('output.totalCommitment')}</p>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {output.snapshot?.total_commitment ? normalizeAmount(output.snapshot.total_commitment) : t('output.na')}
          </p>
          <p className="text-sm text-slate-600">
            {output.snapshot?.term || t('output.12MonthContract')}
          </p>
        </div>

        {/* Red Flags Card */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">{t('output.redFlags')}</p>
          </div>
          <p className="text-3xl font-bold text-red-700 mb-1">
            {output.red_flags?.length || 0}
          </p>
          <button
            onClick={() => setShowRedFlags(!showRedFlags)}
            className="text-sm text-red-700 hover:text-red-800 font-medium hover:underline"
          >
            {output.red_flags?.length === 1 ? t('output.issueToAddress') : t('output.issuesToAddress')}
          </button>
        </div>

        {/* Potential Savings Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('output.potentialSavings')}</p>
          </div>
          <p className="text-3xl font-bold text-emerald-700 mb-1">
            {totalSavings > 0 ? formatSavings(totalSavings) : t('output.na')}
          </p>
          <p className="text-sm text-emerald-700">
            {totalSavings > 0 && output.snapshot?.total_commitment ? (
              (() => {
                const totalCommitment = output.snapshot.total_commitment.replace(/[^0-9.]/g, '')
                const commitmentNum = parseFloat(totalCommitment)
                if (!isNaN(commitmentNum) && commitmentNum > 0) {
                  const percentage = ((totalSavings / commitmentNum) * 100).toFixed(0)
                  return t('output.percentPotentialSavings', { pct: percentage })
                }
                return t('output.identifiedSavingsOpportunities')
              })()
            ) : t('output.noSavingsCalculated')}
          </p>
        </div>

      </div>}

      {/* Score Breakdown — always visible */}
      {output.score != null && output.score_breakdown && (() => {
        const bd = output.score_breakdown
        type Deduction = { points: number; reason: string }
        const categories = [
          { label: locale === 'fr' ? 'Équité prix' : 'Pricing fairness', value: bd.pricing_fairness, max: 50, deductions: (bd.pricing_deductions || []) as Deduction[], noIssueLabel: locale === 'fr' ? 'Aucun problème détecté' : 'No issues found' },
          { label: locale === 'fr' ? 'Termes & protections' : 'Terms & protections', value: bd.terms_protections, max: 30, deductions: (bd.terms_deductions || []) as Deduction[], noIssueLabel: locale === 'fr' ? 'Aucun problème détecté' : 'No issues found' },
          { label: locale === 'fr' ? 'Position de levier' : 'Leverage position', value: bd.leverage_position, max: 20, deductions: (bd.leverage_deductions || []) as Deduction[], noIssueLabel: locale === 'fr' ? 'Aucun problème détecté' : 'No issues found' },
        ]
        const barColor = (v: number, max: number) => {
          const pct = v / max
          if (pct >= 0.8) return 'bg-emerald-500'
          if (pct >= 0.65) return 'bg-blue-500'
          if (pct >= 0.45) return 'bg-amber-500'
          if (pct >= 0.25) return 'bg-orange-500'
          return 'bg-red-500'
        }
        const scoreTextColor = (v: number, max: number) => {
          const pct = v / max
          if (pct >= 0.8) return 'text-emerald-700'
          if (pct >= 0.65) return 'text-blue-700'
          if (pct >= 0.45) return 'text-amber-700'
          if (pct >= 0.25) return 'text-orange-700'
          return 'text-red-700'
        }
        return (
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fr' ? 'Détail du score' : 'Score breakdown'}</h3>
            <div className="space-y-4">
              {categories.map((cat) => {
                // Find the worst deduction (highest points) for the one-line reason
                const worst = cat.deductions.length > 0
                  ? cat.deductions.reduce((a, b) => a.points >= b.points ? a : b)
                  : null
                return (
                  <div key={cat.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{cat.label}</span>
                      <span className={`text-sm font-extrabold ${scoreTextColor(cat.value, cat.max)}`}>{cat.value}/{cat.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 mb-1">
                      <div className={`h-full rounded-full ${barColor(cat.value, cat.max)}`}
                        style={{ width: `${(cat.value / cat.max) * 100}%` }}
                      />
                    </div>
                    {worst ? (
                      <p className="text-xs text-slate-500 leading-snug">{worst.reason}</p>
                    ) : (
                      <p className="text-xs text-emerald-600 leading-snug flex items-center gap-1">
                        <span>&#10003;</span> {cat.noIssueLabel}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DEAL SNAPSHOT */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-6">
        <button
          onClick={() => {}}
          className="flex items-center gap-2 mb-4 text-left w-full"
        >
          <Target className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">{t('output.dealSnapshot')}</h2>
        </button>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.vendor')}</p>
            <p className="text-sm font-semibold text-slate-900">
              {(() => {
                const vendorProduct = output.snapshot?.vendor_product || output.vendor || t('output.na')
                // Extract just the vendor name (before "/" if present)
                const vendorName = vendorProduct.split('/')[0].trim()
                return vendorName
              })()}
            </p>
            {output.description && (
              <p className="text-xs text-slate-600 mt-0.5">{output.description}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.term')}</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.term || t('output.na')}</p>
            {output.snapshot?.billing_payment && (
              <p className="text-xs text-slate-600 mt-0.5">{output.snapshot.billing_payment}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.total')}</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.total_commitment ? normalizeAmount(output.snapshot.total_commitment) : t('output.na')}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.dealType')}</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {output.snapshot?.deal_type || t('output.na')}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.pricingModel')}</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.pricing_model || t('output.na')}</p>
          </div>

          {output.snapshot?.renewal_date && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.renewalDate')}</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <p className="text-sm font-semibold text-slate-900">{output.snapshot.renewal_date}</p>
              </div>
            </div>
          )}

          {output.snapshot?.signing_deadline && (() => {
            const deadlineStr = output.snapshot.signing_deadline
            const parsed = new Date(deadlineStr)
            const isValidDate = !isNaN(parsed.getTime())
            const now = new Date()
            const daysUntil = isValidDate ? Math.ceil((parsed.getTime() - now.getTime()) / 86400000) : null

            const isPast = daysUntil !== null && daysUntil < 0
            const isUrgent = daysUntil !== null && daysUntil >= 0 && daysUntil <= 30

            return (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('output.signingDeadline')}</p>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className={`w-3.5 h-3.5 ${isPast ? 'text-red-600' : 'text-orange-600'}`} />
                  <p className={`text-sm font-semibold ${isPast ? 'text-red-700' : 'text-orange-700'}`}>{deadlineStr}</p>
                </div>
                {isPast && (
                  <p className="text-xs text-red-600 mt-1.5 leading-relaxed">
                    {locale === 'fr'
                      ? 'Cette date limite est passée. Votre fenêtre de négociation a peut-être expiré — vérifiez auprès de votre fournisseur la validité de l\'offre.'
                      : 'This deadline has passed. Your negotiation window may have closed — check with your vendor on current offer validity.'}
                  </p>
                )}
                {isUrgent && (
                  <p className="text-xs text-orange-600 mt-1.5 leading-relaxed font-medium">
                    {locale === 'fr'
                      ? `Date limite dans ${daysUntil} jour${daysUntil !== 1 ? 's' : ''} — priorisez ces négociations.`
                      : `Deadline in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} — prioritize these negotiations.`}
                  </p>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* WHAT'S ALREADY SOLID */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.quick_read?.whats_solid && output.quick_read.whats_solid.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setShowSolid(!showSolid)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('output.whatsAlreadySolid')}</h2>
                <p className="text-xs text-slate-600">{t('output.goodAspectsInThisDeal')}</p>
              </div>
            </div>
            {showSolid ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showSolid && (
            <div className="px-6 pb-6 space-y-3">
              {output.quick_read.whats_solid.map((item, idx) => (
                <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium flex-1">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* RED FLAGS TO ADDRESS - Always Visible */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.red_flags && output.red_flags.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('output.redFlagsToAddress')}</h2>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-red-700">{output.red_flags.length !== 1 ? t('output.criticalIssues', { count: output.red_flags.length }) : t('output.criticalIssue', { count: output.red_flags.length })}</span> {t('output.eachIncludesNegotiationGuidance')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRedFlags(!showRedFlags)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showRedFlags ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {showRedFlags && (() => {
            // Sort flags by severity: HIGH first, then MEDIUM, then LOW
            const flagsWithSeverity = output.red_flags.map((flag, originalIdx) => {
              const amountMatch = flag.why_it_matters?.match(/[\$€£]([\d,]+)/g)
              const maxAmount = amountMatch
                ? Math.max(...amountMatch.map(s => parseInt(s.replace(/[^\d]/g, ''), 10) || 0))
                : 0
              const severity = maxAmount >= 5000 ? 'HIGH' : maxAmount >= 1000 ? 'MEDIUM' : 'LOW'
              const severityOrder = severity === 'HIGH' ? 0 : severity === 'MEDIUM' ? 1 : 2
              return { flag, originalIdx, severity, maxAmount, severityOrder }
            }).sort((a, b) => a.severityOrder - b.severityOrder)

            const visibleFlags = showAllFlags ? flagsWithSeverity : flagsWithSeverity.slice(0, 5)
            const hiddenCount = flagsWithSeverity.length - 5

            return (
            <div className="space-y-4">
              {visibleFlags.map(({ flag, originalIdx: idx, severity, maxAmount }) => {
                const isExpanded = expandedFlags.includes(idx)
                const activeTab = selectedFlagTab[idx] || 'ask'
                const isAddressed = addressedFlags.includes(idx)

                const impactMatch = flag.why_it_matters?.match(/[\$€£][\d,]+(?:\.\d+)?(?:\/(?:year|yr|month|mo))?(?:\s*(?:per|a)\s*year)?/i)
                const financialImpact = impactMatch ? impactMatch[0] : null

                const isSourceInsight = flag.type?.toLowerCase() === 'source insight'
                const severityColor = isSourceInsight
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : severity === 'HIGH' ? 'bg-red-100 text-red-700 border-red-200' : severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'

                return (
                  <div key={idx} className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isAddressed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isSourceInsight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <button
                      onClick={() => toggleFlag(idx)}
                      className="w-full px-5 py-4 flex items-start justify-between hover:bg-slate-100/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${isSourceInsight ? 'bg-indigo-500' : 'bg-red-500'}`}>
                            {isSourceInsight ? (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.312a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 006.364 6.364l1.757-1.757" />
                              </svg>
                            ) : (
                              <span className="text-white font-bold text-xs">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${severityColor} uppercase tracking-wider`}>
                            {isSourceInsight ? 'Source Insight' : severity === 'HIGH' ? t('output.severity.high') : severity === 'MEDIUM' ? t('output.severity.medium') : t('output.severity.low')}
                          </span>
                          {flag.type && !isSourceInsight && (
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{flag.type}</span>
                          )}
                        </div>
                        <h3 className={`font-bold text-base text-slate-900 mb-1 ${isAddressed ? 'line-through opacity-60' : ''}`}>
                          {flag.issue}
                        </h3>
                        {financialImpact && (
                          <p className="text-xs text-slate-400 mb-1.5">{t('output.estimatedRiskUpTo', { amount: financialImpact })}</p>
                        )}
                        <p className="text-sm text-slate-700 leading-relaxed pr-4">
                          {flag.why_it_matters}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t-2 border-slate-200 pt-4 bg-white">
                        {/* Pill toggle */}
                        <div className="space-y-3">
                          <div className="inline-flex rounded-full border-2 border-slate-200 bg-slate-100 p-0.5">
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'ask'})}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === 'ask'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {t('output.whatToAskFor')}
                            </button>
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'fallback'})}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeTab === 'fallback'
                                  ? 'bg-slate-700 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {t('output.fallbackPosition')}
                            </button>
                          </div>

                          {activeTab === 'ask' ? (
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 relative">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(flag.what_to_ask_for)
                                  setCopiedAsk(idx)
                                  setTimeout(() => setCopiedAsk(null), 2000)
                                }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title={t('output.copyToClipboard')}
                              >
                                {copiedAsk === idx ? (
                                  <span className="text-[10px] font-bold text-emerald-700">{t('output.copied')}</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </button>
                              <p className="text-sm text-slate-800 leading-relaxed pr-8">{flag.what_to_ask_for}</p>
                            </div>
                          ) : (
                            <div className="bg-slate-100 border-2 border-slate-200 rounded-lg p-4 relative">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(flag.if_they_push_back)
                                  setCopiedAsk(idx + 100)
                                  setTimeout(() => setCopiedAsk(null), 2000)
                                }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                                title={t('output.copyToClipboard')}
                              >
                                {copiedAsk === idx + 100 ? (
                                  <span className="text-[10px] font-bold text-slate-700">{t('output.copied')}</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </button>
                              <p className="text-sm text-slate-800 leading-relaxed pr-8">{flag.if_they_push_back}</p>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                )
              })}
              {!showAllFlags && hiddenCount > 0 && (
                <button
                  onClick={() => setShowAllFlags(true)}
                  className="w-full py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 transition-all"
                >
                  {locale === 'fr' ? `Voir ${hiddenCount} problème${hiddenCount > 1 ? 's' : ''} de plus` : `Show ${hiddenCount} more issue${hiddenCount !== 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          )})()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: YOUR NEGOTIATION STRATEGY - Simplified */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <h2 id="strategy-section" className="text-xl font-bold text-slate-900 uppercase tracking-wide text-sm">{t('output.strategy')}</h2>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('output.yourNegotiationStrategy')}</h3>
              <p className="text-xs text-slate-600">{t('output.leverageWhatYouHave')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* Push For - LEFT */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{t('output.pushFor')}</h4>
                </div>
                <button
                  onClick={() => {
                    const items = [...(output.what_to_ask_for?.must_have || []), ...(output.what_to_ask_for?.nice_to_have || [])]
                    navigator.clipboard.writeText(items.map(i => `• ${i}`).join('\n'))
                    setCopiedCol('push')
                    setTimeout(() => setCopiedCol(null), 2000)
                  }}
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-100"
                >
                  {copiedCol === 'push' ? t('output.copied') : t('output.copyAll')}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 ml-[42px]">{t('output.whatYouShouldAskVendorToChange')}</p>
              <div className="space-y-2.5 flex-1">
                {output.what_to_ask_for?.must_have?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                    {idx === 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white mb-2">
                        {t('output.mustHave')}
                      </span>
                    )}
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">{item}</p>
                  </div>
                ))}
                {output.what_to_ask_for?.nice_to_have?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                    {idx === 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-400 text-white mb-2">
                        {t('output.niceToHave')}
                      </span>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Leverage - MIDDLE */}
            <div className="bg-emerald-50/40 border-2 border-emerald-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{t('output.yourLeverage')}</h4>
                </div>
                <button
                  onClick={() => {
                    const items = output.negotiation_plan?.leverage_you_have || []
                    navigator.clipboard.writeText(items.map(i => `• ${i}`).join('\n'))
                    setCopiedCol('leverage')
                    setTimeout(() => setCopiedCol(null), 2000)
                  }}
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-emerald-100"
                >
                  {copiedCol === 'leverage' ? t('output.copied') : t('output.copyAll')}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 ml-[42px]">{t('output.whyTheyShouldSayYes')}</p>
              <ul className="space-y-2.5 flex-1">
                {output.negotiation_plan?.leverage_you_have?.map((item, idx) => (
                  <li key={idx} className="bg-white border-l-[3px] border-l-emerald-400 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Can Offer - RIGHT */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{t('output.canOffer')}</h4>
                </div>
                <button
                  onClick={() => {
                    const items = output.negotiation_plan?.trades_you_can_offer || []
                    navigator.clipboard.writeText(items.map(i => `• ${i}`).join('\n'))
                    setCopiedCol('offer')
                    setTimeout(() => setCopiedCol(null), 2000)
                  }}
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-100"
                >
                  {copiedCol === 'offer' ? t('output.copied') : t('output.copyAll')}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 ml-[42px]">{t('output.whatYouCanGiveToGetWhatYouWant')}</p>
              <ul className="space-y-2.5 flex-1">
                {output.negotiation_plan?.trades_you_can_offer?.map((item, idx) => (
                  <li key={idx} className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: SAVINGS IMPACT - Simplified */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.potential_savings && output.potential_savings.length > 0 && (() => {
        // Detect currency from deal value
        const dealTotal = output.snapshot?.total_commitment || ''
        const currencySymbol = dealTotal.includes('€') ? '€' : dealTotal.includes('£') ? '£' : dealTotal.includes('C$') ? 'C$' : dealTotal.includes('A$') ? 'A$' : '$'

        // Detect if recurring contract
        const termStr = (output.snapshot?.term || '').toLowerCase()
        const isRecurring = termStr.includes('month') || termStr.includes('annual') || termStr.includes('year') || termStr.includes('/mo') || termStr.includes('/yr')
        const savingsLabel = isRecurring ? t('output.perYear') : ''

        // Format with correct currency
        const fmtCurrency = (amount: number) => {
          if (amount >= 1000000) return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`
          if (amount >= 1000) return `${currencySymbol}${Math.round(amount).toLocaleString('en-US')}`
          return `${currencySymbol}${Math.round(amount)}`
        }

        // Parse deal total for comparison bar
        const dealTotalNum = parseSavingsAmount(dealTotal)
        const savingsPct = dealTotalNum > 0 ? Math.min((totalSavings / dealTotalNum) * 100, 100) : 0

        return (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('output.savingsImpact')}</h2>
          </div>

          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
            {/* Header with total */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t('output.potentialSavingsTitle')}</h3>
                  <p className="text-xs text-slate-600">{t('output.estimatedImpactIfNegotiate')}</p>
                </div>
              </div>
              <div className="text-right bg-emerald-50 rounded-xl px-5 py-3 border-2 border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">{t('output.totalOpportunity')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{fmtCurrency(totalSavings)}</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">{t('output.ifAllRecommendedAsksAccepted')}</p>
              </div>
            </div>

            {/* Visual comparison bar */}
            {dealTotalNum > 0 && savingsPct > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                  <span>{t('output.originalQuote')} <span className="font-semibold text-slate-700">{dealTotal}</span></span>
                  <span>{t('output.potentialSavingsLabel')} <span className="font-semibold text-emerald-700">{fmtCurrency(totalSavings)}</span></span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-slate-300 rounded-l-full transition-all duration-500"
                    style={{ width: `${100 - savingsPct}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                    style={{ width: `${savingsPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-slate-400">{t('output.afterSavings', { amount: fmtCurrency(dealTotalNum - totalSavings) })}</span>
                  <span className="font-semibold text-emerald-600">{t('output.percentSavings', { pct: savingsPct.toFixed(0) })}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Savings breakdown */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">{t('output.savingsBreakdown')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {output.potential_savings.map((saving, idx) => (
                    <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-lg font-bold text-emerald-700 break-words min-w-0">{saving.annual_impact}</span>
                        {savingsLabel && <span className="text-[10px] text-slate-400 text-right mt-1 flex-shrink-0">{savingsLabel}</span>}
                      </div>
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">{saving.ask}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top priorities */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">{t('output.yourTopPriorities')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {output.what_to_ask_for?.must_have?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-sm text-slate-800 leading-relaxed font-medium pt-0.5">{item}</span>
                    </div>
                  ))}
                </div>
                {output.what_to_ask_for?.must_have && output.what_to_ask_for.must_have.length > 2 && (
                  <button
                    onClick={() => document.getElementById('strategy-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                  >
                    {t('output.moreInStrategySection', { count: output.what_to_ask_for.must_have.length - 2 })}
                    <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: TAKE ACTION - EMAIL BUILDER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        {/* Cash Flow & Risk Improvements */}
        {output.cash_flow_improvements && output.cash_flow_improvements.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('output.cashFlowAndRiskImprovements')}</h3>
                <p className="text-[10px] text-slate-500">{t('output.nonCashImprovements')}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {output.cash_flow_improvements.map((item, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      item.category === 'cash_flow' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      item.category === 'risk_protection' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">3</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('output.takeAction')}</h2>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
          {/* Green header */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('output.readyToSendNegotiationEmail')}</h3>
                <p className="text-sm text-emerald-50">{t('output.copyEditOrSendDirectly')}</p>
              </div>
            </div>
          </div>

          {/* Email content */}
          <div className="p-6 space-y-5">
            {/* Email Tone Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('output.emailTone')}</label>
                <span className="text-xs text-slate-600">{t('output.chooseYourApproach')}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {emailTabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEmailTab(idx)}
                    className={`relative px-4 py-3.5 rounded-lg border-2 transition-all ${
                      activeEmailTab === idx
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-900 mb-0.5">{tab.label}</div>
                      <div className="text-xs text-slate-600">{tab.desc}</div>
                    </div>
                    {activeEmailTab === idx && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('output.subjectLine')}</label>
                <button
                  onClick={() => navigator.clipboard.writeText(emailSubjects[activeEmailTab])}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('output.copy')}
                </button>
              </div>
              <input
                type="text"
                value={emailSubjects[activeEmailTab]}
                onChange={(e) => {
                  const newSubjects = [...emailSubjects]
                  newSubjects[activeEmailTab] = e.target.value
                  setEmailSubjects(newSubjects)
                }}
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm bg-white font-medium"
                placeholder={t('output.emailSubjectPlaceholder')}
              />
            </div>

            {/* Email Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('output.emailBody')}</label>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('output.copyToClipboard')}
                </button>
              </div>
              <textarea
                value={emailBodies[activeEmailTab]}
                onChange={(e) => {
                  const newBodies = [...emailBodies]
                  newBodies[activeEmailTab] = e.target.value
                  setEmailBodies(newBodies)
                }}
                rows={12}
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed shadow-sm bg-white"
                placeholder={t('output.emailBodyPlaceholder')}
              />
            </div>

            {/* Action Buttons + Custom Instructions */}
            <div className="space-y-4 pt-2">
              {/* Main action buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-gradient-to-br from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                  <Mail className="w-4 h-4" />
                  <span>{t('output.openInEmailClient')}</span>
                </button>
                <button className="px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{t('output.copyEmail')}</span>
                </button>
              </div>

              {/* Regenerate with AI section */}
              {roundId && (
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-sm font-bold text-slate-900">{t('output.regenerateWithCustomInstructions')}</span>
                        {remainingRegens > 0 && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            {t(remainingRegens === 1 ? 'output.aiRegenerationsRemaining_one' : 'output.aiRegenerationsRemaining_other', { count: remainingRegens })}
                          </p>
                        )}
                      </div>
                    </div>
                    {showCustomPrompt ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {showCustomPrompt && (
                    <div className="p-4 bg-white border-t-2 border-slate-200 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                          {t('output.customInstructionsOptional')}
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none shadow-sm bg-white"
                          placeholder={t('output.customInstructionsPlaceholder')}
                        />
                        <p className="text-xs text-slate-500 mt-2">{t('output.tellAiHowToAdjust')}</p>
                      </div>

                      <button
                        onClick={handleRegenerateEmails}
                        disabled={regenerating || remainingRegens <= 0}
                        className={`w-full px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                          regenerating || remainingRegens <= 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {regenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t('output.regeneratingAll3Tones')}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>
                              {remainingRegens <= 0 ? t('output.noRegenerationsLeft') : t('output.regenerateAll3EmailTones')}
                            </span>
                          </>
                        )}
                      </button>

                      {remainingRegens > 0 && (
                        <p className="text-xs text-slate-400 text-center">{t(remainingRegens === 1 ? 'output.regenerationsRemaining_one' : 'output.regenerationsRemaining_other', { count: remainingRegens })}</p>
                      )}

                      {remainingRegens <= 0 && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          {t('output.usedAllRegenerations')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Info messages */}
              {regenError && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800">
                  {regenError}
                </div>
              )}
              {!roundId && (
                <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-900">
                      {t('output.signUpToSaveDeal')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ASSUMPTIONS & DISCLAIMER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 overflow-hidden shadow-sm mb-6">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t('output.assumptionsAndDisclaimer')}</h2>
          </div>
          {showAssumptions ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showAssumptions && (
          <div className="px-6 pb-6 border-t border-blue-100 pt-5 space-y-4">
            {output.assumptions && output.assumptions.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">{t('output.assumptionsMade')}</p>
                <ul className="space-y-2">
                  {output.assumptions.map((assumption, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <p className="text-xs text-slate-600 leading-relaxed">{output.disclaimer}</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ANALYSIS HISTORY */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{t('output.analysisHistory')}</h2>
                <p className="text-xs text-slate-600">{t('output.trackNegotiationRounds')}</p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
              {t('output.roundCompleted')}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="relative pl-8 pb-6 border-l-2 border-emerald-300">
            <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md ring-4 ring-white">
              <span className="text-white font-bold text-xs">1</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm ml-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-slate-900">{t('output.round1InitialAnalysis')}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {t('output.actionRequired')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{output.vendor}</span>
                      {output.snapshot?.deal_type && (
                        <span className="text-slate-500"> • {output.snapshot.deal_type}</span>
                      )}
                      <span className="text-slate-500"> • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right bg-white/60 backdrop-blur rounded-lg px-4 py-2 border border-emerald-300">
                  <p className="text-xs font-semibold text-slate-600 mb-0.5">{t('output.totalValue')}</p>
                  <p className="text-lg font-bold text-slate-900">{output.snapshot?.total_commitment ? normalizeAmount(output.snapshot.total_commitment) : t('output.na')}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/60 backdrop-blur rounded-lg border border-emerald-200 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">{t('output.analysisSummary')}</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {output.verdict || output.quick_read?.conclusion || t('output.defaultAnalysisSummary')}
                </p>
              </div>
            </div>
          </div>

          {/* Future rounds placeholder */}
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 font-medium mb-2">{t('output.noAdditionalRoundsYet')}</p>
            <p className="text-xs text-slate-400">{t('output.uploadVendorResponses')}</p>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BOTTOM ACTION BAR - Static footer at bottom */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mt-8 bg-white border-t-2 border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t('output.analysisComplete')}</p>
              <p className="text-xs text-slate-600">{t('output.reviewFindingsAbove')}</p>
            </div>
          </div>

          <button className="px-6 py-3 rounded-lg flex items-center gap-2 font-semibold text-sm bg-gradient-to-br from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('output.markDealAsClosed')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
