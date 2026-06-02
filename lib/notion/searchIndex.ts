import 'server-only'
import { cache } from 'react'
import { getPosts } from './getPosts'
import type { SearchDoc } from './types'

/** Lightweight client-search index (title/summary/tags/category/path). */
export const getSearchIndex = cache(async (): Promise<SearchDoc[]> => {
  const posts = await getPosts()
  return posts.map((p) => ({
    title: p.title,
    summary: p.summary,
    tags: p.tags,
    category: p.category,
    path: p.path,
    date: p.date,
  }))
})
