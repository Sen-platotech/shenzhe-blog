/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * @returns
 */
const Style = () => {
  // 从配置中获取主题色，如果没有配置则使用默认值 #928CEE
  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};
      }

      // 底色
      #theme-hexo body {
        background-color: #f5f5f5;
      }
      .dark #theme-hexo body {
        background-color: black;
      }

      /*  菜单下划线动画 */
      #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(
          var(--theme-color),
          var(--theme-color)
        );
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
      }

      #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--theme-color);
      }

      /* 文章列表中标题行悬浮时的文字颜色 */
      #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }

      /* 下拉菜单悬浮背景色 */
      #theme-hexo li[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* tag标签悬浮背景色 */
      #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 社交按钮悬浮颜色 */
      #theme-hexo i[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo i[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* MenuGroup 悬浮颜色 */
      #theme-hexo #nav div[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo #nav div[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* 最新发布文章悬浮颜色 */
      #theme-hexo div[class*='hover:text-indigo-600']:hover,
      #theme-hexo div[class*='hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* 分页组件颜色 */
      #theme-hexo .text-indigo-400 {
        color: var(--theme-color) !important;
      }
      #theme-hexo .border-indigo-400 {
        border-color: var(--theme-color) !important;
      }
      #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
        color: white !important;
      }
      /* 移动设备下，搜索组件中选中分类的高亮背景色 */
      #theme-hexo div[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo .hover\:bg-indigo-400:hover {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo .bg-indigo-400 {
        background-color: var(--theme-color) !important;
      }
      #theme-hexo a[class*='hover:bg-indigo-600']:hover {
        background-color: var(--theme-color) !important;
        color: white !important;
      }

      /* 右下角悬浮按钮背景色 */
      #theme-hexo .bg-indigo-500 {
        background-color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:bg-indigo-500 {
        background-color: var(--theme-color) !important;
      }

      // 移动设备菜单栏选中背景色
      #theme-hexo div[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 文章浏览进度条颜色 */
      #theme-hexo .bg-indigo-600 {
        background-color: var(--theme-color) !important;
      }
      /* 当前浏览位置标题高亮颜色 */
      #theme-hexo .border-indigo-800 {
        border-color: var(--theme-color) !important;
      }
      #theme-hexo .text-indigo-800 {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:text-indigo-400 {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:border-indigo-400 {
        border-color: var(--theme-color) !important;
      }
      .dark #theme-hexo .dark\:border-white {
        border-color: var(--theme-color) !important;
      }
      /* 目录项悬浮时的字体颜色 */
      #theme-hexo a[class*='hover:text-indigo-800']:hover {
        color: var(--theme-color) !important;
      }
      /* 深色模式下目录项的默认文字颜色和边框线颜色 */
      .dark #theme-hexo .catalog-item {
        color: white !important;
        border-color: white !important;
      }
      .dark #theme-hexo .catalog-item:hover {
        color: var(--theme-color) !important;
      }
      /* 深色模式下当前高亮标题的边框线颜色 */
      .dark #theme-hexo .catalog-item.font-bold {
        border-color: var(--theme-color) !important;
      }

      /* 文章底部版权声明组件左侧边框线颜色 */
      #theme-hexo .border-indigo-500 {
        border-color: var(--theme-color) !important;
      }

      /* 归档页面文章列表项悬浮时左侧边框线颜色 */
      #theme-hexo li[class*='hover:border-indigo-500']:hover {
        border-color: var(--theme-color) !important;
      }

      /* 自定义右键菜单悬浮高亮颜色 */
      #theme-hexo .hover\:bg-blue-600:hover {
        background-color: var(--theme-color) !important;
      }
      .dark #theme-hexo li[class*='dark:hover:border-indigo-300']:hover {
        border-color: var(--theme-color) !important;
      }
      /* 深色模式下，归档页面文章列表项默认状态左侧边框线颜色 */
      .dark #theme-hexo li[class*='dark:border-indigo-400'] {
        border-color: var(--theme-color) !important;
      }
      /* 深色模式下，归档页面文章标题悬浮时的文字颜色 */
      .dark #theme-hexo a[class*='dark:hover:text-indigo-300']:hover {
        color: var(--theme-color) !important;
      }

      /* 设置了从上到下的渐变黑色 */
      #theme-hexo .header-cover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.5) 0%,
          rgba(0, 0, 0, 0.2) 10%,
          rgba(0, 0, 0, 0) 25%,
          rgba(0, 0, 0, 0.2) 75%,
          rgba(0, 0, 0, 0.5) 100%
        );
      }

      #theme-hexo .mdx-article {
        color: #334155;
        font-size: 1rem;
        line-height: 1.92;
        letter-spacing: 0;
        word-break: break-word;
      }

      .dark #theme-hexo .mdx-article {
        color: #d1d5db;
      }

      #theme-hexo .mdx-article > * + * {
        margin-top: 1.15rem;
      }

      #theme-hexo .mdx-article h2 {
        margin-top: 2.6rem;
        padding-top: 0.4rem;
        padding-bottom: 0.35rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.35);
        color: #111827;
        font-size: 1.55rem;
        font-weight: 700;
        line-height: 1.45;
      }

      .dark #theme-hexo .mdx-article h2 {
        color: #f9fafb;
        border-bottom-color: rgba(75, 85, 99, 0.7);
      }

      #theme-hexo .mdx-article h3 {
        margin-top: 2rem;
        color: #1f2937;
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.55;
      }

      .dark #theme-hexo .mdx-article h3 {
        color: #f3f4f6;
      }

      #theme-hexo .mdx-article h4 {
        margin-top: 1.6rem;
        color: #374151;
        font-size: 1.08rem;
        font-weight: 700;
        line-height: 1.55;
      }

      .dark #theme-hexo .mdx-article h4 {
        color: #e5e7eb;
      }

      #theme-hexo .mdx-article p {
        margin-top: 1.05rem;
      }

      #theme-hexo .mdx-article a {
        color: var(--theme-color);
        border-bottom: 1px dashed color-mix(in srgb, var(--theme-color) 45%, transparent);
        transition: border-color 150ms ease, color 150ms ease;
      }

      #theme-hexo .mdx-article a:hover {
        border-bottom-color: var(--theme-color);
      }

      #theme-hexo .mdx-article img {
        margin: 1.4rem auto;
        max-width: 100%;
        border-radius: 0.75rem;
      }

      #theme-hexo .mdx-article blockquote {
        margin: 1.6rem 0;
        border-left: 3px solid var(--theme-color);
        background: color-mix(in srgb, var(--theme-color) 8%, transparent);
        padding: 0.9rem 1rem;
        color: #475569;
      }

      #theme-hexo .mdx-article blockquote p {
        margin-top: 0;
      }

      #theme-hexo .mdx-article blockquote p + p {
        margin-top: 0.65rem;
      }

      .dark #theme-hexo .mdx-article blockquote {
        color: #cbd5e1;
        background: rgba(255, 255, 255, 0.04);
      }

      #theme-hexo .mdx-article ul,
      #theme-hexo .mdx-article ol {
        padding-left: 1.5rem;
      }

      #theme-hexo .mdx-article ul {
        list-style: disc;
      }

      #theme-hexo .mdx-article ol {
        list-style: decimal;
      }

      #theme-hexo .mdx-article li + li {
        margin-top: 0.35rem;
      }

      #theme-hexo .mdx-article code {
        border-radius: 0.25rem;
        background: rgba(15, 23, 42, 0.08);
        padding: 0.12rem 0.3rem;
        font-size: 0.92em;
      }

      .dark #theme-hexo .mdx-article code {
        background: rgba(255, 255, 255, 0.12);
      }

      #theme-hexo .mdx-article pre {
        margin: 1.5rem 0;
        border-radius: 0.75rem;
        background: #0f172a;
        padding: 1rem;
        color: #f8fafc;
        overflow-x: auto;
      }

      #theme-hexo .mdx-article pre code {
        background: transparent;
        padding: 0;
      }

      /* Custem */
      .tk-footer {
        opacity: 0;
      }

      // 选中字体颜色
      ::selection {
        background: color-mix(in srgb, var(--theme-color) 30%, transparent);
      }

      // 自定义滚动条
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--theme-color);
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--theme-color) transparent;
      }
    `}</style>
  )
}

export { Style }
