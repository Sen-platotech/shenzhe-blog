import Link from 'next/link'
import type { Metadata } from 'next'
import { getPosts } from '@/lib/notion/getPosts'
import { formatDate } from '@/lib/utils'

export const revalidate = 1800
export const metadata: Metadata = { title: '归档' }

export default async function ArchivePage() {
  const posts = await getPosts()
  const byYear = new Map<string, typeof posts>()
  for (const p of posts) {
    const year = p.date ? new Date(p.date).getFullYear().toString() : '未知'
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(p)
  }
  const years = [...byYear.keys()].sort((a, b) => b.localeCompare(a))

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">归档</h1>
      <p className="mb-8 text-sm text-zinc-500">共 {posts.length} 篇文章</p>
      {years.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-500">{year}</h2>
          <ul className="space-y-2">
            {byYear.get(year)!.map((p) => (
              <li key={p.id} className="flex items-baseline gap-3">
                <span className="w-24 shrink-0 text-sm text-zinc-400">{formatDate(p.date)}</span>
                <Link href={p.path} className="hover:text-brand">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
