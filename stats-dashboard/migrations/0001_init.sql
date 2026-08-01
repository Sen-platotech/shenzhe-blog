CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  referrer_path TEXT NOT NULL DEFAULT '',
  ip_hash TEXT NOT NULL,
  ip_ciphertext TEXT NOT NULL,
  ip_iv TEXT NOT NULL,
  ip_version INTEGER NOT NULL DEFAULT 4,
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  region_code TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  postal_code TEXT NOT NULL DEFAULT '',
  timezone TEXT NOT NULL DEFAULT '',
  colo TEXT NOT NULL DEFAULT '',
  asn INTEGER,
  as_organization TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT 'unknown',
  browser TEXT NOT NULL DEFAULT 'unknown',
  operating_system TEXT NOT NULL DEFAULT 'unknown',
  is_owner INTEGER NOT NULL DEFAULT 0,
  owner_label TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_visits_occurred_at ON visits(occurred_at);
CREATE INDEX IF NOT EXISTS idx_visits_path_time ON visits(path, occurred_at);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_time ON visits(visitor_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_visits_ip_hash_time ON visits(ip_hash, occurred_at);
CREATE INDEX IF NOT EXISTS idx_visits_owner_time ON visits(is_owner, occurred_at);

CREATE TABLE IF NOT EXISTS schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR REPLACE INTO schema_meta(key, value) VALUES ('schema_version', '1');
