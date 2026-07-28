import { useEffect, useRef, useState } from 'react'

/**
 * 二维码生成
 */
export default function QrCode({ value }) {
  const canvasRef = useRef(null)
  const [renderFailed, setRenderFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    setRenderFailed(false)
    if (!value || !canvas) return

    import('qrcode')
      .then(qrCodeModule => {
        const toCanvas =
          qrCodeModule.toCanvas || qrCodeModule.default?.toCanvas
        if (cancelled || typeof toCanvas !== 'function') return
        return toCanvas(canvas, value, {
          errorCorrectionLevel: 'H',
          width: 256,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
      })
      .catch(() => {
        if (!cancelled) setRenderFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [value])

  return (
    <>
      <canvas
        ref={canvasRef}
        role='img'
        aria-label='文章二维码'
        hidden={renderFailed}
      />
      {renderFailed && (
        <span className='qr-code__error' role='status'>
          二维码暂不可用，请复制文章链接。
        </span>
      )}
    </>
  )
}
