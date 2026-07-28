import QrCode from '@/components/QrCode'
import { siteConfig } from '@/lib/config'
import { Dialog } from '@headlessui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

function shareUrlOf(post) {
  if (post?.canonicalUrl) return post.canonicalUrl
  const siteUrl = siteConfig('LINK', 'https://shenzhe.org').replace(/\/$/, '')
  const path = post?.href || `/${post?.slug || ''}`
  return new URL(path, `${siteUrl}/`).toString()
}

function isWechatBrowser() {
  return (
    typeof navigator !== 'undefined' &&
    /MicroMessenger/i.test(navigator.userAgent)
  )
}

function shareHostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'shenzhe.org'
  }
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // 微信 WebView 或权限策略可能暴露 API 却拒绝调用，继续兼容降级。
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let copied = false
  try {
    copied = Boolean(document.execCommand?.('copy'))
  } finally {
    textarea.remove()
  }
  if (!copied) {
    throw new Error('Clipboard API is unavailable')
  }
}

/**
 * 文章分享入口。系统分享、微信引导和降级逻辑都收敛在此模块内。
 */
export default function SharePanel({ post }) {
  const [dialogMode, setDialogMode] = useState(null)
  const [wechatBrowser, setWechatBrowser] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const shareUrl = shareUrlOf(post)
  const shareHost = shareHostOf(shareUrl)
  const siteTitle = siteConfig('TITLE', '沈哲的博客')
  const previewImage = post?.pageCoverThumbnail || post?.pageCover
  const showQr =
    dialogMode === 'fallback' ||
    dialogMode === 'error' ||
    dialogMode === 'cancelled'
  const shareButtonLabel = wechatBrowser ? '分享到朋友圈' : '分享文章'

  const openDialog = mode => {
    setCopied(false)
    setCopyFailed(false)
    setDialogMode(mode)
  }

  const closeDialog = useCallback(() => {
    setDialogMode(null)
    setCopied(false)
    setCopyFailed(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    setWechatBrowser(isWechatBrowser())
  }, [])

  useEffect(() => {
    if (!dialogMode) return
    document.body.classList.add('share-dialog-open')
    return () => document.body.classList.remove('share-dialog-open')
  }, [dialogMode])

  const handleShare = async () => {
    if (isWechatBrowser()) {
      openDialog('wechat')
      return
    }
    if (
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function'
    ) {
      openDialog('fallback')
      return
    }
    try {
      await navigator.share({
        title: post.title,
        text: post.summary || '',
        url: shareUrl
      })
    } catch (error) {
      // AbortError 既可能是用户关闭，也可能是设备没有可用分享目标。
      openDialog(error?.name === 'AbortError' ? 'cancelled' : 'error')
    }
  }

  const handleCopy = async () => {
    try {
      await copyText(shareUrl)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopied(false)
      setCopyFailed(true)
    }
  }

  return (
    <section className='share-panel' aria-label='分享文章'>
      <div className='share-panel__mark' aria-hidden='true'>
        <span>分</span>
      </div>
      <div className='share-panel__copy'>
        <span className='share-panel__eyebrow'>SHARE · 分享</span>
        <h2 className='share-panel__title cjk'>把这篇文章带给更多人</h2>
        <p className='share-panel__note'>
          {wechatBrowser
            ? '点击后查看右上角菜单分享步骤。'
            : '优先打开系统分享菜单；若设备不支持，可复制链接或微信扫码。'}
        </p>
      </div>
      <button
        ref={triggerRef}
        className='share-panel__button'
        type='button'
        aria-label={shareButtonLabel}
        onClick={() => void handleShare()}>
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'>
          <circle cx='18' cy='5' r='2.5' />
          <circle cx='6' cy='12' r='2.5' />
          <circle cx='18' cy='19' r='2.5' />
          <path d='m8.3 10.9 7.4-4.6M8.3 13.2l7.4 4.5' />
        </svg>
        <span>{shareButtonLabel}</span>
      </button>
      <Dialog
        open={Boolean(dialogMode)}
        onClose={closeDialog}
        initialFocus={closeRef}
        className='share-dialog__root'
        aria-label='分享到朋友圈'>
        <div className='share-dialog__backdrop' aria-hidden='true' />
        <div className='share-dialog__viewport'>
          <Dialog.Panel className='share-dialog'>
            <button
              ref={closeRef}
              type='button'
              className='share-dialog__close'
              aria-label='关闭分享窗口'
              onClick={closeDialog}>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.6'>
                <path d='m6 6 12 12M18 6 6 18' />
              </svg>
            </button>

            {dialogMode === 'wechat' && (
              <div className='share-dialog__wechat-cue' aria-hidden='true'>
                <span className='share-dialog__arrow'>↗</span>
                <span className='share-dialog__dots'>•••</span>
              </div>
            )}

            <span className='share-dialog__eyebrow'>
              {dialogMode === 'wechat' ? '微信内分享' : '分享文章'}
            </span>
            <h2 className='share-dialog__title cjk'>
              {dialogMode === 'wechat'
                ? '只差最后一步'
                : '把文章发送到微信'}
            </h2>

            {dialogMode === 'wechat' && (
              <p className='share-dialog__lead'>
                点击右上角 ···，选择「分享到朋友圈」
              </p>
            )}
            {dialogMode === 'fallback' && (
              <p className='share-dialog__lead'>
                当前浏览器无法直接打开分享菜单，请复制链接后分享到微信。
              </p>
            )}
            {dialogMode === 'error' && (
              <p className='share-dialog__lead'>
                系统分享未能打开，请复制链接后分享到微信。
              </p>
            )}
            {dialogMode === 'cancelled' && (
              <p className='share-dialog__lead'>
                系统分享已关闭，你仍可复制链接或使用二维码。
              </p>
            )}

            <div className='share-preview'>
              <div
                className={`share-preview__cover${previewImage ? ' has-image' : ''}`}
                style={
                  previewImage
                    ? { backgroundImage: `url("${previewImage}")` }
                    : undefined
                }
                aria-hidden='true'>
                {!previewImage && <span>文</span>}
              </div>
              <div className='share-preview__copy'>
                <span>{siteTitle}</span>
                <strong className='cjk'>{post.title}</strong>
                <small>{shareHost}</small>
              </div>
            </div>

            {showQr && (
              <div className='share-qr'>
                <div className='share-qr__code'>
                  <QrCode value={shareUrl} />
                </div>
                <div>
                  <strong className='cjk'>微信扫码打开文章</strong>
                  <p>也可以用另一台设备扫描二维码，打开后再分享至朋友圈。</p>
                </div>
              </div>
            )}

            <div className='share-dialog__actions'>
              <button
                className='share-dialog__copy'
                type='button'
                onClick={() => void handleCopy()}>
                {copied ? (
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'>
                    <path d='m5 12 4 4L19 6' />
                  </svg>
                ) : (
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.7'>
                    <path d='M9 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z' />
                    <path d='M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2' />
                  </svg>
                )}
                <span>{copied ? '已复制' : '复制文章链接'}</span>
              </button>
              <button
                className='share-dialog__cancel'
                type='button'
                onClick={closeDialog}>
                暂不分享
              </button>
            </div>

            <div className='share-dialog__status' aria-live='polite'>
              {copied && <p role='status'>链接已复制</p>}
              {copyFailed && (
                <>
                  <p role='alert'>
                    复制失败，请长按下方链接复制；微信内也可使用右上角「复制链接」。
                  </p>
                  <input
                    className='share-dialog__url'
                    aria-label='文章链接'
                    inputMode='url'
                    readOnly
                    value={shareUrl}
                    onFocus={event => event.currentTarget.select()}
                    onClick={event => event.currentTarget.select()}
                  />
                </>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  )
}
