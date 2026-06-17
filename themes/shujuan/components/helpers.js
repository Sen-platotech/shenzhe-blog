import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 'YYYY-MM-DD' → { md: '6 月 7 日', year: '2026' } */
export function fmtDate(publishDay) {
  if (!publishDay) return { md: '', year: '' }
  const [y, m, d] = publishDay.split('-')
  return { md: `${Number(m)} 月 ${Number(d)} 日`, year: y }
}

/** 'YYYY-MM-DD' → '06 / 07' */
export function fmtArchive(publishDay) {
  if (!publishDay) return ''
  const [, m, d] = publishDay.split('-')
  return `${m} / ${d}`
}

/** 中文阅读时长：约 X 分钟（按 400 字/分钟） */
export function readingTime(body) {
  const n = (body || '').replace(/\s/g, '').length
  return `约 ${Math.max(1, Math.round(n / 400))} 分钟`
}

/** 取文章封面，缺省回退站点 banner */
export function coverOf(post, siteInfo) {
  return post?.pageCover || siteInfo?.pageCover || '/bg_image.jpg'
}

/** 分类封面映射（首页栏目卡 / 分类页） */
export function categoryCover(name) {
  const map = siteConfig('SHUJUAN_CATEGORY_COVERS', CONFIG.SHUJUAN_CATEGORY_COVERS, CONFIG) || {}
  return map[name] || '/bg_image.jpg'
}

/** 标签云字号档位：按 count 映射到 s1..s5（与设计稿 Tags.html 一致） */
export function tagSizeClass(count, max) {
  if (!max || max <= 1) return 's2'
  const r = count / max
  if (r > 0.85) return 's4'
  if (r > 0.6) return 's3'
  if (r > 0.4) return 's5'
  if (r > 0.2) return 's2'
  return 's1'
}
