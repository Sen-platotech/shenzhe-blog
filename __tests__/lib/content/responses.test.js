const {
  serveRss,
  serveSearchIndex,
  serveSitemap
} = require('@/lib/content/responses')

function captureResponse(handler) {
  const headers = {}
  let body = ''
  const res = {
    setHeader(key, value) {
      headers[key] = value
    },
    write(chunk) {
      body += chunk
    },
    end() {
      headers.ended = true
    }
  }

  handler({ res })
  return { body, headers }
}

describe('content responses', () => {
  it('serves RSS from MDX posts', () => {
    const { body, headers } = captureResponse(serveRss)

    expect(headers['Content-Type']).toContain('application/rss+xml')
    expect(body).toContain('<rss version="2.0">')
    expect(body).toContain('进步的牢笼')
    expect(body).not.toContain('\\&quot;')
  })

  it('serves sitemap without preview or concatenated URLs', () => {
    const { body, headers } = captureResponse(serveSitemap)

    expect(headers['Content-Type']).toContain('application/xml')
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(body).toContain('https://shenzhe.org/article/welcome')
    expect(body).not.toContain('.vercel.app')
    expect(body).not.toContain('http://shenzhe.org/https://')
  })

  it('serves a JSON search index from MDX posts', () => {
    const { body, headers } = captureResponse(serveSearchIndex)
    const index = JSON.parse(body)

    expect(headers['Content-Type']).toContain('application/json')
    expect(index).toHaveLength(4)
    expect(index).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: '进步的牢笼',
          content: expect.stringContaining('社会达尔文主义')
        })
      ])
    )
  })
})
