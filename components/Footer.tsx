import type { SiteConfig } from '@/config/schema'

export function Footer({ config }: { config: SiteConfig }) {
  const year = new Date().getFullYear()
  const range = config.since && config.since < year ? `${config.since}–${year}` : `${year}`
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 py-8 text-sm text-zinc-500">
        <div className="flex gap-4">
          {config.social.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
              {s.name}
            </a>
          ))}
        </div>
        <p>
          © {range} {config.author} · 由 Notion 驱动
        </p>
      </div>
    </footer>
  )
}
