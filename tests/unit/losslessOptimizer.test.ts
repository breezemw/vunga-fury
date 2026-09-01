import { describe, expect, it } from 'vitest'
import {
  createOptimizationPlan,
  createOptimizedFileName,
} from '../../src/features/video-optimization/losslessOptimizer'

describe('lossless optimization planner', () => {
  it('approves an H.264/AAC MP4 for stream-copy optimization', () => {
    expect(
      createOptimizationPlan({
        fileName: 'portrait.mp4',
        container: 'MP4',
        videoCodec: 'H.264 (avc1.640028)',
        audioCodec: 'AAC (mp4a.40.2)',
      }).mode,
    ).toBe('lossless')
  })

  it('requires conversion when the video codec is unavailable', () => {
    expect(
      createOptimizationPlan({
        fileName: 'portrait.mov',
        container: 'MOV',
        videoCodec: null,
        audioCodec: 'AAC (mp4a.40.2)',
      }).mode,
    ).toBe('conversion')
  })

  it('requires conversion when the audio codec cannot be copied to MP4 safely', () => {
    expect(
      createOptimizationPlan({
        fileName: 'portrait.mov',
        container: 'MOV',
        videoCodec: 'HEVC (hvc1.1.6.L93.B0)',
        audioCodec: 'PCM',
      }).mode,
    ).toBe('conversion')
  })

  it('creates a separate sanitized MP4 filename', () => {
    expect(createOptimizedFileName('portrait final!.mov')).toBe('portrait_final__optimized.mp4')
  })
})
