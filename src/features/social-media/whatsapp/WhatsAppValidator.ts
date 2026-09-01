import type { VideoMetadata } from '../../video-analysis/videoTypes'
import type { SocialValidationResult } from '../common/socialOptimizer'
import { WHATSAPP_PROFILE } from './WhatsAppProfile'
import { describeWhatsAppOrientationRule } from './WhatsAppRules'

export function validateWhatsAppSelection(
  metadata: VideoMetadata,
  destinationKey: string,
): SocialValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const destination = WHATSAPP_PROFILE.destinations[destinationKey]

  if (!destination) {
    errors.push('Unknown WhatsApp destination selected.')
    return { errors, warnings }
  }

  if (!destination.supportsVideoOptimization) {
    errors.push('This WhatsApp destination is for image media. Switch MEDIA TYPE to IMAGE to prepare it.')
    return { errors, warnings }
  }

  if (metadata.container !== 'MP4' && metadata.container !== 'MOV') {
    errors.push('Only MP4 and MOV containers are supported for local preparation.')
  }

  const orientationNote = describeWhatsAppOrientationRule(destination)
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
