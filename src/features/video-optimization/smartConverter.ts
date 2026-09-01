import { VERTICAL_SOCIAL_VIDEO_PROFILE } from '../../config/videoConfig'
import type { VideoMetadata } from '../video-analysis/videoTypes'
import { createOptimizedFileName } from './losslessOptimizer'
import type { SmartConversionPlan, SmartConversionResult } from './optimizationTypes'

export function createSmartConversionPlan(fileName: string): SmartConversionPlan {
  return {
    mode: 'conversion',
    outputFileName: createOptimizedFileName(fileName),
    profileName: VERTICAL_SOCIAL_VIDEO_PROFILE.name,
    reason: 'Smart Conversion creates a broadly compatible H.264/AAC MP4 output.',
    warnings: [
      'This mode re-encodes the video and may change image quality.',
      'The profile preserves the source aspect ratio and does not upscale beyond 1080 × 1920.',
    ],
  }
}

export function createSmartConversionResult(
  metadata: VideoMetadata,
  outputSize: number,
  outputFileName: string,
  processingTime: number,
  warnings: string[],
  outputMetadata: VideoMetadata,
): SmartConversionResult {
  return {
    codec: metadata.videoCodec,
    fps: metadata.frameRate,
    inputSize: metadata.fileSize,
    mode: 'conversion',
    outputFileName,
    outputSize,
    processingTime,
    reencoded: true,
    resolution: metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : null,
    outputMetadata,
    verified: true,
    warnings,
  }
}
