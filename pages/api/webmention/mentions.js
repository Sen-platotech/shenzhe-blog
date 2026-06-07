const BLOG = require('../../../blog.config')

function allowedHosts() {
  return [
    process.env.NEXT_PUBLIC_WEBMENTION_HOSTNAME,
    BLOG.LINK
  ]
    .filter(Boolean)
    .map(value => {
      try {
        return new URL(value).hostname
      } catch {
        return String(value).replace(/^https?:\/\//, '').split('/')[0]
      }
    })
    .filter(Boolean)
}

function sendJson(res, status, payload) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(payload))
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const target = Array.isArray(req.query.target)
    ? req.query.target[0]
    : req.query.target

  if (!target) {
    res.status(400).json({ error: 'Missing target' })
    return
  }

  let targetUrl
  try {
    targetUrl = new URL(target)
  } catch {
    res.status(400).json({ error: 'Invalid target' })
    return
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    res.status(400).json({ error: 'Invalid target protocol' })
    return
  }

  const hosts = allowedHosts()
  if (hosts.length > 0 && !hosts.includes(targetUrl.hostname)) {
    res.status(403).json({ error: 'Target host is not allowed' })
    return
  }

  const apiUrl = new URL('https://webmention.io/api/mentions.jf2')
  apiUrl.searchParams.set('per-page', '500')
  apiUrl.searchParams.set('target', targetUrl.toString())

  const token = process.env.COMMENT_WEBMENTION_TOKEN
  if (token) {
    apiUrl.searchParams.set('token', token)
  }

  try {
    const response = await fetch(apiUrl)
    const contentType = response.headers?.get?.('content-type') || ''
    const body = await response.text()

    if (!response.ok) {
      sendJson(res, response.status, { error: 'WebMention upstream error', children: [] })
      return
    }

    if (!contentType.includes('application/json') && !contentType.includes('application/jf2')) {
      sendJson(res, 502, { error: 'WebMention upstream returned non-JSON', children: [] })
      return
    }

    try {
      JSON.parse(body)
    } catch {
      sendJson(res, 502, { error: 'WebMention upstream returned invalid JSON', children: [] })
      return
    }

    res.status(response.status)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(body)
  } catch (error) {
    res.status(502).json({ error: 'Failed to fetch WebMention replies' })
  }
}

module.exports = handler
module.exports.default = handler
