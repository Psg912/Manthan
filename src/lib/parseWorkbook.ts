import * as XLSX from 'xlsx'
import type {
  SoifWorkbookData,
  DimensionSummary,
  QuestionRow,
  CriticalAlert,
} from './types'

const CRITICAL_WEIGHT = 0.25

function findRowIndex(rows: any[][], matcher: (row: any[]) => boolean): number {
  return rows.findIndex(matcher)
}

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export async function parseSoifWorkbook(file: File): Promise<SoifWorkbookData> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })

  const requiredSheets = ['Instructions', 'Startup Idea', 'Data Export']
  for (const name of requiredSheets) {
    if (!wb.SheetNames.includes(name)) {
      throw new Error(
        `This doesn't look like a SOIF workbook — missing the "${name}" sheet. Please upload the SOIF_Assessment_Workbook file.`
      )
    }
  }

  // ---- Instructions sheet: overall indices + per-dimension scoring summary ----
  const insRows: any[][] = XLSX.utils.sheet_to_json(wb.Sheets['Instructions'], {
    header: 1,
    defval: null,
  }) as any[][]

  const overallScoreRow = findRowIndex(insRows, (r) => r[0] === 'Overall SOIF Score (0-100)')
  const overallConfRow = findRowIndex(insRows, (r) => r[0] === 'Overall Confidence Index (0-100)')
  const overallValRow = findRowIndex(
    insRows,
    (r) => r[0] === 'Overall Validation Maturity Index (0-100)'
  )

  const overall = {
    soifScore: overallScoreRow >= 0 ? toNum(insRows[overallScoreRow][1]) : null,
    confidenceIndex: overallConfRow >= 0 ? toNum(insRows[overallConfRow][1]) : null,
    validationMaturityIndex: overallValRow >= 0 ? toNum(insRows[overallValRow][1]) : null,
  }

  const summaryHeaderRow = findRowIndex(
    insRows,
    (r) => r[0] === 'Dimension' && r[2] === 'Dimension Score (0-100)'
  )
  const dimSummaryByName = new Map<
    string,
    { weight: number; dimensionScore: number | null; confidenceIndex: number | null; validationIndex: number | null }
  >()
  if (summaryHeaderRow >= 0) {
    for (let i = summaryHeaderRow + 1; i < insRows.length; i++) {
      const row = insRows[i]
      if (!row[0] || typeof row[0] !== 'string') break
      dimSummaryByName.set(row[0], {
        weight: toNum(row[1]) ?? 0,
        dimensionScore: toNum(row[2]),
        confidenceIndex: toNum(row[3]),
        validationIndex: toNum(row[4]),
      })
    }
  }

  // ---- Startup Idea sheet ----
  const ideaSheet = wb.Sheets['Startup Idea']
  const startupIdeaNarrative = String(ideaSheet['A4']?.v ?? '').trim()

  // ---- Data Export sheet (flat, header row is row index 2 -> range: 2) ----
  const exportRows: any[] = XLSX.utils.sheet_to_json(wb.Sheets['Data Export'], {
    range: 2,
    defval: null,
  })

  const questionsByDimension = new Map<string, QuestionRow[]>()
  for (const row of exportRows) {
    const dimension = row['Dimension']
    const question = row['Question']
    if (!dimension || !question) continue
    const weight = toNum(row['Weight']) ?? 0
    const q: QuestionRow = {
      dimension,
      question,
      weight,
      score: toNum(row['Score']),
      confidence: toNum(row['Confidence']),
      validationStatus: row['Validation Status'] ?? null,
      reasonAndEvidence: row['Reason & Evidence'] ?? null,
      isCritical: Math.abs(weight - CRITICAL_WEIGHT) < 0.001,
    }
    if (!questionsByDimension.has(dimension)) questionsByDimension.set(dimension, [])
    questionsByDimension.get(dimension)!.push(q)
  }

  const dimensions: DimensionSummary[] = []
  const unansweredByDimension: Record<string, number> = {}
  let questionsAnswered = 0
  let questionsTotal = 0
  const criticalAlerts: CriticalAlert[] = []

  for (const [name, questions] of questionsByDimension.entries()) {
    const summary = dimSummaryByName.get(name)
    dimensions.push({
      name,
      weight: summary?.weight ?? 0,
      dimensionScore: summary?.dimensionScore ?? null,
      confidenceIndex: summary?.confidenceIndex ?? null,
      validationIndex: summary?.validationIndex ?? null,
      questions,
    })

    let unanswered = 0
    for (const q of questions) {
      questionsTotal += 1
      if (q.score !== null) {
        questionsAnswered += 1
      } else {
        unanswered += 1
      }
      if (q.isCritical && q.score !== null && q.score <= 2) {
        criticalAlerts.push({ dimension: name, question: q.question, score: q.score })
      }
    }
    if (unanswered > 0) unansweredByDimension[name] = unanswered
  }

  return {
    startupIdeaNarrative,
    overall,
    dimensions,
    criticalAlerts,
    completeness: {
      questionsAnswered,
      questionsTotal,
      unansweredByDimension,
    },
  }
}
