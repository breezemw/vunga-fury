import type { ImageDestinationProfile } from '../images/imageProfiles'

/**
 * No accessible official WhatsApp image specification page was verified in
 * this session beyond the general HD-availability note in
 * docs/SOCIAL_MEDIA_RESEARCH.md. All numeric fields are UNKNOWN, so the
 * engine only ever preserves the original image unchanged.
 */
const UNVERIFIED_WHATSAPP_PHOTO_RULE: Omit<ImageDestinationProfile, 'targetSurface'> = {
  limitations:
    'WhatsApp media compression and HD availability vary by app version, network conditions, and user settings, per https://faq.whatsapp.com/iphone/chats/how-to-send-media/. No exact numeric width or aspect-ratio requirement was verified.',
  notes: 'No verified numeric width or aspect-ratio requirement was found for this destination.',
  qualityStrategy: 'preserve-original',
  recommendedFormat: 'UNKNOWN',
  recommendedMaxWidth: 'UNKNOWN',
  recommendedMinWidth: 'UNKNOWN',
  recommendedWidthToHeightRatio: 'UNKNOWN',
  sourceDocumentation: 'https://faq.whatsapp.com/iphone/chats/how-to-send-media/',
}

export const WHATSAPP_IMAGE_PROFILE: Record<string, ImageDestinationProfile> = {
  chat: { ...UNVERIFIED_WHATSAPP_PHOTO_RULE, targetSurface: 'Chat' },
  profilePhoto: { ...UNVERIFIED_WHATSAPP_PHOTO_RULE, targetSurface: 'Profile Photo' },
  status: { ...UNVERIFIED_WHATSAPP_PHOTO_RULE, targetSurface: 'Status' },
}
