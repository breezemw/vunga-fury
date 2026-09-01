import type { VideoMetadata } from '../video-analysis/videoTypes'
import type {
  LosslessOptimizationResult,
  OptimizationPlan,
  OptimizerInput,
} from './optimizationTypes'

const streamCopyVideoCodecs = ['H.264', 'HEVC']

export function createOptimizedFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'video'
  return `${baseName}_optimized.mp4`
}

export function createOptimizationPlan(
  input: OptimizerInput & { fileName: string },
): OptimizationPlan {
  if (input.container !== 'MP4' && input.container !== 'MOV') {
    return {
      mode: 'conversion',
      outputFileName: createOptimizedFileName(input.fileName),
      reason: 'The input container is not supported for MP4 stream-copy output.',
      warnings: [],
    }
  }
  if (
    !input.videoCodec ||
    !streamCopyVideoCodecs.some((codec) => input.videoCodec?.startsWith(codec))
  ) {
    return {
      mode: 'conversion',
      outputFileName: createOptimizedFileName(input.fileName),
      reason: 'The detected video codec is not approved for the lossless MP4 stream-copy profile.',
      warnings: ['Use Smart Conversion to re-encode this video into a compatible MP4.'],
    }
  }
  if (input.audioCodec && !input.audioCodec.startsWith('AAC')) {
    return {
      mode: 'conversion',
      outputFileName: createOptimizedFileName(input.fileName),
      reason: 'The detected audio codec is not approved for the lossless MP4 stream-copy profile.',
      warnings: ['Use Smart Conversion to re-encode this video into a compatible MP4.'],
    }
  }
  return {
    mode: 'lossless',
    outputFileName: createOptimizedFileName(input.fileName),
    reason: 'The detected streams are eligible for container-level stream copying.',
    warnings: input.audioCodec
      ? []
      : [
          'Audio stream metadata is unavailable. Output stream preservation will require verification.',
        ],
  }
}

export function createLosslessOptimizationResult(
  metadata: VideoMetadata,
  outputSize: number,
  outputFileName: string,
  processingTime: number,
  warnings: string[],
): LosslessOptimizationResult {
  return {
    codec: metadata.videoCodec,
    fps: metadata.frameRate,
    inputSize: metadata.fileSize,
    mode: 'lossless',
    outputFileName,
    outputSize,
    processingTime,
    reencoded: false,
    resolution: metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : null,
    warnings,
  }
}
