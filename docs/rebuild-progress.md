# Blog Rebuild Progress

日期：2026-06-07 10:09 CST

## 当前分支

`rebuild/mdx-core`

## 当前方向

重建后的长期内容源采用 `MDX + Git`。Notion 只保留为旧内容迁移来源、可选草稿区或临时 fallback，不再作为线上渲染和构建的默认依赖。

前端设计语言已按用户确认恢复为原 `hexo` 背景图主题：全屏 banner、原 Notion 配置项 `HOME_BANNER_IMAGE` 对应的 `/bg_image.jpg` 首页主视觉、`/avatar.png` 作者头像、打字机欢迎语、玻璃感导航按钮、文章卡片入场动画、交错封面列表、文章大图头图、右侧作者卡和目录。阅读层仍保留中文长文排版优化。

## 已完成

- 建立安全基线：
  - 从 git 索引移除 `.env.production`，并将 `.env.production` 加入 `.gitignore`。
  - 删除 `blog.config.js` 中的 Notion 配置硬编码，改为从服务端环境变量读取。
  - `.env.example` 中将 Notion token 和 WebMention token 保持为 server-only 示例；Gitalk 仍按其客户端库要求使用 `NEXT_PUBLIC_`，并明确标注启用后会公开到浏览器。
  - 新增 `scripts/secret-scan.js` 与 `npm run secret:scan`。
- 建立内容源 ADR：
  - `docs/adr/0001-content-source.md`
  - 决策：`MDX + Git` 为 canonical content source。
- 建立 MDX 内容内核：
  - `content/posts/*.mdx`
  - `lib/content/schema.js`
  - `lib/content/index.js`
  - `lib/content/markdown.js`
  - `lib/content/generators.js`
  - `lib/content/responses.js`
  - `lib/content/site-data.js`
  - `scripts/validate-content.js`
  - `scripts/import-public-posts.js`
  - `scripts/generate-content-artifacts.js`
- 迁移当前公开文章：
  - `content/posts/welcome.mdx`
  - `content/posts/33b00906-2c37-817f-b80e-d177122a6681.mdx`
  - `content/posts/research-share.mdx`
  - `content/posts/essay.mdx`
- 生成迁移和内容产物：
  - `work/reports/migration/redirect-map.csv`
  - `work/reports/migration/migration-report.md`
  - `work/generated/content/rss.xml`
  - `work/generated/content/sitemap.xml`
  - `work/generated/content/search-index.json`
- 接入 MDX 内容端点：
  - `/sitemap.xml`
  - `/rss.xml`
  - `/rss/feed.xml`
  - `/search-index.json`
- 接入 MDX 页面数据：
  - 首页 `/`
  - 文章详情 `/article/[slug]`
  - 文章列表分页 `/page/[page]`
  - 归档 `/archive`
  - 分类 `/category`、`/category/[category]`
  - 标签 `/tag`、`/tag/[tag]`
  - 搜索 `/search`、`/search/[keyword]`
