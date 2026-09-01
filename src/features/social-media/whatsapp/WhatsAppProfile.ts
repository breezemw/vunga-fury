import type { SocialPlatformProfile } from '../common/platformTypes'

/**
 * WhatsApp destination profiles.
 *
 * Verified source: https://faq.whatsapp.com/iphone/chats/how-to-send-media/ notes that
 * HD/quality media sending availability varies by app version and settings. No further
 * official numeric video specification was verified, so those fields are UNKNOWN.
 */
export const WHATSAPP_PROFILE: SocialPlatformProfile = {
  destinations: {
    chat: {
      limitations:
        'WhatsApp media compression and HD availability vary by app version, network conditions, and user settings. This tool cannot control WhatsApp-side compression.',
      mediaType: 'video',
      notes:
        'Sending as a "document" in WhatsApp avoids WhatsApp\'s media-compression pipeline, but that is a choice made in the WhatsApp app when attaching the file, not something this tool changes about the prepared file.',
      orientation: 'flexible',
      qualityStrategy: 'lossless-remux-preferred',
      recommendedAspectRatios: 'UNKNOWN',
      recommendedAudioCodec: 'AAC',
      recommendedContainer: 'MP4',
      recommendedDimensions: 'UNKNOWN',
      recommendedDuration: 'UNKNOWN',
      recommendedFileSize: 'UNKNOWN',
      recommendedFPS: 'UNKNOWN',
      recommendedVideoCodec: 'H.264',
      sourceDocumentation: 'https://faq.whatsapp.com/iphone/chats/how-to-send-media/',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Chat',
    },
    status: {
      limitations: 'Status updates expire after 24 hours on WhatsApp; this is a platform behavior, not a local file property.',
      mediaType: 'video',
      notes: 'Status updates are intended for vertical, full-screen video.',
      orientation: 'vertical',
      qualityStrategy: 'lossless-remux-preferred',
      recommendedAspectRatios: 'UNKNOWN',
      recommendedAudioCodec: 'AAC',
      recommendedContainer: 'MP4',
      recommendedDimensions: 'UNKNOWN',
      recommendedDuration: 'UNKNOWN',
      recommendedFileSize: 'UNKNOWN',
      recommendedFPS: 'UNKNOWN',
      recommendedVideoCodec: 'H.264',
      sourceDocumentation: 'UNKNOWN — no accessible official WhatsApp Status video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Status',
    },
    profilePhoto: {
      limitations: 'Profile photos are still images. Switch MEDIA TYPE to IMAGE to prepare a profile photo; this entry only describes why video preparation does not apply here.',
      mediaType: 'image',
      notes: 'Profile photo is an image-only destination. See the IMAGE media type for this platform.',
      orientation: 'flexible',
      qualityStrategy: 'preserve-original',
      recommendedAspectRatios: 'UNKNOWN',
      recommendedAudioCodec: 'UNKNOWN',
      recommendedContainer: 'UNKNOWN',
      recommendedDimensions: 'UNKNOWN',
      recommendedDuration: 'UNKNOWN',
      recommendedFileSize: 'UNKNOWN',
      recommendedFPS: 'UNKNOWN',
      recommendedVideoCodec: 'UNKNOWN',
      sourceDocumentation: 'UNKNOWN — no accessible official WhatsApp profile-photo specification was verified.',
      supportsImageOptimization: true,
      supportsLosslessRemux: false,
      supportsVideoOptimization: false,
      targetSurface: 'Profile Photo',
    },
  },
  platformName: 'WhatsApp',
  shortDescription: 'Prepare local video for WhatsApp Chats and Status updates.',
}
