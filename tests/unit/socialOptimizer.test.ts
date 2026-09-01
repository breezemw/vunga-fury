import { describe, expect, it } from 'vitest'
import { evaluateSocialVideo, createSocialVideoPlan } from '../../src/features/social-media/common/socialOptimizer'
import { INSTAGRAM_PROFILE } from '../../src/features/social-media/instagram/InstagramProfile'
import { WHATSAPP_PROFILE } from '../../src/features/social-media/whatsapp/WhatsAppProfile'
import type { VideoMetadata } from '../../src/features/video-analysis/videoTypes'

function buildMetadata(overrides: Partial<VideoMetadata> = {}): VideoMetadata {
  return {
    fileName: 'clip.mp4',
    fileSize: 1_000_000,
    duration: 10,
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    frameRate: 30,
    videoCodec: 'H.264 (avc1.640028)',
    audioCodec: 'AAC (mp4a.40.2)',
    videoBitrate: 4_000_000,
    audioBitrate: 128_000,
    pixelFormat: 'yuv420p',
    container: 'MP4',
    colorInformation: null,
    hdrInformation: null,
    streamCount: 2,
    videoStreamCount: 1,
    audioStreamCount: 1,
    ...overrides,
  }
}

describe('evaluateSocialVideo', () => {
  it('marks a vertical, H.264/AAC MP4 as already optimal for a vertical destination', () => {
    const decision = evaluateSocialVideo(buildMetadata(), INSTAGRAM_PROFILE.destinations.reel)
    expect(decision.status).toBe('already-optimal')
  })

  it('marks a MOV with compatible streams as eligible for lossless optimization', () => {
    const decision = evaluateSocialVideo(
      buildMetadata({ container: 'MOV' }),
      INSTAGRAM_PROFILE.destinations.reel,
    )
    expect(decision.status).toBe('lossless-optimization')
  })

  it('requires conversion when the audio codec is not AAC', () => {
    const decision = evaluateSocialVideo(
      buildMetadata({ audioCodec: 'PCM' }),
      INSTAGRAM_PROFILE.destinations.post,
    )
    expect(decision.status).toBe('requires-conversion')
    expect(decision.warnings.length).toBeGreaterThan(0)
  })

  it('warns when a vertical destination receives landscape video', () => {
    const decision = evaluateSocialVideo(
      buildMetadata({ width: 1920, height: 1080 }),
      INSTAGRAM_PROFILE.destinations.story,
    )
    expect(decision.warnings.length).toBeGreaterThan(0)
  })

  it('marks image-only destinations as unsupported for video input', () => {
    const decision = evaluateSocialVideo(buildMetadata(), WHATSAPP_PROFILE.destinations.profilePhoto)
    expect(decision.status).toBe('unsupported')
  })

  it('marks unsupported containers as unsupported', () => {
    const decision = evaluateSocialVideo(
      // @ts-expect-error intentionally invalid container to test the guard
      buildMetadata({ container: 'WEBM' }),
      INSTAGRAM_PROFILE.destinations.post,
    )
    expect(decision.status).toBe('unsupported')
  })
})

describe('createSocialVideoPlan', () => {
  it('returns null for an unsupported decision', () => {
    const decision = evaluateSocialVideo(buildMetadata(), WHATSAPP_PROFILE.destinations.profilePhoto)
    expect(createSocialVideoPlan('clip.mp4', 'whatsapp', decision)).toBeNull()
  })

  it('produces a lossless plan with a platform-suffixed output name', () => {
    const decision = evaluateSocialVideo(buildMetadata(), INSTAGRAM_PROFILE.destinations.reel)
    const plan = createSocialVideoPlan('My Clip.mp4', 'instagram', decision)
    expect(plan?.mode).toBe('lossless')
    expect(plan?.outputFileName).toBe('My_Clip_instagram.mp4')
  })

  it('produces a conversion plan when a re-encode is required', () => {
    const decision = evaluateSocialVideo(
      buildMetadata({ audioCodec: 'PCM' }),
      INSTAGRAM_PROFILE.destinations.post,
    )
    const plan = createSocialVideoPlan('clip.mp4', 'instagram', decision)
    expect(plan?.mode).toBe('conversion')
  })
})
