export type VideoMetadata = {
  fileName: string
  fileSize: number
  duration: number | null
  width: number | null
  height: number | null
  aspectRatio: string | null
  frameRate: number | null
  videoCodec: string | null
  audioCodec: string | null
  videoBitrate: number | null
  audioBitrate: number | null
  pixelFormat: string | null
  container: 'MP4' | 'MOV'
  colorInformation: string | null
  hdrInformation: string | null
  streamCount: number | null
  videoStreamCount: number | null
  audioStreamCount: number | null
}

export type FileValidationResult = {
  errors: string[]
  warnings: string[]
}

export type VideoAnalysisResult = {
  metadata: VideoMetadata
  warnings: string[]
}

export type ContainerMetadata = {
  audioBitrate: number | null
  audioCodec: string | null
  container: 'MP4' | 'MOV'
  frameRate: number | null
  videoBitrate: number | null
  videoCodec: string | null
  streamCount: number
  videoStreamCount: number
  audioStreamCount: number
}
