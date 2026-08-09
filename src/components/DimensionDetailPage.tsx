import { ArrowLeft } from 'lucide-react'
import ScoreRing from './ScoreRing'
import { visualFor, ACCENT_CLASSES } from '../lib/accent'
import type { DimensionSummary } from '../lib/types'

interface Props {
  dimension: DimensionSummary
  onBack: () => void
}

export default function DimensionDetailPage({ dimension, onBack }: Props) {
  const visual = visualFor(dimension.name)
  const accentClasses = ACCENT_CLASSES[visual.accent]

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} />
        Overview
      </button>

      <div className="mb-5 flex items-center gap-3">
        <ScoreRing score={dimension.dimensionScore} accent={visual.accent} icon={visual.icon} size={52} />
        <div>
          <p className="font-display text-xl font-medium">{dimension.name}</p>
          <p className="text-sm text-ink-soft">
            {dimension.dimensionScore !== null ? `${Math.round(dimension.dimensionScore)}/100` : 'Not scored yet'}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-3 text-sm">
        <span className={`rounded-full px-3 py-1 font-medium ${accentClasses.bg} ${accentClasses.text}`}>
          Confidence {dimension.confidenceIndex !== null ? Math.round(dimension.confidenceIndex) : '–'}
        </span>
        <span className={`rounded-full px-3 py-1 font-medium ${accentClasses.bg} ${accentClasses.text}`}>
          Validation {dimension.validationIndex !== null ? Math.round(dimension.validationIndex) : '–'}
        </span>
      </div>

      <ul className="space-y-4">
        {dimension.questions.map((q, i) => (
          <li key={i} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm font-medium leading-snug">
              {q.question}
              {q.isCritical && (
                <span className="ml-2 rounded-full bg-amber-bg px-2 py-0.5 text-[11px] font-medium text-amber-text">
                  Critical
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Score {q.score ?? '–'} · Confidence {q.confidence ?? '–'} · {q.validationStatus ?? 'Not set'}
            </p>
            {q.reasonAndEvidence && (
              <p className="mt-1 text-sm italic text-ink-soft">"{q.reasonAndEvidence}"</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
