import type { SocialPlatformProfile } from '../common/platformTypes'

/**
 * Facebook video destination profiles. No accessible official Facebook video
 * specification page was verified during this implementation, so all numeric
 * technical fields are marked UNKNOWN rather than invented.
 */
export const FACEBOOK_PROFILE: SocialPlatformProfile = {
  destinations: {
    feed: {
      limitations: 'Facebook may re-encode and re-compress uploaded video on its own servers regardless of local preparation.',
      mediaType: 'video',
      notes:
        'Feed posts accept a range of aspect ratios. This tool does not crop or reframe; it only prepares the existing framing.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official Facebook Feed video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Feed Post',
    },
    reel: {
      limitations:
        'Reels are optimized by Facebook for vertical full-screen viewing; non-vertical source video will not be reframed by this tool.',
      mediaType: 'video',
      notes: 'Reels are intended for vertical, full-screen video.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official Facebook Reels video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Reel',
    },
    story: {
      limitations: 'Stories expire after 24 hours on Facebook; this is a platform behavior, not a local file property.',
      mediaType: 'video',
      notes: 'Stories are intended for vertical, full-screen video.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official Facebook Story video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Story',
    },
  },
  platformName: 'Facebook',
  shortDescription: 'Prepare local video for Facebook Feed Posts, Stories, and Reels.',
}
