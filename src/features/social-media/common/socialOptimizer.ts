import type { SocialImagePreparationResult } from '../images/imageComparison'
import type { ImageDestinationProfile } from '../images/imageProfiles'
import type { VideoMetadata } from '../../video-analysis/videoTypes'
import type {
  OptimizationPlan,
  SmartConversionPlan,
} from '../../video-optimization/optimizationTypes'
import type { VerificationStatus } from '../../video-verification/verificationTypes'
import type { QualityResultCategory } from './qualityCategory'
import type { SocialDestinationProfile, SocialPlatformProfile } from './platformTypes'

export type SocialProcessingStatus =
  | 'already-optimal'
  | 'lossless-optimization'
  | 'requires-conversion'
  | 'unsupported'

export type SocialDecision = {
  destination: SocialDestinationProfile
  reason: string
  status: SocialProcessingStatus
  warnings: string[]
}

const STREAM_COPY_VIDEO_CODECS = ['H.264', 'HEVC']

function sanitizeBaseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'video'
}

/**
 * Evaluates a local video against one destination profile.
 * The result never claims control over platform-side processing.
 */
export function evaluateSocialVideo(
  metadata: VideoMetadata,
  destination: SocialDestinationProfile,
): SocialDecision {
  const warnings: string[] = []

  if (destination.mediaType !== 'video' || !destination.supportsVideoOptimization) {
    return {
      destination,
      reason: 'This destination is for image media. Local video preparation does not apply here.',
      status: 'unsupported',
      warnings,
    }
  }

  if (metadata.container !== 'MP4' && metadata.container !== 'MOV') {
    return {
      destination,
      reason: 'This container is not supported for local preparation.',
      status: 'unsupported',
      warnings,
    }
  }

  if (
    destination.orientation === 'vertical' &&
    metadata.width !== null &&
    metadata.height !== null &&
    metadata.height <= metadata.width
  ) {
    warnings.push(
      'This destination favors vertical video. VUNGA FURY does not crop or reframe video automatically, so the original orientation is kept.',
    )
  }

  const hasCompatibleVideoCodec = Boolean(
    metadata.videoCodec && STREAM_COPY_VIDEO_CODECS.some((codec) => metadata.videoCodec?.startsWith(codec)),
  )
  const hasCompatibleAudioCodec = !metadata.audioCodec || metadata.audioCodec.startsWith('AAC')

  if (hasCompatibleVideoCodec && hasCompatibleAudioCodec) {
    const alreadyOptimal =
      metadata.container === 'MP4' &&
      (destination.orientation !== 'vertical' ||
        metadata.width === null ||
        metadata.height === null ||
        metadata.height > metadata.width)
    return {
      destination,
      reason: alreadyOptimal
        ? 'The detected streams are already compatible. A lossless container pass is still applied to confirm progressive-playback metadata.'
        : 'The detected streams are compatible; container-level stream copying can be used without re-encoding.',
      status: alreadyOptimal ? 'already-optimal' : 'lossless-optimization',
      warnings,
    }
  }

  return {
    destination,
    reason:
      'The detected streams are not compatible with local stream copying for this destination; a controlled re-encode is required.',
    status: 'requires-conversion',
    warnings: [...warnings, 'This mode re-encodes the video and may change image quality.'],
  }
}

/**
 * Builds the smallest justified processing plan for a decision, reusing the
 * existing tested lossless/Smart Conversion engine. Returns null when unsupported.
 */
export function createSocialVideoPlan(
  fileName: string,
  platformKey: string,
  decision: SocialDecision,
): OptimizationPlan | SmartConversionPlan | null {
  if (decision.status === 'unsupported') return null
  const outputFileName = `${sanitizeBaseName(fileName)}_${platformKey}.mp4`

  if (decision.status === 'requires-conversion') {
    return {
      mode: 'conversion',
      outputFileName,
      profileName: decision.destination.targetSurface,
      reason: decision.reason,
      warnings: decision.warnings,
    }
  }

  return {
    mode: 'lossless',
    outputFileName,
    reason: decision.reason,
    warnings: decision.warnings,
  }
}

export function getDestination(profile: SocialPlatformProfile, destinationKey: string) {
  return profile.destinations[destinationKey] ?? null
}

/**
 * Maps the internal video decision/verification outcome onto the user-facing
 * quality vocabulary. Verification evidence always takes precedence over the
 * pre-processing plan: an unexpected re-encode is never reported as LOSSLESS.
 */
export function getVideoQualityCategory(
  decisionStatus: SocialProcessingStatus,
  verificationStatus: VerificationStatus | null,
): QualityResultCategory {
  if (verificationStatus === null || verificationStatus === 'failed' || verificationStatus === 'inconclusive') {
    return 'NOT-VERIFIED'
  }
  if (decisionStatus === 'already-optimal' && verificationStatus === 'preserved') return 'QUALITY-PRESERVING'
  if (verificationStatus === 'preserved') return 'LOSSLESS'
  return 'PLATFORM-OPTIMIZED'
}

export type SocialValidationResult = { errors: string[]; warnings: string[] }

/** Shape every platform's lazy-loaded module must expose. */
export type SocialPlatformModule = {
  analyzeVideo: (metadata: VideoMetadata, destinationKey: string) => SocialDecision | null
  imageProfile: Record<string, ImageDestinationProfile>
  planVideo: (
    fileName: string,
    metadata: VideoMetadata,
    destinationKey: string,
  ) => OptimizationPlan | SmartConversionPlan | null
  prepareImage: (file: File, destinationKey: string) => Promise<SocialImagePreparationResult | null>
  profile: SocialPlatformProfile
  validate: (metadata: VideoMetadata, destinationKey: string) => SocialValidationResult
}
