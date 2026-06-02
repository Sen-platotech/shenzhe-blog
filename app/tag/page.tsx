import Link from 'next/link'
import type { Metadata } from 'next'
import { getTags } from '@/lib/notion/getPosts'

export const revalidate = 1800
export const metadata: Metadata = { title: '标签' }

export default async function TagIndex() {
  const tags = await getTags()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">标签</h1>
      {tags.length === 0 ? (
        <p className="text-zinc-500">暂无标签。</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.name}>
              <Link
                href={`/tag/${encodeURIComponent(t.name)}`}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm hover:bg-brand/10 hover:text-brand dark:bg-zinc-800"
              >
                #{t.name} <span className="text-zinc-400">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
