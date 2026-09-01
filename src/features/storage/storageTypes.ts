import type { Appearance } from '../../app/providers/themeContext'
import type { VerificationStatus } from '../video-verification/verificationTypes'

export type LocalSettings = {
  automaticCleanup: boolean
  optimizationPreference: 'lossless' | 'conversion'
  theme: Appearance
}

export type ProcessingHistoryEntry = {
  completedAt: number
  duration: number | null
  fileName: string
  id: string
  mode: 'lossless' | 'conversion'
  processingTime: number
  resolution: string | null
  status: VerificationStatus
}

export type TemporaryMetadata = {
  expiresAt: number
  id: string
  kind: string
}

export type StorageQuota = {
  available: boolean
  quota: number | null
  usage: number | null
  usageRatio: number | null
}
