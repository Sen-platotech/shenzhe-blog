import { render, waitFor } from '@testing-library/react'
import QrCode from '@/components/QrCode'
import { loadExternalResource } from '@/lib/utils'

jest.mock('@/lib/utils', () => ({
  loadExternalResource: jest.fn().mockResolvedValue('qrcode.js')
}))

describe('QrCode', () => {
  it('regenerates the QR code when the shared article URL changes', async () => {
    const clear = jest.fn()
    const QRCode = jest.fn(() => ({ clear }))
    QRCode.CorrectLevel = { H: 'high' }
    window.QRCode = QRCode

    const { rerender } = render(<QrCode value='https://shenzhe.org/article/a' />)

    await waitFor(() => {
      expect(QRCode).toHaveBeenLastCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          text: 'https://shenzhe.org/article/a'
        })
      )
    })

    rerender(<QrCode value='https://shenzhe.org/article/b' />)

    await waitFor(() => {
      expect(QRCode).toHaveBeenLastCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          text: 'https://shenzhe.org/article/b'
        })
      )
    })
    expect(clear).toHaveBeenCalled()
    expect(loadExternalResource).toHaveBeenCalled()
  })
})
