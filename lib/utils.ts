/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Format an ISO date as e.g. "2026年6月2日" (zh-CN). */
export function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** Notion block/text color name -> CSS. Used by the rich text + block renderers. */
export function notionColor(color: string | undefined): string | undefined {
  if (!color || color === 'default') return undefined
  const TEXT: Record<string, string> = {
    gray: '#787774',
    brown: '#9f6b53',
    orange: '#d9730d',
    yellow: '#cb912f',
    green: '#448361',
    blue: '#337ea9',
    purple: '#9065b0',
    pink: '#c14c8a',
    red: '#d44c47',
  }
  if (color.endsWith('_background')) return undefined
  return TEXT[color]
}

/** Notion background color name -> CSS background. */
export function notionBackground(color: string | undefined): string | undefined {
  if (!color || !color.endsWith('_background')) return undefined
  const BG: Record<string, string> = {
    gray_background: '#f1f1ef',
    brown_background: '#f4eeee',
    orange_background: '#fbecdd',
    yellow_background: '#fbf3db',
    green_background: '#edf3ec',
    blue_background: '#e7f3f8',
    purple_background: '#f6f3f9',
    pink_background: '#faf1f5',
    red_background: '#fdebec',
  }
  return BG[color]
}
