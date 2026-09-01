import type { VideoMetadata } from '../../video-analysis/videoTypes'
import type { SocialValidationResult } from '../common/socialOptimizer'
import { TIKTOK_PROFILE } from './TikTokProfile'
import { describeTikTokOrientationRule } from './TikTokRules'

export function validateTikTokSelection(
  metadata: VideoMetadata,
  destinationKey: string,
): SocialValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const destination = TIKTOK_PROFILE.destinations[destinationKey]

  if (!destination) {
    errors.push('Unknown TikTok destination selected.')
    return { errors, warnings }
  }

  if (metadata.container !== 'MP4' && metadata.container !== 'MOV') {
    errors.push('Only MP4 and MOV containers are supported for local preparation.')
  }

  const orientationNote = describeTikTokOrientationRule(destination)
  if (
    orientationNote &&
    metadata.width !== null &&
    metadata.height !== null &&
    metadata.height <= metadata.width
  ) {
    warnings.push(orientationNote)
  }

  return { errors, warnings }
}
