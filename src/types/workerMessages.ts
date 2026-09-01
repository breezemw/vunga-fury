import type { ContainerMetadata } from '../features/video-analysis/videoTypes'
import type { OptimizationWorkerResult } from '../features/video-optimization/optimizationTypes'
import type {
  VerificationMode,
  VerificationResult,
} from '../features/video-verification/verificationTypes'
import type { VideoMetadata } from '../features/video-analysis/videoTypes'

export type WorkerCommand =
  | { type: 'LOAD'; jobId: string }
  | { type: 'ANALYZE'; jobId: string; file: File }
  | {
      type: 'OPTIMIZE'
      jobId: string
      file: File
      inputName: string
      mode: 'lossless' | 'conversion'
      outputName: string
    }
  | {
      type: 'VERIFY'
      jobId: string
      mode: VerificationMode
      original: VideoMetadata
      output: VideoMetadata
      outputFile: File
    }
  | { type: 'CANCEL'; jobId: string }
  | { type: 'CLEANUP'; jobId: string }

export type WorkerResponse<TResult = unknown> =
  | { type: 'LOADING'; jobId: string; message: string }
  | { type: 'PROGRESS'; jobId: string; stage: string; value?: number }
  | { type: 'COMPLETE'; jobId: string; result?: TResult }
  | { type: 'ERROR'; jobId: string; message: string }
  | { type: 'CANCELLED'; jobId: string }

export type AnalysisWorkerResult = ContainerMetadata | null

export type FfmpegEngineResult = {
  coreVersion: string
}

export type FfmpegWorkerResult = FfmpegEngineResult | OptimizationWorkerResult

export type VerificationWorkerResult = VerificationResult