- 落地 hexo 原主题复刻：
  - 新增 `docs/design-language.md`。
  - 新增 `components/MdxArticle.js` 作为迁移期 MDX renderer，支持当前文章所需的标题、引用块、列表、代码块、行内加粗、行内代码、链接和图片。
  - `blog.config.js` 默认主题恢复为 `process.env.NEXT_PUBLIC_THEME || 'hexo'`。
  - `HOME_BANNER_IMAGE` 默认 `/bg_image.jpg`，`AVATAR` 默认 `/avatar.png`。
  - 从原 Notion 管理页读取到启用的 `HOME_BANNER_IMAGE=https://www.notion.so/images/page-cover/rijksmuseum_rembrandt_1642.jpg`，并将其镜像为本地 `public/bg_image.jpg`。
  - 从原 Notion 管理页读取到启用的 `GREETING_WORDS`，并恢复默认欢迎语为“Hi，我是一个政治学人, Hi，我是一个程序员,Hi，我是一个INFP人,欢迎来到这里”。
  - `content/posts/*.mdx` 显式写入 `cover: "/bg_image.jpg"`，保留迁移文章的原站封面图。
  - `conf/animation.config.js` 默认恢复点击烟花、鼠标跟随和樱花飘落；彩带、漂浮线段、星空雨保留为环境变量可选。
  - `conf/animation.config.js` 修复布尔环境变量解析，`NEXT_PUBLIC_*="false"`、`0`、`off` 不再被误判为开启。
  - `public/js/sakura.js` 修复 canvas id 与销毁函数不一致的问题，并补齐 RAF 取消与图片加载代际检查，避免重复挂载和清理残留。
  - `lib/content/markdown.js` 统一生成 MDX 标题锚点和目录，避免前端正文 heading id 与后端 `toc` 分叉。
  - `lib/content/site-data.js` 为 MDX 内容补齐 `hexo` 需要的 `pageCover`、`tagItems`、`toc`、分类/标签侧栏字段。
  - `lib/content/site-data.js` 修复滚动列表语义：`POST_LIST_STYLE=scroll` 时首页向前端传完整文章集合，只有 `page` 模式才在服务端切片。
  - `lib/content/site-data.js` 进一步修复分类、标签和关键词搜索页的滚动列表语义；显式 `/page/[page]` 路由仍强制服务端分页。
  - `pages/[prefix]/[slug]/[...suffix].js` 接入 MDX catch-all slug，支持 `/article/2026/06/foo` 这类多级路径优先走本地内容。
  - `themes/hexo/index.js` 在文章详情页对 MDX 文章走 `MdxArticle`，旧 Notion 内容仍走 `NotionPage`。
  - `themes/hexo/style.js` 增加 MDX 正文中文排版。
  - `themes/hexo/components/Footer.js` 去除模板化 `Powered by NotionNext` 与迁移期文案，仅保留站点版权、作者与备案信息。
- 保留 simple 主题迁移兼容：
  - `simple` 仍可作为可选主题使用。
  - `themes/simple/index.js` 对 MDX 文章走 `MdxArticle`，不再经过 `NotionPage`。
  - `themes/simple/style.js` 增加 MDX 正文排版、列表页、分类/标签/搜索入口的克制样式。
  - `themes/simple/components/Footer.js` 去除模板化 `Powered by NotionNext` 与迁移期文案，仅保留站点版权、作者与备案信息。
- 关闭默认旧模板路径：
  - 新增 `lib/routes/legacy.js`。
  - `ENABLE_AUTH_ROUTES`、`ENABLE_DASHBOARD_ROUTES`、`ENABLE_NOTION_FALLBACK`、`ENABLE_NOTION_STATIC_PATHS` 默认关闭。
  - `/dashboard`、`/sign-in`、`/sign-up`、`/auth/result` 和未迁移动态路径默认返回 404。
  - 构建阶段不再主动请求 Notion page paths、dashboard、sign-in、404 或 auth 数据。
- 收敛评论配置暴露面：
  - 新增 `/api/webmention/mentions`，WebMention token 改由服务端代理读取 `COMMENT_WEBMENTION_TOKEN`。
  - `/api/webmention/mentions` 限制 `target` 只能指向当前站点主机，避免服务端 token 被用作任意 URL 查询代理。
  - `components/WebMention.js` 不再把 token 拼进浏览器请求。
  - 静态导出模式下 WebMention replies 回退到不带 token 的公开 `webmention.io` API，避免纯静态部署请求本域 API 404。
  - `.env.example` 明确 Gitalk 客户端 secret 的 public 性质，避免误把它当服务端密钥。
- 新增内容层测试：
  - `jest.content.config.js`
  - `npm run test:content`
  - `__tests__/lib/content/*.test.js`
- 清理本地副本污染：
  - 删除误拷贝的 `pages/sitemap.xml 2.js`、`docs/rebuild-progress 2.md`、`tsconfig 2.tsbuildinfo`。
  - `.gitignore` 改为忽略 `*.tsbuildinfo`。

## 验证结果

已通过：

```bash
npm run test:content
npm run validate-content
npm run secret:scan
npm run type-check
npm run build
git diff --check
```

