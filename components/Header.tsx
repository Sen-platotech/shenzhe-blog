import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import type { MenuItem } from '@/lib/notion/types'

function NavLink({ item }: { item: MenuItem }) {
  if (item.subMenus && item.subMenus.length > 0) {
    return (
      <div className="group relative">
        <button className="px-3 py-2 text-sm text-zinc-600 transition hover:text-brand dark:text-zinc-300">
          {item.title}
        </button>
        <div className="invisible absolute left-0 top-full z-20 min-w-[8rem] rounded-lg border border-zinc-200 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">
          {item.subMenus.map((sub) => (
            <Link
              key={sub.title}
              href={sub.href}
              target={sub.target}
              className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {sub.title}
            </Link>
          ))}
        </div>
      </div>
    )
  }
  return (
    <Link
      href={item.href}
      target={item.target}
      className="px-3 py-2 text-sm text-zinc-600 transition hover:text-brand dark:text-zinc-300"
    >
      {item.title}
    </Link>
  )
}

export function Header({ title, menus }: { title: string; menus: MenuItem[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {title}
        </Link>
        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {menus.map((item) => (
              <NavLink key={item.title} item={item} />
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
