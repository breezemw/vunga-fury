import { describe, expect, it } from 'vitest'
import { VERTICAL_SOCIAL_VIDEO_PROFILE } from '../../src/config/videoConfig'
import { buildSmartConversionCommand } from '../../src/features/video-optimization/smartConversionCommand'
import { createSmartConversionPlan } from '../../src/features/video-optimization/smartConverter'

describe('Smart Conversion profile', () => {
  it('discloses re-encoding and creates a separate MP4 output name', () => {
    const plan = createSmartConversionPlan('camera-original.mov')

    expect(plan.mode).toBe('conversion')
    expect(plan.outputFileName).toBe('camera-original_optimized.mp4')
    expect(plan.warnings).toContain('This mode re-encodes the video and may change image quality.')
  })

  it('uses the configured H.264/AAC profile without a frame-rate override', () => {
    const command = buildSmartConversionCommand('/input/source.mov', '/output/converted.mp4')

    expect(command).toContain('libx264')
    expect(command).toContain('aac')
    expect(command).toContain('-crf')
    expect(command).toContain(String(VERTICAL_SOCIAL_VIDEO_PROFILE.videoCrf))
    expect(command).not.toContain('-r')
    expect(command.join(' ')).toContain('force_original_aspect_ratio=decrease')
  })
})
