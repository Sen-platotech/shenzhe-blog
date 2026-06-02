import { PostList } from '@/components/PostList'
import { Pagination } from '@/components/Pagination'
import { getPosts } from '@/lib/notion/getPosts'
import { getSiteConfig } from '@/config'

export const revalidate = 1800

export default async function HomePage() {
  const [config, posts] = await Promise.all([getSiteConfig(), getPosts()])
  const totalPages = Math.max(1, Math.ceil(posts.length / config.postsPerPage))
  const pagePosts = posts.slice(0, config.postsPerPage)

  return (
    <div>
      <section className="border-b border-zinc-100 pb-8 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{config.bio}</p>
      </section>
      <PostList posts={pagePosts} />
      <Pagination basePath="" current={1} total={totalPages} />
    </div>
  )
}
