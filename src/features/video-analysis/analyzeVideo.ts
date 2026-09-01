import type { VideoAnalysisResult, VideoMetadata } from './videoTypes'
import { analyzeContainerInWorker } from '../../lib/workers/analysisWorkerClient'

function waitForVideoMetadata(objectUrl: string, signal?: AbortSignal) {
  return new Promise<{ duration: number; height: number; width: number }>((resolve, reject) => {
    const video = document.createElement('video')
    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('Video metadata could not be read in time.'))
    }, 15_000)

    const cleanup = () => {
      window.clearTimeout(timeout)
      signal?.removeEventListener('abort', handleAbort)
      video.removeAttribute('src')
      video.load()
    }
    const handleAbort = () => {
      cleanup()
      reject(new DOMException('Video analysis was cancelled.', 'AbortError'))
    }

    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const metadata = {
        duration: video.duration,
        height: video.videoHeight,
        width: video.videoWidth,
      }
      cleanup()
      if (!Number.isFinite(metadata.duration) || metadata.width === 0 || metadata.height === 0) {
        reject(new Error('The selected file does not contain a readable video stream.'))
        return
      }
      resolve(metadata)
    }
    video.onerror = () => {
      cleanup()
      reject(new Error('This video cannot be previewed by the current browser.'))
    }
    if (signal?.aborted) {
      handleAbort()
      return
    }
    signal?.addEventListener('abort', handleAbort, { once: true })
    video.src = objectUrl
  })
}

function getAspectRatio(width: number, height: number) {
  const greatestCommonDivisor = (first: number, second: number): number =>
    second === 0 ? first : greatestCommonDivisor(second, first % second)
  const divisor = greatestCommonDivisor(width, height)
  return `${width / divisor}:${height / divisor}`
}

export async function analyzeVideo(
  file: File,
  objectUrl: string,
  signal?: AbortSignal,
): Promise<VideoAnalysisResult> {
  const [browserMetadata, containerMetadata] = await Promise.all([
    waitForVideoMetadata(objectUrl, signal),
    analyzeContainerInWorker(file, signal).catch(() => null),
  ])

  const extension = file.name.split('.').pop()?.toLowerCase()
  const fallbackContainer = extension === 'mov' ? 'MOV' : 'MP4'
  const metadata: VideoMetadata = {
    fileName: file.name,
    fileSize: file.size,
    duration: browserMetadata.duration,
    width: browserMetadata.width,
    height: browserMetadata.height,
    aspectRatio: getAspectRatio(browserMetadata.width, browserMetadata.height),
    frameRate: containerMetadata?.frameRate ?? null,
    videoCodec: containerMetadata?.videoCodec ?? null,
    audioCodec: containerMetadata?.audioCodec ?? null,
    videoBitrate: containerMetadata?.videoBitrate ?? null,
    audioBitrate: containerMetadata?.audioBitrate ?? null,
    pixelFormat: null,
    container: containerMetadata?.container ?? fallbackContainer,
    colorInformation: null,
    hdrInformation: null,
    streamCount: containerMetadata?.streamCount ?? null,
    videoStreamCount: containerMetadata?.videoStreamCount ?? null,
    audioStreamCount: containerMetadata?.audioStreamCount ?? null,
  }

  const warnings = containerMetadata
    ? []
    : [
        'Container-level metadata was unavailable. Codec, bitrate, and frame-rate values may be unavailable.',
      ]

  return { metadata, warnings }
}
