import React from 'react'
import katex from 'katex'
import { RichText } from './RichText'
import { Mermaid } from './Mermaid'
import { richTextToPlain } from '@/lib/notion/mappers'
import { notionBackground } from '@/lib/utils'
import type { BlockNode } from '@/lib/notion/types'

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function proxySrc(blockId: string): string {
  return `/api/notion-image?blockId=${blockId}`
}

/** Render an ordered list of sibling blocks, grouping consecutive list items. */
function Blocks({ blocks }: { blocks: BlockNode[] }) {
  const out: React.ReactNode[] = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const type = block.type
      const run: BlockNode[] = []
      while (i < blocks.length && blocks[i].type === type) {
        run.push(blocks[i])
        i++
      }
      const ListTag = type === 'bulleted_list_item' ? 'ul' : 'ol'
      out.push(
        <ListTag key={block.id} className={type === 'bulleted_list_item' ? 'list-disc pl-6' : 'list-decimal pl-6'}>
          {run.map((item) => (
            <li key={item.id}>
              <RichText
                value={
                  item.type === 'bulleted_list_item'
                    ? item.bulleted_list_item.rich_text
                    : (item as Extract<BlockNode, { type: 'numbered_list_item' }>).numbered_list_item.rich_text
                }
              />
              {item.children.length > 0 && <Blocks blocks={item.children} />}
            </li>
          ))}
        </ListTag>,
      )
      continue
    }

    out.push(<Block key={block.id} block={block} />)
    i++
  }
  return <>{out}</>
}