最新结果：

- `npm run test:content`: 7 个 test suites 通过，32 个 tests 通过。
- `npm run validate-content`: 4 个内容文件，4 篇公开文章，0 个标签，1 个归档年份。
- `npm run secret:scan`: 通过，未发现脚本规则覆盖的密钥模式。
- `npm run type-check`: 通过。
- `npm run build`: 通过，静态生成页数为 24，默认主题 webpack alias 指向 `themes/hexo`，构建日志中没有 Notion API 请求。
- `git diff --check`: 通过，无 trailing whitespace 或 conflict marker。
- 生成产物断言通过：
  - RSS 是 XML 且包含 4 篇公开文章。
  - sitemap 不包含 `.vercel.app` preview 域名。
  - sitemap 不包含 `http://shenzhe.org/https://` 这类 URL 拼接错误。
  - search index JSON 可解析，包含 4 篇公开文章，且包含《进步的牢笼》的正文关键词“社会达尔文主义”。
  - redirect map 保留当前 `/article/...` 公开 URL。

已做语法检查：

```bash
node -c jest.content.config.js
node -c lib/content/schema.js
node -c lib/content/index.js
node -c lib/content/generators.js
node -c lib/content/responses.js
node -c lib/content/site-data.js
node -c lib/routes/legacy.js
node -c scripts/validate-content.js
node -c scripts/secret-scan.js
node -c scripts/import-public-posts.js
node -c scripts/generate-content-artifacts.js
```

浏览器/HTTP 验证：

- 本地生产服务：`http://127.0.0.1:3002`。`3001` 上仍有一个旧服务进程，本轮未动。
- 最新构建后已重启 `3002` 生产服务；使用 Codex in-app Browser 做最终复验时，浏览器插件因 URL policy 拦截 `http://127.0.0.1:3002/`，本轮未绕过该策略继续浏览器自动化。
- 最新终端/HTTP/资产检查：
  - `/` 返回 `200 OK`。
  - `public/bg_image.jpg` 为 JPEG，尺寸 `1501x1222`，SHA-256 为 `1e0c3aa448d402bc9d29e83e4e10cd63eb258dec8c12a9db69087eff61a1d78c`。
  - `pages/api/webmention/mentions.js`、`pages/[prefix]/[slug]/[...suffix].js`、`lib/content/site-data.js`、`public/js/sakura.js` 均通过 `node -c` 语法检查。
- 下列浏览器检查为本轮早些时候对 Hexo 主题和动效的结果；最终新增的 WebMention 代理、scroll 列表语义、多级 slug 和樱花 RAF 清理由测试、构建和语法检查覆盖：
- 页面 200：
  - `/`
  - `/article/33b00906-2c37-817f-b80e-d177122a6681`
  - `/archive`
  - `/category/心情随笔`
  - `/search?s=社会达尔文主义`
  - `/sitemap.xml`
  - `/rss.xml`
  - `/search-index.json`
- 默认 404：
  - `/dashboard`
  - `/sign-in`
  - `/sign-up`
  - `/auth/result`
  - `/sitemap.xml%202`
  - `/does-not-exist`
- 首页、文章页、归档页、分类页、搜索页均返回 `hexo` 主题 HTML，且包含 `/bg_image.jpg` 背景引用。
- 首页桌面检查：
  - `#theme-hexo` 存在。
  - `header#header` 是全屏首屏，高度约 `720px`。
  - 首页首屏图片为 `/bg_image.jpg`，自然尺寸 `1501x1222`，以 `object-fit: cover` 铺满首屏。
  - 头像图片为 `/avatar.png`，自然尺寸 `528x560`。
  - 文章卡片 4 张。
  - 打字机目标存在。
  - 点击烟花 `canvas#fireworks`、鼠标跟随 `canvas#vixcityCanvas`、樱花 `canvas#canvas_sakura` 均存在并可见。
  - 无横向溢出。
  - 控制台无 error/warning。
