import type { ImageDestinationProfile } from '../images/imageProfiles'

/**
 * No accessible official Facebook image specification page was verified in
 * this session (see docs/SOCIAL_MEDIA_RESEARCH.md). All numeric fields are
 * UNKNOWN, so the engine only ever preserves the original image unchanged.
 */
const UNVERIFIED_FACEBOOK_PHOTO_RULE: Omit<ImageDestinationProfile, 'targetSurface'> = {
  limitations: 'No verified official Facebook image specification exists; only the original file is used, unmodified.',
  notes: 'No verified numeric width or aspect-ratio requirement was found for this destination.',
  qualityStrategy: 'preserve-original',
  recommendedFormat: 'UNKNOWN',
  recommendedMaxWidth: 'UNKNOWN',
  recommendedMinWidth: 'UNKNOWN',
  recommendedWidthToHeightRatio: 'UNKNOWN',
  sourceDocumentation: 'UNKNOWN — no accessible official Facebook image specification was verified.',
}

export const FACEBOOK_IMAGE_PROFILE: Record<string, ImageDestinationProfile> = {
  feedPost: { ...UNVERIFIED_FACEBOOK_PHOTO_RULE, targetSurface: 'Feed Post' },
  story: { ...UNVERIFIED_FACEBOOK_PHOTO_RULE, targetSurface: 'Story' },
}
