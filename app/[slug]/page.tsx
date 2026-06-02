import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NotionRenderer } from '@/components/notion/NotionRenderer'
import { getPageBySlug, getStaticPages } from '@/lib/notion/getPosts'
import { absoluteUrl } from '@/lib/notion/url'

export const revalidate = 1800
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getStaticPages()
  return pages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getPageBySlug(slug)
  if (!data) return {}
  return {
    title: data.meta.title,
    description: data.meta.summary || undefined,
    alternates: { canonical: data.meta.path },
    openGraph: { title: data.meta.title, url: absoluteUrl(data.meta.path) },
  }
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPageBySlug(slug)
  if (!data) notFound()

  const { meta, blocks } = data
  return (
    <article>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {meta.icon && <span className="mr-2">{meta.icon}</span>}
        {meta.title}
      </h1>
      <NotionRenderer blocks={blocks} />
    </article>
  )
}
