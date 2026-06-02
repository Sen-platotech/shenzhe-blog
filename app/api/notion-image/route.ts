import { NextResponse } from 'next/server'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion, notionCall } from '@/lib/notion/client'

export const runtime = 'nodejs'
// Always resolve a fresh signed URL — Notion's S3 links expire after ~1h.
export const dynamic = 'force-dynamic'

function extractUrl(block: BlockObjectResponse): string | null {
  switch (block.type) {
    case 'image':
      return block.image.type === 'external' ? block.image.external.url : block.image.file.url
    case 'video':
      return block.video.type === 'external' ? block.video.external.url : block.video.file.url
    case 'file':
      return block.file.type === 'external' ? block.file.external.url : block.file.file.url
    case 'pdf':
      return block.pdf.type === 'external' ? block.pdf.external.url : block.pdf.file.url
    default:
      return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const blockId = searchParams.get('blockId')
  if (!blockId) {
    return NextResponse.json({ error: 'blockId required' }, { status: 400 })
  }

  try {
    const block = (await notionCall(() =>
      notion.blocks.retrieve({ block_id: blockId }),
    )) as BlockObjectResponse
    const url = extractUrl(block)
    if (!url) return NextResponse.json({ error: 'no media on block' }, { status: 404 })

    return NextResponse.redirect(url, {
      status: 307,
      // Let the browser/CDN cache the resolved asset briefly, but well under
      // the ~1h signed-URL expiry so we never serve a dead link.
      headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800' },
    })
  } catch {
    return NextResponse.json({ error: 'failed to resolve media' }, { status: 502 })
  }
}
