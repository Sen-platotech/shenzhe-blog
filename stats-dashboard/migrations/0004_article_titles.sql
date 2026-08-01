CREATE TABLE IF NOT EXISTS historical_articles (
  path TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  pageviews INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'cloudflare_web_analytics',
  imported_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS article_rollups (
  date TEXT NOT NULL,
  is_owner INTEGER NOT NULL DEFAULT 0,
  path TEXT NOT NULL,
  title TEXT NOT NULL,
  pageviews INTEGER NOT NULL,
  visitors INTEGER NOT NULL,
  rolled_up_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (date, is_owner, path)
);

INSERT OR REPLACE INTO historical_articles(path, title, pageviews) VALUES
  ('/article/research-share', '研究分享', 20),
  ('/article/essay', '心情随笔', 10),
  ('/article/vulgar-theory-as-cowardice', '庸俗的使用理论是一种怯懦', 10),
  ('/article/fox-spirit-cult-social-history', '狐仙、贫家破屋与官印：一部被妖魅保存的民间史', 10),
  ('/article/artificial-intelligence-and-computational-politics', '【杂谈】人工智能与计算政治学', 10),
  ('/article/build-an-ai-proof-knowledge-base', '建造一个不会被 AI 替代的知识库', 10),
  ('/article/doctoraldairy-20260730', '读博日记（20260730）', 10);

INSERT OR REPLACE INTO schema_meta(key, value) VALUES
  ('schema_version', '4'),
  ('historical_article_pageviews', '80'),
  ('historical_article_count', '7');
