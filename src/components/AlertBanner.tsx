import { Lightbulb } from 'lucide-react'
import type { CriticalAlert } from '../lib/types'

interface Props {
  alerts: CriticalAlert[]
}

export default function AlertBanner({ alerts }: Props) {
  if (alerts.length === 0) return null

  return (
    <div className="mb-5 space-y-2">
      {alerts.map((a, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl bg-amber-bg px-4 py-3">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-text" />
          <div>
            <p className="text-sm font-medium text-amber-text">
              Worth a look: {a.dimension}
            </p>
            <p className="text-sm text-ink-soft">
              "{a.question}" scored {a.score}/5 — this is a Critical Question, so it carries
              extra weight in the overall picture.
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
