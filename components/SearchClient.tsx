'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { formatDate } from '@/lib/utils'
import type { SearchDoc } from '@/lib/notion/types'

export function SearchClient({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'summary', weight: 0.25 },
          { name: 'tags', weight: 0.1 },
          { name: 'category', weight: 0.05 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [docs],
  )

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return fuse.search(q).map((r) => r.item)
  }, [query, fuse])

  return (
    <div>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章标题、摘要、标签…"
        className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-3 outline-none transition focus:border-brand dark:border-zinc-700"
      />

      <div className="mt-6">
        {query.trim() === '' ? (
          <p className="text-sm text-zinc-500">输入关键字开始搜索。</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-zinc-500">没有找到匹配「{query}」的文章。</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {results.map((doc) => (
              <li key={doc.path} className="py-4">
                <Link href={doc.path} className="font-medium hover:text-brand">
                  {doc.title}
                </Link>
                <div className="mt-1 text-xs text-zinc-500">{formatDate(doc.date)}</div>
                {doc.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{doc.summary}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
