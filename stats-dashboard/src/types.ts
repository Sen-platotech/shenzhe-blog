export type VisitEvent = {
  visitorId: string
  sessionId: string
  path: string
  title: string
  referrer: string
}

export type NormalizedClient = {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown'
  browser: string
  operatingSystem: string
}

export type OwnerIdentity = {
  label: string
  issuedAt: number
}

export type SessionIdentity = {
  authenticated: true
  issuedAt: number
  expiresAt: number
}

export type EncryptedValue = {
  ciphertext: string
  iv: string
}

export type DashboardRow = Record<string, string | number | null>
