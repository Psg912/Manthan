interface Props {
  text: string
}

export default function LiteMarkdown({ text }: Props) {
  if (!text) return <p className="text-sm text-ink-faint">Not provided.</p>

  const blocks = text.split(/\n\s*\n/)

  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l))
        if (isList) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^[-*]\s+/, '')}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{block.trim()}</p>
      })}
    </div>
  )
}
