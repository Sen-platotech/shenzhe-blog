// pages/sitemap.xml.js
import { ENABLE_AUTH_ROUTES, legacyRouteProps } from '@/lib/routes/legacy'
import { useRouter } from 'next/router'
import Slug from '../[prefix]'

/**
/**
 * @returns
 */
export const getStaticProps = () => {
  if (!ENABLE_AUTH_ROUTES) {
    return {
      notFound: true
    }
  }

  return {
    props: legacyRouteProps()
  }
}

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const UI = props => {
  const router = useRouter()
  return <Slug {...props} msg={router?.query?.msg} title={'授权结果'} />
}

export default UI
