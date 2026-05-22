'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Mail, Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General question')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subjectOptions = [
    { value: 'General question', label: t('contact.subjectGeneral') },
    { value: 'Feature request', label: t('contact.subjectFeature') },
    { value: 'Bug report', label: t('contact.subjectBug') },
    { value: 'Partnership', label: t('contact.subjectPartnership') },
    { value: 'Press', label: t('contact.subjectPress') },
    { value: 'Other', label: t('contact.subjectOther') },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(t('contact.errorGeneric'))
    } finally {
      setSending(false)
    }
  }

  const handleReset = () => {
    setName(''); setEmail(''); setSubject('General question'); setMessage('')
    setSent(false); setError(null)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden px-6 pt-20 sm:pt-28 pb-12">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 340px at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1DB954' }}>
              {t('footer.contact')}
            </p>
            <h1 className="text-slate-900 mb-4" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.028em' }}>
              {t('contact.title')}
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">

            {/* Form — 3 cols */}
            <div className="md:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-10 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>{t('contact.successTitle')}</h3>
                  <p className="text-sm text-slate-600 mb-6">{t('contact.successDesc')}</p>
                  <button onClick={handleReset} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    {t('contact.sendAnother')} &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">{t('contact.name')} <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder={t('contact.namePlaceholder')}
                      className="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">{t('contact.email')} <span className="text-red-500">*</span></label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('contact.emailPlaceholder')}
                      className="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">{t('contact.subject')}</label>
                    <select
                      value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      {subjectOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">{t('contact.message')} <span className="text-red-500">*</span></label>
                    <textarea
                      required rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('contact.messagePlaceholder')}
                      className="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">{error}</p>}
                  <button
                    type="submit" disabled={sending || !name.trim() || !email.trim() || !message.trim()}
                    className="w-full px-6 py-4 text-sm font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_-6px_rgba(29,185,84,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(29,185,84,0.55)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('contact.sending')}</> : <>{t('contact.send')} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>

            {/* Info cards — 2 cols */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{t('contact.emailLabel')}</h3>
                </div>
                <a href="mailto:hello@termlift.com" className="text-[13.5px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  hello@termlift.com
                </a>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{t('contact.responseTime')}</h3>
                </div>
                <p className="text-[13.5px] text-slate-500">{t('contact.responseValue')}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{t('contact.linkedinLabel')}</h3>
                </div>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  LinkedIn &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
