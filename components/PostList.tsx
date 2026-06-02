import { PostCard } from './PostCard'
import type { PostMeta } from '@/lib/notion/types'

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return <p className="py-12 text-center text-zinc-500">还没有文章。</p>
  }
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
