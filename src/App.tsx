import { useEffect, useState } from 'react'
import UploadFlow from './components/UploadFlow'
import ReportDashboard from './components/ReportDashboard'
import { parseSoifWorkbook } from './lib/parseWorkbook'
import { buildUserPrompt, parseReportMarkdown } from './lib/promptTemplate'
import { callAI, DEFAULT_MODELS } from './lib/aiProviders'
import type { AppStep, ParsedReport, ProviderConfig, SoifWorkbookData } from './lib/types'

const STORAGE_KEY = 'soif_provider_config'

function loadConfig(): ProviderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore malformed storage
  }
  return { provider: 'groq', apiKey: '', model: DEFAULT_MODELS.groq }
}

export default function App() {
  const [step, setStep] = useState<AppStep>('upload')
  const [fileName, setFileName] = useState<string | null>(null)
  const [data, setData] = useState<SoifWorkbookData | null>(null)
  const [report, setReport] = useState<ParsedReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<ProviderConfig>(loadConfig)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  async function handleFile(file: File) {
    setError(null)
    try {
      const parsed = await parseSoifWorkbook(file)
      setData(parsed)
      setFileName(file.name)
      setStep('confirm')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that file.')
    }
  }

  async function handleAnalyze() {
    if (!data) return
    setError(null)
    setStep('analyzing')
    try {
      const prompt = buildUserPrompt(data)
      const raw = await callAI(config, prompt)
      setReport(parseReportMarkdown(raw))
      setStep('report')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The analysis request failed.')
      setStep('confirm')
    }
  }

  function handleStartOver() {
    setStep('upload')
    setFileName(null)
    setData(null)
    setReport(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border px-4 py-4">
        <p className="font-display text-lg font-medium">Manthan</p>
        <p className="text-xs text-ink-soft">मंथन · startup idea analysis, powered by SOIF</p>
      </header>

      {step === 'report' && data && report ? (
        <ReportDashboard
          data={data}
          report={report}
          fileName={fileName}
          onStartOver={handleStartOver}
        />
      ) : (
        <UploadFlow
          step={step}
          fileName={fileName}
          data={data}
          error={error}
          config={config}
          onFile={handleFile}
          onConfigChange={setConfig}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  )
}
