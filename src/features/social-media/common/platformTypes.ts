export type SocialPlatformKey = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok'

export type SocialMediaCategory = 'video' | 'image'

/** Marks a specification value that no accessible official source currently confirms. */
export type UnknownOr<T> = T | 'UNKNOWN'

export type SocialQualityStrategy =
  | 'preserve-original'
  | 'lossless-remux-preferred'
  | 'controlled-conversion-when-required'

export type SocialDestinationProfile = {
  targetSurface: string
  mediaType: SocialMediaCategory
  orientation: 'vertical' | 'flexible'
  recommendedContainer: UnknownOr<'MP4'>
  recommendedVideoCodec: UnknownOr<string>
  recommendedAudioCodec: UnknownOr<string>
  recommendedAspectRatios: UnknownOr<string[]>
  recommendedDimensions: UnknownOr<string>
  recommendedFPS: UnknownOr<string>
  recommendedDuration: UnknownOr<string>
  recommendedFileSize: UnknownOr<string>
  qualityStrategy: SocialQualityStrategy
  supportsLosslessRemux: boolean
  supportsImageOptimization: boolean
  supportsVideoOptimization: boolean
  notes: string
  limitations: string
  sourceDocumentation: string
}

export type SocialPlatformProfile = {
  platformName: 'Instagram' | 'Facebook' | 'WhatsApp' | 'TikTok'
  shortDescription: string
  destinations: Record<string, SocialDestinationProfile>
}

export function getPlatformRealityStatement(platformName: SocialPlatformProfile['platformName']) {
  return `Prepared locally for ${platformName}. ${platformName} may apply additional processing after upload. No local tool can guarantee zero platform-side compression.`
}
