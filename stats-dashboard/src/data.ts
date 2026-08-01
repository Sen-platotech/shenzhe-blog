import { decryptValue } from './crypto'
import type { DashboardRow } from './types'

type RecentVisit = DashboardRow & {
  ip_ciphertext: string
  ip_iv: string
  visitor_id: string
  owner_label: string
  is_owner: number
}

function whereClause(excludeOwner: boolean): string {
  return `julianday(occurred_at) >= julianday('now', ?)${excludeOwner ? ' AND is_owner = 0' : ''}`
}

function modifier(days: number): string {
  return `-${days} days`
}

export async function getDashboardData(
  db: D1Database,
  days: number,
  excludeOwner: boolean,
  encryptionSecret: string
): Promise<object> {
  const where = whereClause(excludeOwner)
  const period = modifier(days)
  const results = await db.batch<DashboardRow>([
    db
      .prepare(
        `SELECT COUNT(*) AS pageviews,
            COUNT(DISTINCT session_id) AS visits,
            COUNT(DISTINCT visitor_id) AS visitors,
            SUM(CASE WHEN path LIKE '/article/%' THEN 1 ELSE 0 END) AS articleViews
           FROM visits WHERE ${where}`
      )
      .bind(period),
    db
      .prepare(
        `SELECT strftime('%Y-%m-%d', occurred_at) AS date, COUNT(*) AS pageviews
           FROM visits WHERE ${where}
           GROUP BY date ORDER BY date ASC`
      )
      .bind(period),
    db
      .prepare(
        `SELECT path, MAX(title) AS title, COUNT(*) AS pageviews,
            COUNT(DISTINCT visitor_id) AS visitors
           FROM visits WHERE ${where} AND path LIKE '/article/%'
           GROUP BY path ORDER BY pageviews DESC LIMIT 12`
      )
      .bind(period),
    db
      .prepare(
        `SELECT country, region, region_code, city, COUNT(*) AS pageviews,
            COUNT(DISTINCT visitor_id) AS visitors
           FROM visits WHERE ${where}
           GROUP BY country, region, region_code, city
           ORDER BY pageviews DESC LIMIT 16`
      )
      .bind(period),
    db
      .prepare(
        `SELECT device_type || ' · ' || browser AS label, COUNT(*) AS pageviews
           FROM visits WHERE ${where}
           GROUP BY device_type, browser ORDER BY pageviews DESC LIMIT 8`
      )
      .bind(period),
    db
      .prepare(
        `SELECT CASE WHEN referrer_host = '' THEN '直接/应用内' ELSE referrer_host END AS label,
            COUNT(*) AS pageviews
           FROM visits WHERE ${where}
           GROUP BY referrer_host ORDER BY pageviews DESC LIMIT 8`
      )
      .bind(period),
    db
      .prepare(
        `SELECT occurred_at, visitor_id, path, title, referrer_host,
            ip_ciphertext, ip_iv, country, region, region_code, city,
            device_type, browser, operating_system, asn, as_organization,
            is_owner, owner_label
           FROM visits WHERE ${where}
           ORDER BY occurred_at DESC LIMIT 100`
      )
      .bind(period)
  ])
  const totals = results[0]!
  const trend = results[1]!
  const articles = results[2]!
  const locations = results[3]!
  const devices = results[4]!
  const referrers = results[5]!
  const recent = results[6]!

  const recentRows = (recent.results || []) as RecentVisit[]
  const recentWithIp = await Promise.all(
    recentRows.map(async row => ({
      ...row,
      ip: await decryptValue(
        { ciphertext: row.ip_ciphertext, iv: row.ip_iv },
        encryptionSecret
      ),
      visitor_label: `访客 ${row.visitor_id.slice(0, 8)}`,
      ip_ciphertext: undefined,
      ip_iv: undefined
    }))
  )

  const totalRow = (totals.results?.[0] || {}) as DashboardRow
  return {
    generatedAt: new Date().toISOString(),
    days,
    excludeOwner,
    totals: {
      pageviews: Number(totalRow.pageviews || 0),
      visits: Number(totalRow.visits || 0),
      visitors: Number(totalRow.visitors || 0),
      articleViews: Number(totalRow.articleViews || 0)
    },
    trend: trend.results || [],
    articles: (articles.results || []).map((row: DashboardRow) => ({
      ...row,
      label: String(row.title || row.path || '')
    })),
    locations: locations.results || [],
    devices: devices.results || [],
    referrers: referrers.results || [],
    recent: recentWithIp
  }
}
