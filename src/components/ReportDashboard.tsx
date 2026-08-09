import { useState } from 'react'
import {
  Sparkles,
  ThumbsUp,
  AlertOctagon,
  GitCompareArrows,
  ListTodo,
  Map,
  TrendingUp,
  RefreshCcw,
  Info,
  ChevronDown,
} from 'lucide-react'
import Sidebar from './Sidebar'
import GradeLegend from './GradeLegend'
import DimensionDetailPage from './DimensionDetailPage'
import AlertBanner from './AlertBanner'
import LiteMarkdown from './LiteMarkdown'
import { gradeFor } from '../lib/grade'
import type { ParsedReport, SoifWorkbookData } from '../lib/types'

interface Props {
  data: SoifWorkbookData
  report: ParsedReport
  fileName: string | null
  onStartOver: () => void
}

const SECTIONS: { key: keyof ParsedReport; title: string; icon: typeof Sparkles }[] = [
  { key: 'executiveSummary', title: 'Executive summary', icon: Sparkles },
  { key: 'strengths', title: 'Strengths', icon: ThumbsUp },
  { key: 'weaknesses', title: 'Weaknesses', icon: AlertOctagon },
  { key: 'contradictions', title: 'Contradictions', icon: GitCompareArrows },
  { key: 'recommendations', title: 'Recommendations', icon: ListTodo },
  { key: 'improvementRoadmap', title: 'Improvement roadmap', icon: Map },
  { key: 'rescoringPotential', title: 'Re-scoring potential', icon: TrendingUp },
  { key: 'startupEvolutionNotes', title: 'Startup evolution notes', icon: RefreshCcw },
]

export default function ReportDashboard({ data, report, fileName, onStartOver }: Props) {
  const [view, setView] = useState('overview')
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['executiveSummary']))
  const { badge, verdict } = gradeFor(data.overall.soifScore)

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectedDimension = data.dimensions.find((d) => d.name === view)

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar dimensions={data.dimensions} view={view} onSelect={setView} />

      <main className="min-w-0 flex-1">
        {selectedDimension ? (
          <DimensionDetailPage dimension={selectedDimension} onBack={() => setView('overview')} />
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-surface p-5">
              <div className="min-w-0">
                <p className="text-xs text-ink-soft">Overall SOIF score</p>
                <p className="truncate font-display text-lg font-medium">
                  {fileName?.replace(/\.xlsx$/i, '') ?? 'Your assessment'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-ink-soft">Verdict</p>
                  <p className="max-w-[220px] text-sm font-medium">{verdict}</p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-bg font-display text-xl font-medium text-purple-text">
                  {badge}
                </div>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <StatChip
                label="SOIF score"
                value={data.overall.soifScore}
                explanation="Overall strength of the idea (0-100), combining all 10 dimensions weighted by how much they typically matter to investors. This is 'how good does it look' based on what's been scored."
              />
              <StatChip
                label="Confidence"
                value={data.overall.confidenceIndex}
                explanation="How sure the founder is in their own answers (0-100) — separate from the scores themselves. A high SOIF score with low Confidence means the strengths are real but still feel uncertain even to the founder."
              />
              <StatChip
                label="Validation"
                value={data.overall.validationMaturityIndex}
                explanation="How proven the answers are with real-world evidence (0-100). Untested assumptions score low; direct customer, market, or revenue proof scores high. This is 'how much of this is still a guess.'"
              />
            </div>

            <AlertBanner alerts={data.criticalAlerts} />

            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <AccordionSection
                  key={s.key}
                  icon={s.icon}
                  title={s.title}
                  body={report[s.key] as string}
                  open={openSections.has(s.key)}
                  onToggle={() => toggleSection(s.key)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onStartOver}
              className="mt-8 w-full rounded-xl border border-border py-3 font-display text-sm font-medium text-ink-soft transition-colors hover:border-ink-faint"
            >
              Analyze another assessment
            </button>
          </div>
        )}
      </main>

      <GradeLegend currentBadge={badge} />
    </div>
  )
}

function StatChip({
  label,
  value,
  explanation,
}: {
  label: string
  value: number | null
  explanation: string
}) {
  return (
    <div className="group relative rounded-xl bg-surface p-3 text-center">
      <div className="flex items-center justify-center gap-1">
        <p className="text-xs text-ink-soft">{label}</p>
        <Info size={12} className="text-ink-faint" aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-medium">
        {value !== null ? Math.round(value) : '–'}
      </p>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-left text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {explanation}
      </div>
    </div>
  )
}

function AccordionSection({
  icon: Icon,
  title,
  body,
  open,
  onToggle,
}: {
  icon: typeof Sparkles
  title: string
  body: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Icon size={16} className="shrink-0 text-purple" />
        <p className="flex-1 font-display text-sm font-medium">{title}</p>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3">
          <LiteMarkdown text={body} />
        </div>
      )}
    </div>
  )
}
