import type { Metadata } from 'next'
import { PostList } from '@/components/PostList'
import { getCategories, getPostsByCategory } from '@/lib/notion/getPosts'

export const revalidate = 1800

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ category: c.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  return { title: `分类：${decodeURIComponent(category)}` }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const name = decodeURIComponent(category)
  const posts = await getPostsByCategory(name)
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">分类：{name}</h1>
      <p className="mb-4 text-sm text-zinc-500">{posts.length} 篇文章</p>
      <PostList posts={posts} />
    </div>
  )
}
