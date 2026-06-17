import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 顶部导航 —— 结构与 styles.css 的 .nav 完全一致。
 * active: 'home' | 'archive' | 'category' | 'tag' | 'about' | null
 * hasHero: 首页为 true（初始 nav--over），其余 false（初始 nav--solid）。behavior.js 会接管后续切换。 */
export default function Nav({ active, hasHero }) {
  const seal = siteConfig('SHUJUAN_AUTHOR_SEAL', CONFIG.SHUJUAN_AUTHOR_SEAL, CONFIG)
  const title = siteConfig('TITLE') || '沈哲的博客'
  const link = (href, key, label) => (
    <li>
      <SmartLink className={'nav__link' + (active === key ? ' active' : '')} href={href}>
        {label}
      </SmartLink>
    </li>
  )
  return (
    <nav className={'nav ' + (hasHero ? 'nav--over' : 'nav--solid')}>
      <SmartLink className='nav__brand' href='/'>
        <span className='seal cjk'>{seal}</span>
        <span className='cjk'>{title}</span>
      </SmartLink>
      <ul className='nav__menu'>
        {link('/', 'home', '首页')}
        {link('/archive', 'archive', '归档')}
        {link('/category', 'category', '分类')}
        {link('/tag', 'tag', '标签')}
        {link('/about', 'about', '关于')}
      </ul>
      <div className='nav__tools'>
        <SmartLink className='icon-btn' aria-label='搜索' href='/search'>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
            <circle cx='11' cy='11' r='7' />
            <path d='M21 21l-4.3-4.3' />
          </svg>
        </SmartLink>
        <button className='icon-btn' data-theme-toggle aria-label='切换明暗'>
          <svg className='ico-sun' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
            <circle cx='12' cy='12' r='4' />
            <path d='M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19' />
          </svg>
          <svg className='ico-moon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
            <path d='M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 009.8 9.8z' />
          </svg>
        </button>
        <button className='icon-btn nav__burger' aria-label='菜单'>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
            <path d='M4 7h16M4 12h16M4 17h16' />
          </svg>
        </button>
      </div>
    </nav>
  )
}
