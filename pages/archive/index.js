import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentArchiveProps } from '@/lib/content/site-data'
import { isBrowser } from '@/lib/utils'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 归档首页
 * @param {*} props
 * @returns
 */
const ArchiveIndex = props => {
  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1))
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutArchive' {...props} />
}

export function getStaticProps({ locale }) {
  const props = getContentArchiveProps()

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default ArchiveIndex
