'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useI18n } from '@/i18n/context'

interface EmailCaptureProps {
  source: string // e.g. 'blog', 'try', 'landing'
}

export function EmailCapture({ source }: EmailCaptureProps) {
  const { locale } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const copy = {
    en: {
      title: 'Get negotiation tips in your inbox',
      subtitle: 'One practical tip per week. No spam, unsubscribe anytime.',
      placeholder: 'your@email.com',
      button: 'Subscribe',
      success: 'You\'re in. Check your inbox.',
      error: 'Something went wrong. Try again.',
    },
    fr: {
      title: 'Recevez nos conseils de négociation',
      subtitle: 'Un conseil pratique par semaine. Pas de spam, désinscription en un clic.',
      placeholder: 'votre@email.com',
      button: 'S\'inscrire',
      success: 'C\'est fait. Vérifiez votre boîte mail.',
      error: 'Une erreur est survenue. Réessayez.',
    },
  }

  const t = locale === 'fr' ? copy.fr : copy.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 sm:p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <p className="text-sm font-semibold text-emerald-800">{t.success}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{t.title}</h4>
      <p className="text-xs text-slate-500 mb-4">{t.subtitle}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : t.button}
          {status !== 'loading' && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-2">{t.error}</p>
      )}
    </div>
  )
}
