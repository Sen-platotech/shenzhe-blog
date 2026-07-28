import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef } from 'react'

/**
 * 二维码生成
 */
export default function QrCode({ value }) {
  const containerRef = useRef(null)
  const qrCodeCDN =
    process.env.NEXT_PUBLIC_QR_CODE_CDN ||
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'

  useEffect(() => {
    let qrcode
    let cancelled = false
    const container = containerRef.current
    if (!value) {
      return
    }
    loadExternalResource(qrCodeCDN, 'js')
      .then(() => {
        const QRCode = window?.QRCode
        if (cancelled || typeof QRCode === 'undefined' || !container) return
        container.replaceChildren()
        qrcode = new QRCode(container, {
          text: value,
          width: 256,
          height: 256,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
      qrcode?.clear()
      container?.replaceChildren()
    }
  }, [qrCodeCDN, value])

  return <div ref={containerRef} aria-label='文章二维码' />
}
