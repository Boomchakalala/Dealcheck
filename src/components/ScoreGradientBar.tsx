interface ScoreGradientBarProps {
  score: number
  width?: number
  height?: number
  className?: string
  /** Grayscale instead of red/orange/green — for deals that are closed without a "won" outcome, where the score is no longer the relevant signal. */
  muted?: boolean
}

/**
 * Directional score signal — red (high risk) to green (low risk) gradient with
 * a marker at the deal's position. Replaces the precise 0-100 number: the
 * point isn't to give an exact grade, it's to show roughly where a deal lands
 * so you know whether it's worth pushing back.
 */
export function ScoreGradientBar({ score, width = 160, height = 10, className = '', muted = false }: ScoreGradientBarProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const markerSize = height + 8

  return (
    <div className={className} style={{ width }}>
      <div className="relative" style={{ height: markerSize }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-full rounded-full"
          style={{ height, background: muted ? '#cbd5e1' : 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)' }}
        />
        <div
          className="absolute top-1/2 rounded-full bg-white shadow-md"
          style={{ left: `${clamped}%`, width: markerSize, height: markerSize, transform: 'translate(-50%, -50%)', border: `3px solid ${muted ? '#94a3b8' : '#0f172a'}` }}
        />
      </div>
    </div>
  )
}
