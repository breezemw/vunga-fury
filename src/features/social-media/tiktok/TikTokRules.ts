import type { SocialDestinationProfile } from '../common/platformTypes'

export function describeTikTokOrientationRule(destination: SocialDestinationProfile): string | null {
  if (destination.orientation !== 'vertical') return null
  return 'TikTok is designed for vertical, full-screen playback. Landscape or square video will still upload, but may be displayed with letterboxing by TikTok.'
}
