import BLOG from '@/blog.config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';

/**
 * 个人简介页面
 */
const About = props => {
  const { locale } = useGlobal()

  return (
    <div className='pt-6 md:pt-8'>
      <div className='max-w-3xl mx-auto px-4'>
        {/* ====== 个人信息卡片 ====== */}
        <div className='bg-white dark:bg-hexo-black-gray rounded-xl shadow-sm overflow-hidden mb-8'>
          <div className='h-36 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600'></div>
          <div className='px-6 pb-6 -mt-8'>
            <div className='text-center'>
              <h1 className='text-3xl font-bold mt-6 dark:text-gray-100'>沈哲</h1>
              <p className='text-base text-gray-500 dark:text-gray-400 mt-1'>
                政治学理论 · 硕士研究生 | 吉林大学 行政学院
              </p>
              <div className='flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3 text-sm text-gray-500 dark:text-gray-400'>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fas fa-envelope text-indigo-500'></i> szjluedu2024@163.com
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fab fa-github text-purple-500'></i> github.com/Sen-platotech
                </span>
              </div>
            </div>

            <div className='mt-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center max-w-xl mx-auto'>
              <p>
                政治学理论方向硕士生，关注基层治理、科技政策与数字时代的公共治理转型。
                相信好的研究需要在田野和书斋之间往返，也相信公共知识值得被认真书写。
              </p>
            </div>

            <div className='mt-6 flex flex-wrap justify-center gap-2'>
              <span className='px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full'>科技政策</span>
              <span className='px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full'>公共治理</span>
              <span className='px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full'>AI + 社会科学</span>
              <span className='px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm rounded-full'>知识写作</span>
            </div>
          </div>
        </div>

        {/* ====== 关于我 ====== */}
        <Section title='关于我' icon='fas fa-user-pen'>
          <div className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4'>
            <p>
              目前在吉林大学行政学院攻读政治学理论硕士学位，研究兴趣集中在基层治理、科技治理以及数字时代公共风险的整体性应对。本科毕业于山西大学政治学与行政学专业，期间曾在德国图宾根大学交流，修读欧洲认同与人工智能伦理课程。这些经历让我逐渐找到自己的问题意识——在技术变迁与社会结构交织的节点上理解治理逻辑的演变。
            </p>
            <p>
              学术之余，我也在尝试将公共知识带到更广的受众面前。运营着自己的知识类社交媒体账号，以相对平实的语言讨论政治学与公共治理议题；也曾作为通讯员在《安徽青年报》《山西晚报》等媒体发表过一些报道。这些写作实践让我体会到，好的学术训练不应当只停留在论文里。
            </p>
            <p>
              这个博客记录了我对政治学、科技与社会交叉议题的一些思考，以及日常阅读与研究的碎片。欢迎交流。
            </p>
          </div>
        </Section>

        {/* ====== 教育 ====== */}
        <Section title='教育' icon='fas fa-graduation-cap'>
          <div className='space-y-1'>
            <TimelineItem
              title='吉林大学 · 政治学理论（硕士）'
              period='2024 – 2027 在读'
              details={[]}
            />
            <TimelineItem
              title='山西大学 · 政治学与行政学（学士）'
              period='2020 – 2024'
              details={[]}
            />
            <TimelineItem
              title='图宾根大学（德国）· 国际交流'
              period=''
              details={[]}
            />
          </div>
        </Section>

        {/* ====== 研究与经历 ====== */}
        <Section title='研究与经历' icon='fas fa-compass'>
          <div className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4'>
            <p>
              研究方面，主要关注科技政策与公共治理的交汇地带。曾参与合成生物学治理与科学传播课题，独立撰写政策咨询报告；
              也在大学生创新创业训练计划中带领团队完成乡村治理的实地调研，获评国家级优秀项目。目前正在撰写关于数字政府与
              政策话语方面的论文。
            </p>
            <p>
              实践方面，先后在华大基因研究院参与科技政策与伦理治理工作，涉及政策研究简报撰写、科研管理流程优化以及
              多智能体伦理审查框架的设计（Ethics Council，已在 GitHub 开源）。同时也在大语言模型领域担任政治学方向的外聘专家，
              参与评测数据集构建与模型能力诊断。此外还参与过财政绩效评价、社会调查（CFPS 中国家庭追踪调查）等不同类型的实务工作。
            </p>
          </div>
        </Section>

        {/* ====== 联系 ====== */}
        <Section title='联系' icon='fas fa-envelope'>
          <div className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center'>
            <p className='mb-3'>可以通过以下方式找到我：</p>
            <div className='flex flex-wrap justify-center gap-4'>
              <a href='mailto:szjluedu2024@163.com' className='inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors'>
                <i className='fas fa-envelope'></i> szjluedu2024@163.com
              </a>
              <a href='https://github.com/Sen-platotech' target='_blank' rel='noreferrer' className='inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <i className='fab fa-github'></i> GitHub
              </a>
            </div>
          </div>
        </Section>

        <div className='text-center text-xs text-gray-400 dark:text-gray-600 mt-8 pb-8'>
          © {new Date().getFullYear()} 沈哲
        </div>
      </div>
    </div>
  )
}

function Section ({ title, icon, children }) {
  return (
    <div className='bg-white dark:bg-hexo-black-gray rounded-xl shadow-sm overflow-hidden mb-8'>
      <div className='px-6 py-5'>
        <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2'>
          <i className={`${icon} text-indigo-500 text-lg`}></i>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

function TimelineItem ({ title, period, details }) {
  return (
    <div className='border-l-2 border-indigo-300 dark:border-indigo-600 pl-4 ml-4 pb-4'>
      <div className='flex items-baseline justify-between flex-wrap gap-x-2'>
        <h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>{title}</h4>
        {period && (
          <span className='text-xs text-gray-400 dark:text-gray-500 shrink-0'>{period}</span>
        )}
      </div>
      {details.length > 0 && (
        <ul className='mt-1.5 space-y-1'>
          {details.map((d, i) => (
            <li key={i} className='text-sm text-gray-600 dark:text-gray-400 flex gap-2'>
              <span className='text-gray-300 dark:text-gray-600 mt-1 shrink-0'>–</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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
