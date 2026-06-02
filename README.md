# Shen Zhe's Blog

A self-built, **Notion-powered** personal blog on **Next.js 15 (App Router) + TypeScript + Tailwind**.
Content lives in a Notion database and is fetched through the **official Notion API**
(`@notionhq/client`); pages are rendered by a small, fully-owned block renderer and served
with **ISR**. No third-party blog template.

## Features

- 📝 Posts, static pages, categories, tags, archive
- 🔎 Client-side fuzzy search (Fuse.js) over title / summary / tags / category
- 🎨 Custom Notion block renderer: rich text, headings, lists, quotes, callouts, toggles,
  code (shiki, dual light/dark), math (KaTeX + mhchem), mermaid, images, video, embeds
  (YouTube / Bilibili), bookmarks, files, PDF, tables, columns, synced blocks …
- 🌗 Dark mode (next-themes, no flash)
- 💬 Comments via Giscus (theme-synced)
- 📡 RSS, sitemap, robots, OpenGraph + JSON-LD
- 🧩 **Notion-driven** navigation (`Menu`/`SubMenu`), site config (`Config`) and a
  dismissible announcement banner (`Notice`) — edit Notion, no redeploy
- 🖼 Image proxy that refreshes Notion's ~1h-expiring S3 URLs so images never break

## Quick start

```bash
cp .env.example .env.local   # fill in the values below
npm install
npm run dev
```

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NOTION_TOKEN` | ✅ | Internal integration secret. **Server-only — never `NEXT_PUBLIC_`.** |
| `NOTION_DATABASE_ID` | ✅ | The blog database id (32 chars from its URL). |
| `SITE_URL` | ✅ (prod) | Canonical URL, no trailing slash. Used for SEO/sitemap/RSS. |
| `NEXT_PUBLIC_GISCUS_*` | optional | From https://giscus.app — leave blank to disable comments. |

### Notion integration setup

1. Create an internal integration at https://www.notion.so/my-integrations and copy the secret
   into `NOTION_TOKEN`.
2. Open the blog database in Notion → **⋯ → Connections → Add** your integration so it can read
   the pages.
3. Put the database id into `NOTION_DATABASE_ID`.

> Rotate the old leaked token: revoke it in *My integrations*, generate a fresh secret, and set
> it only in `.env.local` / the Vercel dashboard.

> **Network policy:** the runtime must be able to reach `api.notion.com`. On Vercel this is fine;
> in a restricted sandbox, allowlist that host.

## Content model (Notion database)

One database drives everything; the `type` select decides how a row is used:

| `type` | Used as |
| --- | --- |
| `Post` | A blog article at `/article/<slug>` |
| `Page` | A standalone page at `/<slug>` (e.g. `about`) |
| `Menu` / `SubMenu` | Navigation. A `SubMenu` attaches to the most recent `Menu`; order comes from the `date` property. `slug` is the link (empty = a pure dropdown parent; `http(s)://…` = external). |
| `Notice` | First Published row renders as a dismissible top banner. |
| `Config` | Runtime site config — see below. |

`status`: `Published` (listed), `Invisible` (reachable by direct link, hidden from lists),
`Draft` (excluded everywhere).

Other properties: `title`, `slug`, `summary`, `category`, `tags`, `date`, `icon`, `password`.

### Site config from Notion (`type = Config`)

Create a row with `type = Config`, open it, and put a single **code block** containing JSON.
Only whitelisted keys are applied (anything else is ignored):

```json
{
  "title": "Shen Zhe",
  "description": "知行合一 · 研究分享 · 心情随笔",
  "bio": "写一些关于研究、工具与生活的思考。",
  "brandColor": "79 70 229",
  "postsPerPage": 10,
  "social": [{ "name": "GitHub", "href": "https://github.com/sen-platotech" }]
}
```

Config resolves in three layers (highest wins): **Notion `Config` → environment variables →
compile-time defaults** in `config/static.config.ts`.

## Project structure

```
config/        # 3-layer typed config (schema.ts / static.config.ts / env.ts / index.ts)
lib/notion/    # official-API data layer (client, fetch, mappers, url, menus, notice, config)
lib/shiki.ts   # server-side code highlighting
components/    # UI + components/notion/* block renderer
app/           # App Router routes (home, article, pages, taxonomy, search, rss, sitemap, image proxy)
```

The canonical URL for any page comes from a single function, `lib/notion/url.ts#getPostPath`,
reused by sitemap, RSS and links so paths can never drift.

> Article URLs use the `article` prefix (`config/static.config.ts → postUrlPrefix`). If you
> change the prefix, rename `app/article/` to match.

## Deploy (Vercel)

1. Import the repo, set `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `SITE_URL` (and optional Giscus vars).
2. Deploy. Content revalidates every 30 minutes (ISR); editing Notion updates the site without a
   redeploy.

## License

MIT
