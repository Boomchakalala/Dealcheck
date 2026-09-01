'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, StickyNote, CheckCircle2 } from 'lucide-react'

interface NegotiationAdminWorkspaceProps {
  requestId: string
  initialAdminNotes: string | null
  initialNextAction: string | null
  clientEmail: string | null
  vendorContactEmail: string | null
  vendor: string | null
}

export function NegotiationAdminWorkspace({
  requestId, initialAdminNotes, initialNextAction, clientEmail, vendorContactEmail, vendor,
}: NegotiationAdminWorkspaceProps) {
  const router = useRouter()
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes || '')
  const [nextAction, setNextAction] = useState(initialNextAction || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = adminNotes !== (initialAdminNotes || '') || nextAction !== (initialNextAction || '')

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/negotiation-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes, nextAction }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const subject = encodeURIComponent(vendor ? `Your ${vendor} negotiation` : 'Your negotiation')

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        <StickyNote className="w-4 h-4 text-slate-500" />
        <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Working this case</h2>
      </div>

      <div className="px-5 py-5">
        <div className="flex flex-wrap gap-2 mb-5">
          {clientEmail && (
            <a href={`mailto:${clientEmail}?subject=${subject}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 text-[12.5px] font-semibold text-slate-700 bg-slate-50 no-underline transition-colors">
              <Mail className="w-3.5 h-3.5" /> Email client
            </a>
          )}
          {vendorContactEmail && (
            <a href={`mailto:${vendorContactEmail}?subject=${subject}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 text-[12.5px] font-semibold text-slate-700 bg-slate-50 no-underline transition-colors">
              <Mail className="w-3.5 h-3.5" /> Email supplier
            </a>
          )}
          {!clientEmail && !vendorContactEmail && (
            <p className="text-[12.5px] text-slate-400">No contact emails on file yet.</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-slate-500 mb-1.5 block">Next action</label>
            <input
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              placeholder="e.g. Follow up with supplier by Friday"
              disabled={saving}
              className="w-full px-3 py-2 text-[13.5px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-slate-500 mb-1.5 block">Internal notes <span className="font-normal text-slate-400">(admin only, not visible to the client)</span></label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Calls made, supplier responses, anything the next person picking this up should know..."
              disabled={saving}
              className="w-full px-3 py-2 text-[13.5px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>

        {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${saving || !dirty ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : 'Save'}
          </button>
          {saved && <span className="text-[12px] text-emerald-600 font-semibold inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </div>
    </section>
  )
}
