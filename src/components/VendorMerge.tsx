'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GitMerge, Loader2, AlertTriangle } from 'lucide-react'

interface VendorRef { id: string; name: string; dealCount: number }

interface PendingMerge {
  loserId: string; loserName: string; loserCount: number
  winnerId: string; winnerName: string; winnerCount: number
}

export function VendorMerge({
  vendorId, vendorName, aliases, dealCount, others, suggestions,
}: {
  vendorId: string; vendorName: string; aliases: string[]; dealCount: number
  others: VendorRef[]; suggestions: VendorRef[]
}) {
  const router = useRouter()
  const [pending, setPending] = useState<PendingMerge | null>(null)
  const [pickId, setPickId] = useState('')
  const [merging, setMerging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const self: VendorRef = { id: vendorId, name: vendorName, dealCount }

  // merge `loser` INTO `winner`
  const confirm = (loser: VendorRef, winner: VendorRef) =>
    setPending({ loserId: loser.id, loserName: loser.name, loserCount: loser.dealCount, winnerId: winner.id, winnerName: winner.name, winnerCount: winner.dealCount })

  const run = async () => {
    if (!pending) return
    setMerging(true); setError(null)
    try {
      const res = await fetch(`/api/vendors/${pending.loserId}/merge`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId: pending.winnerId }),
      })
      const data = await res.json()
      if (res.ok) { router.push(`/app/vendors/${pending.winnerId}`); router.refresh() }
      else { setError(data.error || 'Merge failed'); setMerging(false) }
    } catch {
      setError('Merge failed'); setMerging(false)
    }
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        <GitMerge className="w-4 h-4 text-slate-500" />
        <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Aliases &amp; merge</h2>
      </div>
      <div className="p-5 space-y-5">
        {/* aliases */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Aliases</p>
          {aliases.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {aliases.map((a) => <span key={a} className="text-[12px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{a}</span>)}
            </div>
          ) : <p className="text-[13px] text-slate-400">No aliases yet. Merging another vendor in will record its name here.</p>}
        </div>

        {/* suggested merges (>0.85) — merge the other INTO this one */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Possible duplicates</p>
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5">
                <p className="text-[13px] text-slate-700">Is <span className="font-semibold">&ldquo;{s.name}&rdquo;</span> the same as <span className="font-semibold">&ldquo;{vendorName}&rdquo;</span>?</p>
                <button onClick={() => confirm(s, self)} className="text-[12.5px] font-bold text-emerald-700 hover:text-emerald-800 flex-shrink-0">Merge</button>
              </div>
            ))}
          </div>
        )}

        {/* merge this vendor INTO another */}
        {others.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Merge this vendor into another</p>
            <div className="flex gap-2">
              <select value={pickId} onChange={(e) => setPickId(e.target.value)} className="flex-1 px-3 py-2 text-[13.5px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
                <option value="">Choose a vendor…</option>
                {others.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.dealCount} {o.dealCount === 1 ? 'deal' : 'deals'})</option>)}
              </select>
              <button
                disabled={!pickId}
                onClick={() => { const o = others.find((x) => x.id === pickId); if (o) confirm(self, o) }}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold ${pickId ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400'}`}
              >Merge</button>
            </div>
          </div>
        )}
      </div>

      {/* confirm modal */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40" onClick={() => !merging && setPending(null)}>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
              <h3 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>Merge vendors?</h3>
            </div>
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">
              <span className="font-semibold">&ldquo;{pending.loserName}&rdquo;</span> will be merged into <span className="font-semibold">&ldquo;{pending.winnerName}&rdquo;</span>.
              Its {pending.loserCount} {pending.loserCount === 1 ? 'deal' : 'deals'} move over, its name becomes an alias, and it&apos;s removed.
              {' '}<span className="font-semibold">&ldquo;{pending.winnerName}&rdquo;</span> will have {pending.loserCount + pending.winnerCount} deals.
            </p>
            {error && <p className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setPending(null)} disabled={merging} className="px-4 py-2 text-[13.5px] font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
              <button onClick={run} disabled={merging} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13.5px] font-bold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                {merging && <Loader2 className="w-4 h-4 animate-spin" />}Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
