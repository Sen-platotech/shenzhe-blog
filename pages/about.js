import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 个人简介页面 —— 走主题的 LayoutAbout（自动套上导航 / 页脚 / 全站交互）
 * @param {*} props
 */
const About = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutAbout' {...props} />
}

export function getStaticProps() {
  const props = getContentIndexProps()
  return {
    props
  }
}

export default About
