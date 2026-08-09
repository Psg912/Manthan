import type { SoifWorkbookData, ParsedReport } from './types'

export const SYSTEM_PROMPT = `You are a senior startup evaluator acting as an advisor, not a decision-maker. You are analysing a completed SOIF (Startup Opportunity & Improvement Framework) assessment: a structured, evidence-based scoring of a startup idea across 10 dimensions, provided to you as JSON, plus the founder's own narrative description of the idea.

Ground rules:
- Evidence over opinion. Base every judgement on the Score, Confidence, Validation Status, and Reason & Evidence actually provided — never invent facts about the startup that weren't given to you.
- Distinguish score from confidence from validation. A high Score with low Confidence or weak Validation Status is a genuine warning sign, not a strength — call it out explicitly.
- Be direct and specific. Avoid generic startup-advice language ("focus on product-market fit," "talk to more customers") unless you tie it to a specific row in the data.
- You are advisory only. Never tell the founder what to do in absolute terms ("you must pivot") — frame recommendations as considerations and trade-offs for the founder to weigh.
- If the data is sparse (many blank or low-confidence answers), say so plainly rather than papering over gaps with generic optimism.
- Write for a founder audience: clear, professional, constructive, no hedging filler.`

const SECTION_HEADERS = [
  'Executive Summary',
  'Strengths',
  'Weaknesses',
  'Contradictions',
  'Critical Risk Alerts',
  'Recommendations',
  'Improvement Roadmap',
  'Re-scoring Potential',
  'Startup Evolution Notes',
] as const

export function buildUserPrompt(data: SoifWorkbookData): string {
  const { completeness, overall, criticalAlerts, dimensions, startupIdeaNarrative } = data

  const gapsLine =
    Object.keys(completeness.unansweredByDimension).length > 0
      ? `Gaps: ${Object.entries(completeness.unansweredByDimension)
          .map(([d, n]) => `${d} (${n} unanswered)`)
          .join(', ')}`
      : 'No gaps — every question answered.'

  const alertsBlock =
    criticalAlerts.length > 0
      ? criticalAlerts
          .map((a) => `- [${a.dimension}] "${a.question}" scored ${a.score}/5.`)
          .join('\n')
      : 'None — no Critical Question scored 2 or below.'

  const dimensionsForPrompt = dimensions.map((d) => ({
    name: d.name,
    weight: d.weight,
    dimension_score: d.dimensionScore,
    confidence_index: d.confidenceIndex,
    validation_index: d.validationIndex,
    questions: d.questions.map((q) => ({
      question: q.question,
      weight: q.weight,
      score: q.score,
      confidence: q.confidence,
      validation_status: q.validationStatus,
      reason_and_evidence: q.reasonAndEvidence,
      is_critical: q.isCritical,
    })),
  }))

  return `Here is a completed SOIF assessment. Analyse it and produce the report described below.

STARTUP IDEA (founder's own words):
${startupIdeaNarrative || '(not provided)'}

ASSESSMENT COMPLETENESS: ${completeness.questionsAnswered} of ${completeness.questionsTotal} questions answered.
${gapsLine}

OVERALL SCORES:
- SOIF Score: ${overall.soifScore ?? 'n/a'} / 100
- Confidence Index: ${overall.confidenceIndex ?? 'n/a'} / 100
- Validation Maturity Index: ${overall.validationMaturityIndex ?? 'n/a'} / 100

PRE-FLAGGED CRITICAL RISK ALERTS (Critical Questions scoring 2 or below):
${alertsBlock}

FULL DIMENSION AND QUESTION DATA (JSON):
${JSON.stringify(dimensionsForPrompt)}

---

Produce your analysis using EXACTLY these markdown section headers, in this order, and nothing outside them:

## Executive Summary
2-4 sentences: what this business is, and the single most important takeaway from this assessment — including an honest read on the overall SOIF Score relative to what "good" looks like at this stage.

## Strengths
The 3-5 strongest points in the assessment, each citing the specific dimension/question and why the evidence (not just the score) supports it.

## Weaknesses
The 3-5 weakest points, each citing the specific dimension/question. Prioritise genuine gaps in evidence over merely low scores.

## Contradictions
Specific tensions in the data itself — e.g. high Score paired with low Confidence or weak Validation Status, or two answers that don't logically sit together. If there are none of note, say so rather than inventing one.

## Critical Risk Alerts
Expand on the pre-flagged critical items above: why each matters and what it implies if unresolved. If none were flagged, confirm that explicitly.

## Recommendations
3-6 specific, prioritised considerations tied to the actual weaknesses and gaps found — not generic startup advice.

## Improvement Roadmap
A rough sequence (e.g. next 30/60/90 days) for closing the biggest evidence gaps, focused on which Validation Status upgrades (e.g. Assumption → Customer Validated) would most change the picture, and in what order.

## Re-scoring Potential
Which specific answers, if the founder gathered stronger evidence in the next round, would most move the Overall SOIF Score and Validation Maturity Index — i.e. where effort has the highest leverage.

## Startup Evolution Notes
A short note (2-3 sentences) framed for the founder's next assessment pass: what to watch for, and what would constitute meaningful progress since this one.`
}

/** Splits the model's markdown response on the 9 expected `## ` headers. Tolerant of
 *  stray text before/after, and of a model dropping a section. */
export function parseReportMarkdown(raw: string): ParsedReport {
  const result: Record<string, string> = {}
  const pattern = /##\s+(.+?)\s*\n([\s\S]*?)(?=\n##\s+|$)/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw)) !== null) {
    const header = match[1].trim()
    const body = match[2].trim()
    const known = SECTION_HEADERS.find((h) => h.toLowerCase() === header.toLowerCase())
    if (known) result[known] = body
  }

  const get = (h: (typeof SECTION_HEADERS)[number]) => result[h] ?? ''

  return {
    executiveSummary: get('Executive Summary'),
    strengths: get('Strengths'),
    weaknesses: get('Weaknesses'),
    contradictions: get('Contradictions'),
    criticalRiskAlerts: get('Critical Risk Alerts'),
    recommendations: get('Recommendations'),
    improvementRoadmap: get('Improvement Roadmap'),
    rescoringPotential: get('Re-scoring Potential'),
    startupEvolutionNotes: get('Startup Evolution Notes'),
    raw,
  }
}
