import type { VideoMetadata } from '../../video-analysis/videoTypes'
import type { SocialValidationResult } from '../common/socialOptimizer'
import { FACEBOOK_PROFILE } from './FacebookProfile'
import { describeFacebookOrientationRule } from './FacebookRules'

export function validateFacebookSelection(
  metadata: VideoMetadata,
  destinationKey: string,
): SocialValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const destination = FACEBOOK_PROFILE.destinations[destinationKey]

  if (!destination) {
    errors.push('Unknown Facebook destination selected.')
    return { errors, warnings }
  }

  if (metadata.container !== 'MP4' && metadata.container !== 'MOV') {
    errors.push('Only MP4 and MOV containers are supported for local preparation.')
  }

  const orientationNote = describeFacebookOrientationRule(destination)
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
