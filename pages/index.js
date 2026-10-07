import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export function getStaticProps(req) {
  const props = getContentIndexProps()

  return {
    props
  }
}

export default Index
