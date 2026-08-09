import { Key } from 'lucide-react'
import { DEFAULT_MODELS } from '../lib/aiProviders'
import type { Provider, ProviderConfig } from '../lib/types'

interface Props {
  config: ProviderConfig
  onChange: (config: ProviderConfig) => void
}

const PROVIDER_LABELS: Record<Provider, string> = {
  groq: 'Groq (free tier)',
  gemini: 'Google Gemini (free tier)',
}

const PROVIDER_KEY_LINKS: Record<Provider, string> = {
  groq: 'https://console.groq.com/keys',
  gemini: 'https://aistudio.google.com/apikey',
}

export default function SettingsPanel({ config, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Key size={16} className="text-ink-faint" />
        <p className="font-display text-sm font-medium">Your AI provider</p>
      </div>

      <div className="mb-3 flex gap-2">
        {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() =>
              onChange({ ...config, provider: p, model: config.model || DEFAULT_MODELS[p] })
            }
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              config.provider === p
                ? 'border-purple bg-purple-bg text-purple-text'
                : 'border-border text-ink-soft hover:border-ink-faint'
            }`}
          >
            {PROVIDER_LABELS[p]}
          </button>
        ))}
      </div>

      <label className="mb-1 block text-xs font-medium text-ink-soft">API key</label>
      <input
        type="password"
        value={config.apiKey}
        onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
        placeholder="Paste your free-tier API key"
        className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-purple"
      />
      <p className="mt-1.5 text-xs text-ink-faint">
        Stored only in your browser. Get a free key at{' '}
        <a
          href={PROVIDER_KEY_LINKS[config.provider]}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {PROVIDER_KEY_LINKS[config.provider]}
        </a>
        .
      </p>
    </div>
  )
}
