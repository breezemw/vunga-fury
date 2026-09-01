import type { QualityResultCategory } from '../common/qualityCategory'
import { describeColorHandling, type ColorHandlingResult } from './imageColor'
import type { ImageMetadata } from './imageMetadata'
import type { SocialImageDecision, SocialImageStatus } from './imageOptimizer'
import type { ImagePixelComparisonResult, ImagePixelComparisonStatus } from './imageVerifier'

export type SocialImageOutputSummary = {
  fileSize: number
  height: number
  width: number
}

export type SocialImageComparison = {
  colorHandling: ColorHandlingResult
  decision: SocialImageDecision
  original: ImageMetadata
  output: SocialImageOutputSummary
  pixelComparison: ImagePixelComparisonResult
}

export function buildSocialImageComparison(
  original: ImageMetadata,
  output: SocialImageOutputSummary,
  pixelComparison: ImagePixelComparisonResult,
  wasReencoded: boolean,
  decision: SocialImageDecision,
): SocialImageComparison {
  return {
    colorHandling: describeColorHandling(wasReencoded),
    decision,
    original,
    output,
    pixelComparison,
  }
}

export type SocialImagePreparationResult = {
  comparison: SocialImageComparison
  outputBlob: Blob
  outputFileName: string
}

/**
 * Maps the internal image decision/pixel-comparison outcome onto the
 * user-facing quality vocabulary. Pixel-comparison evidence always takes
 * precedence: an image is never reported as LOSSLESS without an actual
 * matching pixel comparison.
 */
export function getImageQualityCategory(
  decisionStatus: SocialImageStatus,
  pixelStatus: ImagePixelComparisonStatus,
): QualityResultCategory {
  if (pixelStatus === 'not-compared') return 'NOT-VERIFIED'
  if (decisionStatus === 'already-optimal' && pixelStatus === 'identical') return 'QUALITY-PRESERVING'
  if (pixelStatus === 'identical') return 'LOSSLESS'
  return 'PLATFORM-OPTIMIZED'
}

