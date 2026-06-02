import type { Metadata } from 'next'
import { PostList } from '@/components/PostList'
import { getTags, getPostsByTag } from '@/lib/notion/getPosts'

export const revalidate = 1800

export async function generateStaticParams() {
  const tags = await getTags()
  return tags.map((t) => ({ tag: t.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  return { title: `标签：${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const name = decodeURIComponent(tag)
  const posts = await getPostsByTag(name)
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">标签：#{name}</h1>
      <p className="mb-4 text-sm text-zinc-500">{posts.length} 篇文章</p>
      <PostList posts={posts} />
    </div>
  )
}
