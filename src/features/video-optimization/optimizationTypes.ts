import type { VideoMetadata } from '../video-analysis/videoTypes'

export type OptimizationPlan = {
  mode: 'lossless' | 'conversion'
  outputFileName: string
  reason: string
  warnings: string[]
}

export type SmartConversionPlan = {
  mode: 'conversion'
  outputFileName: string
  profileName: string
  reason: string
  warnings: string[]
}

export type LosslessOptimizationResult = {
  codec: string | null
  fps: number | null
  inputSize: number
  mode: 'lossless'
  outputFileName: string
  outputSize: number
  processingTime: number
  reencoded: false
  resolution: string | null
  warnings: string[]
}

export type SmartConversionResult = {
  codec: string | null
  fps: number | null
  inputSize: number
  mode: 'conversion'
  outputFileName: string
  outputSize: number
  processingTime: number
  reencoded: true
  resolution: string | null
  outputMetadata: VideoMetadata
  verified: true
  warnings: string[]
}

export type OptimizationWorkerResult = {
  output: Uint8Array
  outputFileName: string
  processingTime: number
}

export type OptimizerInput = Pick<VideoMetadata, 'audioCodec' | 'container' | 'videoCodec'>
