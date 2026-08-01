import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

const ENDPOINT =
  process.env.NEXT_PUBLIC_STATS_ENDPOINT ||
  'https://stats.shenzhe.org/api/event'

function randomId(prefix) {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return `${prefix}_${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`
}

function storedId(storage, key, prefix) {
  try {
    let value = storage.getItem(key)
    if (!value) {
      value = randomId(prefix)
      storage.setItem(key, value)
    }
    return value
  } catch {
    return randomId(prefix)
  }
}

function sendPageView(path) {
  if (
    !path ||
    navigator.doNotTrack === '1' ||
    navigator.globalPrivacyControl === true ||
    navigator.webdriver === true
  ) {
    return
  }

  let pathname = '/'
  try {
    pathname = new URL(path, window.location.origin).pathname
  } catch {}

  const payload = {
    visitorId: storedId(localStorage, 'sz_stats_visitor', 'v'),
    sessionId: storedId(sessionStorage, 'sz_stats_session', 's'),
    path: pathname.slice(0, 512),
    title: document.title.slice(0, 255),
    referrer: document.referrer.slice(0, 1024)
  }

  fetch(ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    keepalive: true,
    headers: { 'content-type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload)
  }).catch(() => {})
}

export default function StatsTracker() {
  const router = useRouter()
  const lastPath = useRef('')

  useEffect(() => {
    const track = path => {
      const normalized =
        path || `${window.location.pathname}${window.location.search}`
      if (normalized === lastPath.current) return
      lastPath.current = normalized
      window.setTimeout(() => sendPageView(normalized), 0)
    }

    if (router.isReady) track(router.asPath)
    router.events.on('routeChangeComplete', track)
    return () => router.events.off('routeChangeComplete', track)
  }, [router.asPath, router.isReady, router.events])

  return null
}
