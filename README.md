# 沈哲的博客

文章主源是 `content/` 中的 MDX 文件，由 Git 管理。当前使用书卷主题，保留首页、文章、归档、分类、标签、搜索、RSS、评论和独立统计入口。

本项目已移除旧模板的远程内容 API、OAuth、登录后台和正文回退路径；旧模板主题及其专用依赖不进入构建。历史迁移标识仍保留在原稿元数据中，文章 URL 不改。

## 本地开发与构建

```bash
yarn install --frozen-lockfile
npm run validate-content
npm run secret:scan
npm run dev
NEXT_BUILD_STANDALONE=true npm run build
```

列表和导航只包含摘要，文章正文按页提供。发布由 GitHub Actions 构建 Linux standalone 包，VPS 验证并切换；内容随着 Git 发布更新，不在运行时每 60 秒重新生成。部署说明见 [docs/vps-deployment.md](docs/vps-deployment.md)。

`npm run export` 可用于验证纯静态产物，但不能直接替换目前的服务：任意关键词搜索路由、同源 API、Feed 跳转和统计转发路径需要配套的静态托管配置。正式上线必须完整验证这些功能。

## 测试

```bash
npm test -- --runInBand
npm run test:content
```

独立统计服务有自己的测试配置，不由博客根目录 Jest 执行。源项目中已有部分通用校验工具测试失败，见本次执行记录；请区分这些既有问题与内容或页面回归。

旧上游说明保存在 [docs/history/upstream-readme.md](docs/history/upstream-readme.md)，仅作为历史材料；许可证和贡献者署名保留。
