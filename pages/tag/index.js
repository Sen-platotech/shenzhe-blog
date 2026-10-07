import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentTagIndexProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const router = useRouter()
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutTagIndex' {...props} />
}

export function getStaticProps(req) {
  const props = getContentTagIndexProps()
  return {
    props
  }
}

export default TagIndex
