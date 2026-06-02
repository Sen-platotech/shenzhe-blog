import type { SiteConfig } from './schema'

/**
 * Layer 1 — compile-time static configuration.
 *
 * Pure data, no `process.env`. Edit this file (and redeploy) to change the
 * site's identity, defaults and look. Values here can be overridden at runtime
 * by environment variables (layer 2) and the Notion `Config` page (layer 3).
 */
export const staticConfig: SiteConfig = {
  title: 'Shen Zhe',
  description: '知行合一 · 研究分享 · 心情随笔',
  author: 'Shen Zhe',
  bio: '写一些关于研究、工具与生活的思考。',
  since: 2021,
  siteUrl: 'https://shenzhe.org',
  postsPerPage: 10,
  postUrlPrefix: 'article',
  // Indigo-600 in "r g b" form, consumed by CSS variables + Tailwind.
  brandColor: '79 70 229',
  defaultNav: [
    { title: '首页', href: '/' },
    { title: '分类', href: '/category' },
    { title: '标签', href: '/tag' },
    { title: '归档', href: '/archive' },
    { title: '搜索', href: '/search' },
  ],
  social: [
    { name: 'GitHub', href: 'https://github.com/sen-platotech' },
  ],
  giscus: {
    repo: '',
    repoId: '',
    category: '',
    categoryId: '',
  },
}
