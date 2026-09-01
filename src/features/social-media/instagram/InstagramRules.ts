import type { SocialDestinationProfile } from '../common/platformTypes'

/**
 * Instagram-specific business rules that go beyond the generic codec/container
 * checks in `common/socialOptimizer.ts`.
 */
export function describeInstagramOrientationRule(destination: SocialDestinationProfile): string | null {
  if (destination.orientation !== 'vertical') return null
  return 'Instagram Stories and Reels are designed for vertical, full-screen playback. Landscape or square video will still upload, but may be displayed with letterboxing by Instagram.'
}
