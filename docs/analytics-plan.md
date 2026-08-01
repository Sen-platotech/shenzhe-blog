# 博客流量分析基线与看板方案

更新日期：2026-08-01

## 运维约束

- GitHub 是博客的唯一发布与运维入口：`Sen-platotech/shenzhe-blog` / `main`。
- 统计接入和后续修改必须通过 GitHub 仓库及其发布链路完成。
- 不将 Vercel 作为当前管理平面，不查询、不修改 Vercel 项目。

## 当前检查结果

- 代码已预留 Google Analytics 4、Umami、不蒜子等统计能力的接入点；Cloudflare Web Analytics 未写入仓库代码，而是由 Cloudflare 对代理站点自动安装。
- 2026-08-01 通过 Cloudflare 插件只读核验：`shenzhe.org` Zone 为 active，Web Analytics 创建于 2026-01-08，`auto_install` 和统计规则均为启用状态。
- 公开 HTML 中未直接看到 beacon，但 Cloudflare 账户内的权威配置已确认自动统计有效；Cloudflare 看板在 2026-08-01 显示过去 24 小时为 11 次页面浏览、10 次访问。
- GraphQL Web Analytics 数据集当前最长可查约 26 周 2 天，单次查询时间窗不能超过约 13 周 2 天。这些限制以 2026-08-01 实际 API 返回为准。

## 2026-08-01 首次量化盘点

口径：2026-01-30 至 2026-08-01，排除 Cloudflare 标记的 bot，并强制 `requestHost = shenzhe.org`。GraphQL 使用 Adaptive Groups 数据集，低流量细分值会抽样/估算且可能显示为 10 的倍数，因此下列数值仅用于趋势判断，不视为精确计数。

- 主域名估算总量：260 pageviews，160 visits；2026 年 7 月估算为 130 pageviews，70 visits。
- 首页 `/`：约 120 pageviews，占主域名页面浏览的约 46%。
- 文章页合计：约 80 pageviews，占约 31%。当前排名最高的文章路径为 `/article/research-share`（约 20）；其余已识别文章在该抽样粒度下多为约 10。
- 地区：中国大陆约 130 pageviews（50%），美国约 110（42%），日本和中国台湾各约 10。
- 设备：桌面端约 150 pageviews（58%），移动端约 110（42%）。
- 来源：空引荐域（直接访问、应用内浏览器或隐藏 referrer）约 150；站内跳转约 100。暂时不宜把空 referrer 全部解释为“主动输入网址”。
- 浏览器和系统中存在较多 `Unknown`，且 Edge、macOS、Windows 占比较高。在没有排除站长自访问前，不应将这些数据直接解释为稳定读者画像。

### 数据污染发现

Cloudflare 自动安装的现行规则是 `host = *`、`paths = *`，因此会收到同一 Zone 下其他子域名的数据。未按主机名过滤的粗数据中出现了 `nas.shenzhe.org`、`wifi.shenzhe.org` 及管理/存储路径，粗估总量为 390 pageviews。排除后主博客口径为约 260 pageviews。

后续看板和定期报告必须始终带上 `requestHost = shenzhe.org` 过滤条件。可选改进是在 Web Analytics 规则中从源头排除其他子域名；该操作属于外部配置变更，需单独确认后执行。

## 能看到什么

推荐看板至少包含：

- 全站：浏览量（pageviews）、访问次数（visits/sessions）、独立访客近似值、趋势。
- 文章：每篇文章的访问量、独立访客、入口次数、平均参与时间、退出/参与率。
- 来源：搜索引擎、直接访问、微信/社交平台、外部链接、UTM 活动参数。
- 受众：国家/地区、城市级近似位置、设备类型、浏览器、操作系统。
- 内容行为：文章内链点击、外链点击、分享按钮、阅读 25%/50%/75%/90%、评论按钮等自定义事件。

## 已实施：`stats.shenzhe.org`

2026-08-01 已完成并上线私有看板：

