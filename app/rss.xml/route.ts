import { getPosts } from '@/lib/notion/getPosts'
import { getSiteConfig } from '@/config'
import { absoluteUrl } from '@/lib/notion/url'

export const revalidate = 1800

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const [config, posts] = await Promise.all([getSiteConfig(), getPosts()])

  const items = posts
    .slice(0, 30)
    .map((p) => {
      const url = absoluteUrl(p.path)
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${p.date ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ''}
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ''}
      <description>${escapeXml(p.summary)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${config.siteUrl}</link>
    <description>${escapeXml(config.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  })
}
