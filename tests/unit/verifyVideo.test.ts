import { describe, expect, it } from 'vitest'
import { createVerificationResult } from '../../src/features/video-verification/verifyVideo'
import type { VideoMetadata } from '../../src/features/video-analysis/videoTypes'

function createMetadata(overrides: Partial<VideoMetadata> = {}): VideoMetadata {
  return {
    aspectRatio: '9:16',
    audioBitrate: 192000,
    audioCodec: 'AAC (mp4a.40.2)',
    audioStreamCount: 1,
    colorInformation: null,
    container: 'MP4',
    duration: 10,
    fileName: 'clip.mp4',
    fileSize: 1000,
    frameRate: 30,
    hdrInformation: null,
    height: 1920,
    pixelFormat: null,
    streamCount: 2,
    videoBitrate: 4000000,
    videoCodec: 'H.264 (avc1.640028)',
    videoStreamCount: 1,
    width: 1080,
    ...overrides,
  }
}

describe('output verification', () => {
  it('confirms stream preservation only for matching essential stream metadata', () => {
    const result = createVerificationResult(
      'lossless',
      createMetadata(),
      createMetadata({ fileName: 'clip_optimized.mp4' }),
      'abc',
    )
    expect(result.status).toBe('preserved')
    expect(result.success).toBe(true)
    expect(result.outputHash).toBe('abc')
  })

  it('reports re-encoding for Smart Conversion while retaining property comparisons', () => {
    const result = createVerificationResult(
      'conversion',
      createMetadata({ videoCodec: 'HEVC (hvc1)' }),
      createMetadata({ fileName: 'clip_optimized.mp4', videoCodec: 'H.264 (avc1.640028)' }),
      null,
    )
    expect(result.status).toBe('reencoded')
    expect(result.comparisons.find(({ label }) => label === 'Video codec')?.matches).toBe(false)
  })

  it('does not claim preservation when essential metadata is unavailable', () => {
    const result = createVerificationResult(
      'lossless',
      createMetadata({ frameRate: null }),
      createMetadata({ fileName: 'clip_optimized.mp4', frameRate: null }),
      null,
    )
    expect(result.status).toBe('inconclusive')
    expect(result.warnings).toContain(
      'Output is readable, but stream preservation is inconclusive because required metadata is unavailable.',
    )
  })
})
