import { describe, expect, it } from 'vitest'
import {
  normalizeLabel,
  parseDays,
  parseUserAgent,
  parseVisitEvent
} from './validation'

describe('collector validation', () => {
  it('normalizes a valid page view', () => {
    expect(
      parseVisitEvent({
        visitorId: 'v_1234567890',
        sessionId: 's_1234567890',
        path: '/article/example?source=home',
        title: 'Example',
        referrer: 'https://shenzhe.org/'
      })
    ).toMatchObject({ path: '/article/example', title: 'Example' })
  })

  it('rejects unsafe identifiers', () => {
    expect(
      parseVisitEvent({
        visitorId: '<script>',
        sessionId: 'short',
        path: '/',
        title: ''
      })
    ).toBeNull()
  })

  it('detects bots and supported periods', () => {
    expect(parseUserAgent('Googlebot/2.1').deviceType).toBe('bot')
    expect(parseDays('7')).toBe(7)
    expect(parseDays('365')).toBe(30)
    expect(normalizeLabel(' 我的 MacBook ')).toBe('我的 MacBook')
  })
})
