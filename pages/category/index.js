import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentCategoryIndexProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return (
    <DynamicLayout theme={theme} layoutName='LayoutCategoryIndex' {...props} />
  )
}

export function getStaticProps({ locale }) {
  const props = getContentCategoryIndexProps()
  return {
    props
  }
}
