import type { ImageDestinationProfile } from '../images/imageProfiles'

/**
 * No accessible official TikTok photo-post specification page yielded
 * extractable technical content in this session (see
 * docs/SOCIAL_MEDIA_RESEARCH.md). All numeric fields are UNKNOWN, so the
 * engine only ever preserves the original image unchanged.
 */
export const TIKTOK_IMAGE_PROFILE: Record<string, ImageDestinationProfile> = {
  photoPost: {
    limitations: 'No verified official TikTok photo-post specification exists; only the original file is used, unmodified.',
    notes: 'No verified numeric width or aspect-ratio requirement was found for this destination.',
    qualityStrategy: 'preserve-original',
    recommendedFormat: 'UNKNOWN',
    recommendedMaxWidth: 'UNKNOWN',
    recommendedMinWidth: 'UNKNOWN',
    recommendedWidthToHeightRatio: 'UNKNOWN',
    sourceDocumentation: 'UNKNOWN — no accessible official TikTok photo-post specification was verified.',
    targetSurface: 'Photo Post',
  },
}
