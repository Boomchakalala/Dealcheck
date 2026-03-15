'use client'

import { useI18n } from '@/i18n/context'

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
  const { locale, setLocale } = useI18n()
  const isFr = locale === 'fr'

  return (
    <button
      onClick={() => setLocale(isFr ? 'en' : 'fr')}
      className="relative inline-flex items-center w-[72px] h-[32px] rounded-full bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer p-0.5 flex-shrink-0"
      title={isFr ? 'Switch to English' : 'Passer en français'}
      aria-label={isFr ? 'Switch to English' : 'Passer en français'}
    >
      {/* Sliding indicator */}
      <div
        className={`absolute top-0.5 w-[32px] h-[28px] rounded-full bg-white shadow-sm border border-slate-200 transition-all duration-200 ease-in-out ${
          isFr ? 'left-[36px]' : 'left-0.5'
        }`}
      />

      {/* EN flag */}
      <div className={`relative z-10 flex items-center justify-center w-[32px] h-[28px] transition-opacity duration-200 ${
        isFr ? 'opacity-40' : 'opacity-100'
      }`}>
        <svg width="20" height="14" viewBox="0 0 60 40" className="rounded-[2px] overflow-hidden">
          <rect width="60" height="40" fill="#012169"/>
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="7"/>
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
        </svg>
      </div>

      {/* FR flag */}
      <div className={`relative z-10 flex items-center justify-center w-[32px] h-[28px] transition-opacity duration-200 ${
        isFr ? 'opacity-100' : 'opacity-40'
      }`}>
        <svg width="20" height="14" viewBox="0 0 60 40" className="rounded-[2px] overflow-hidden">
          <rect width="20" height="40" fill="#002395"/>
          <rect x="20" width="20" height="40" fill="#fff"/>
          <rect x="40" width="20" height="40" fill="#ED2939"/>
        </svg>
      </div>
    </button>
  )
}
