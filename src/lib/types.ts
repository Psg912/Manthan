export interface QuestionRow {
  dimension: string
  question: string
  weight: number
  score: number | null
  confidence: number | null
  validationStatus: string | null
  reasonAndEvidence: string | null
  isCritical: boolean
}

export interface DimensionSummary {
  name: string
  weight: number
  dimensionScore: number | null
  confidenceIndex: number | null
  validationIndex: number | null
  questions: QuestionRow[]
}

export interface OverallSummary {
  soifScore: number | null
  confidenceIndex: number | null
  validationMaturityIndex: number | null
}

export interface CriticalAlert {
  dimension: string
  question: string
  score: number
}

export interface Completeness {
  questionsAnswered: number
  questionsTotal: number
  unansweredByDimension: Record<string, number>
}

export interface SoifWorkbookData {
  startupIdeaNarrative: string
  overall: OverallSummary
  dimensions: DimensionSummary[]
  criticalAlerts: CriticalAlert[]
  completeness: Completeness
}

export type AppStep = 'upload' | 'confirm' | 'analyzing' | 'report'

export type Provider = 'groq' | 'gemini'

export interface ProviderConfig {
  provider: Provider
  apiKey: string
  model: string
}

export interface ParsedReport {
  executiveSummary: string
  strengths: string
  weaknesses: string
  contradictions: string
  criticalRiskAlerts: string
  recommendations: string
  improvementRoadmap: string
  rescoringPotential: string
  startupEvolutionNotes: string
  raw: string
}
