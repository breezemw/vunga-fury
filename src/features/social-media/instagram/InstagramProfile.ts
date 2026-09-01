import type { SocialPlatformProfile } from '../common/platformTypes'

/**
 * Instagram video destination profiles.
 *
 * Verified source: https://help.instagram.com/1631821640426723 documents Instagram's
 * photo aspect-ratio guidance (320-1080px width, 1.91:1 to 4:5). It does not cover
 * video-specific technical requirements, so video fields below that are not backed
 * by an accessible official source are explicitly marked UNKNOWN rather than guessed.
 */
export const INSTAGRAM_PROFILE: SocialPlatformProfile = {
  destinations: {
    post: {
      limitations:
        'Instagram may re-encode and re-compress uploaded video on its own servers regardless of local preparation.',
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
      sourceDocumentation:
        'https://help.instagram.com/1631821640426723 (covers photo aspect ratio only; video specification is UNKNOWN)',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Feed Post',
    },
    reel: {
      limitations:
        'Reels are optimized by Instagram for vertical full-screen viewing; non-vertical source video will not be reframed by this tool.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official Reels video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Reel',
    },
    story: {
      limitations: 'Stories expire after 24 hours on Instagram; this is a platform behavior, not a local file property.',
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
      sourceDocumentation: 'UNKNOWN — no accessible official Story video specification was verified.',
      supportsImageOptimization: false,
      supportsLosslessRemux: true,
      supportsVideoOptimization: true,
      targetSurface: 'Story',
    },
  },
  platformName: 'Instagram',
  shortDescription: 'Prepare local video for Instagram Feed Posts, Stories, and Reels.',
}
