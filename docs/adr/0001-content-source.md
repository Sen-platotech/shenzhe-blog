# ADR 0001: Canonical Content Source

日期：2026-06-06

## 状态

Accepted for rebuild work.

## 背景

当前博客基于 NotionNext 模板，线上页面直接依赖 Notion 数据结构、模板主题系统和大量运行时配置。这个模式适合快速启动，但不适合长期重建：内容、路由、SEO、搜索、前端主题和部署配置耦合过深，任何大规模改版都会继续受模板边界影响。

项目目标是把博客重建为可长期维护、可测试、可迁移、可由 agent 协作的个人博客系统。

## 决策

长期 canonical content source 采用 `MDX + Git`。

Notion 的角色调整为：

- 旧内容迁移来源。
- 可选草稿区。
- 可选导入 adapter。

线上页面不得直接依赖 Notion API 作为唯一渲染路径。页面层只调用 content service，content service 可以有多个 adapter，但生产发布内容以 MDX 文件和 Git 历史为准。

## 影响

需要新增：

- `content/posts`
- `content/pages`
- `public/images/posts`
- `lib/content/schema.ts`
- `lib/content/index.ts`
- `scripts/validate-content.ts`

内容构建必须支持：

- frontmatter schema 校验。
- slug 唯一性校验。
- draft 过滤。
- RSS 生成。
- sitemap 生成。
- 静态搜索索引。
- 旧 URL 映射。

## 取舍

收益：

- 内容可 diff、review、版本管理。
- 构建不依赖 Notion API 可用性。
- SEO、RSS、sitemap、搜索索引可测试。
- agent 可以安全批量处理文章和元数据。

成本：

- 需要迁移现有 Notion 内容。
- 作者如果继续在 Notion 写草稿，需要导入流程。
- 复杂 Notion block 需要人工校对或专门 adapter。

## 备选方案

继续 NotionNext：

- 短期改动少。
- 但模板耦合和密钥风险继续存在，不符合重建目标。

自建 Notion-powered Next.js：

- 可减少模板依赖。
- 但线上仍依赖 Notion，不满足内容资产 Git 化目标。

完整 CMS：

- 编辑体验更强。
- MVP 复杂度过高，暂不采用。

## 后续任务

1. 建立 MDX schema 和内容读取。
2. 迁移当前 4 篇公开文章作为样本。
3. 生成 redirect map，首轮保留 `/article/...` URL。
4. 用新内容服务驱动首页、文章页、归档、标签、搜索和 RSS/sitemap。
