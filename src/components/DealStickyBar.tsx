'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Copy, Check } from 'lucide-react'
import { useT } from '@/i18n/context'

interface DealStickyBarProps {
  dealName: string
  totalCommitment?: string
  redFlagCount: number
  potentialSavings?: string
}

export function DealStickyBar({ dealName, totalCommitment, redFlagCount, potentialSavings }: DealStickyBarProps) {
  const t = useT()
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyEmail = () => {
    // Find the email body textarea on the page and copy its content
    const emailTextarea = document.querySelector<HTMLTextAreaElement>('#email-drafts textarea')
    if (emailTextarea) {
      navigator.clipboard.writeText(emailTextarea.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 truncate">{dealName}</h2>
          {totalCommitment && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">
              {totalCommitment}
            </span>
          )}
          {redFlagCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium flex-shrink-0">
              <AlertTriangle className="w-3 h-3" />
              {redFlagCount}
            </span>
          )}
          {potentialSavings && (
            <span className="text-xs font-semibold text-emerald-700 flex-shrink-0">
              {t('sticky.save')} {potentialSavings}
            </span>
          )}
        </div>
        <button
          onClick={handleCopyEmail}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              {t('sticky.copied')}
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              {t('sticky.copyEmail')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
