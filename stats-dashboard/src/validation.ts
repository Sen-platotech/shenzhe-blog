import type { NormalizedClient, VisitEvent } from './types'

const MAX_PATH_LENGTH = 512
const MAX_TITLE_LENGTH = 240
const MAX_REFERRER_LENGTH = 1024
const SAFE_ID = /^[a-zA-Z0-9_-]{8,96}$/

function asShortString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.slice(0, maxLength) : ''
}

export function parseVisitEvent(value: unknown): VisitEvent | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const visitorId = asShortString(input.visitorId, 96)
  const sessionId = asShortString(input.sessionId, 96)
  const rawPath = asShortString(input.path, MAX_PATH_LENGTH)
  if (!SAFE_ID.test(visitorId) || !SAFE_ID.test(sessionId)) return null

  let path: string
  try {
    const url = new URL(rawPath, 'https://shenzhe.org')
    path = url.pathname.slice(0, MAX_PATH_LENGTH)
  } catch {
    return null
  }
  if (!path.startsWith('/')) return null

  return {
    visitorId,
    sessionId,
    path,
    title: asShortString(input.title, MAX_TITLE_LENGTH),
    referrer: asShortString(input.referrer, MAX_REFERRER_LENGTH)
  }
}

export function parseUserAgent(userAgent: string): NormalizedClient {
  const ua = userAgent.toLowerCase()
  const isBot =
    /bot|crawler|spider|headless|lighthouse|preview|facebookexternalhit/.test(
      ua
    )
  if (isBot) {
    return { deviceType: 'bot', browser: 'Bot', operatingSystem: 'Unknown' }
  }

  const deviceType: NormalizedClient['deviceType'] = /ipad|tablet/.test(ua)
    ? 'tablet'
    : /android|iphone|ipod|mobile/.test(ua)
      ? 'mobile'
      : userAgent
        ? 'desktop'
        : 'unknown'

  const browser = /edg\//.test(ua)
    ? 'Edge'
    : /firefox\//.test(ua)
      ? 'Firefox'
      : /crios\//.test(ua)
        ? 'Chrome Mobile'
        : /chrome\//.test(ua)
          ? 'Chrome'
          : /safari\//.test(ua)
            ? 'Safari'
            : 'Unknown'

  const operatingSystem = /windows/.test(ua)
    ? 'Windows'
    : /iphone|ipad|ipod/.test(ua)
      ? 'iOS'
      : /android/.test(ua)
        ? 'Android'
        : /mac os x|macintosh/.test(ua)
          ? 'macOS'
          : /linux/.test(ua)
            ? 'Linux'
            : 'Unknown'

  return { deviceType, browser, operatingSystem }
}

export function parseDays(value: string | null): number {
  const days = Number.parseInt(value || '30', 10)
  return [1, 7, 30].includes(days) ? days : 30
}

export function normalizeLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const label = value.trim().slice(0, 40)
  return label.length >= 2 ? label : null
}
