import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ScoreRing from './ScoreRing'
import { visualFor, ACCENT_CLASSES } from '../lib/accent'
import type { DimensionSummary } from '../lib/types'

interface Props {
  dimension: DimensionSummary
}

export default function DimensionCard({ dimension }: Props) {
  const [open, setOpen] = useState(false)
  const visual = visualFor(dimension.name)
  const accentClasses = ACCENT_CLASSES[visual.accent]
  const score = dimension.dimensionScore

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 text-left"
      >
        <ScoreRing score={score} accent={visual.accent} icon={visual.icon} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-medium leading-tight">{dimension.name}</p>
          <p className="text-sm text-ink-soft">
            {score !== null ? `${Math.round(score)}/100` : 'Not scored yet'}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-ink-faint shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          <div className="flex gap-4 text-xs">
            <span className={`rounded-full px-2 py-1 font-medium ${accentClasses.bg} ${accentClasses.text}`}>
              Confidence {dimension.confidenceIndex !== null ? Math.round(dimension.confidenceIndex) : '–'}
            </span>
            <span className={`rounded-full px-2 py-1 font-medium ${accentClasses.bg} ${accentClasses.text}`}>
              Validation {dimension.validationIndex !== null ? Math.round(dimension.validationIndex) : '–'}
            </span>
          </div>
          <ul className="space-y-3">
            {dimension.questions.map((q, i) => (
              <li key={i} className="text-sm">
                <p className="font-medium leading-snug">
                  {q.question}
                  {q.isCritical && (
                    <span className="ml-2 rounded-full bg-amber-bg px-2 py-0.5 text-[11px] font-medium text-amber-text">
                      Critical
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-ink-soft">
                  Score {q.score ?? '–'} · Confidence {q.confidence ?? '–'} ·{' '}
                  {q.validationStatus ?? 'Not set'}
                </p>
                {q.reasonAndEvidence && (
                  <p className="mt-0.5 text-ink-soft italic">"{q.reasonAndEvidence}"</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
