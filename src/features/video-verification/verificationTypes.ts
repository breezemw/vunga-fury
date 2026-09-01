import type { VideoMetadata } from '../video-analysis/videoTypes'

export type VerificationMode = 'lossless' | 'conversion'
export type VerificationStatus = 'preserved' | 'reencoded' | 'inconclusive' | 'failed'

export type MetadataComparison = {
  label: string
  original: string
  output: string
  matches: boolean | null
}

export type VerificationResult = {
  comparisons: MetadataComparison[]
  outputMetadata: VideoMetadata
  outputHash: string | null
  outputHashAlgorithm: 'SHA-256' | null
  status: VerificationStatus
  success: boolean
  warnings: string[]
}

export type VerificationRequest = {
  mode: VerificationMode
  original: VideoMetadata
  output: VideoMetadata
  outputFile: File
}
