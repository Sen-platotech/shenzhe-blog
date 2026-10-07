# VPS 发布与运行

正式主站 shenzhe.org 已迁至 VPS。www.shenzhe.org 跳转到主站。文章、主题、路由及 RSS 的主源仍为本仓库 main 分支。

## 日常发布

推送 main 后，`Build VPS production release` 构建 Linux standalone 产物并发布到 `vps-artifacts` Release。`vps-manifest.json` 记录源码 SHA、产物 URL 与 SHA-256。VPS 主动读取并验证产物，无需把服务器 SSH 私钥交给 GitHub。

VPS 发布检查每 5 分钟运行。可通过既有 SSH 管理立即触发 `systemctl start shenzhe-update.service`；检查发布状态用 `journalctl -u shenzhe-update -n 30 --no-pager`、`cat /opt/shenzhe/current-blog/.vps-deploy.json` 与正式页面内容交叉核验。GitHub 构建成功不等于网站已经更新。

三个静态文章网站的源码仍在各自仓库：guanliziyou-github-pages、sixianggaizao-github-pages、longcan-github-pages；VPS 每约 15 分钟核验其 main 分支并更新对应静态文件。原 GitHub Pages 作为可恢复的来源保留。

## 统计后台

统计应用及数据存放在 VPS 的 Node + SQLite 服务中。`stats-dashboard/src/` 仍是统计逻辑的主源；Linux 发布包含 `vps/stats-worker.mjs`，部署程序只在模块内容变化时更新统计运行模块并重启对应服务。

`stats-dashboard/vps/stats-edge.js` 是 Cloudflare 的无存储元数据转发，保留原省市、ASN 与访客 IP。该入口不执行统计查询、登录处理或 D1 写入；它禁用中间缓存，向 VPS 发送签名元数据。修改该转发入口时，使用既有管理凭据明确部署此文件，不能再把完整统计应用部署回 Worker。

旧 `Deploy private stats dashboard` 工作流已改为仅构建 VPS 模块，移除远程 D1 migrations 和完整 Worker 部署。数据库结构更改须先备份，再在 VPS 明确应用对应迁移；不要把旧的历史汇总 SQL 无差别重跑。

## 运维与恢复

Node 22、Nginx 及 cloudflared 由 systemd 管理。公网 80/443 保持供现有代理使用，网站只监听回环地址。统计精细明细继续按 30 天清理，数据库与原服务密钥每日备份到受限目录。

主站内容回退可切换服务器 release，并重启博客服务。若改回原 Vercel DNS，统计 CDN 转发依赖的主站回源也必须一并处理，不能只改一条 DNS 就认为所有服务恢复。

原 D1、原 Worker、GitHub Pages 与迁移前备份保留为恢复来源。统计或报价数据库回退前，应先导出切换后新增数据，不能用旧快照覆盖正在使用的数据。

完整运维入口：`/Users/shen/Documents/美西 VPS 管理/outputs/2026-10-07-统一迁移/README.md`。服务器管理员、服务密码与所有密钥不进入本仓库。
