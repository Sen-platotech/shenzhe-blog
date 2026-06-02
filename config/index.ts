import 'server-only'
import { staticConfig } from './static.config'
import { envDerived } from './env'
import { SiteConfigSchema, type SiteConfig } from './schema'
import { getNotionConfig } from '@/lib/notion/getNotionConfig'

/**
 * Layer merge — Notion runtime > environment > compile-time static.
 *
 * Higher layers override lower ones with a flat spread (no deep merge, which is
 * unpredictable). The merged object is validated so the rest of the app can
 * rely on a fully-typed, valid `SiteConfig`.
 */
let cached: SiteConfig | null = null

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cached) return cached

  const notionOverrides = await getNotionConfig()

  const merged: SiteConfig = {
    ...staticConfig,
    // env layer only contributes a few keys
    ...(envDerived.siteUrl ? { siteUrl: envDerived.siteUrl } : {}),
    giscus: envDerived.giscus.repo ? envDerived.giscus : staticConfig.giscus,
    // notion layer (whitelisted) wins last
    ...notionOverrides,
  }

  cached = SiteConfigSchema.parse(merged)
  return cached
}

export type { SiteConfig } from './schema'
