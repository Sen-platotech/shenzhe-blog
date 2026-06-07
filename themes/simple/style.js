/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
  // 底色
  .dark body{
      background-color: black;
  }
  // 文本不可选取
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
  
  #theme-simple #announcement-content {
    /* background-color: #f6f6f6; */
  }
  
  #theme-simple .blog-item-title {
    color: #276077;
  }

  #theme-simple {
    --simple-accent: #276077;
    --simple-accent-hover: #dd3333;
    --simple-ink: #1f2937;
    --simple-muted: #6b7280;
    text-rendering: optimizeLegibility;
  }

  #theme-simple .article-info {
    max-width: 100%;
  }

  #theme-simple #posts-wrapper .blog-item-title {
    letter-spacing: 0;
  }

  #theme-simple #posts-wrapper article main {
    max-width: 68ch;
  }

  #theme-simple #category-list,
  #theme-simple #tags-list {
    gap: 0.35rem;
  }

  #theme-simple #category-list > a,
  #theme-simple #tags-list a {
    border-radius: 4px;
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
  }
  
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  #theme-simple .mdx-article {
    color: #374151;
    font-size: 1rem;
    line-height: 1.9;
    overflow-wrap: anywhere;
    max-width: 72ch;
  }

  .dark #theme-simple .mdx-article {
    color: #d1d5db;
  }

  #theme-simple .mdx-article > * + * {
    margin-top: 1.15rem;
  }

  #theme-simple .mdx-article h2 {
    color: #111827;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.35;
    margin-top: 2rem;
  }

  .dark #theme-simple .mdx-article h2 {
    color: #f3f4f6;
  }

  #theme-simple .mdx-article h3 {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
    margin-top: 1.75rem;
  }

  .dark #theme-simple .mdx-article h3 {
    color: #e5e7eb;
  }

  #theme-simple .mdx-article blockquote {
    border-left: 3px solid #276077;
    color: #4b5563;
    padding-left: 1rem;
    white-space: pre-line;
    font-style: italic;
  }

  #theme-simple .mdx-article p {
    text-align: left;
  }

  #theme-simple .mdx-article a {
    color: var(--simple-accent);
    border-bottom: 1px dashed rgba(39, 96, 119, 0.45);
  }

  .dark #theme-simple .mdx-article blockquote {
    color: #9ca3af;
  }

  #theme-simple .mdx-article ul,
  #theme-simple .mdx-article ol {
    padding-left: 1.5rem;
  }

  #theme-simple .mdx-article ul {
    list-style: disc;
  }

  #theme-simple .mdx-article ol {
    list-style: decimal;
  }
  
  
  /*  菜单下划线动画 */
  #theme-simple .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#dd3333, #dd3333);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
      background-size: 100% 2px;
      color: #dd3333;
      cursor: pointer;
  }
  
  

  `}</style>
}

export { Style }
