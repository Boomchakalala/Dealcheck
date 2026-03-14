'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Mail, Clock, ArrowRight, CheckCircle2, Loader2, MessageSquare } from 'lucide-react'
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
    <div className="min-h-screen bg-white flex flex-col">
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/60 shadow-sm mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('footer.contact')}</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.12] font-bold text-slate-900 tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">

            {/* Form — 3 cols */}
            <div className="md:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{t('contact.successTitle')}</h3>
                  <p className="text-sm text-slate-500 mb-5">{t('contact.successDesc')}</p>
                  <button onClick={handleReset} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    {t('contact.sendAnother')} &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('contact.name')} <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder={t('contact.namePlaceholder')}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('contact.email')} <span className="text-red-500">*</span></label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('contact.emailPlaceholder')}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('contact.subject')}</label>
                    <select
                      value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {subjectOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('contact.message')} <span className="text-red-500">*</span></label>
                    <textarea
                      required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('contact.messagePlaceholder')}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                  <button
                    type="submit" disabled={sending || !name.trim() || !email.trim() || !message.trim()}
                    className="w-full px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('contact.sending')}</> : <>{t('contact.send')} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>

            {/* Info cards — 2 cols */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t('contact.emailLabel')}</h3>
                </div>
                <a href="mailto:hello@termlift.com" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  hello@termlift.com
                </a>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t('contact.responseTime')}</h3>
                </div>
                <p className="text-sm text-slate-600">{t('contact.responseValue')}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{t('contact.linkedinLabel')}</h3>
                </div>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
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