- Cloudflare Worker：`shenzhe-stats`；D1：`shenzhe-stats`；自定义域名：`https://stats.shenzhe.org`。
- 看板包含浏览量、会话、独立访客近似值、文章阅读量、每日趋势、热门文章、来源、设备、地区和最近访问明细。
- 最近访问明细显示 IP、访客短标签、页面/文章、来源、设备和 ASN/网络组织。浏览器无法可靠读取本地主机名，因此不声称显示真实设备主机名。
- Cloudflare 的 IP 定位字段用于显示国家、region 与 city；中国大陆按可用数据展示省/市，美国展示州/市。定位是网络出口近似值。
- 点击“标记当前设备”后，会设置 `.shenzhe.org` 安全 Cookie，并把同一 IP 最近 30 天记录标为站长访问；看板默认排除站长访问，也可切换查看。
- 原始 IP 使用 AES-GCM 加密后写入 D1；IP 聚合键使用带密钥 HMAC。密钥和管理密码仅存在 Cloudflare Worker Secrets，不进入 GitHub。
- 默认保留 30 天，每日定时删除；登录 15 分钟内最多尝试 10 次；采集端过滤常见机器人并限制每个 IP 每分钟 60 次。
- 前端只发送路径名，不发送 URL 查询参数、文章正文或表单内容；启用 DNT/GPC 的浏览器不发送事件。
- 实现代码见 `stats-dashboard/`，博客埋点见 `components/StatsTracker.js`。生产发布仍以 GitHub 仓库为唯一入口。

## “哪些人”与 IP 地址的边界

- 普通统计可以告诉我们“有多少访客、从哪个地区来、看了什么”，但不能凭 IP 可靠确定现实身份。
- IP 可能对应 VPN、移动网络出口、学校/单位网关或共享宽带；地理位置通常只能近似到国家、地区或城市。
- 逐页路径与原始 IP 的组合属于高敏感度访问数据。当前按站长明确选择实施，但通过私有登录、加密存储、最短保留期、查询参数剥离和本人访问标记降低风险。
- 若未来访问量增大，应重新评估是否继续显示完整 IP，优先改为截断 IP 或只保留 HMAC 聚合标识。

## 推荐方案

### 第一阶段：Cloudflare Web Analytics

已完成并确认正在采集。当前作为主看板，用于观察访问趋势、页面路径、来源、地区和设备。后续需增加主域名过滤规则或保证所有查询显式过滤 `requestHost = shenzhe.org`。

### 第二阶段：文章级事件（基础页面浏览已完成）

如果只需要“哪篇文章被看了多少次”，页面 path 已可作为文章维度。如果还要分析阅读深度、分享、出站链接和站内导航，再接入支持自定义事件的工具，并统一事件命名：

- `article_view`：文章页被打开。
- `reading_depth`：阅读到 25%/50%/75%/90%。
- `share_click`：点击分享入口，并记录 channel。
- `outbound_click`：点击外部链接，仅记录目标域名，避免收集链接中的敏感查询参数。
- `internal_article_click`：从首页、归档、搜索或文章内链点击另一篇文章。

## 当前外部条件

- Cloudflare 插件已连接并获授权，已创建 D1、Worker、定时任务和 Custom Domain。
- Cloudflare 已通过自动设置采集，不需要把站点 token 写入 GitHub 仓库或前端配置。
- 当前没有接入 GA4、Umami 或 Vercel Analytics；无需额外 Measurement ID / Website ID。
- 看板默认应保持私有，不把统计 API token 放入博客的前端 JavaScript。

## 验收标准

- 首页、文章页和客户端路由切换各记录一次 pageview，不重复计数。
- 看板能按 `/article/<slug>` 汇总并排序文章。
- 能排除或单独标记管理员自访问、常见爬虫和健康检查。
- 前端事件不上传文章正文、表单内容、完整 IP 或 URL 查询参数；服务端从 Cloudflare 请求上下文读取 IP 并加密保存。
- 隐私说明列明统计目的、工具、数据类型、保留期和联系方式。
