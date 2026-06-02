import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NotionRenderer, slugifyHeading } from '@/components/notion/NotionRenderer'
import { TableOfContents, type TocItem } from '@/components/TableOfContents'
import { Comments } from '@/components/Comments'
import { getPostBySlug, getLinkablePosts } from '@/lib/notion/getPosts'
import { richTextToPlain } from '@/lib/notion/mappers'
import { formatDate } from '@/lib/utils'
import { absoluteUrl } from '@/lib/notion/url'
import { getSiteConfig } from '@/config'
import type { BlockNode } from '@/lib/notion/types'

export const revalidate = 1800
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getLinkablePosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getPostBySlug(slug)
  if (!data) return {}
  const { meta } = data
  return {
    title: meta.title,
    description: meta.summary || undefined,
    alternates: { canonical: meta.path },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.summary || undefined,
      url: absoluteUrl(meta.path),
      images: meta.cover ? [absoluteUrl(`/api/notion-image?blockId=${meta.id}`)] : undefined,
      publishedTime: meta.date ?? undefined,
    },
  }
}

function buildToc(blocks: BlockNode[]): TocItem[] {
  const items: TocItem[] = []
  for (const b of blocks) {
    if (b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3') {
      const data =
        b.type === 'heading_1' ? b.heading_1 : b.type === 'heading_2' ? b.heading_2 : b.heading_3
      const text = richTextToPlain(data.rich_text)
      if (!text) continue
      const level = b.type === 'heading_1' ? 1 : b.type === 'heading_2' ? 2 : 3
      items.push({ id: slugifyHeading(text), text, level })
    }
  }
  return items
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPostBySlug(slug)
  if (!data) notFound()

  const { meta, blocks } = data
  const toc = buildToc(blocks)
  const config = await getSiteConfig()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    datePublished: meta.date,
    author: { '@type': 'Person', name: config.author },
    url: absoluteUrl(meta.path),
  }

  return (
    <div className="lg:flex lg:gap-10">
      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {meta.icon && <span className="mr-2">{meta.icon}</span>}
            {meta.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <time dateTime={meta.date ?? undefined}>{formatDate(meta.date)}</time>
            {meta.category && <span>· {meta.category}</span>}
          </div>
        </header>

        <NotionRenderer blocks={blocks} />

        {meta.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            {meta.tags.map((t) => (
              <a
                key={t}
                href={`/tag/${encodeURIComponent(t)}`}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:text-brand dark:bg-zinc-800"
              >
                #{t}
              </a>
            ))}
          </div>
        )}

        <Comments config={config.giscus} />
      </article>

      {toc.length >= 2 && (
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <TableOfContents items={toc} />
          </div>
        </aside>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
