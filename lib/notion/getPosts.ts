import 'server-only'
import { cache } from 'react'
import { getBuckets } from './getDatabasePages'
import { mapPageToPost } from './mappers'
import { getBlocksTree } from './getBlocksTree'
import type { PostMeta, BlockNode } from './types'

/** Published posts for listing (newest first; excludes Invisible/Draft). */
export const getPosts = cache(async (): Promise<PostMeta[]> => {
  const { posts } = await getBuckets()
  return posts.map(mapPageToPost).filter((p) => p.status === 'Published')
})

/** Posts reachable by direct link (Published + Invisible) — for static params. */
export const getLinkablePosts = cache(async (): Promise<PostMeta[]> => {
  const { posts } = await getBuckets()
  return posts
    .map(mapPageToPost)
    .filter((p) => p.status === 'Published' || p.status === 'Invisible')
})

/** Static single pages (type=Page), reachable by direct link. */
export const getStaticPages = cache(async (): Promise<PostMeta[]> => {
  const { pages } = await getBuckets()
  return pages
    .map(mapPageToPost)
    .filter((p) => p.status === 'Published' || p.status === 'Invisible')
})

export const getPostBySlug = cache(
  async (slug: string): Promise<{ meta: PostMeta; blocks: BlockNode[] } | null> => {
    const meta = (await getLinkablePosts()).find((p) => p.slug === slug)
    if (!meta) return null
    const blocks = await getBlocksTree(meta.id)
    return { meta, blocks }
  },
)

export const getPageBySlug = cache(
  async (slug: string): Promise<{ meta: PostMeta; blocks: BlockNode[] } | null> => {
    const meta = (await getStaticPages()).find((p) => p.slug === slug)
    if (!meta) return null
    const blocks = await getBlocksTree(meta.id)
    return { meta, blocks }
  },
)

export interface TermCount {
  name: string
  count: number
}

export const getCategories = cache(async (): Promise<TermCount[]> => {
  const posts = await getPosts()
  const map = new Map<string, number>()
  for (const p of posts) {
    if (p.category) map.set(p.category, (map.get(p.category) ?? 0) + 1)
  }
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})

export const getTags = cache(async (): Promise<TermCount[]> => {
  const posts = await getPosts()
  const map = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1)
  }
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})

export const getPostsByCategory = cache(async (category: string): Promise<PostMeta[]> => {
  return (await getPosts()).filter((p) => p.category === category)
})

export const getPostsByTag = cache(async (tag: string): Promise<PostMeta[]> => {
  return (await getPosts()).filter((p) => p.tags.includes(tag))
})
