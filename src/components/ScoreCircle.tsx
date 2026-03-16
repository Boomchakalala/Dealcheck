interface ScoreCircleProps {
  score: number
  size?: number // pixel size, default 100
  strokeWidth?: number // default 7
  trackClass?: string // tailwind stroke class for track
  ringClass?: string // tailwind stroke class for filled arc
  textClass?: string // tailwind text color class
  showOutOf?: boolean // show "/ 100" below score
  label?: string // optional label below score instead of "/ 100"
}

export function ScoreCircle({
  score,
  size = 100,
  strokeWidth = 7,
  trackClass = 'stroke-slate-100',
  ringClass = 'stroke-emerald-500',
  textClass = 'text-emerald-700',
  showOutOf = true,
  label,
}: ScoreCircleProps) {
  const radius = (size / 2) - strokeWidth - 2
  const circumference = 2 * Math.PI * radius
  const dashLength = (score / 100) * circumference
  const viewBox = `0 0 ${size} ${size}`
  const center = size / 2

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={viewBox} className="-rotate-90">
        <circle
          cx={center} cy={center} r={radius}
          fill="none" className={trackClass} strokeWidth={strokeWidth}
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none" className={ringClass} strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-extrabold ${textClass} leading-none`}
          style={{ fontSize: size * 0.28 }}
        >
          {score}
        </span>
        {showOutOf && (
          <span className="text-slate-400 font-medium leading-none mt-0.5"
            style={{ fontSize: size * 0.1 }}
          >
            {label || '/ 100'}
          </span>
        )}
      </div>
    </div>
  )
}
