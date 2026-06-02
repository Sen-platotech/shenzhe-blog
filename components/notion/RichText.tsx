import React from 'react'
import katex from 'katex'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { notionColor, notionBackground } from '@/lib/utils'

function withLineBreaks(text: string): React.ReactNode {
  const parts = text.split('\n')
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </React.Fragment>
  ))
}

function InlineEquation({ expression }: { expression: string }) {
  const html = katex.renderToString(expression, {
    throwOnError: false,
    displayMode: false,
  })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function RichText({ value }: { value: RichTextItemResponse[] }) {
  return (
    <>
      {value.map((item, i) => {
        if (item.type === 'equation') {
          return <InlineEquation key={i} expression={item.equation.expression} />
        }

        const { bold, italic, strikethrough, underline, code, color } = item.annotations
        const style: React.CSSProperties = {}
        const c = notionColor(color)
        const bg = notionBackground(color)
        if (c) style.color = c
        if (bg) style.backgroundColor = bg

        let node: React.ReactNode = code ? (
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em] text-pink-600 dark:bg-zinc-800 dark:text-pink-400">
            {item.plain_text}
          </code>
        ) : (
          withLineBreaks(item.plain_text)
        )

        if (bold) node = <strong>{node}</strong>
        if (italic) node = <em>{node}</em>
        if (underline) node = <span className="underline">{node}</span>
        if (strikethrough) node = <s>{node}</s>

        if (item.href) {
          return (
            <a
              key={i}
              href={item.href}
              style={style}
              className="text-brand underline-offset-2 hover:underline"
              {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {node}
            </a>
          )
        }

        return (
          <span key={i} style={Object.keys(style).length ? style : undefined}>
            {node}
          </span>
        )
      })}
    </>
  )
}
