#!/usr/bin/env node

const fs = require('fs')
const https = require('https')
const path = require('path')

const POSTS = [
  'https://shenzhe.org/article/welcome',
  'https://shenzhe.org/article/33b00906-2c37-817f-b80e-d177122a6681',
  'https://shenzhe.org/article/research-share',
  'https://shenzhe.org/article/essay'
]

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'user-agent': 'shenzhe-blog-mdx-import' } }, response => {
        const chunks = []
        response.on('data', chunk => chunks.push(chunk))
        response.on('end', () => {
          resolve(Buffer.concat(chunks).toString('utf8'))
        })
      })
      .on('error', reject)
  })
}

function extractNextData(html, url) {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )
  if (!match) {
    throw new Error(`${url}: cannot find __NEXT_DATA__`)
  }
  return JSON.parse(match[1])
}

function plain(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(plain).join('')
  return ''
}

function formatDate(value) {
  if (!value) return ''
  const match = String(value).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return value
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
}

function yamlString(value) {
  return JSON.stringify(value || '')
}

function fileNameFromSlug(slug) {
  const name = slug.replace(/^article\//, '').replace(/[^a-zA-Z0-9_-]+/g, '-')
  return `${name || 'post'}.mdx`
}

function blockText(block) {
  return plain(block?.properties?.title || block?.properties?.caption || []).trim()
}

function blockToMarkdown(block) {
  const text = blockText(block)
  if (!text) return ''

  switch (block.type) {
    case 'header':
      return `## ${text}`
    case 'sub_header':
      return `### ${text}`
    case 'sub_sub_header':
      return `#### ${text}`
    case 'quote':
      return text
        .split(/\n+/)
        .map(line => `> ${line}`)
        .join('\n')
    case 'bulleted_list':
      return `- ${text}`
    case 'numbered_list':
      return `1. ${text}`
    case 'callout':
      return `> ${text}`
    case 'code': {
      const language = block?.properties?.language?.[0]?.[0] || ''
      return `\`\`\`${language}\n${text}\n\`\`\``
    }
    default:
      return text
  }
}

function postBlocks(post) {
  const blocks = post?.blockMap?.block || {}
  return Object.values(blocks)
    .map(entry => entry.value)
    .filter(Boolean)
    .filter(block => block.parent_id === post.id)
}

function descriptionFor(post, markdownBlocks) {
  if (post.summary) return post.summary
  const firstParagraph =
    markdownBlocks
      .find(block => block && !block.startsWith('#') && !block.startsWith('>'))
      ?.replace(/\s+/g, ' ')
      .trim() || post.title
  return firstParagraph.slice(0, 120)
}

function toMdx(post, sourceUrl) {
  const markdownBlocks = postBlocks(post).map(blockToMarkdown).filter(Boolean)
  const description = descriptionFor(post, markdownBlocks)
  const date = formatDate(post.publishDay)
  const updated = formatDate(post.lastEditedDay || post.publishDay)
  const tags = Array.isArray(post.tags) ? post.tags : []
  const body = markdownBlocks.join('\n\n').trim()

  return `---
title: ${yamlString(post.title)}
slug: ${yamlString(post.slug)}
description: ${yamlString(description)}
date: ${yamlString(date)}
updated: ${yamlString(updated)}
status: "published"
visibility: "public"
type: "post"
lang: "zh"
category: ${yamlString(post.category || "未分类")}
tags: ${tags.length ? '' : '[]'}
${tags.map(tag => `  - ${yamlString(tag)}`).join('\n')}${tags.length ? '\n' : ''}featured: false
pinned: false
comments: true
canonicalUrl: ${yamlString(sourceUrl)}
legacy:
  oldUrl: ${yamlString(sourceUrl)}
  notionId: ${yamlString(post.id)}
seo:
  noindex: false
---

${body}
`
}

async function main() {
  const outputDir = path.join(process.cwd(), 'content', 'posts')
  fs.mkdirSync(outputDir, { recursive: true })

  for (const url of POSTS) {
    const html = await fetchText(url)
    const data = extractNextData(html, url)
    const post = data?.props?.pageProps?.post
    if (!post?.slug || post.type !== 'Post' || post.status !== 'Published') {
      throw new Error(`${url}: missing published post data`)
    }

    const mdx = toMdx(post, url)
    if (mdx.includes('\uFFFD')) {
      throw new Error(`${url}: generated content contains replacement characters`)
    }

    const filePath = path.join(outputDir, fileNameFromSlug(post.slug))
    fs.writeFileSync(filePath, mdx)
    console.log(`wrote ${path.relative(process.cwd(), filePath)}`)
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}
