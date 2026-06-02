import { staticConfig } from '@/config/static.config'

/**
 * Single source of truth for how a page maps to a URL path. Sitemap, RSS,
 * post cards and redirects all go through here so the canonical path can never
 * drift between them (the main maintainability problem in the old site).
 */
export function getPostPath(input: { slug: string; type: 'Post' | 'Page' }): string {
  const slug = input.slug.replace(/^\/+/, '')
  if (input.type === 'Page') return `/${slug}`
  const prefix = staticConfig.postUrlPrefix.replace(/^\/+|\/+$/g, '')
  return prefix ? `/${prefix}/${slug}` : `/${slug}`
}

/** Absolute URL for SEO / RSS. */
export function absoluteUrl(path: string): string {
  const base = staticConfig.siteUrl.replace(/\/+$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
