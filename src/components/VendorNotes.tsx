'use client'

import { useState } from 'react'
import { StickyNote, Plus, Loader2 } from 'lucide-react'

interface Note { id: string; body: string; created_at: string; source: string | null }

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function VendorNotes({ vendorId, initialNotes }: { vendorId: string; initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const add = async () => {
    const body = text.trim()
    if (!body || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/vendors/${vendorId}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }),
      })
      const data = await res.json()
      if (res.ok && data.note) {
        setNotes((n) => [{ id: data.note.id, body: data.note.body, created_at: data.note.created_at, source: null }, ...n])
        setText('')
      }
    } finally { setSaving(false) }
  }

  return (
    <section className="bg-white border border-line rounded-[14px]  overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-line-2">
        <StickyNote className="w-4 h-4 text-ink-3" />
        <h2 className="text-[13px] font-bold text-ink uppercase tracking-wide">Notes</h2>
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add() }}
            placeholder="Add a note about this vendor…"
            className="flex-1 px-3.5 py-2 text-[13.5px] bg-ground border border-line rounded-lg focus:outline-none  focus:border-green focus:bg-white transition-colors"
          />
          <button
            onClick={add}
            disabled={saving || !text.trim()}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${saving || !text.trim() ? 'bg-surface-2 text-ink-3' : 'bg-green text-white hover:bg-green-deep'}`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}Add
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-[13px] text-ink-3">No notes yet. Outcome notes from won deals show up here too.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="border-l-2 border-line pl-3.5">
                <p className="text-[13.5px] text-ink-2 leading-relaxed whitespace-pre-wrap">{n.body}</p>
                <p className="text-[11.5px] text-ink-3 mt-1">{n.source ? `${n.source} · ` : ''}{fmt(n.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
