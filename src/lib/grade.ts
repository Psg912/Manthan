export function gradeFor(score: number | null): { badge: string; verdict: string } {
  if (score === null) return { badge: '—', verdict: 'Not enough data scored yet.' }
  if (score >= 90) return { badge: 'A', verdict: 'Exceptional — rare at this stage.' }
  if (score >= 80) return { badge: 'A-', verdict: 'Very strong across the board.' }
  if (score >= 70) return { badge: 'B+', verdict: 'Strong, with clear upside.' }
  if (score >= 60) return { badge: 'B', verdict: 'Solid, with real gaps to close.' }
  if (score >= 50) return { badge: 'C+', verdict: 'Promising, needs real validation.' }
  if (score >= 40) return { badge: 'C', verdict: 'Early-stage, several open questions.' }
  if (score >= 30) return { badge: 'D', verdict: 'High-risk — most claims unproven.' }
  return { badge: 'F', verdict: 'Not yet investable as scored.' }
}
