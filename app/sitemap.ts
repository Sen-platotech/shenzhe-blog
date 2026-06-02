import type { MetadataRoute } from 'next'
import { getPosts, getStaticPages, getCategories, getTags } from '@/lib/notion/getPosts'
import { getSiteConfig } from '@/config'
import { absoluteUrl } from '@/lib/notion/url'

export const revalidate = 1800

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, posts, pages, categories, tags] = await Promise.all([
    getSiteConfig(),
    getPosts(),
    getStaticPages(),
    getCategories(),
    getTags(),
  ])

  const staticRoutes = ['/', '/category', '/tag', '/archive', '/search'].map((p) => ({
    url: absoluteUrl(p),
    lastModified: new Date(),
  }))

  const postRoutes = posts.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.date ? new Date(p.date) : new Date(),
  }))

  const pageRoutes = pages
    .filter((p) => p.status === 'Published')
    .map((p) => ({ url: absoluteUrl(p.path), lastModified: new Date() }))

  const taxonomyRoutes = [
    ...categories.map((c) => absoluteUrl(`/category/${encodeURIComponent(c.name)}`)),
    ...tags.map((t) => absoluteUrl(`/tag/${encodeURIComponent(t.name)}`)),
  ].map((url) => ({ url, lastModified: new Date() }))

  void config
  return [...staticRoutes, ...postRoutes, ...pageRoutes, ...taxonomyRoutes]
}
