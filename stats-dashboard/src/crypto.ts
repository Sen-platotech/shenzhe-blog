import type { EncryptedValue } from './types'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '')
}

export function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', encoder.encode(value))
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function aesKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    await sha256(secret),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  )
}

export async function hashIdentifier(
  value: string,
  secret: string
): Promise<string> {
  const key = await hmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return toBase64Url(new Uint8Array(signature))
}

export async function encryptValue(
  value: string,
  secret: string
): Promise<EncryptedValue> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await aesKey(secret),
    encoder.encode(value)
  )
  return {
    ciphertext: toBase64Url(new Uint8Array(ciphertext)),
    iv: toBase64Url(iv)
  }
}

export async function decryptValue(
  encrypted: EncryptedValue,
  secret: string
): Promise<string> {
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(encrypted.iv) },
    await aesKey(secret),
    fromBase64Url(encrypted.ciphertext)
  )
  return decoder.decode(plaintext)
}

export async function signPayload(
  payload: object,
  secret: string
): Promise<string> {
  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await hashIdentifier(encoded, secret)
  return `${encoded}.${signature}`
}

export async function verifyPayload<T extends object>(
  value: string | undefined,
  secret: string
): Promise<T | null> {
  if (!value) return null
  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) return null
  const key = await hmacKey(secret)
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    fromBase64Url(signature),
    encoder.encode(encoded)
  )
  if (!valid) return null
  try {
    return JSON.parse(decoder.decode(fromBase64Url(encoded))) as T
  } catch {
    return null
  }
}

export async function secureSecretEqual(
  input: string,
  secret: string
): Promise<boolean> {
  const [inputHash, secretHash] = await Promise.all([
    sha256(input),
    sha256(secret)
  ])
  const left = new Uint8Array(inputHash)
  const right = new Uint8Array(secretHash)
  let diff = left.length ^ right.length
  for (let i = 0; i < left.length; i += 1) diff |= left[i]! ^ right[i]!
  return diff === 0
}
