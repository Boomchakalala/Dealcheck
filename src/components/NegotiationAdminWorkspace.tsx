'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { Btn } from '@/components/system'
import { cn } from '@/lib/utils'

interface NegotiationAdminWorkspaceProps {
  requestId: string
  initialAdminNotes: string | null
  initialNextAction: string | null
  clientEmail: string | null
  vendorContactEmail: string | null
  vendor: string | null
}

const inputCls = 'w-full h-10 px-3.5 rounded-[10px] border border-line bg-surface text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-green disabled:opacity-60'

/** Next action + internal notes, with the two mailto shortcuts. Same PATCH contract as before. */
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
    setSaving(true); setError(null); setSaved(false)
    try {
      const res = await fetch(`/api/negotiation-requests/${requestId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
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
    <div className="bg-surface border border-line rounded-[14px] px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <p className="tl-label text-green-deep">Working this case</p>
          <p className="text-[12.5px] text-ink-2 mt-0.5">The next action shows on the client&apos;s page. Notes stay internal.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {clientEmail && <Btn href={`mailto:${clientEmail}?subject=${subject}`} variant="ghost" size="sm"><Mail className="w-3.5 h-3.5" />Email client</Btn>}
          {vendorContactEmail && <Btn href={`mailto:${vendorContactEmail}?subject=${subject}`} variant="ghost" size="sm"><Mail className="w-3.5 h-3.5" />Email supplier</Btn>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-[12.5px] font-semibold text-ink mb-1 block">Next action</label>
          <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="e.g. Follow up with supplier by Friday" disabled={saving} className={inputCls} />
        </div>
        <div>
          <label className="text-[12.5px] font-semibold text-ink mb-1 block">Internal notes <span className="font-normal text-ink-3">(admin only)</span></label>
          <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={4} placeholder="Calls made, supplier responses, anything the next person picking this up should know…" disabled={saving} className={cn(inputCls, 'h-auto py-2.5 resize-y')} />
        </div>
      </div>

      {error && <p className="text-[12.5px] text-risk mt-2">{error}</p>}

      <div className="flex items-center gap-3 mt-3">
        <Btn variant={dirty ? 'primary' : 'ghost'} size="sm" onClick={handleSave} disabled={saving || !dirty}>
          {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : 'Save'}
        </Btn>
        {saved && <span className="text-[12.5px] text-green-deep font-semibold inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
      </div>
    </div>
  )
}
