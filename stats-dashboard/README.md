# shenzhe.org 私有访问看板

`stats.shenzhe.org` 的 Cloudflare Worker。它接收主博客的轻量页面浏览事件，使用 D1 汇总文章、趋势、来源、设备和地理位置，并在登录后显示最近访问的加密 IP。

## 设计边界

- GitHub 仓库是唯一发布与运维入口，不使用 Vercel。
- 原始 IP 使用 AES-GCM 加密后写入 D1；用于聚合和本人识别的 IP 是带密钥 HMAC，不存储明文。
- 默认 30 天自动删除，管理密码和全部密钥只存放在 Cloudflare Worker Secrets。
- 中国大陆展示 Cloudflare 提供的省/市，美国展示州/市；IP 定位是网络出口的近似位置，不代表现实身份。
- 浏览器不能可靠读取客户端主机名，因此用“本人设备标签 + 网络 ASN/组织”代替。
- 尊重 DNT、Global Privacy Control，并过滤常见机器人和自动化浏览器。

## 本地验证

```bash
npm install
npm run types
npm run check
npm test
npm run build
npm run deploy:dry
```

本地运行前，将 `.dev.vars.example` 复制为 `.dev.vars` 并替换全部示例值。不要提交 `.dev.vars`。

## Cloudflare 资源

- Worker：`shenzhe-stats`
- D1：`shenzhe-stats`（`cf52ac23-eaee-4895-9e27-cd9340f222bd`）
- Custom Domain：`stats.shenzhe.org`
- 定时清理：每日 `04:17 UTC`

首次部署需应用 `migrations/0001_init.sql`，设置五个 Worker Secrets，再发布 Worker、定时任务和 Custom Domain。博客埋点位于 `components/StatsTracker.js`。

后续发布从 GitHub Actions 的 `Deploy private stats dashboard` 手动工作流进入。仓库需要配置 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID` 两项 GitHub Actions Secrets；Worker 的五项运行时 Secrets 继续保留在 Cloudflare，不复制到 GitHub。
