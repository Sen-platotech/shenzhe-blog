# Design Language

日期：2026-06-07

## 定位

当前博客设计语言以原 `hexo` 主题为基准复刻：第一屏是全屏背景图、站点标题、打字机欢迎语和大图标导航；内容区进入浅灰背景上的白色卡片流，文章页保留大图头图、右侧信息卡、目录和浮动工具按钮。

关键词：

- 原 Hexo 氛围
- 全屏背景图
- 原站图片资产
- 打字机欢迎语
- 轻玻璃感导航
- 卡片入场动画
- 烟花、鼠标跟随、樱花
- 中文长文阅读
- 个人博客而非营销落地页

## 参考方向

可以参考优秀个人博客里常见的“个人气质先出现，内容随后展开”的结构：

- 原 NotionNext Hexo 主题：全屏 banner、typed greeting、分类按钮、交错文章封面和右侧作者卡。
- YunYouJun / Hexo 系个人站：轻动效、标题阴影、大图开场和文章卡片滚动入场。
- Maggie Appleton：个人气质明确，但信息结构仍然清楚。
- Gwern：长文阅读、归档、目录和可检索性优先。

本项目不是继续 `simple` 极简路线，而是恢复“背景图 + 动效 + 卡片列表”的原站气质，并把内容源从 Notion 稳定迁移到 `MDX + Git`。

## 视觉规则

### 第一屏

- 首页第一视口使用 `/bg_image.jpg` 作为主视觉背景；该图已从原 Notion 配置项 `HOME_BANNER_IMAGE` 复原，对应 Notion 官方封面 `rijksmuseum_rembrandt_1642.jpg`。
- 迁移文章显式保留 `/bg_image.jpg` 作为封面，避免后续全站默认图调整时丢掉旧站气质。
- 头像继续使用 `/avatar.png`，favicon 继续使用 `/favicon.ico`。
- 标题居中叠加在图片上，使用白色文字与阴影提高可读性。
- 欢迎语使用 `typed.min.js` 打字机效果，文案来自原 Notion 配置项 `GREETING_WORDS`。
- 分类/导航按钮保持半透明玻璃感、边框和 hover 放大效果。
- 向下阅读按钮使用轻微 bounce 动画，引导进入文章列表。

### 色彩

- 主题色沿用 Hexo 默认紫蓝 `#928CEE`，可通过 `HEXO_THEME_COLOR` 覆盖。
- 内容区背景使用浅灰，卡片使用白色；深色模式切换为近黑与深灰。
- 文章正文以灰黑文本为主，强调色只用于 hover、目录高亮、引用块左边线和浮动按钮。

### 排版

- 首页标题可以使用大字号，因为它承担站点识别功能。
- 内容卡片标题保持中等字号，避免压过阅读内容。
- 文章页中文正文行高约 `1.9`，二级标题带细分隔线，三级标题用更紧凑层级。
- 引用块使用主题色左边线，不做过重背景。

### 布局

- 首页是大图 hero + 文章卡片列表 + 右侧作者/分类/最新文章卡。
- 文章列表保留 `hexo` 的封面左右交错和 AOS 入场动画。
- 文章页保留顶部文章头图、分类标签、发布时间、右侧目录和推荐文章。
- 移动端折叠侧栏，目录进入右下角浮动抽屉。

### 动效

- 主题自带动效：打字机欢迎语、文章卡片 AOS fade-up、滚动按钮 bounce、hover scale。
- 默认恢复的全局动效：点击烟花、鼠标跟随、樱花飘落。
- 保留但默认关闭的重型/场景动效：漂浮线段、彩带、星空雨。
- 所有动效均可通过 `NEXT_PUBLIC_*` 环境变量覆盖。

## 当前落地

- `blog.config.js` 默认主题恢复为 `hexo`，同时保留 `NEXT_PUBLIC_THEME` 覆盖能力。
- `HOME_BANNER_IMAGE` 默认 `/bg_image.jpg`，`AVATAR` 默认 `/avatar.png`，`BLOG_FAVICON` 默认 `/favicon.ico`。
- `/bg_image.jpg` 已替换为原 Notion 管理页启用的 `HOME_BANNER_IMAGE` 图片：`rijksmuseum_rembrandt_1642.jpg`，本地尺寸为 `1501x1222`。
- `content/posts/*.mdx` 已显式写入 `cover: "/bg_image.jpg"`，作为迁移文章的原站封面资产。
- `conf/animation.config.js` 默认开启点击烟花、鼠标跟随和樱花飘落，并修正了布尔环境变量解析，`NEXT_PUBLIC_SAKURA=false`、`0`、`off` 等配置会真实关闭对应动效。
- `public/js/sakura.js` 已修复 canvas id 与销毁函数不一致的问题，并补齐 RAF 取消与图片加载代际检查，避免重复挂载和卸载残留。
- `lib/content/site-data.js` 已保持 Hexo scroll 列表语义：首页、分类、标签和关键词搜索的滚动加载拿完整文章集合，页码模式和显式分页路由才做服务端分页。
- `pages/[prefix]/[slug]/[...suffix].js` 已接入 MDX 多级 slug，避免保留 Hexo/Notion 风格长路径时 sitemap/RSS URL 与页面路由脱节。
- `components/WebMention.js` 在普通运行时通过本域 API 代理读取 replies，静态导出时回退公开 WebMention API；服务端代理限制 target host，避免 token 被泛用。
- `lib/content/markdown.js` 统一生成 MDX 标题锚点和目录，让正文 heading 与 Hexo 目录稳定对齐。
- `lib/content/site-data.js` 为 MDX 文章补齐 `hexo` 所需的封面、标签、目录、分类/标签侧栏字段。
- `components/MdxArticle.js` 为 MDX 标题生成与 Hexo 目录兼容的锚点，并支持当前迁移内容所需的引用块、列表、代码块、链接、图片和基础行内样式。
- `themes/hexo/index.js` 在文章页对 MDX 走 `MdxArticle`，旧 Notion 内容仍可走 `NotionPage`。
- `themes/hexo/style.js` 增加 MDX 正文排版。
- `themes/hexo/components/Footer.js` 去除 NotionNext 和迁移期模板文案，仅保留站点版权、作者与备案信息。

## 后续优化

1. 根据旧站截图或线上备份校准具体动效组合、欢迎语和主题色。
2. 将迁移期 MDX renderer 替换为完整 MDX 编译管线，支持自定义组件、脚注和复杂嵌套语法。
3. 为 `/tag` 空状态、空正文文章和移动端导航做更细节的 Hexo 风格优化。
4. 增加首页、文章页、归档页、搜索页的截图回归检查。
