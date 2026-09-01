import type { SocialDestinationProfile } from '../common/platformTypes'

export function describeFacebookOrientationRule(destination: SocialDestinationProfile): string | null {
  if (destination.orientation !== 'vertical') return null
  return 'Facebook Stories and Reels are designed for vertical, full-screen playback. Landscape or square video will still upload, but may be displayed with letterboxing by Facebook.'
}
