import BLOG from '@/blog.config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'

/**
 * 个人简介页面
 * @param {*} props
 * @returns
 */
const About = props => {
  const { locale } = useGlobal()
  const author = siteConfig('AUTHOR', '沈哲', props.NOTION_CONFIG)
  const bio = siteConfig('BIO', '', props.NOTION_CONFIG)
  const avatar = siteConfig('AVATAR', '/avatar.png', props.NOTION_CONFIG)

  return (
    <div className='pt-6 md:pt-8'>
      <div className='max-w-3xl mx-auto px-4'>
        {/* 个人资料卡片 */}
        <div className='bg-white dark:bg-hexo-black-gray rounded-xl shadow-sm overflow-hidden'>
          {/* 头部渐变封面 */}
          <div className='h-48 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'></div>

          {/* 头像和基本信息 */}
          <div className='px-6 pb-6'>
            <div className='flex flex-col items-center -mt-16'>
              <LazyImage
                src={avatar}
                className='rounded-full w-32 h-32 object-cover border-4 border-white dark:border-gray-800 shadow-md'
                alt={author}
              />
              <h1 className='text-3xl font-bold mt-4 dark:text-gray-100'>{author}</h1>
              <p className='text-gray-500 dark:text-gray-400 mt-1 text-center'>{bio}</p>
            </div>

            {/* 个人简介正文 - 占位内容 */}
            <div className='mt-8 space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed'>
              <p>
                你好！我是{author}，这个博客是我记录学习、思考和生活的地方。
              </p>
              <p>
                我深耕学术研究与软件开发两个领域，试图在这两种思维方式之间架起桥梁。
                从政治学、社会学到计算机科学，我相信跨学科的视角能带来更有深度的洞察。
              </p>
              <p>
                这里是我的个人简介页面，目前展示的是测试占位内容。
                你可以将你的个人简介发送给我，我来替换这些占位文字。
              </p>
            </div>

            {/* 分隔线 */}
            <div className='border-t border-gray-100 dark:border-gray-700 my-6'></div>

            {/* 联系信息 - 占位 */}
            <h2 className='text-xl font-bold mb-4 dark:text-gray-100'>联系我</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center'>
                  <i className='fas fa-envelope text-indigo-500'></i>
                </div>
                <div>
                  <p className='text-sm font-medium dark:text-gray-200'>邮箱</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>your-email@example.com</p>
                </div>
              </div>
              <div className='flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center'>
                  <i className='fab fa-github text-purple-500'></i>
                </div>
                <div>
                  <p className='text-sm font-medium dark:text-gray-200'>GitHub</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>github.com/your-username</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * SSG 获取页面数据
 * @returns
 */
export function getStaticProps() {
  const props = getContentIndexProps()
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

export default About
