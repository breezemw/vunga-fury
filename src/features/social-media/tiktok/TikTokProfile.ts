import type { SocialPlatformProfile } from '../common/platformTypes'

/**
 * TikTok video destination profile. No accessible official TikTok video
 * specification page was verified during this implementation, so all numeric
 * technical fields are marked UNKNOWN rather than invented.
 */
export const TIKTOK_PROFILE: SocialPlatformProfile = {
  destinations: {
    video: {
      limitations: 'TikTok may re-encode and re-compress uploaded video on its own servers regardless of local preparation.',
      mediaType: 'video',
      notes: 'TikTok videos are intended for vertical, full-screen playback.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official TikTok video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Video',
    },
  },
  platformName: 'TikTok',
  shortDescription: 'Prepare local video for TikTok uploads.',
}
