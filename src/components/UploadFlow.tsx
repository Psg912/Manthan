import { useRef, useState } from 'react'
import { Upload, FileCheck, Loader2, ShieldCheck } from 'lucide-react'
import SettingsPanel from './SettingsPanel'
import type { AppStep, ProviderConfig, SoifWorkbookData } from '../lib/types'

interface Props {
  step: AppStep
  fileName: string | null
  data: SoifWorkbookData | null
  error: string | null
  config: ProviderConfig
  onFile: (file: File) => void
  onConfigChange: (config: ProviderConfig) => void
  onAnalyze: () => void
}

const STEPS: { key: AppStep; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'confirm', label: 'Confirm' },
  { key: 'analyzing', label: 'Analyzing' },
  { key: 'report', label: 'Report' },
]

export default function UploadFlow({
  step,
  fileName,
  data,
  error,
  config,
  onFile,
  onConfigChange,
  onAnalyze,
}: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [ackPrivacy, setAckPrivacy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const currentIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i < currentIndex
                    ? 'bg-blue-bg text-blue-text'
                    : i === currentIndex
                    ? 'bg-blue text-white'
                    : 'bg-canvas text-ink-faint'
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs text-ink-soft">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${i < currentIndex ? 'bg-blue' : 'bg-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div>
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-canvas px-4 py-3">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ink-soft" />
            <label className="flex items-start gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={ackPrivacy}
                onChange={(e) => setAckPrivacy(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Your workbook data — including free-text answers — is sent directly from your
                browser to the AI provider you choose below, using your own API key. It never
                passes through our servers, because there are none.
              </span>
            </label>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file && ackPrivacy) onFile(file)
            }}
            onClick={() => ackPrivacy && inputRef.current?.click()}
            className={`mb-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              !ackPrivacy
                ? 'cursor-not-allowed border-border opacity-50'
                : dragOver
                ? 'cursor-pointer border-blue bg-blue-bg'
                : 'cursor-pointer border-border hover:border-ink-faint'
            }`}
          >
            <Upload size={28} className="text-blue" />
            <p className="font-display font-medium">Drag your SOIF workbook here</p>
            <p className="text-sm text-ink-soft">or click to browse — .xlsx file</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onFile(file)
              }}
            />
          </div>

          <SettingsPanel config={config} onChange={onConfigChange} />

          {error && <p className="mt-3 text-sm text-coral-text">{error}</p>}
        </div>
      )}

      {step === 'confirm' && data && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <FileCheck size={22} className="mt-0.5 shrink-0 text-blue" />
            <div>
              <p className="font-display font-medium">{fileName}</p>
              <p className="text-sm text-ink-soft">
                {data.completeness.questionsAnswered} of {data.completeness.questionsTotal}{' '}
                questions answered
              </p>
              {data.completeness.questionsAnswered < 10 && (
                <p className="mt-2 text-sm text-amber-text">
                  This assessment is quite early — complete more of the workbook for a
                  meaningful report. Analysis works best with at least 10 answered questions.
                </p>
              )}
            </div>
          </div>

          <SettingsPanel config={config} onChange={onConfigChange} />

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!config.apiKey || data.completeness.questionsAnswered < 10}
            className="w-full rounded-xl bg-blue py-3 font-display font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze
          </button>
          {error && <p className="text-sm text-coral-text">{error}</p>}
        </div>
      )}

      {step === 'analyzing' && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-canvas p-14 text-center">
          <Loader2 size={28} className="animate-spin text-blue" />
          <p className="font-display font-medium">Reading your data and generating the report</p>
          <p className="text-sm text-ink-soft">Usually takes 10–20 seconds.</p>
        </div>
      )}
    </div>
  )
}
