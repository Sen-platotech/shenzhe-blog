'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
}

/** Giscus (GitHub Discussions) comments with dark-mode sync. */
export function Comments({ config }: { config: GiscusConfig }) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    if (!config.repo || !ref.current) return
    if (ref.current.querySelector('iframe.giscus-frame')) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', config.repo)
    script.setAttribute('data-repo-id', config.repoId)
    script.setAttribute('data-category', config.category)
    script.setAttribute('data-category-id', config.categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', giscusTheme)
    script.setAttribute('data-lang', 'zh-CN')
    ref.current.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.repo, config.repoId, config.category, config.categoryId])

  // Sync theme to an already-loaded giscus frame.
  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    frame?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app',
    )
  }, [giscusTheme])

  if (!config.repo) return null
  return <div ref={ref} className="mt-12" />
}
