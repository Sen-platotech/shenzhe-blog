import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 关于页 —— 结构与 About.html 一致（专属样式在 extra.css）。
 * 作为主题导出的 LayoutAbout 使用：pages/about.js 走 DynamicLayout layoutName='LayoutAbout'。 */
export default function AboutView() {
  const seal = siteConfig('SHUJUAN_AUTHOR_SEAL', CONFIG.SHUJUAN_AUTHOR_SEAL, CONFIG)
  const author = siteConfig('AUTHOR', '沈哲', CONFIG)
  return (
    <>
      <header className='about-hero'>
        <div className='wrap'>
          <div className='avatar cjk reveal'>{seal}</div>
          <h1 className='cjk reveal'>{author}</h1>
          <p className='motto cjk reveal'>闭门即是深山 · 读书随处净土</p>
        </div>
      </header>

      <section className='sec band'>
        <div className='wrap' style={{ maxWidth: '980px' }}>
          <div className='divider reveal' style={{ marginBottom: '48px' }}>
            <span className='cjk'>三种身份</span>
          </div>
          <div className='ids'>
            <div className='idcard reveal' data-d='1'>
              <svg className='ico' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.3'>
                <path d='M12 3l9 4-9 4-9-4 9-4z' />
                <path d='M5 9.5V14c0 1.7 3.1 3 7 3s7-1.3 7-3V9.5' />
              </svg>
              <h3 className='cjk'>政治学人</h3>
              <p>读政治学与社会史，关心权力、边缘与普通人的生存技术。</p>
            </div>
            <div className='idcard reveal' data-d='2'>
              <svg className='ico' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.3'>
                <path d='M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14' />
              </svg>
              <h3 className='cjk'>程序员</h3>
              <p>写代码，也用代码思考。喜欢把研究流程当成系统来设计。</p>
            </div>
            <div className='idcard reveal' data-d='3'>
              <svg className='ico' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.3'>
                <path d='M12 21s-7-4.5-9.2-9C1.3 9 2.6 5.5 6 5.5c2 0 3.2 1.4 4 2.6.8-1.2 2-2.6 4-2.6 3.4 0 4.7 3.5 3.2 6.5C19 16.5 12 21 12 21z' />
              </svg>
              <h3 className='cjk'>INFP</h3>
              <p>理想主义者。相信文字的温度，也相信安静的力量。</p>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-sm band-2'>
        <div className='wrap'>
          <div className='divider reveal' style={{ marginBottom: '46px' }}>
            <span className='cjk'>自述</span>
          </div>
          <div className='bio-body reveal'>
            <p>这是一个安静的角落。我把读过的书、想过的问题，以及一些不便说与人听、却愿意留给时间的句子，都放在这里。</p>
            <p>我的兴趣常在「边缘」：那些不被正史照亮的人与事——狐仙、盗户、流民、被耽误的婢女。我相信，理解一个社会，往往要从它不愿明说的地方开始。</p>
            <p>白天我写代码，把混乱的需求整理成可运行的系统；夜里我读书，把混乱的世界整理成可理解的故事。两件事其实是一件事：都是在为无序寻找一种秩序的语言。</p>
            <p>如果这里的某一篇文字，恰好在你脆弱的时候陪了你一会儿，那便是它最好的去处。</p>
          </div>
        </div>
      </section>

      <section className='sec-sm band'>
        <div className='wrap'>
          <div className='divider reveal' style={{ marginBottom: '42px' }}>
            <span className='cjk'>最近在做</span>
          </div>
          <div className='now-list'>
            <div className='now-row reveal'>
              <span className='k'>在读</span>
              <span className='v cjk'>
                康笑菲《狐仙崇拜》<small>中国封建王朝晚期的民间信仰与民众心理</small>
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>在写</span>
              <span className='v cjk'>一组关于「边缘力量如何生存」的社会史读书笔记</span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>在折腾</span>
              <span className='v cjk'>
                这个博客的新样子<small>更安静、更耐读的「书卷 · 夜读」设计语言</small>
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>在想</span>
              <span className='v cjk'>如何把学术的厚度，写成普通人愿意读完的故事</span>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-sm band-2'>
        <div className='wrap' style={{ textAlign: 'center' }}>
          <span className='kicker center'>Keep in touch · 保持联系</span>
          <p className='section-title cjk' style={{ margin: '18px 0 30px', fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
            愿意聊聊，随时来信
          </p>
          <div className='contact'>
            <a className='btn btn--solid' href='#'>
              写封邮件
            </a>
            <SmartLink className='btn btn--ghost' href='/rss/feed.xml'>
              RSS 订阅
            </SmartLink>
            <SmartLink className='btn btn--ghost' href='/archive'>
              读读文章
            </SmartLink>
          </div>
        </div>
      </section>
    </>
  )
}
