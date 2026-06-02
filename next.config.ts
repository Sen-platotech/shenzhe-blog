import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Notion image hosts (used as a fallback; primary path is the /api/notion-image proxy).
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      // Backwards-compatibility with the old pseudo-static `.html` links.
      { source: '/:path*.html', destination: '/:path*' },
    ]
  },
  async redirects() {
    return [
      // Keep historical RSS subscribers working.
      { source: '/feed', destination: '/rss.xml', permanent: true },
      { source: '/rss/feed.xml', destination: '/rss.xml', permanent: true },
      { source: '/atom.xml', destination: '/rss.xml', permanent: true },
    ]
  },
}

export default nextConfig
