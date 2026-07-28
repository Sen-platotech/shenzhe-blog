import { render, screen, waitFor } from '@testing-library/react'
import QrCode from '@/components/QrCode'

const mockToCanvas = jest.fn()

jest.mock('qrcode', () => ({
  toCanvas: (...args) => mockToCanvas(...args)
}))

describe('QrCode', () => {
  beforeEach(() => {
    mockToCanvas.mockResolvedValue(undefined)
  })

  it('regenerates the QR code when the shared article URL changes', async () => {
    const { rerender } = render(<QrCode value='https://shenzhe.org/article/a' />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenLastCalledWith(
        expect.any(HTMLCanvasElement),
        'https://shenzhe.org/article/a',
        expect.objectContaining({
          errorCorrectionLevel: 'H'
        })
      )
    })

    rerender(<QrCode value='https://shenzhe.org/article/b' />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenLastCalledWith(
        expect.any(HTMLCanvasElement),
        'https://shenzhe.org/article/b',
        expect.objectContaining({
          errorCorrectionLevel: 'H'
        })
      )
    })
  })

  it('shows a useful fallback when local QR rendering fails', async () => {
    mockToCanvas.mockRejectedValueOnce(new Error('render failed'))

    render(<QrCode value='https://shenzhe.org/article/a' />)

    expect(
      await screen.findByText('二维码暂不可用，请复制文章链接。')
    ).toBeInTheDocument()
  })

  it('can render a new URL after an earlier QR render failed', async () => {
    mockToCanvas.mockRejectedValueOnce(new Error('render failed'))
    const { rerender } = render(
      <QrCode value='https://shenzhe.org/article/a' />
    )

    expect(
      await screen.findByText('二维码暂不可用，请复制文章链接。')
    ).toBeInTheDocument()

    mockToCanvas.mockResolvedValueOnce(undefined)
    rerender(<QrCode value='https://shenzhe.org/article/b' />)

    await waitFor(() => {
      expect(mockToCanvas).toHaveBeenLastCalledWith(
        expect.any(HTMLCanvasElement),
        'https://shenzhe.org/article/b',
        expect.any(Object)
      )
    })
    expect(
      screen.queryByText('二维码暂不可用，请复制文章链接。')
    ).not.toBeInTheDocument()
  })
})
