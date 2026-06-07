const handler = require('@/pages/api/webmention/mentions').default

function createResponse() {
  return {
    body: null,
    headers: {},
    statusCode: null,
    json(payload) {
      this.body = payload
      return this
    },
    send(payload) {
      this.body = payload
      return this
    },
    setHeader(key, value) {
      this.headers[key] = value
      return this
    },
    status(code) {
      this.statusCode = code
      return this
    }
  }
}

describe('/api/webmention/mentions', () => {
  const originalFetch = global.fetch
  const originalHostname = process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME
  const originalToken = process.env.COMMENT_WEBMENTION_TOKEN

  afterEach(() => {
    global.fetch = originalFetch
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = originalHostname
    process.env.COMMENT_WEBMENTION_TOKEN = originalToken
  })

  it('rejects targets outside the configured site host', async () => {
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = 'shenzhe.org'
    const res = createResponse()

    await handler({
      method: 'GET',
      query: { target: 'https://example.com/article/welcome' }
    }, res)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ error: 'Target host is not allowed' })
  })

  it('forwards allowed targets with the server-only token', async () => {
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = 'shenzhe.org'
    process.env.COMMENT_WEBMENTION_TOKEN = 'server-token'
    const res = createResponse()
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      text: () => Promise.resolve('{"children":[]}')
    })

    await handler({
      method: 'GET',
      query: { target: 'https://shenzhe.org/article/welcome' }
    }, res)

    const requestedUrl = new URL(global.fetch.mock.calls[0][0])
    expect(requestedUrl.hostname).toBe('webmention.io')
    expect(requestedUrl.searchParams.get('target')).toBe('https://shenzhe.org/article/welcome')
    expect(requestedUrl.searchParams.get('token')).toBe('server-token')
    expect(res.statusCode).toBe(200)
    expect(res.body).toBe('{"children":[]}')
  })

  it('omits token when no server token is configured', async () => {
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = 'shenzhe.org'
    delete process.env.COMMENT_WEBMENTION_TOKEN
    const res = createResponse()
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      text: () => Promise.resolve('{"children":[]}')
    })

    await handler({
      method: 'GET',
      query: { target: 'https://shenzhe.org/article/welcome' }
    }, res)

    const requestedUrl = new URL(global.fetch.mock.calls[0][0])
    expect(requestedUrl.searchParams.has('token')).toBe(false)
  })

  it('returns structured JSON when the upstream response is not JSON', async () => {
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = 'shenzhe.org'
    const res = createResponse()
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: {
        get: () => 'text/html'
      },
      text: () => Promise.resolve('<html>rate limited</html>')
    })

    await handler({
      method: 'GET',
      query: { target: 'https://shenzhe.org/article/welcome' }
    }, res)

    expect(res.statusCode).toBe(502)
    expect(JSON.parse(res.body)).toEqual({
      error: 'WebMention upstream returned non-JSON',
      children: []
    })
  })

  it('returns empty children for upstream errors', async () => {
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME = 'shenzhe.org'
    const res = createResponse()
    global.fetch = jest.fn().mockResolvedValue({
      status: 429,
      ok: false,
      headers: {
        get: () => 'application/json'
      },
      text: () => Promise.resolve('{"error":"rate limited"}')
    })

    await handler({
      method: 'GET',
      query: { target: 'https://shenzhe.org/article/welcome' }
    }, res)

    expect(res.statusCode).toBe(429)
    expect(JSON.parse(res.body)).toEqual({
      error: 'WebMention upstream error',
      children: []
    })
  })
})
