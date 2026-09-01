import type { VideoMetadata } from '../../video-analysis/videoTypes'
import type { SocialValidationResult } from '../common/socialOptimizer'
import { INSTAGRAM_PROFILE } from './InstagramProfile'
import { describeInstagramOrientationRule } from './InstagramRules'

export function validateInstagramSelection(
  metadata: VideoMetadata,
  destinationKey: string,
): SocialValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const destination = INSTAGRAM_PROFILE.destinations[destinationKey]

  if (!destination) {
    errors.push('Unknown Instagram destination selected.')
    return { errors, warnings }
  }

  if (metadata.container !== 'MP4' && metadata.container !== 'MOV') {
    errors.push('Only MP4 and MOV containers are supported for local preparation.')
  }

  const orientationNote = describeInstagramOrientationRule(destination)
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
