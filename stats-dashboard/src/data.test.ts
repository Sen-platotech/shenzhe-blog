import { describe, expect, it } from 'vitest'
import { mergeTrendRows } from './data'

describe('mergeTrendRows', () => {
  it('merges historical, rolled-up, and detailed counts on the same date', () => {
    expect(
      mergeTrendRows(
        [{ date: '2026-07-31', pageviews: 5, visits: 4 }],
        [{ date: '2026-08-01', pageviews: 2, visits: 1 }],
        [
          { date: '2026-08-01', pageviews: 3, visits: 2 },
          { date: '2026-08-02', pageviews: 1, visits: 1 }
        ]
      )
    ).toEqual([
      { date: '2026-07-31', pageviews: 5, visits: 4 },
      { date: '2026-08-01', pageviews: 5, visits: 3 },
      { date: '2026-08-02', pageviews: 1, visits: 1 }
    ])
  })
})
