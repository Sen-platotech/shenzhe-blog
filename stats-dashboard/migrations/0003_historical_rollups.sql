CREATE TABLE IF NOT EXISTS historical_daily (
  date TEXT PRIMARY KEY,
  pageviews INTEGER NOT NULL,
  visits INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'cloudflare_web_analytics',
  imported_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS daily_rollups (
  date TEXT NOT NULL,
  is_owner INTEGER NOT NULL DEFAULT 0,
  pageviews INTEGER NOT NULL,
  visits INTEGER NOT NULL,
  visitors INTEGER NOT NULL,
  article_views INTEGER NOT NULL,
  rolled_up_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (date, is_owner)
);

INSERT OR REPLACE INTO historical_daily(date, pageviews, visits) VALUES
  ('2026-04-07', 60, 40),
  ('2026-04-08', 10, 0),
  ('2026-06-06', 20, 20),
  ('2026-06-08', 10, 10),
  ('2026-06-09', 10, 10),
  ('2026-06-17', 10, 0),
  ('2026-06-18', 10, 10),
  ('2026-07-02', 30, 0),
  ('2026-07-10', 10, 10),
  ('2026-07-12', 30, 10),
  ('2026-07-13', 10, 0),
  ('2026-07-26', 10, 10),
  ('2026-07-27', 10, 10),
  ('2026-07-29', 1, 1),
  ('2026-07-30', 20, 17),
  ('2026-07-31', 5, 4);

INSERT OR REPLACE INTO schema_meta(key, value) VALUES
  ('schema_version', '3'),
  ('historical_available_from', '2026-04-07'),
  ('fine_grained_from', '2026-08-01T09:37:45.166Z'),
  ('historical_source', 'cloudflare_web_analytics_adaptive_groups');
