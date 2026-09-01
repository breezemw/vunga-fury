import { describe, expect, it } from 'vitest'
import { buildLosslessRemuxCommand } from '../../src/features/video-optimization/remuxer'

describe('lossless remux command', () => {
  it('uses stream copying and faststart without a video or audio encoder', () => {
    expect(buildLosslessRemuxCommand('/input/portrait.mov', '/portrait_optimized.mp4')).toEqual([
      '-i',
      '/input/portrait.mov',
      '-map',
      '0',
      '-c',
      'copy',
      '-movflags',
      '+faststart',
      '/portrait_optimized.mp4',
    ])
  })
})
