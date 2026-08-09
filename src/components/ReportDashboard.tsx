import {
  Sparkles,
  ThumbsUp,
  AlertOctagon,
  GitCompareArrows,
  ListTodo,
  Map,
  TrendingUp,
  RefreshCcw,
} from 'lucide-react'
import DimensionCard from './DimensionCard'
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

export default function ReportDashboard({ data, report, fileName, onStartOver }: Props) {
  const { badge, verdict } = gradeFor(data.overall.soifScore)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
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
        <StatChip label="SOIF score" value={data.overall.soifScore} />
        <StatChip label="Confidence" value={data.overall.confidenceIndex} />
        <StatChip label="Validation" value={data.overall.validationMaturityIndex} />
      </div>

      <AlertBanner alerts={data.criticalAlerts} />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.dimensions.map((d) => (
          <DimensionCard key={d.name} dimension={d} />
        ))}
      </div>

      <div className="space-y-4">
        <ReportSection icon={Sparkles} title="Executive summary" body={report.executiveSummary} />
        <ReportSection icon={ThumbsUp} title="Strengths" body={report.strengths} />
        <ReportSection icon={AlertOctagon} title="Weaknesses" body={report.weaknesses} />
        <ReportSection
          icon={GitCompareArrows}
          title="Contradictions"
          body={report.contradictions}
        />
        <ReportSection icon={ListTodo} title="Recommendations" body={report.recommendations} />
        <ReportSection icon={Map} title="Improvement roadmap" body={report.improvementRoadmap} />
        <ReportSection
          icon={TrendingUp}
          title="Re-scoring potential"
          body={report.rescoringPotential}
        />
        <ReportSection
          icon={RefreshCcw}
          title="Startup evolution notes"
          body={report.startupEvolutionNotes}
        />
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="mt-8 w-full rounded-xl border border-border py-3 font-display text-sm font-medium text-ink-soft transition-colors hover:border-ink-faint"
      >
        Analyze another assessment
      </button>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-surface p-3 text-center">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-display text-lg font-medium">
        {value !== null ? Math.round(value) : '–'}
      </p>
    </div>
  )
}

function ReportSection({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Sparkles
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-purple" />
        <p className="font-display text-sm font-medium">{title}</p>
      </div>
      <LiteMarkdown text={body} />
    </div>
  )
}
