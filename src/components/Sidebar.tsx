import { LayoutDashboard } from 'lucide-react'
import ScoreRing from './ScoreRing'
import { visualFor, ACCENT_CLASSES } from '../lib/accent'
import type { DimensionSummary } from '../lib/types'

interface Props {
  dimensions: DimensionSummary[]
  view: string
  onSelect: (view: string) => void
}

export default function Sidebar({ dimensions, view, onSelect }: Props) {
  return (
    <nav className="shrink-0 space-y-1 border-b border-border p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
      <button
        type="button"
        onClick={() => onSelect('overview')}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
          view === 'overview' ? 'bg-purple-bg text-purple-text' : 'text-ink-soft hover:bg-canvas'
        }`}
      >
        <LayoutDashboard size={16} />
        Overview
      </button>

      <p className="px-3 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">
        Dimensions
      </p>

      {dimensions.map((d) => {
        const visual = visualFor(d.name)
        const active = view === d.name
        return (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect(d.name)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active ? 'bg-purple-bg font-medium text-purple-text' : 'text-ink-soft hover:bg-canvas'
            }`}
          >
            <ScoreRing score={d.dimensionScore} accent={visual.accent} icon={visual.icon} size={24} />
            <span className="min-w-0 flex-1 truncate">{d.name}</span>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium ${ACCENT_CLASSES[visual.accent].bg} ${ACCENT_CLASSES[visual.accent].text}`}
            >
              {d.dimensionScore !== null ? Math.round(d.dimensionScore) : '–'}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
