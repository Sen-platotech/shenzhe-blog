import type { MetadataRoute } from 'next'
import { staticConfig } from '@/config/static.config'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.SITE_URL ?? staticConfig.siteUrl).replace(/\/+$/, '')
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
