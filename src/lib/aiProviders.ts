import type { ProviderConfig } from './types'
import { SYSTEM_PROMPT } from './promptTemplate'

// Default model names — provider free-tier lineups change fairly often.
// These are editable in Settings; treat them as sensible starting points, not gospel.
export const DEFAULT_MODELS: Record<ProviderConfig['provider'], string> = {
  groq: 'llama-3.3-70b-versatile',
  gemini: 'gemini-2.5-flash',
}

export async function callAI(config: ProviderConfig, userPrompt: string): Promise<string> {
  if (config.provider === 'groq') return callGroq(config, userPrompt)
  return callGemini(config, userPrompt)
}

async function callGroq(config: ProviderConfig, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODELS.groq,
      temperature: 0.35,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  })
  if (!res.ok) {
    const detail = await safeErrorText(res)
    throw new Error(`Groq request failed (${res.status}). ${detail}`)
  }
  const json = await res.json()
  const text = json?.choices?.[0]?.message?.content
  if (!text) throw new Error('Groq returned an empty response.')
  return text
}

async function callGemini(config: ProviderConfig, userPrompt: string): Promise<string> {
  const model = config.model || DEFAULT_MODELS.gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    config.apiKey
  )}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.35 },
    }),
  })
  if (!res.ok) {
    const detail = await safeErrorText(res)
    throw new Error(`Gemini request failed (${res.status}). ${detail}`)
  }
  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('')
  if (!text) throw new Error('Gemini returned an empty response.')
  return text
}

async function safeErrorText(res: Response): Promise<string> {
  try {
    const body = await res.json()
    return body?.error?.message || JSON.stringify(body)
  } catch {
    return res.statusText
  }
}
