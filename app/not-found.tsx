import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-zinc-500">页面不存在或已被移动。</p>
      <Link href="/" className="mt-6 inline-block text-brand hover:underline">
        ← 返回首页
      </Link>
    </div>
  )
}
