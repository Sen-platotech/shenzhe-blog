import Link from 'next/link'
import type { Metadata } from 'next'
import { getCategories } from '@/lib/notion/getPosts'

export const revalidate = 1800
export const metadata: Metadata = { title: '分类' }

export default async function CategoryIndex() {
  const categories = await getCategories()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">分类</h1>
      {categories.length === 0 ? (
        <p className="text-zinc-500">暂无分类。</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <li key={c.name}>
              <Link
                href={`/category/${encodeURIComponent(c.name)}`}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm hover:border-brand hover:text-brand dark:border-zinc-700"
              >
                {c.name} <span className="text-zinc-400">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
