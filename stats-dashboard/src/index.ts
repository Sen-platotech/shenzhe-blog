import { DASHBOARD_HTML, PRIVACY_HTML } from './dashboard'
import {
  encryptValue,
  hashIdentifier,
  secureSecretEqual,
  signPayload,
  verifyPayload
} from './crypto'
import { getDashboardData } from './data'
import type { OwnerIdentity, SessionIdentity } from './types'
import {
  normalizeLabel,
  parsePeriod,
  parseUserAgent,
  parseVisitEvent
} from './validation'

const SESSION_COOKIE = 'stats_session'
const OWNER_COOKIE = 'sz_owner'

function json(data: object, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

function html(body: string): Response {
  return new Response(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy':
        "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY'
    }
  })
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get('cookie') || ''
  for (const part of cookies.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return value.join('=')
  }
  return undefined
}

function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || '0.0.0.0'
}

function ipVersion(ip: string): number {
  return ip.includes(':') ? 6 : 4
}

function corsHeaders(env: Env): Headers {
  const headers = new Headers()
  headers.set('access-control-allow-origin', env.ALLOWED_ORIGIN)
  headers.set('access-control-allow-credentials', 'true')
  headers.set('access-control-allow-methods', 'POST, OPTIONS')
  headers.set('access-control-allow-headers', 'content-type')
  headers.set('vary', 'Origin')
  return headers
}

function collectionResponse(env: Env, status = 204): Response {
  return new Response(null, { status, headers: corsHeaders(env) })
}

async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > 4096) throw new Error('payload-too-large')
  const text = await request.text()
  if (text.length > 4096) throw new Error('payload-too-large')
  return JSON.parse(text)
}

async function authenticated(request: Request, env: Env): Promise<boolean> {
  const identity = await verifyPayload<SessionIdentity>(
    getCookie(request, SESSION_COOKIE),
    env.SESSION_SECRET
  )
  return Boolean(identity?.authenticated && identity.expiresAt > Date.now())
}

async function ownerIdentity(
  request: Request,
  env: Env
): Promise<OwnerIdentity | null> {
  return verifyPayload<OwnerIdentity>(
    getCookie(request, OWNER_COOKIE),
    env.OWNER_SECRET
  )
}

async function handleCollect(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const origin = request.headers.get('origin')
  if (origin !== env.ALLOWED_ORIGIN) return collectionResponse(env, 403)

  let input: unknown
  try {
    input = await readJson(request)
  } catch {
    return collectionResponse(env, 400)
  }
  const event = parseVisitEvent(input)
  if (!event) return collectionResponse(env, 422)

  const userAgent = (request.headers.get('user-agent') || '').slice(0, 512)
  const client = parseUserAgent(userAgent)
  if (client.deviceType === 'bot') return collectionResponse(env)

  const ip = clientIp(request)
  const [ipHash, encryptedIp, owner] = await Promise.all([
    hashIdentifier(ip, env.IP_HASH_SECRET),
    encryptValue(ip, env.IP_ENCRYPTION_SECRET),
    ownerIdentity(request, env)
  ])

  const recentRate = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM visits WHERE ip_hash = ? AND occurred_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 minute')"
  )
    .bind(ipHash)
    .first<{ count: number }>()
  if (Number(recentRate?.count || 0) >= 60) return collectionResponse(env, 429)

  let referrerHost = ''
  let referrerPath = ''
  if (event.referrer) {
    try {
      const referrer = new URL(event.referrer)
      referrerHost = referrer.hostname.slice(0, 255)
      referrerPath = referrer.pathname.slice(0, 512)
    } catch {
      referrerHost = ''
    }
  }

  const cf = request.cf
  const insert = env.DB.prepare(
    `INSERT INTO visits (
      visitor_id, session_id, path, title, referrer_host, referrer_path,
      ip_hash, ip_ciphertext, ip_iv, ip_version, country, region, region_code,
      city, postal_code, timezone, colo, asn, as_organization, user_agent,
      device_type, browser, operating_system, is_owner, owner_label
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    event.visitorId,
    event.sessionId,
    event.path,
    event.title,
    referrerHost,
    referrerPath,
    ipHash,
    encryptedIp.ciphertext,
    encryptedIp.iv,
    ipVersion(ip),
    cf?.country || '',
    cf?.region || '',
    cf?.regionCode || '',
    cf?.city || '',
    cf?.postalCode || '',
    cf?.timezone || '',
    cf?.colo || '',
    cf?.asn || null,
    cf?.asOrganization || '',
    userAgent,
    client.deviceType,
    client.browser,
    client.operatingSystem,
    owner ? 1 : 0,
    owner?.label || ''
  )
  ctx.waitUntil(
    insert.run().then(() => {
      console.log(
        JSON.stringify({
          message: 'visit-recorded',
          path: event.path,
          country: cf?.country || '',
          owner: Boolean(owner)
        })
      )
    })
  )
  return collectionResponse(env)
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  let body: unknown
  try {
    body = await readJson(request)
  } catch {
    return json({ error: '请求格式无效' }, { status: 400 })
  }
  const password =
    body &&
    typeof body === 'object' &&
    typeof (body as Record<string, unknown>).password === 'string'
      ? String((body as Record<string, unknown>).password).slice(0, 256)
      : ''
  const loginIpHash = await hashIdentifier(
    clientIp(request),
    env.IP_HASH_SECRET
  )
  const attempts = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM login_attempts WHERE ip_hash = ? AND julianday(occurred_at) >= julianday('now', '-15 minutes')"
  )
    .bind(loginIpHash)
    .first<{ count: number }>()
  if (Number(attempts?.count || 0) >= 10) {
    return json({ error: '尝试次数过多，请稍后再试' }, { status: 429 })
  }
  if (!(await secureSecretEqual(password, env.ADMIN_PASSWORD))) {
    await env.DB.prepare('INSERT INTO login_attempts (ip_hash) VALUES (?)')
      .bind(loginIpHash)
      .run()
    return json({ error: '密码错误' }, { status: 401 })
  }
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip_hash = ?')
    .bind(loginIpHash)
    .run()

  const now = Date.now()
  const token = await signPayload(
    {
      authenticated: true,
      issuedAt: now,
      expiresAt: now + 12 * 60 * 60 * 1000
    },
    env.SESSION_SECRET
  )
  return json(
    { ok: true },
    {
      headers: {
        'set-cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`
      }
    }
  )
}

