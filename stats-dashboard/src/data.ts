import { decryptValue } from './crypto'
import type { DashboardPeriod, DashboardRow } from './types'

type RecentVisit = DashboardRow & {
  ip_ciphertext: string
  ip_iv: string
  visitor_id: string
  owner_label: string
  is_owner: number
}

type TrendRow = { date: string; pageviews: number; visits?: number }

const HISTORY_AVAILABLE_FROM = '2026-04-07'
const FINE_GRAINED_FROM = '2026-08-01T09:37:45.166Z'

function periodStart(period: DashboardPeriod): string {
  if (period === 'all') return '1970-01-01T00:00:00.000Z'
  return new Date(Date.now() - period * 86_400_000).toISOString()
}

function detailWhere(excludeOwner: boolean): string {
  return `occurred_at >= ?${excludeOwner ? ' AND is_owner = 0' : ''}`
}

function rollupWhere(excludeOwner: boolean): string {
  return `date >= ?${excludeOwner ? ' AND is_owner = 0' : ''}`
}

function numeric(row: DashboardRow | undefined, key: string): number {
  return Number(row?.[key] || 0)
}

export function mergeTrendRows(...groups: TrendRow[][]): TrendRow[] {
  const merged = new Map<string, TrendRow>()
  for (const group of groups) {
    for (const row of group) {
      const current = merged.get(row.date) || {
        date: row.date,
        pageviews: 0,
        visits: 0
      }
      current.pageviews += Number(row.pageviews || 0)
      current.visits = Number(current.visits || 0) + Number(row.visits || 0)
      merged.set(row.date, current)
    }
  }
  return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export async function getDashboardData(
  db: D1Database,
  period: DashboardPeriod,
  excludeOwner: boolean,
  encryptionSecret: string
): Promise<object> {
  const start = periodStart(period)
  const startDate = start.slice(0, 10)
  const detailFilter = detailWhere(excludeOwner)
  const rollupFilter = rollupWhere(excludeOwner)
  const results = await db.batch<DashboardRow>([
    db.prepare(
      `SELECT COALESCE(SUM(pageviews), 0) AS pageviews,
          COALESCE(SUM(visits), 0) AS visits,
          CASE WHEN ? = 'all' THEN
            COALESCE((SELECT SUM(pageviews) FROM historical_articles), 0)
          ELSE 0 END AS articleViews
       FROM historical_daily WHERE date >= ?`
    ).bind(period, startDate),
    db.prepare(
      `SELECT COALESCE(SUM(pageviews), 0) AS pageviews,
          COALESCE(SUM(visits), 0) AS visits,
          COALESCE(SUM(visitors), 0) AS visitors,
          COALESCE(SUM(article_views), 0) AS articleViews
       FROM daily_rollups WHERE ${rollupFilter}`
    ).bind(startDate),
    db.prepare(
      `SELECT COUNT(*) AS pageviews,
          COUNT(DISTINCT session_id) AS visits,
          COUNT(DISTINCT visitor_id) AS visitors,
          SUM(CASE WHEN path LIKE '/article/%' THEN 1 ELSE 0 END) AS articleViews
       FROM visits WHERE ${detailFilter}`
    ).bind(start),
    db.prepare(
      `SELECT date, pageviews, visits FROM historical_daily
       WHERE date >= ? ORDER BY date ASC`
    ).bind(startDate),
    db.prepare(
      `SELECT date, SUM(pageviews) AS pageviews, SUM(visits) AS visits
       FROM daily_rollups WHERE ${rollupFilter}
       GROUP BY date ORDER BY date ASC`
    ).bind(startDate),
    db.prepare(
      `SELECT strftime('%Y-%m-%d', occurred_at) AS date,
          COUNT(*) AS pageviews, COUNT(DISTINCT session_id) AS visits
       FROM visits WHERE ${detailFilter}
       GROUP BY date ORDER BY date ASC`
    ).bind(start),
    db.prepare(
      `SELECT path, MAX(title) AS title, SUM(pageviews) AS pageviews,
          SUM(visitors) AS visitors
       FROM (
         SELECT path, title, pageviews, 0 AS visitors
         FROM historical_articles WHERE ? = 'all'
         UNION ALL
         SELECT path, MAX(title) AS title, SUM(pageviews) AS pageviews,
           SUM(visitors) AS visitors
         FROM article_rollups WHERE ${rollupFilter}
         GROUP BY path
         UNION ALL
         SELECT path, MAX(title) AS title, COUNT(*) AS pageviews,
           COUNT(DISTINCT visitor_id) AS visitors
         FROM visits WHERE ${detailFilter} AND path LIKE '/article/%'
         GROUP BY path
       )
       GROUP BY path ORDER BY pageviews DESC, title ASC LIMIT 12`
    ).bind(period, startDate, start),
    db.prepare(
      `SELECT country, region, region_code, city, COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_id) AS visitors
       FROM visits WHERE ${detailFilter}
       GROUP BY country, region, region_code, city
       ORDER BY pageviews DESC LIMIT 16`
    ).bind(start),
    db.prepare(
      `SELECT device_type || ' · ' || browser AS label, COUNT(*) AS pageviews
       FROM visits WHERE ${detailFilter}
       GROUP BY device_type, browser ORDER BY pageviews DESC LIMIT 8`
    ).bind(start),
    db.prepare(
      `SELECT CASE WHEN referrer_host = '' THEN '直接/应用内' ELSE referrer_host END AS label,
          COUNT(*) AS pageviews
       FROM visits WHERE ${detailFilter}
       GROUP BY referrer_host ORDER BY pageviews DESC LIMIT 8`
    ).bind(start),
    db.prepare(
      `SELECT occurred_at, visitor_id, path, title, referrer_host,
          ip_ciphertext, ip_iv, country, region, region_code, city,
          device_type, browser, operating_system, asn, as_organization,
          is_owner, owner_label
       FROM visits WHERE ${detailFilter}
       ORDER BY occurred_at DESC LIMIT 100`
    ).bind(start)
  ])

  const [historicalTotals, rollupTotals, detailTotals] = results
    .slice(0, 3)
    .map(result => (result?.results?.[0] || {}) as DashboardRow)
  const trend = mergeTrendRows(
    (results[3]?.results || []) as TrendRow[],
    (results[4]?.results || []) as TrendRow[],
    (results[5]?.results || []) as TrendRow[]
  )
  const recentRows = (results[10]?.results || []) as RecentVisit[]
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

  const historicalPageviews = numeric(historicalTotals, 'pageviews')
  const historicalVisits = numeric(historicalTotals, 'visits')
  return {
    generatedAt: new Date().toISOString(),
    period,
    excludeOwner,
    coverage: {
      historicalAvailableFrom: HISTORY_AVAILABLE_FROM,
      fineGrainedFrom: FINE_GRAINED_FROM,
      historicalPageviews,
      historicalVisits,
      historicalIsSampled: true,
      historicalOwnerFilterAvailable: false
    },
    totals: {
      pageviews:
        historicalPageviews +
        numeric(rollupTotals, 'pageviews') +
        numeric(detailTotals, 'pageviews'),
      visits:
        historicalVisits +
        numeric(rollupTotals, 'visits') +
        numeric(detailTotals, 'visits'),
      visitors:
        numeric(rollupTotals, 'visitors') + numeric(detailTotals, 'visitors'),
      articleViews:
        numeric(historicalTotals, 'articleViews') +
        numeric(rollupTotals, 'articleViews') +
        numeric(detailTotals, 'articleViews')
    },
    trend,
    articles: (results[6]?.results || []).map((row: DashboardRow) => ({
      ...row,
      label: String(row.title || row.path || '')
    })),
    locations: results[7]?.results || [],
    devices: results[8]?.results || [],
    referrers: results[9]?.results || [],
    recent: recentWithIp
  }
}