- 文章页桌面检查：
  - 文章大图头图存在，高度约 `384px`；真实图片节点加载 `/bg_image.jpg`，自然尺寸 `1501x1222`，`#article-header-cover` 是其上方文字遮罩层。
  - 头像图片为 `/avatar.png`。
  - MDX 正文存在，行高约 `30.72px`。
  - MDX 标题生成了和 Hexo 目录兼容的锚点。
  - 右侧目录包含“社会达尔文主义”等标题；DOM 中同时存在桌面目录和移动抽屉目录，但桌面下只有一组可见。
  - 点击烟花、鼠标跟随、樱花 canvas 均存在并可见。
  - 控制台无 error/warning。
- 移动端 `390x844` 检查：
  - 首页 `#theme-hexo`、全屏背景图、4 张文章卡片、打字机目标、烟花和鼠标跟随 canvas 存在，无横向溢出。
  - 文章页正文宽度约 `339px`，首个 heading id 与目录 href 对齐，无横向溢出。

## 已知问题

- 全站 `jest.config.js` 仍经过 `next/jest` 初始化。单独执行全站 Jest 仍可能卡住；本轮使用 `jest.content.config.js` 作为内容层稳定测试入口，后续仍需单独整理全站 Jest 配置。
- `npm run lint` 仍未全绿；本轮新增/触发的 `require-await` 和 trailing whitespace 已修复，剩余主要是仓库既有债务：
  - `pages/api/cache.js` 的 `await-thenable`。
  - `lib/db/notion/*`、`lib/site/*`、`lib/utils/*.ts` 中的 TypeScript `any`/unsafe assignment 规则。
  - 多个旧组件中的 React Hook dependency warnings。
- `yarn install --frozen-lockfile` 曾失败，因为现有 `yarn.lock` 与依赖解析不一致；普通 `yarn install` 已成功并更新 `yarn.lock`。需要在提交前审查 lockfile diff。
- `.env.production` 本地文件仍可能存在，但已经忽略且不再被 git 跟踪。任何曾经暴露过的 Notion token 仍需在 Notion/Vercel 控制台轮换，仓库侧清理不能替代轮换。
- `essay` 和 `research-share` 当前公开页面没有正文块，迁移出的 MDX 正文为空；需要作者确认是否为预期或后续补写。
- `components/MdxArticle.js` 是迁移期 renderer，已覆盖当前迁移文章的基础 Markdown/MDX 表达，但还不是完整 MDX 编译/组件管线，暂不支持自定义 MDX 组件、脚注和复杂嵌套语法。
- `/tag` 当前为空，因为迁移文章暂未带标签；需要后续补充 tags 或设计更明确的空状态。
- 樱花飘落动效已恢复默认开启，并修复了卸载清理问题；后续仍需在更多设备上做性能观察，如需关闭可设置 `NEXT_PUBLIC_SAKURA=false`。
- Gitalk 的 `clientSecret` 是 Gitalk 客户端初始化参数，启用 Gitalk 时会公开到浏览器；如需真正服务端私密评论凭据，应改用 Giscus/Waline/Twikoo 或新建服务端代理方案。
- 移动端文章页的 `hexo` 侧栏当前会在正文后堆叠展示，未造成横向溢出，但后续可进一步调整移动端侧栏顺序和密度。

## 下一步

1. 按旧站截图继续校准 `hexo` 主题细节：欢迎语、主题色、动效强度和封面裁切策略。
2. 为 `essay` 与 `research-share` 做人工内容核对或补写正文。
3. 将迁移期 `MdxArticle` 替换为完整 MDX 编译/组件管线，支持自定义组件、脚注、复杂嵌套语法和 frontmatter-driven components。
4. 审查并收敛 `yarn.lock` diff，确保依赖更新只来自必要安装。
5. 清理旧 NotionNext 模板残留：SEO generator 文案、未使用主题、旧 auth/API/dashboard 代码。
6. 分批修复 lint 旧债务，先处理 `pages/api/cache.js` 和 `lib/db/notion/*`。
7. 修复或拆分全站 Jest 配置，避免 `next/jest` 初始化卡顿。
8. 增加首页、文章页、归档页、搜索页的截图回归或 Playwright 路由级测试。
