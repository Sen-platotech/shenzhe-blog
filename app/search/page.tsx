import type { Metadata } from 'next'
import { SearchClient } from '@/components/SearchClient'
import { getSearchIndex } from '@/lib/notion/searchIndex'

export const revalidate = 1800
export const metadata: Metadata = { title: '搜索' }

export default async function SearchPage() {
  const docs = await getSearchIndex()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">搜索</h1>
      <SearchClient docs={docs} />
    </div>
  )
}
