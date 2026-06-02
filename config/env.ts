import 'server-only'
import { z } from 'zod'

/**
 * Layer 2 — environment variables.
 *
 * Only secrets and deployment-bound values live here. Validated once at module
 * load so a missing/invalid value fails fast instead of producing confusing
 * runtime errors. This module is server-only and must never be imported from a
 * client component (it would leak NOTION_TOKEN into the browser bundle).
 */
const EnvSchema = z.object({
  NOTION_TOKEN: z.string().min(1, 'NOTION_TOKEN is required'),
  // The blog database id. NOTION_DATA_SOURCE_ID is accepted as a legacy alias.
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
  SITE_URL: z.string().url().optional(),
})

const parsed = EnvSchema.safeParse({
  ...process.env,
  NOTION_DATABASE_ID:
    process.env.NOTION_DATABASE_ID ?? process.env.NOTION_DATA_SOURCE_ID,
})

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`Invalid environment configuration:\n${issues}`)
}

export const env = parsed.data

/** Public Giscus values are safe to read from NEXT_PUBLIC_* on the client too. */
export const envDerived = {
  siteUrl: env.SITE_URL,
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
  },
}
