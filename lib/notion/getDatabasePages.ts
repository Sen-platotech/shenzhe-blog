import 'server-only'
import { cache } from 'react'
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'
import { notion, databaseId, notionCall } from './client'
import { env } from '@/config/env'
import { getPageType, getStatus } from './mappers'

type Sort = QueryDatabaseParameters['sorts']

/**
 * Fetch the entire blog database in one paginated pass (sorted newest-first).
 * Wrapped in React.cache so every consumer in a single render/build pass shares
 * one fetch instead of hammering the rate-limited Notion API per `type`.
 */
export const getAllPages = cache(async (): Promise<PageObjectResponse[]> => {
  const sorts: Sort = [{ property: 'date', direction: 'descending' }]
  const results: PageObjectResponse[] = []
  let cursor: string | undefined

  // No token -> serve an empty site rather than spamming failed API calls.
  if (!env.hasNotion) return results

  try {
    do {
      const res = await notionCall(() =>
        notion.databases.query({
          database_id: databaseId,
          sorts,
          page_size: 100,
          start_cursor: cursor,
        }),
      )
      for (const page of res.results) {
        if ('properties' in page) results.push(page as PageObjectResponse)
      }
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
    } while (cursor)
  } catch (err) {
    // Stay up (degraded/empty) instead of 500-ing; ISR will recover on the next
    // successful revalidation once the API/credentials are reachable.
    console.error('[getAllPages] Notion query failed:', err)
    return results
  }

  return results
})

/** Bucket every row by its `type` select in a single pass over the database. */
export const getBuckets = cache(async () => {
  const pages = await getAllPages()
  const buckets = {
    posts: [] as PageObjectResponse[],
    pages: [] as PageObjectResponse[],
    menus: [] as PageObjectResponse[],
    notices: [] as PageObjectResponse[],
    configs: [] as PageObjectResponse[],
  }
  for (const page of pages) {
    const type = getPageType(page)
    const published = getStatus(page) === 'Published'
    switch (type) {
      case 'Post':
        buckets.posts.push(page)
        break
      case 'Page':
        buckets.pages.push(page)
        break
      case 'Menu':
      case 'SubMenu':
        if (published) buckets.menus.push(page)
        break
      case 'Notice':
        if (published) buckets.notices.push(page)
        break
      case 'Config':
        buckets.configs.push(page)
        break
    }
  }
  return buckets
})
