import SmartLink from '@/components/SmartLink'
import { categoryCover, tagSizeClass } from './helpers'

/** 分类总览 —— 内页头 + 栏目卡网格（与设计稿的 .cat-grid / .catcard 一致）。
 * /category 索引页只有 categoryOptions（无文章），故用卡片网格呈现。 */
export function CategoryIndexView({ categoryOptions = [] }) {
  return (
    <>
      <header className='pagehead'>
        <span className='kicker center'>Columns · 栏目</span>
        <h1 className='pagehead__title cjk' style={{ marginTop: '18px' }}>
          分类
        </h1>
        <p className='pagehead__sub'>AI研究分享 · 社会研究分享 · 心情随笔</p>
      </header>
      <section className='sec-sm band'>
        <div className='wrap'>
          <div className='cat-grid'>
            {categoryOptions.map((c, i) => (
              <SmartLink
                className='catcard reveal'
                data-d={String((i % 3) + 1)}
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
    </>
  )
}

/** 标签云 —— 内页头 + .cloud（字号档位按 count 映射，样式在 extra.css）。 */
export function TagCloudView({ tagOptions = [] }) {
  const max = tagOptions.reduce((m, t) => Math.max(m, t.count || 0), 0)
  return (
    <>
      <header className='pagehead'>
        <span className='kicker center'>Tags · 标签</span>
        <h1 className='pagehead__title cjk' style={{ marginTop: '18px' }}>
          标签云
        </h1>
        <p className='pagehead__sub'>顺着一个词，找到所有相关的文字</p>
      </header>
      <section className='sec band'>
        <div className='wrap'>
          <div className='cloud reveal'>
            {tagOptions.map(t => (
              <SmartLink className={`tag ${tagSizeClass(t.count, max)} cjk`} href={`/tag/${t.name}`} key={t.name}>
                {t.name}
                <span className='ct'>{t.count}</span>
              </SmartLink>
            ))}
          </div>
          <div className='divider' style={{ margin: '72px 0 0' }}>
            <span className='cjk'>读书随处净土</span>
          </div>
        </div>
      </section>
    </>
  )
}
