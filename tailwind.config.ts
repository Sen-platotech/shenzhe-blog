import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wired to CSS variables so the Notion `Config` page / static config can recolor the site.
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          fg: 'rgb(var(--brand-fg) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.zinc.700'),
            a: { color: 'rgb(var(--brand))', textDecoration: 'none', fontWeight: '500' },
            'a:hover': { textDecoration: 'underline' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
        invert: {
          css: {
            color: theme('colors.zinc.300'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
