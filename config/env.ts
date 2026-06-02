import 'server-only'

/**
 * Layer 2 — environment variables (secrets / deployment-bound values).
 *
 * Server-only: never import from a client component (would leak NOTION_TOKEN).
 *
 * This module intentionally does NOT throw when values are missing. Instead the
 * data layer degrades to an empty (but live) site, and ISR fills content in once
 * the token is present. Missing values are surfaced as a build warning.
 */

// The blog database id is not secret; default to the known id so only the token
// must be configured. Accept the common alias names too.
const KNOWN_DATABASE_ID = '2f7009062c378165bd1dc6120f6a2b44'

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const v of values) if (v && v.trim()) return v.trim()
  return ''
}

const NOTION_TOKEN = firstNonEmpty(
  process.env.NOTION_TOKEN,
  process.env.NOTION_ACCESS_TOKEN,
  process.env.NOTION_API_KEY,
  process.env.NOTION_SECRET,
)

const NOTION_DATABASE_ID = firstNonEmpty(
  process.env.NOTION_DATABASE_ID,
  process.env.NOTION_DATA_SOURCE_ID,
  process.env.NOTION_PAGE_ID,
  process.env.NEXT_PUBLIC_NOTION_PAGE_ID,
  KNOWN_DATABASE_ID,
)

if (!NOTION_TOKEN) {
  console.warn(
    '[config/env] NOTION_TOKEN is not set — the site will build and run but show no Notion content until it is configured.',
  )
}

export const env = {
  NOTION_TOKEN,
  NOTION_DATABASE_ID,
  /** True when a Notion token is available; used to skip pointless API calls. */
  hasNotion: Boolean(NOTION_TOKEN),
}

export const envDerived = {
  siteUrl: firstNonEmpty(process.env.SITE_URL, process.env.NEXT_PUBLIC_SITE_URL) || undefined,
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
  },
}
