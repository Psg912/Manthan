export const GRADE_SCALE: { badge: string; range: string; label: string; min: number }[] = [
  { badge: 'A', range: '90–100', label: 'Exceptional', min: 90 },
  { badge: 'A-', range: '80–89', label: 'Very strong', min: 80 },
  { badge: 'B+', range: '70–79', label: 'Strong', min: 70 },
  { badge: 'B', range: '60–69', label: 'Solid', min: 60 },
  { badge: 'C+', range: '50–59', label: 'Promising', min: 50 },
  { badge: 'C', range: '40–49', label: 'Early-stage', min: 40 },
  { badge: 'D', range: '30–39', label: 'High-risk', min: 30 },
  { badge: 'F', range: '0–29', label: 'Not yet investable', min: 0 },
]

export function gradeFor(score: number | null): { badge: string; verdict: string } {
  if (score === null) return { badge: '—', verdict: 'Not enough data scored yet.' }
  const verdicts: Record<string, string> = {
    A: 'Exceptional — rare at this stage.',
    'A-': 'Very strong across the board.',
    'B+': 'Strong, with clear upside.',
    B: 'Solid, with real gaps to close.',
    'C+': 'Promising, needs real validation.',
    C: 'Early-stage, several open questions.',
    D: 'High-risk — most claims unproven.',
    F: 'Not yet investable as scored.',
  }
  const grade = GRADE_SCALE.find((g) => score >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1]
  return { badge: grade.badge, verdict: verdicts[grade.badge] }
}
