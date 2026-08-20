import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 页脚 —— 结构与 styles.css 的 .foot 完全一致。 */
export default function Footer() {
  const seal = siteConfig(
    'SHUJUAN_AUTHOR_SEAL',
    CONFIG.SHUJUAN_AUTHOR_SEAL,
    CONFIG
  )
  const title = siteConfig('TITLE') || '沈哲的博客'
  const copyright = siteConfig(
    'SHUJUAN_FOOTER_COPYRIGHT',
    CONFIG.SHUJUAN_FOOTER_COPYRIGHT,
    CONFIG
  )
  const motto = siteConfig(
    'SHUJUAN_FOOTER_MOTTO',
    CONFIG.SHUJUAN_FOOTER_MOTTO,
    CONFIG
  )
  return (
    <footer className='foot'>
      <div className='wrap'>
        <div className='foot__top'>
          <div className='foot__brand'>
            <span className='foot__name cjk'>
              <span className='seal cjk'>{seal}</span>
              {title}
            </span>
            <p className='foot__bio'>
              闭门即是深山，读书随处净土。
              <br />
              记录学习与成长的点滴。
            </p>
          </div>
          <div className='foot__cols'>
            <div className='foot__col'>
              <h4>导航</h4>
              <SmartLink href='/'>首页</SmartLink>
              <SmartLink href='/archive'>归档</SmartLink>
              <SmartLink href='/category'>分类</SmartLink>
              <SmartLink href='/tag'>标签</SmartLink>
            </div>
            <div className='foot__col'>
              <h4>栏目</h4>
              <SmartLink href='/category/AI研究分享'>AI研究分享</SmartLink>
              <SmartLink href='/category/社会研究分享'>社会研究分享</SmartLink>
              <SmartLink href='/category/心情随笔'>心情随笔</SmartLink>
            </div>
            <div className='foot__col'>
              <h4>联系</h4>
              <SmartLink href='/about'>关于我</SmartLink>
              <SmartLink href='/rss/feed.xml'>RSS 订阅</SmartLink>
              <a href='https://stats.shenzhe.org/privacy'>访问统计与隐私</a>
              <a href='#'>电子邮件</a>
            </div>
          </div>
        </div>
        <div className='foot__bot'>
          <span>{copyright}</span>
          <span>{motto}</span>
        </div>
      </div>
    </footer>
  )
}
