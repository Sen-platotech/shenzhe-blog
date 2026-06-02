import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NoticeBar } from '@/components/NoticeBar'
import { NotionRenderer } from '@/components/notion/NotionRenderer'
import { getSiteConfig } from '@/config'
import { getMenus } from '@/lib/notion/getMenus'
import { getNotice } from '@/lib/notion/getNotice'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return {
    metadataBase: new URL(config.siteUrl),
    title: { default: config.title, template: `%s · ${config.title}` },
    description: config.description,
    alternates: {
      canonical: '/',
      types: { 'application/rss+xml': '/rss.xml' },
    },
    openGraph: {
      type: 'website',
      title: config.title,
      description: config.description,
      url: config.siteUrl,
      siteName: config.title,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, menus, notice] = await Promise.all([getSiteConfig(), getMenus(), getNotice()])

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body style={{ '--brand': config.brandColor } as React.CSSProperties}>
        <ThemeProvider>
          {notice && (
            <NoticeBar id={notice.id}>
              <NotionRenderer blocks={notice.blocks} />
            </NoticeBar>
          )}
          <Header title={config.title} menus={menus} />
          <main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-8">{children}</main>
          <Footer config={config} />
        </ThemeProvider>
      </body>
    </html>
  )
}
