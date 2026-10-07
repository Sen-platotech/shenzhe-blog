const {
  generateRedirectMap,
  generateSearchIndex,
  generateSitemap
} = require('@/lib/content/generators')

const posts = [
  {
    title: '欢迎来到我的博客',
    slug: 'article/welcome',
    description: '记录学习与成长的点滴',
    date: '2026-05-04',
    updated: '2026-05-04',
    category: '知行合一',
    tags: [],
    body: '## 主旨内容\n\n正文内容',
    canonicalUrl: 'https://shenzhe.org/article/welcome',
    legacy: {
      oldUrl: 'https://shenzhe.org/article/welcome'
    }
  }
]

describe('content generators', () => {
  it('generates sitemap without preview domains', () => {
    const sitemap = generateSitemap(posts)
    expect(sitemap).toContain('<loc>https://shenzhe.org/article/welcome</loc>')
    expect(sitemap).not.toContain('.vercel.app')
  })

  it('generates a compact search index', () => {
    const index = generateSearchIndex(posts)
    expect(index).toEqual([
      expect.objectContaining({
        title: '欢迎来到我的博客',
        slug: 'article/welcome',
        content: expect.stringContaining('正文内容')
      })
    ])
  })

  it('generates a redirect map preserving current URLs', () => {
    const csv = generateRedirectMap(posts)
    expect(csv).toContain('old_url,new_url,status,notes')
    expect(csv).toContain(
      'https://shenzhe.org/article/welcome,https://shenzhe.org/article/welcome,keep'
    )
  })
})
