import type { ImageDestinationProfile } from '../images/imageProfiles'

/**
 * Verified source: https://help.instagram.com/1631821640426723
 * "When you share a photo that has a width between 320 and 1080 pixels, we keep
 * that photo at its original resolution as long as the photo's aspect ratio is
 * between 1.91:1 and 3:4." Narrower photos are enlarged to 320px; wider photos
 * are downsized to 1080px. The source text does not distinguish Feed/Story/Reel
 * cover surfaces, so the same verified rule is applied to all three.
 */
const INSTAGRAM_PHOTO_RULE: Omit<ImageDestinationProfile, 'targetSurface'> = {
  limitations:
    'Instagram may still crop or otherwise process the image after upload; this rule only describes what Instagram itself documents about resolution handling.',
  notes:
    'Instagram keeps a photo at its original resolution when its width is between 320 and 1080px and its aspect ratio is between 1.91:1 and 3:4. Otherwise it is resized (and out-of-range aspect ratios are cropped by Instagram, not by this tool).',
  qualityStrategy: 'controlled-conversion-when-required',
  recommendedFormat: 'UNKNOWN',
  recommendedMaxWidth: 1080,
  recommendedMinWidth: 320,
  recommendedWidthToHeightRatio: { max: 1.91, min: 0.75 },
  sourceDocumentation: 'https://help.instagram.com/1631821640426723',
}

export const INSTAGRAM_IMAGE_PROFILE: Record<string, ImageDestinationProfile> = {
  feedPost: { ...INSTAGRAM_PHOTO_RULE, targetSurface: 'Feed Post' },
  reel: { ...INSTAGRAM_PHOTO_RULE, targetSurface: 'Reel Cover' },
  story: { ...INSTAGRAM_PHOTO_RULE, targetSurface: 'Story' },
}
