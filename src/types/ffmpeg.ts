export type FfmpegEngineStatus = 'idle' | 'loading' | 'ready' | 'error' | 'cancelled'

export type FutureProcessingStatus =
  'idle' | 'loading' | 'analyzing' | 'processing' | 'verifying' | 'complete' | 'error' | 'cancelled'