async function handleOwnerDevice(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown
  try {
    body = await readJson(request)
  } catch {
    return json({ error: '请求格式无效' }, { status: 400 })
  }
  const label = normalizeLabel(
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).label
      : null
  )
  if (!label)
    return json({ error: '设备标签至少需要 2 个字符' }, { status: 422 })

  const ipHash = await hashIdentifier(clientIp(request), env.IP_HASH_SECRET)
  const result = await env.DB.prepare(
    "UPDATE visits SET is_owner = 1, owner_label = ? WHERE ip_hash = ? AND julianday(occurred_at) >= julianday('now', '-30 days')"
  )
    .bind(label, ipHash)
    .run()
  const token = await signPayload(
    { label, issuedAt: Date.now() },
    env.OWNER_SECRET
  )
  return json(
    { ok: true, updated: result.meta.changes || 0 },
    {
      headers: {
        'set-cookie': `${OWNER_COOKIE}=${token}; Domain=.shenzhe.org; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
      }
    }
  )
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  if (url.pathname === '/api/login' && request.method === 'POST')
    return handleLogin(request, env)
  if (!(await authenticated(request, env)))
    return json({ error: '请先登录' }, { status: 401 })
  if (url.pathname === '/api/logout' && request.method === 'POST') {
    return json(
      { ok: true },
      {
        headers: {
          'set-cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
        }
      }
    )
  }
  if (url.pathname === '/api/owner-device' && request.method === 'POST')
    return handleOwnerDevice(request, env)
  if (url.pathname === '/api/dashboard' && request.method === 'GET') {
    const period = parsePeriod(url.searchParams.get('days'))
    const excludeOwner = url.searchParams.get('excludeOwner') !== '0'
    return json(
      await getDashboardData(
        env.DB,
        period,
        excludeOwner,
        env.IP_ENCRYPTION_SECRET
      )
    )
  }
  return json({ error: '未找到接口' }, { status: 404 })
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/event' && request.method === 'OPTIONS')
        return collectionResponse(env)
      if (url.pathname === '/api/event' && request.method === 'POST')
        return handleCollect(request, env, ctx)
      if (url.pathname.startsWith('/api/')) return handleApi(request, env)
      if (url.pathname === '/health')
        return json({ ok: true, service: 'shenzhe-stats' })
      if (url.pathname === '/privacy') return html(PRIVACY_HTML)
      if (url.pathname === '/' || url.pathname === '/index.html')
        return html(DASHBOARD_HTML)
      return new Response('未找到页面', { status: 404 })
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'request-failed',
          method: request.method,
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error)
        })
      )
      return url.pathname.startsWith('/api/')
        ? json({ error: '服务暂时不可用' }, { status: 500 })
        : new Response('服务暂时不可用', { status: 500 })
    }
  },

  async scheduled(_controller, env, ctx): Promise<void> {
    const retentionDays = Math.min(
      90,
      Math.max(7, Number.parseInt(env.RETENTION_DAYS, 10) || 30)
    )
    const cutoff = `-${retentionDays} days`
    ctx.waitUntil(
      env.DB.batch([
        env.DB.prepare(
          `INSERT INTO daily_rollups (
             date, is_owner, pageviews, visits, visitors, article_views, rolled_up_at
           )
           SELECT strftime('%Y-%m-%d', occurred_at), is_owner, COUNT(*),
             COUNT(DISTINCT session_id), COUNT(DISTINCT visitor_id),
             SUM(CASE WHEN path LIKE '/article/%' THEN 1 ELSE 0 END),
             strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
           FROM visits
           WHERE date(occurred_at) < date('now', ?)
           GROUP BY strftime('%Y-%m-%d', occurred_at), is_owner
           ON CONFLICT(date, is_owner) DO UPDATE SET
             pageviews = excluded.pageviews,
             visits = excluded.visits,
             visitors = excluded.visitors,
             article_views = excluded.article_views,
             rolled_up_at = excluded.rolled_up_at`
        ).bind(cutoff),
        env.DB.prepare(
          "DELETE FROM visits WHERE date(occurred_at) < date('now', ?)"
        ).bind(cutoff),
        env.DB.prepare(
          "DELETE FROM login_attempts WHERE julianday(occurred_at) < julianday('now', '-1 day')"
        )
      ]).then((results) => {
        console.log(
          JSON.stringify({
            message: 'retention-prune',
            rollupRowsChanged: results[0]?.meta.changes || 0,
            visitsDeleted: results[1]?.meta.changes || 0,
            loginAttemptsDeleted: results[2]?.meta.changes || 0
          })
        )
      })
    )
  }
} satisfies ExportedHandler<Env>
