import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/lib/notion/types'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border-b border-zinc-100 py-6 last:border-0 dark:border-zinc-800">
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <time dateTime={post.date ?? undefined}>{formatDate(post.date)}</time>
        {post.category && (
          <Link href={`/category/${encodeURIComponent(post.category)}`} className="hover:text-brand">
            {post.category}
          </Link>
        )}
      </div>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">
        <Link href={post.path} className="transition group-hover:text-brand">
          {post.icon && <span className="mr-1">{post.icon}</span>}
          {post.title}
        </Link>
      </h2>
      {post.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.summary}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 hover:bg-brand/10 hover:text-brand dark:bg-zinc-800 dark:text-zinc-400"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
