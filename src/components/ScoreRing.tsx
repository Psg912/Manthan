import type { LucideIcon } from 'lucide-react'
import { ACCENT_CLASSES, type AccentKey } from '../lib/accent'

interface Props {
  score: number | null
  accent: AccentKey
  icon?: LucideIcon
  size?: number
}

export default function ScoreRing({ score, accent, icon: Icon, size = 40 }: Props) {
  const r = (size - 6) / 2
  const circumference = 2 * Math.PI * r
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score)) / 100
  const offset = circumference * (1 - pct)
  const strokeClass = ACCENT_CLASSES[accent].ring

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={strokeClass}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {Icon ? (
          <Icon className={ACCENT_CLASSES[accent].text} size={Math.round(size * 0.35)} />
        ) : (
          <span className="text-xs font-medium">{score ?? '–'}</span>
        )}
      </div>
    </div>
  )
}
