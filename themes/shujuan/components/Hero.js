import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 首页 Hero —— 结构与 styles.css 的 .hero 完全一致。
 * 背景图用 config 的 banner 覆盖（内联 backgroundImage，保留 CSS 里的 scale/veil）。
 * 打字机由 behavior.js 读取 [data-type] 驱动。 */
export default function Hero() {
  const title = siteConfig('TITLE') || '沈哲的博客'
  const banner = siteConfig('SHUJUAN_HOME_BANNER_IMAGE', CONFIG.SHUJUAN_HOME_BANNER_IMAGE, CONFIG)
  const greeting = siteConfig('SHUJUAN_GREETING_WORDS', CONFIG.SHUJUAN_GREETING_WORDS, CONFIG)
  return (
    <header className='hero'>
      <div className='hero__bg' style={{ backgroundImage: `url("${banner}")` }} />
      <div className='hero__veil' />
      <div className='hero__inner'>
        <h1 className='hero__title cjk'>{title}</h1>
        <p className='hero__type cjk' data-type={greeting} />
        <div className='hero__rule' />
        <div className='hero__cards'>
          <SmartLink className='hcard' href='/about'>
            <span className='hcard__idx'>01</span>
            <span className='hcard__name cjk'>个人简介</span>
            <span className='hcard__desc'>政治学人 · 程序员 · INFP，关于我的一切</span>
            <span className='hcard__arrow'>走近 →</span>
          </SmartLink>
          <SmartLink className='hcard' href='/category/研究分享'>
            <span className='hcard__idx'>02</span>
            <span className='hcard__name cjk'>研究分享</span>
            <span className='hcard__desc'>政治、社会史与民间信仰的长读笔记</span>
            <span className='hcard__arrow'>阅读 →</span>
          </SmartLink>
          <SmartLink className='hcard' href='/category/心情随笔'>
            <span className='hcard__idx'>03</span>
            <span className='hcard__name cjk'>心情随笔</span>
            <span className='hcard__desc'>闭门读书之余，写给自己的只言片语</span>
            <span className='hcard__arrow'>翻阅 →</span>
          </SmartLink>
        </div>
      </div>
      <a className='hero__scroll' href='#recent'>
        <span>开始阅读</span>
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.4'>
          <path d='M6 9l6 6 6-6' />
        </svg>
      </a>
    </header>
  )
}
