// Stateless CDN metadata forwarding. All analytics, login and storage run on VPS.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = new URL(request.url)
    origin.hostname = 'shenzhe.org'
    const metadata = {
      at: Date.now(), method: request.method, path: url.pathname,
      ip: request.headers.get('cf-connecting-ip') || '0.0.0.0',
      cf: {
        country: request.cf?.country || '', city: request.cf?.city || '',
        region: request.cf?.region || '', regionCode: request.cf?.regionCode || '',
        postalCode: request.cf?.postalCode || '', timezone: request.cf?.timezone || '',
        colo: request.cf?.colo || '', asn: request.cf?.asn || null,
        asOrganization: request.cf?.asOrganization || '',
      }
    }
    const bytes = new TextEncoder().encode(JSON.stringify(metadata))
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    const encoded = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.IP_HASH_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('vps-geo:' + encoded)))
    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.set('x-shenzhe-target', 'stats')
    headers.set('x-shenzhe-geo', encoded)
    headers.set('x-shenzhe-geo-signature', [...signature].map(x => x.toString(16).padStart(2, '0')).join(''))
    const forwarded = new Request(origin, request)
    forwarded.headers.delete('host')
    for (const [name, value] of headers) forwarded.headers.set(name, value)
    const response = await fetch(forwarded, {
      redirect: 'manual',
      cf: { cacheEverything: false, cacheTtlByStatus: { '100-599': -1 } }
    })
    return response
  }
}
