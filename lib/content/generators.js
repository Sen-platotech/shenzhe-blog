const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_LINK || 'https://shenzhe.org'

function siteUrl() {
  return SITE_URL.replace(/\/$/, '')
}

function absoluteUrl(slug = '') {
  const path = String(slug).startsWith('/') ? slug : `/${slug}`
  return `${siteUrl()}${path}`
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripMarkdown(value) {
  return String(value || '')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function generateSitemap(posts, extraPaths = ['/', '/archive', '/category', '/tag', '/search']) {
  const urls = [
    ...extraPaths.map(path => ({
      loc: `${siteUrl()}${path === '/' ? '' : path}`,
      lastmod: new Date().toISOString().slice(0, 10)
    })),
    ...posts.map(post => ({
      loc: post.canonicalUrl || absoluteUrl(post.slug),
      lastmod: post.updated || post.date
    }))
  ]

  const uniqueUrls = Array.from(new Map(urls.map(url => [url.loc, url])).values())

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`
}

function generateSearchIndex(posts) {
  return posts.map(post => ({
    title: post.title,
    slug: post.slug,
    url: post.canonicalUrl || absoluteUrl(post.slug),
    description: post.description,
    date: post.date,
    updated: post.updated || post.date,
    category: post.category,
    series: post.series || null,
    tags: post.tags || [],
    content: stripMarkdown(post.body)
  }))
}

function generateRedirectMap(posts) {
  const rows = ['old_url,new_url,status,notes']
  for (const post of posts) {
    const oldUrl = post.legacy?.oldUrl || post.canonicalUrl || absoluteUrl(post.slug)
    const newUrl = post.canonicalUrl || absoluteUrl(post.slug)
    rows.push(`${oldUrl},${newUrl},keep,Preserve current public URL`)
  }
  return `${rows.join('\n')}\n`
}

module.exports = {
  absoluteUrl,
  escapeXml,
  generateRedirectMap,
  generateSearchIndex,
  generateSitemap,
  stripMarkdown
}
