import { useRouter } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'

/**
 * 社交信息卡
 */
export function InfoCard(props) {
  const { className, siteInfo } = props
  const router = useRouter()
  const contactEmail = siteConfig('CONTACT_EMAIL')
  const contactGithub = siteConfig('CONTACT_GITHUB')
  const contactXiaohongshu = siteConfig('CONTACT_XIAOHONGSHU')

  return (
        <Card className={className}>
            <div
                className='justify-center items-center flex py-6 dark:text-gray-100  transform duration-200 cursor-pointer'
                onClick={() => {
                  router.push('/about')
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <LazyImage src={siteInfo?.icon} className='rounded-full' width={120} alt={siteConfig('AUTHOR')} />
            </div>
            <div className='font-medium text-center text-xl pb-4'>{siteConfig('AUTHOR')}</div>
            <div className='text-sm text-center'>{siteConfig('BIO')}</div>

            {/* 联系方式 */}
            <div className='px-4 pb-4 border-b border-gray-100 dark:border-gray-700 mb-3'>
              <div className='text-xs text-gray-400 dark:text-gray-500 mb-2 text-center font-medium tracking-wide'>联 系</div>
              <div className='space-y-1.5 text-xs text-gray-500 dark:text-gray-400'>
                {contactEmail && (
                  <div className='flex items-center gap-2 justify-center'>
                    <i className='fas fa-envelope text-indigo-400 text-xs'></i>
                    <span className='truncate'>szjluedu2024@163.com</span>
                  </div>
                )}
                {contactGithub && (
                  <div className='flex items-center gap-2 justify-center'>
                    <i className='fab fa-github text-purple-400 text-xs'></i>
                    <span className='truncate'>github.com/Sen-platotech</span>
                  </div>
                )}
                {contactXiaohongshu && (
                  <div className='flex items-center gap-2 justify-center'>
                    <i className='fas fa-feather-pointed text-rose-400 text-xs'></i>
                    <span className='truncate'>小红书：晒太阳的水母叻</span>
                  </div>
                )}
                <div className='flex items-center gap-2 justify-center'>
                  <i className='fas fa-comment-dots text-green-400 text-xs'></i>
                  <span className='truncate'>公众号：爱吃奶油蛋糕的人</span>
                </div>
              </div>
            </div>

            <MenuGroupCard {...props} />
            <SocialButton />
        </Card>
  )
}
