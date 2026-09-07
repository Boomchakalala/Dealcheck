'use client'

import { useState } from 'react'
import { Mail, Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MarketingPage, PageHero, Section } from '@/components/marketing/MarketingPage'
import { Btn } from '@/components/system'

const EMAIL = 'hello@termlift.com'
const field =
  'w-full h-10 px-3 text-[14px] text-ink bg-surface border border-line rounded-[10px] outline-none transition-colors placeholder:text-ink-3 focus:border-green'

export default function ContactPage() {
  const t = useTranslations('contact')
  const f = useTranslations('footer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General question')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subjectOptions = [
    { value: 'General question', label: t('subjectGeneral') },
    { value: 'Feature request', label: t('subjectFeature') },
    { value: 'Bug report', label: t('subjectBug') },
    { value: 'Partnership', label: t('subjectPartnership') },
    { value: 'Press', label: t('subjectPress') },
    { value: 'Other', label: t('subjectOther') },
  ]

  const canSend = !!name.trim() && !!email.trim() && !!message.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
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
      setError(t('errorGeneric'))
    } finally {
      setSending(false)
    }
  }

  const handleReset = () => {
    setName(''); setEmail(''); setSubject('General question'); setMessage('')
    setSent(false); setError(null)
  }

  return (
    <MarketingPage>
      <PageHero eyebrow={f('contact')} title={t('title')} lead={t('subtitle')} narrow />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
          {/* Form — the one object on the page */}
          <div className="max-w-[640px]">
            {sent ? (
              <div className="rounded-[14px] border border-green-line bg-green-soft px-6 py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-deep mx-auto mb-3" />
                <h2 className="font-display font-bold text-[19px] leading-tight">{t('successTitle')}</h2>
                <p className="text-[14px] text-ink-2 mt-1.5">{t('successDesc')}</p>
                <Btn variant="link" onClick={handleReset} className="mt-4 text-green-deep">{t('sendAnother')} <ArrowRight className="w-3.5 h-3.5" /></Btn>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-ink block mb-1.5">{t('name')} <span className="text-risk">*</span></span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePlaceholder')} className={field} />
                  </label>
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-ink block mb-1.5">{t('email')} <span className="text-risk">*</span></span>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} className={field} />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[12.5px] font-semibold text-ink block mb-1.5">{t('subject')}</span>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className={field}>
                    {subjectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[12.5px] font-semibold text-ink block mb-1.5">{t('message')} <span className="text-risk">*</span></span>
                  <textarea required rows={7} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('messagePlaceholder')} className={`${field} h-auto py-2.5 resize-y min-h-[140px]`} />
                </label>
                {error && <p className="text-[13.5px] text-risk bg-risk-soft border border-risk-line rounded-[10px] px-3.5 py-3">{error}</p>}
                <div>
                  <Btn type="submit" variant="primary" size="lg" disabled={sending || !canSend}>
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}</> : <>{t('send')} <ArrowRight className="w-4 h-4" /></>}
                  </Btn>
                </div>
              </form>
            )}
          </div>

          {/* Other ways in — flat list */}
          <aside className="lg:pt-1">
            <dl className="divide-y divide-line border-y border-line">
              <div className="py-4 flex items-start gap-3">
                <Mail className="w-4 h-4 text-ink-3 mt-1 shrink-0" />
                <div>
                  <dt className="text-[12.5px] font-semibold text-ink">{t('emailLabel')}</dt>
                  <dd className="text-[14px] mt-0.5"><a href={`mailto:${EMAIL}`} className="text-green-deep font-medium no-underline hover:underline">{EMAIL}</a></dd>
                </div>
              </div>
              <div className="py-4 flex items-start gap-3">
                <Clock className="w-4 h-4 text-ink-3 mt-1 shrink-0" />
                <div>
                  <dt className="text-[12.5px] font-semibold text-ink">{t('responseTime')}</dt>
                  <dd className="text-[14px] text-ink-2 mt-0.5">{t('responseValue')}</dd>
                </div>
              </div>
            </dl>
          </aside>
        </div>
      </Section>
    </MarketingPage>
  )
}
