'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

/** Client-side mermaid renderer (mermaid is heavy and browser-only). */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
        })
        const { svg } = await mermaid.render(`mermaid-${id}`, chart)
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'mermaid error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [chart, id, resolvedTheme])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
        {chart}
      </pre>
    )
  }
  return <div ref={ref} className="my-4 flex justify-center" />
}
