import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { fmtDate, readingTime, coverOf, categoryCover } from './helpers'

const author = () => siteConfig('AUTHOR', '沈哲', CONFIG)

/** 大图特稿卡 .feature */
export function Feature({ post, siteInfo }) {
  if (!post) return null
  const { md, year } = fmtDate(post.publishDay)
  return (
    <SmartLink className='feature reveal' href={post.href}>
      <div className='feature__media'>
        {post.category && <span className='feature__tag cjk'>{post.category}</span>}
        <img src={coverOf(post, siteInfo)} alt='' />
      </div>
      <div className='feature__body'>
        <span className='feature__date'>{`${year} 年 ${md}`}</span>
        <h3 className='feature__title cjk'>{post.title}</h3>
        <p className='feature__excerpt'>{post.summary}</p>
        <div className='feature__meta'>
          {post.category && <span>{post.category}</span>}
          <span className='dot' />
          <span>{readingTime(post.body)}</span>
          <span className='dot' />
          <span>{author()}</span>
        </div>
      </div>
    </SmartLink>
  )
}

/** 列表行 .prow（index 为 1 起的序号） */
export function PostRow({ post, index }) {
  const { md, year } = fmtDate(post.publishDay)
  const tags = (post.tags || []).slice(0, 3)
  return (
    <SmartLink className='prow reveal' href={post.href}>
      <span className='prow__num'>{String(index).padStart(2, '0')}</span>
      <span className='prow__main'>
        {post.category && <span className='prow__cat'>{post.category}</span>}
        <span className='prow__title cjk'>{post.title}</span>
        {post.summary && <span className='prow__excerpt'>{post.summary}</span>}
        {tags.length > 0 && (
          <span className='prow__tags'>
            {tags.map(t => (
              <span className='chip' key={t}>
                {t}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className='prow__date'>
        {md}
        <small>{year}</small>
      </span>
    </SmartLink>
  )
}

/** 首页「近来读与写」：1 篇特稿 + 其余列表 */
export function RecentSection({ posts = [], siteInfo }) {
  const feature = posts[0]
  const rest = posts.slice(1)
  return (
    <section className='sec band' id='recent'>
      <div className='wrap'>
        <div className='sec-head reveal'>
          <div className='sec-head__l'>
            <span className='kicker'>Recent · 新近文章</span>
            <h2 className='section-title cjk'>近来读与写</h2>
          </div>
          <SmartLink className='more-link' href='/archive'>
            全部归档
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
              <path d='M5 12h14M13 6l6 6-6 6' />
            </svg>
          </SmartLink>
        </div>
        <Feature post={feature} siteInfo={siteInfo} />
        {rest.length > 0 && (
          <div className='postlist' style={{ marginTop: '18px' }}>
            {rest.map((p, i) => (
              <PostRow key={p.id || p.slug} post={p} index={i + 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/** 首页「三个角落」栏目卡 */
export function CategoryCards({ categoryOptions = [] }) {
  const cards = categoryOptions.slice(0, 3)
  return (
    <section className='sec band-2'>
      <div className='wrap'>
        <div className='sec-head reveal'>
          <div className='sec-head__l'>
            <span className='kicker'>Columns · 栏目</span>
            <h2 className='section-title cjk'>三个角落</h2>
          </div>
          <SmartLink className='more-link' href='/category'>
            全部分类
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
              <path d='M5 12h14M13 6l6 6-6 6' />
            </svg>
          </SmartLink>
        </div>
        <div className='cat-grid'>
          {cards.map((c, i) => (
            <SmartLink
              className='catcard reveal'
              data-d={String(i + 1)}
              href={`/category/${c.name}`}
              key={c.name}>
              <img className='catcard__bg' src={categoryCover(c.name)} alt='' />
              <span className='catcard__count'>{c.count} 篇</span>
              <span className='catcard__name cjk'>{c.name}</span>
              <span className='catcard__arrow'>进入栏目 →</span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}

/** 首页「关于」条 */
export function AboutStrip() {
  const seal = siteConfig('SHUJUAN_AUTHOR_SEAL', CONFIG.SHUJUAN_AUTHOR_SEAL, CONFIG)
  return (
    <section className='sec band'>
      <div className='wrap'>
        <div className='about-strip reveal'>
          <div className='avatar cjk'>{seal}</div>
          <div>
            <span className='kicker'>About · 关于我</span>
            <p className='about-strip__quote cjk' style={{ marginTop: '18px' }}>
              「闭门即是深山，
              <br />
              读书随处净土。」
            </p>
            <p className='about-strip__by'>
              我是沈哲——一个政治学人，也是一个程序员，还是一个 INFP。这里收着我读过的书、想过的问题，以及一些不便说与人听、却愿意留给时间的句子。
            </p>
            <div style={{ marginTop: '26px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <SmartLink className='btn btn--solid' href='/about'>
                认识沈哲
                <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.6'>
                  <path d='M5 12h14M13 6l6 6-6 6' />
                </svg>
              </SmartLink>
              <SmartLink className='btn btn--ghost' href='/archive'>
                翻看所有文章
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 列表页（分类 / 标签 / 分页 / 搜索结果）：内页头 + 列表行 */
export function ListPage({ posts = [], kicker, title, sub }) {
  return (
    <>
      <header className='pagehead'>
        <span className='kicker center'>{kicker}</span>
        <h1 className='pagehead__title cjk' style={{ marginTop: '18px' }}>
          {title}
        </h1>
        {sub && <p className='pagehead__sub'>{sub}</p>}
      </header>
      <section className='sec-sm band'>
        <div className='wrap' style={{ maxWidth: '880px' }}>
          <div className='postlist'>
            {posts.map((p, i) => (
              <PostRow key={p.id || p.slug} post={p} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
