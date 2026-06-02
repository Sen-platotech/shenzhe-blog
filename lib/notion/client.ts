import 'server-only'
import { Client, APIResponseError } from '@notionhq/client'
import pLimit from 'p-limit'
import { env } from '@/config/env'

/**
 * Shared Notion client. Pinned to the stable 2022-06-28 API version so
 * `databases.query({ database_id })` returns pages directly (no data-source
 * indirection), which is all a single-source blog database needs.
 */
export const notion = new Client({
  auth: env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
})

export const databaseId = env.NOTION_DATABASE_ID

/** Cap concurrent Notion requests to stay under the ~3 req/s rate limit. */
export const limit = pLimit(3)

/**
 * Retry a Notion call on rate-limit / transient errors with exponential
 * backoff. Honors the `Retry-After` header when Notion provides one.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 4): Promise<T> {
  let attempt = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn()
    } catch (err) {
      const retriable =
        err instanceof APIResponseError &&
        (err.status === 429 || err.status === 502 || err.status === 503)
      if (!retriable || attempt >= retries) throw err

      const retryAfter = Number(
        (err as { headers?: { get?: (k: string) => string | null } }).headers?.get?.('retry-after'),
      )
      const delay = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(2 ** attempt * 1000, 16000)
      await new Promise((r) => setTimeout(r, delay))
      attempt++
    }
  }
}

/** Run a Notion call through both the concurrency limiter and retry wrapper. */
export function notionCall<T>(fn: () => Promise<T>): Promise<T> {
  return limit(() => withRetry(fn))
}
