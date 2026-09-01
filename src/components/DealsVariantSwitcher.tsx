import Link from 'next/link'

const VARIANTS = [
  { key: 'a', label: 'A · Table' },
  { key: 'b', label: 'B · Stat line' },
  { key: 'c', label: 'C · Grouped' },
  { key: 'd', label: 'D · Card grid' },
  { key: 'e', label: 'E · Feed' },
  { key: 'f', label: 'F · Category' },
  { key: 'g', label: 'G · A+boxes' },
  { key: 'h', label: 'H · A+chips' },
  { key: 'i', label: 'I · A+icons' },
] as const

/** Dev-only preview switcher — lets you flip between the /app/deals-variant-* layout experiments without retyping URLs. Not part of the real app. */
export function DealsVariantSwitcher({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Link href="/app" className="text-[11px] text-slate-400 hover:text-emerald-600 mr-2">&larr; real page</Link>
      {VARIANTS.map(v => (
        <Link
          key={v.key}
          href={`/app/deals-variant-${v.key}`}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold no-underline transition-colors ${
            v.key === current ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {v.label}
        </Link>
      ))}
    </div>
  )
}
