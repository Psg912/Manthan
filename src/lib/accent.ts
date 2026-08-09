import {
  TrendingUp,
  Users,
  Swords,
  Receipt,
  ArrowUpRight,
  ListChecks,
  UserCheck,
  AlertTriangle,
  Rocket,
  Leaf,
  type LucideIcon,
} from 'lucide-react'

export type AccentKey = 'blue' | 'coral' | 'purple' | 'teal' | 'pink' | 'amber' | 'green'

export interface DimensionVisual {
  accent: AccentKey
  icon: LucideIcon
}

export const DIMENSION_VISUALS: Record<string, DimensionVisual> = {
  'Market Opportunity': { accent: 'blue', icon: TrendingUp },
  'Customer Problem': { accent: 'coral', icon: Users },
  'Competitive Advantage': { accent: 'purple', icon: Swords },
  'Business Model & Economics': { accent: 'teal', icon: Receipt },
  Scalability: { accent: 'pink', icon: ArrowUpRight },
  'Execution Feasibility': { accent: 'blue', icon: ListChecks },
  'Founder Fit': { accent: 'purple', icon: UserCheck },
  Risk: { accent: 'amber', icon: AlertTriangle },
  'Market Momentum': { accent: 'green', icon: Rocket },
  'Sustainability & Impact': { accent: 'teal', icon: Leaf },
}

export function visualFor(dimensionName: string): DimensionVisual {
  return DIMENSION_VISUALS[dimensionName] ?? { accent: 'blue', icon: TrendingUp }
}

export const ACCENT_CLASSES: Record<AccentKey, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-bg', text: 'text-blue-text', ring: 'stroke-blue' },
  coral: { bg: 'bg-coral-bg', text: 'text-coral-text', ring: 'stroke-coral' },
  purple: { bg: 'bg-purple-bg', text: 'text-purple-text', ring: 'stroke-purple' },
  teal: { bg: 'bg-teal-bg', text: 'text-teal-text', ring: 'stroke-teal' },
  pink: { bg: 'bg-pink-bg', text: 'text-pink-text', ring: 'stroke-pink' },
  amber: { bg: 'bg-amber-bg', text: 'text-amber-text', ring: 'stroke-amber' },
  green: { bg: 'bg-green-bg', text: 'text-green-text', ring: 'stroke-green' },
}
