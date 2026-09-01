import { describe, expect, it } from 'vitest'
import { evaluateSocialImage } from '../../src/features/social-media/images/imageOptimizer'
import type { ImageDestinationProfile } from '../../src/features/social-media/images/imageProfiles'
import type { ImageMetadata } from '../../src/features/social-media/images/imageMetadata'
import { INSTAGRAM_IMAGE_PROFILE } from '../../src/features/social-media/instagram/InstagramImageProfile'
import { FACEBOOK_IMAGE_PROFILE } from '../../src/features/social-media/facebook/FacebookImageProfile'

function buildImageMetadata(overrides: Partial<ImageMetadata> = {}): ImageMetadata {
  return {
    aspectRatio: '9:16',
    fileName: 'photo.jpg',
    fileSize: 500_000,
    format: 'JPEG',
    hasAlpha: false,
    height: 1350,
    width: 1080,
    ...overrides,
  }
}

describe('evaluateSocialImage', () => {
  it('keeps a photo within Instagram\'s verified width/ratio range unchanged', () => {
    const decision = evaluateSocialImage(buildImageMetadata(), INSTAGRAM_IMAGE_PROFILE.feedPost)
    expect(decision.status).toBe('already-optimal')
    expect(decision.targetWidth).toBeNull()
  })

  it('resizes down once when width exceeds the verified maximum', () => {
    const decision = evaluateSocialImage(
      buildImageMetadata({ width: 4000, height: 5000, aspectRatio: '4:5' }),
      INSTAGRAM_IMAGE_PROFILE.feedPost,
    )
    expect(decision.status).toBe('requires-resize')
    expect(decision.targetWidth).toBe(1080)
  })

  it('resizes up once when width is below the verified minimum', () => {
    const decision = evaluateSocialImage(
      buildImageMetadata({ width: 100, height: 125, aspectRatio: '4:5' }),
      INSTAGRAM_IMAGE_PROFILE.feedPost,
    )
    expect(decision.status).toBe('requires-resize')
    expect(decision.targetWidth).toBe(320)
  })

  it('warns, but does not resize, when the aspect ratio is outside the verified range', () => {
    const decision = evaluateSocialImage(
      buildImageMetadata({ width: 1080, height: 200, aspectRatio: '27:5' }),
      INSTAGRAM_IMAGE_PROFILE.feedPost,
    )
    expect(decision.status).toBe('already-optimal')
    expect(decision.warnings.length).toBeGreaterThan(0)
  })

  it('keeps the original unchanged for a platform with no verified width range', () => {
    const decision = evaluateSocialImage(buildImageMetadata(), FACEBOOK_IMAGE_PROFILE.feedPost)
    expect(decision.status).toBe('already-optimal')
    expect(decision.reason).toContain('No verified official width range')
  })

  it('never targets more than one resize pass regardless of how far out of range the source is', () => {
    const destination: ImageDestinationProfile = INSTAGRAM_IMAGE_PROFILE.feedPost
    const decision = evaluateSocialImage(
      buildImageMetadata({ width: 8000, height: 10000, aspectRatio: '4:5' }),
      destination,
    )
    expect(decision.status).toBe('requires-resize')
    expect(decision.targetWidth).toBe(destination.recommendedMaxWidth)
  })
})
