'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Dismissible announcement banner. The content is server-rendered (Notion
 * blocks) and passed in as children; this client wrapper only handles dismiss
 * state, persisted per-notice in localStorage.
 */
export function NoticeBar({ id, children }: { id: string; children: ReactNode }) {
  const key = `notice-dismissed-${id}`
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(key) !== '1')
  }, [key])

  if (!visible) return null

  return (
    <div className="border-b border-brand/20 bg-brand/5">
      <div className="mx-auto flex max-w-3xl items-start gap-3 px-4 py-2 text-sm">
        <div className="min-w-0 flex-1 [&_p]:my-0">{children}</div>
        <button
          type="button"
          aria-label="关闭公告"
          onClick={() => {
            localStorage.setItem(key, '1')
            setVisible(false)
          }}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
