import { notFound } from 'next/navigation'
import { PostList } from '@/components/PostList'
import { Pagination } from '@/components/Pagination'
import { getPosts } from '@/lib/notion/getPosts'
import { getSiteConfig } from '@/config'

export const revalidate = 1800

export async function generateStaticParams() {
  const [config, posts] = await Promise.all([getSiteConfig(), getPosts()])
  const totalPages = Math.ceil(posts.length / config.postsPerPage)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }))
}

export default async function PagedHome({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const current = Number(page)
  if (!Number.isInteger(current) || current < 2) notFound()

  const [config, posts] = await Promise.all([getSiteConfig(), getPosts()])
  const totalPages = Math.max(1, Math.ceil(posts.length / config.postsPerPage))
  if (current > totalPages) notFound()

  const start = (current - 1) * config.postsPerPage
  const pagePosts = posts.slice(start, start + config.postsPerPage)

  return (
    <div>
      <PostList posts={pagePosts} />
      <Pagination basePath="" current={current} total={totalPages} />
    </div>
  )
}