function Block({ block }: { block: BlockNode }) {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text.length ? (
        <p>
          <RichText value={block.paragraph.rich_text} />
        </p>
      ) : (
        <p className="h-4" />
      )

    case 'heading_1':
    case 'heading_2':
    case 'heading_3': {
      const data =
        block.type === 'heading_1'
          ? block.heading_1
          : block.type === 'heading_2'
            ? block.heading_2
            : block.heading_3
      const text = richTextToPlain(data.rich_text)
      const id = slugifyHeading(text)
      const Tag = (block.type === 'heading_1' ? 'h2' : block.type === 'heading_2' ? 'h3' : 'h4') as 'h2'
      const inner = (
        <Tag id={id} className="scroll-mt-24 group">
          <RichText value={data.rich_text} />
        </Tag>
      )
      if (data.is_toggleable) {
        return (
          <details className="my-2">
            <summary className="cursor-pointer">{inner}</summary>
            {block.children.length > 0 && <Blocks blocks={block.children} />}
          </details>
        )
      }
      return inner
    }

    case 'quote':
      return (
        <blockquote className="border-l-4 border-brand/60 pl-4 italic">
          <RichText value={block.quote.rich_text} />
          {block.children.length > 0 && <Blocks blocks={block.children} />}
        </blockquote>
      )

    case 'callout': {
      const icon = block.callout.icon
      const bg = notionBackground(block.callout.color) ?? 'rgb(244 244 245)'
      return (
        <div
          className="my-4 flex gap-3 rounded-lg p-4 dark:bg-zinc-800/60"
          style={{ background: bg }}
        >
          <div className="shrink-0 text-xl leading-6">
            {icon?.type === 'emoji'
              ? icon.emoji
              : icon?.type === 'external'
                ? '💡'
                : '💡'}
          </div>
          <div className="min-w-0 flex-1">
            <RichText value={block.callout.rich_text} />
            {block.children.length > 0 && <Blocks blocks={block.children} />}
          </div>
        </div>
      )
    }

    case 'to_do':
      return (
        <div className="flex items-start gap-2">
          <input type="checkbox" checked={block.to_do.checked} readOnly className="mt-1.5" />
          <span className={block.to_do.checked ? 'text-zinc-400 line-through' : ''}>
            <RichText value={block.to_do.rich_text} />
          </span>
        </div>
      )

    case 'toggle':
      return (
        <details className="my-2 rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700">
          <summary className="cursor-pointer font-medium">
            <RichText value={block.toggle.rich_text} />
          </summary>
          {block.children.length > 0 && (
            <div className="mt-2">
              <Blocks blocks={block.children} />
            </div>
          )}
        </details>
      )

    case 'code': {
      const lang = block.code.language ?? 'text'
      const text = richTextToPlain(block.code.rich_text)
      if (lang.toLowerCase() === 'mermaid') return <Mermaid chart={text} />
      const caption = richTextToPlain(block.code.caption)
      return (
        <figure className="my-4">
          {block.highlighted ? (
            <div
              className="overflow-x-auto rounded-lg border border-zinc-200 text-sm dark:border-zinc-700 [&_pre]:m-0 [&_pre]:p-4"
              dangerouslySetInnerHTML={{ __html: block.highlighted }}
            />
          ) : (
            <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
              <code>{text}</code>
            </pre>
          )}
          {caption && <figcaption className="mt-1 text-center text-xs text-zinc-500">{caption}</figcaption>}
        </figure>
      )
    }

    case 'equation': {
      const html = katex.renderToString(block.equation.expression, {
        throwOnError: false,
        displayMode: true,
      })
      return <div className="my-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
    }

    case 'image': {
      const caption = richTextToPlain(block.image.caption)
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proxySrc(block.id)}
            alt={caption || 'image'}
            loading="lazy"
            className="mx-auto rounded-lg"
          />
          {caption && <figcaption className="mt-2 text-center text-sm text-zinc-500">{caption}</figcaption>}
        </figure>
      )
    }

    case 'video': {
      const v = block.video
      if (v.type === 'external') {
        const url = v.external.url
        const embed = toEmbedUrl(url)
        if (embed) return <Iframe src={embed} />
        return <LinkCard href={url} label="▶ 视频" />
      }
      return (
        <video controls className="my-4 w-full rounded-lg" src={proxySrc(block.id)}>
          您的浏览器不支持视频播放。
        </video>
      )
    }

    case 'embed': {
      const url = block.embed.url
      const embed = toEmbedUrl(url) ?? url
      return <Iframe src={embed} />
    }

    case 'bookmark':
      return <LinkCard href={block.bookmark.url} label={block.bookmark.url} />

    case 'file': {
      const name = richTextToPlain(block.file.caption) || '附件下载'
      return <LinkCard href={proxySrc(block.id)} label={`📎 ${name}`} />
    }

    case 'pdf':
      return (
        <div className="my-4">
          <iframe src={proxySrc(block.id)} className="h-[600px] w-full rounded-lg border border-zinc-200 dark:border-zinc-700" />
        </div>
      )

    case 'divider':
      return <hr className="my-8 border-zinc-200 dark:border-zinc-700" />

    case 'table': {
      const rows = block.children.filter((c) => c.type === 'table_row')
      const hasColHeader = block.table.has_column_header
      const hasRowHeader = block.table.has_row_header
      return (
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {rows.map((row, ri) => {
                if (row.type !== 'table_row') return null
                return (
                  <tr key={row.id}>
                    {row.table_row.cells.map((cell, ci) => {
                      const isHeader = (hasColHeader && ri === 0) || (hasRowHeader && ci === 0)
                      const Cell = isHeader ? 'th' : 'td'
                      return (
                        <Cell
                          key={ci}
                          className="border border-zinc-200 px-3 py-2 text-left dark:border-zinc-700"
                        >
                          <RichText value={cell} />
                        </Cell>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }

    case 'column_list':
      return (
        <div className="my-4 flex flex-col gap-4 md:flex-row">
          {block.children.map((col) => (
            <div key={col.id} className="min-w-0 flex-1">
              {col.type === 'column' && <Blocks blocks={col.children} />}
            </div>
          ))}
        </div>
      )

    case 'synced_block':
      return block.children.length > 0 ? <Blocks blocks={block.children} /> : null

    case 'child_page':
      return (
        <div className="my-2 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-700">
          📄 {block.child_page.title}
        </div>
      )

    case 'table_of_contents':
    case 'child_database':
    case 'breadcrumb':
    case 'link_to_page':
      return null

    default:
      return null
  }
}

function Iframe({ src }: { src: string }) {
  return (
    <div className="my-4 aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={src}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-3 block truncate rounded-lg border border-zinc-200 px-4 py-3 text-brand hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {label}
    </a>
  )
}

/** Convert common video/share URLs to their embeddable form. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    if (u.hostname.includes('bilibili.com')) {
      const bvid = u.pathname.split('/').find((s) => s.startsWith('BV'))
      if (bvid) return `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1`
    }
    return null
  } catch {
    return null
  }
}

export function NotionRenderer({ blocks }: { blocks: BlockNode[] }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24">
      <Blocks blocks={blocks} />
    </div>
  )
}
