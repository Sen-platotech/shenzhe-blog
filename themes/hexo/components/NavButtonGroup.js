import SmartLink from '@/components/SmartLink'

/**
 * 首页导航按钮的自定义显示顺序
 * 数组中的分类名按想要的顺序排列，未列出的保持原有排序
 */
const CATEGORY_DISPLAY_ORDER = [
  '个人简介',
  '研究分享',
  '心情随笔'
]

/**
 * 按自定义顺序重新排列分类选项
 */
function sortCategoryOptions(categoryOptions) {
  if (!categoryOptions) return []
  
  return [...categoryOptions].sort((a, b) => {
    const indexA = CATEGORY_DISPLAY_ORDER.indexOf(a.name)
    const indexB = CATEGORY_DISPLAY_ORDER.indexOf(b.name)
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return 0
  })
}

/**
 * 获取分类按钮的链接地址
 * 个人简介使用单独的 /about 页面
 */
function getCategoryHref(name) {
  if (name === '个人简介') {
    return '/about'
  }
  return `/category/${name}`
}


/**
 * 首页导航大按钮组件
 * @param {*} props
 * @returns
 */
const NavButtonGroup = (props) => {
  const { categoryOptions: rawCategoryOptions } = props
  const categoryOptions = sortCategoryOptions(rawCategoryOptions)
  if (!categoryOptions || categoryOptions.length === 0) {
    return <></>
  }

  return (
    <nav id='home-nav-button' className={'w-full z-10 md:h-72 md:mt-6 xl:mt-32 px-5 py-2 mt-8 flex flex-wrap md:max-w-6xl space-y-2 md:space-y-0 md:flex justify-center max-h-80 overflow-auto'}>
      {categoryOptions?.map(category => {
        return (
          <SmartLink
            key={`${category.name}`}
            title={`${category.name}`}
            href={getCategoryHref(category.name)}
            passHref
            className='text-center shadow-text w-full sm:w-4/5 md:mx-6 md:w-40 md:h-14 lg:h-20 h-14 justify-center items-center flex border-2 cursor-pointer rounded-lg glassmorphism hover:bg-white hover:text-black duration-200 hover:scale-105 transform'>
               {category.name}
            </SmartLink>
        )
      })}
    </nav>
  )
}
export default NavButtonGroup
