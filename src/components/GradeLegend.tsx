import { GRADE_SCALE } from '../lib/grade'

interface Props {
  currentBadge: string
}

export default function GradeLegend({ currentBadge }: Props) {
  return (
    <aside className="shrink-0 border-t border-border p-3 md:w-56 md:border-t-0 md:border-l md:p-4">
      <p className="mb-2 font-display text-sm font-medium">Grade scale</p>
      <div className="space-y-1">
        {GRADE_SCALE.map((g) => {
          const isCurrent = g.badge === currentBadge
          return (
            <div
              key={g.badge}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                isCurrent ? 'bg-purple-bg' : ''
              }`}
            >
              <span
                className={`flex h-6 w-8 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-medium ${
                  isCurrent ? 'bg-purple text-white' : 'bg-canvas text-ink-soft'
                }`}
              >
                {g.badge}
              </span>
              <div className="min-w-0">
                <p className={`truncate font-medium ${isCurrent ? 'text-purple-text' : 'text-ink'}`}>
                  {g.label}
                </p>
                <p className="text-ink-faint">{g.range}</p>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
