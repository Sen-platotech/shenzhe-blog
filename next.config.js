const { THEME } = require('./blog.config')
const fs = require('fs')
const path = require('path')
const BLOG = require('./blog.config')

// 打包时是否分析代码
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: BLOG.BUNDLE_ANALYZER
})

// 扫描项目 /themes下的目录名
const themes = scanSubdirectories(path.resolve(__dirname, 'themes'))
// 检测用户开启的多语言
const locales = [BLOG.LANG]

// 编译前执行
// eslint-disable-next-line no-unused-vars
const preBuild = (function () {
  if (!['build', 'export'].includes(process.env.npm_lifecycle_event)) {
    return
  }

  const rootSitemapPath = path.resolve(__dirname, 'sitemap.xml')
  if (fs.existsSync(rootSitemapPath)) {
    fs.unlinkSync(rootSitemapPath)
    console.log('Deleted existing sitemap.xml from root directory')
  }
})()

/**
 * 扫描指定目录下的文件夹名，用于获取所有主题
 * @param {*} directory
 * @returns
 */
function scanSubdirectories(directory) {
  const subdirectories = []

  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      subdirectories.push(file)
    }

    // subdirectories.push(file)
  })

  return subdirectories
}

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  output: process.env.EXPORT
    ? 'export'
    : process.env.NEXT_BUILD_STANDALONE === 'true'
      ? 'standalone'
      : undefined,
  staticPageGenerationTimeout: 120,

  // 内容随 Git 构建发布；不在 Node 堆中缓存整页数据。
  cacheMaxMemorySize: 0,

  // 性能优化配置
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // 构建优化
  swcMinify: true,
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}'
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}'
    }
  },
  // 多语言， 在export时禁用
  i18n: process.env.EXPORT
    ? undefined
    : {
        defaultLocale: BLOG.LANG,
        // 支持的所有多语言,按需填写即可
        locales: locales
      },
  images: {
    // 图片压缩和格式优化
    formats: ['image/avif', 'image/webp'],
    // 图片尺寸优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 允许next/image加载的图片 域名
    domains: [
      'gravatar.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'p1.qhimg.com',
      'webmention.io',
      'ko-fi.com'
    ],
    // 图片加载器优化
    loader: 'default',
    unoptimized: Boolean(process.env.EXPORT),
    // 图片缓存优化
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7天
    // 危险的允许SVG
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // 默认将feed重定向至 /public/rss/feed.xml
  redirects: process.env.EXPORT
    ? undefined
    : () => {
        return [
          {
            source: '/feed',
            destination: '/rss/feed.xml',
            permanent: true
          }
        ]
      },
  // 重写url
  headers: process.env.EXPORT
    ? undefined
    : () => {
        return [
          {
            source: '/:path*{/}?',
            headers: [
              // 为了博客兼容性，不做过多安全限制
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
              { key: 'Access-Control-Allow-Origin', value: '*' },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
              },
              {
                key: 'Access-Control-Allow-Headers',
                value:
                  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
              }
              // 安全头部 相关配置，谨慎开启
            //   { key: 'X-Frame-Options', value: 'DENY' },
            //   { key: 'X-Content-Type-Options', value: 'nosniff' },
            //   { key: 'X-XSS-Protection', value: '1; mode=block' },
            //   { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            //   { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            //   {
            //     key: 'Strict-Transport-Security',
            //     value: 'max-age=31536000; includeSubDomains; preload'
            //   },
            //   {
            //     key: 'Content-Security-Policy',
            //     value: [
            //       "default-src 'self'",
            //       "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com *.google-analytics.com *.googletagmanager.com",
            //       "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
            //       "img-src 'self' data: blob: *.unsplash.com *.githubusercontent.com *.gravatar.com",
            //       "font-src 'self' *.googleapis.com *.gstatic.com",
            //       "connect-src 'self' *.google-analytics.com *.googletagmanager.com",
            //       "frame-src 'self' *.youtube.com *.vimeo.com",
            //       "object-src 'none'",
            //       "base-uri 'self'",
            //       "form-action 'self'"
            //     ].join('; ')
            //   },

            //   // CORS 配置（更严格）
            //   { key: 'Access-Control-Allow-Credentials', value: 'false' },
            //   {
            //     key: 'Access-Control-Allow-Origin',
            //     value: process.env.NODE_ENV === 'production'
            //       ? siteConfig('LINK') || 'https://yourdomain.com'
            //       : '*'
            //   },
            //   { key: 'Access-Control-Max-Age', value: '86400' }
            ]
          },
            //   {
            //     source: '/api/:path*',
            //     headers: [
            //       // API 特定的安全头部
            //       { key: 'X-Frame-Options', value: 'DENY' },
            //       { key: 'X-Content-Type-Options', value: 'nosniff' },
            //       { key: 'Cache-Control', value: 'no-store, max-age=0' },
            //       {
            //         key: 'Access-Control-Allow-Methods',
            //         value: 'GET,POST,PUT,DELETE,OPTIONS'
            //       }
            //     ]
            //   }
        ]
      },
  webpack: (config, { dev, isServer }) => {
    // 动态主题：添加 resolve.alias 配置，将动态路径映射到实际路径
    config.resolve.alias['@'] = path.resolve(__dirname)

    if (!isServer) {
      console.log('[默认主题]', path.resolve(__dirname, 'themes', THEME))
    }
    config.resolve.alias['@theme-components'] = path.resolve(
      __dirname,
      'themes',
      THEME
    )

    // 性能优化配置
    if (!dev) {
      // 生产环境优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }

    // Enable source maps in development mode
    if (dev || process.env.NODE_ENV_API === 'development') {
      // config.devtool = 'source-map'
      config.devtool = 'eval-source-map'
      // console.log('启动调试 nextjs.config.devtool ', config.devtool)
    }

    // 优化模块解析
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ]

    return config
  },
  experimental: {
    scrollRestoration: true,
    // 性能优化实验性功能
    optimizePackageImports: ['@heroicons/react', 'lodash']
  },
  exportPathMap: function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // export 静态导出时 忽略/pages/sitemap.xml.js ， 否则和getServerSideProps这个动态文件冲突
    const pages = { ...defaultPathMap }
    delete pages['/sitemap.xml']
    delete pages['/auth']
    return pages
  },
  publicRuntimeConfig: {
    // 这里的配置既可以服务端获取到，也可以在浏览器端获取到
    THEMES: themes
  }
}

module.exports = process.env.ANALYZE
  ? withBundleAnalyzer(nextConfig)
  : nextConfig
