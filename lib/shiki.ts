import 'server-only'
import { codeToHtml, bundledLanguages } from 'shiki'

/** Map Notion's code language names onto shiki language ids. */
const LANG_MAP: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  'objective-c': 'objc',
  assembly: 'asm',
  'plain text': 'text',
  'plain-text': 'text',
  shell: 'bash',
  docker: 'dockerfile',
  'f#': 'fsharp',
  'visual basic': 'vb',
}

function resolveLang(lang: string): string {
  const normalized = (lang || 'text').toLowerCase().trim()
  const mapped = LANG_MAP[normalized] ?? normalized
  return mapped in bundledLanguages ? mapped : 'text'
}

/**
 * Highlight a code block to dual-theme HTML (light/dark via CSS variables).
 * Mermaid is handled separately on the client, so it is returned unhighlighted.
 * Unknown languages gracefully fall back to plain text.
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  if (lang?.toLowerCase() === 'mermaid') return ''
  try {
    return await codeToHtml(code, {
      lang: resolveLang(lang),
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  } catch {
    return await codeToHtml(code, {
      lang: 'text',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  }
}
