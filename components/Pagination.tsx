import Link from 'next/link'

/**
 * Page-number pagination. `basePath` is the route prefix; page 1 lives at
 * `basePath` and subsequent pages at `basePath/page/N`.
 */
export function Pagination({
  basePath,
  current,
  total,
}: {
  basePath: string
  current: number
  total: number
}) {
  if (total <= 1) return null
  const href = (p: number) => (p === 1 ? basePath || '/' : `${basePath}/page/${p}`)

  return (
    <nav className="mt-10 flex items-center justify-between text-sm">
      {current > 1 ? (
        <Link href={href(current - 1)} className="rounded-md border border-zinc-200 px-3 py-1.5 hover:border-brand hover:text-brand dark:border-zinc-700">
          ← 上一页
        </Link>
      ) : (
        <span />
      )}
      <span className="text-zinc-500">
        {current} / {total}
      </span>
      {current < total ? (
        <Link href={href(current + 1)} className="rounded-md border border-zinc-200 px-3 py-1.5 hover:border-brand hover:text-brand dark:border-zinc-700">
          下一页 →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
