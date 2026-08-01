import { describe, expect, it } from 'vitest'
import {
  decryptValue,
  encryptValue,
  hashIdentifier,
  secureSecretEqual,
  signPayload,
  verifyPayload
} from './crypto'

describe('analytics cryptography', () => {
  it('encrypts IP values with a random IV and decrypts them', async () => {
    const first = await encryptValue('203.0.113.8', 'encryption-test-secret')
    const second = await encryptValue('203.0.113.8', 'encryption-test-secret')
    expect(first.ciphertext).not.toBe(second.ciphertext)
    await expect(decryptValue(first, 'encryption-test-secret')).resolves.toBe(
      '203.0.113.8'
    )
  })

  it('creates stable keyed hashes', async () => {
    await expect(hashIdentifier('203.0.113.8', 'hash-secret')).resolves.toBe(
      await hashIdentifier('203.0.113.8', 'hash-secret')
    )
  })

  it('signs and rejects tampered cookies', async () => {
    const signed = await signPayload({ authenticated: true }, 'cookie-secret')
    await expect(verifyPayload(signed, 'cookie-secret')).resolves.toEqual({
      authenticated: true
    })
    await expect(
      verifyPayload(`${signed}x`, 'cookie-secret')
    ).resolves.toBeNull()
  })

  it('compares dashboard passwords', async () => {
    await expect(secureSecretEqual('correct', 'correct')).resolves.toBe(true)
    await expect(secureSecretEqual('wrong', 'correct')).resolves.toBe(false)
  })
})
