'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav className="text-sm">
      <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">目录</p>
      <ul className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-700">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem` }}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l border-transparent transition hover:text-brand',
                active === item.id
                  ? 'border-brand font-medium text-brand'
                  : 'text-zinc-500',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
