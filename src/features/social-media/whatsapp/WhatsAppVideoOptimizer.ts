import type { VideoMetadata } from '../../video-analysis/videoTypes'
import {
  createSocialVideoPlan,
  evaluateSocialVideo,
  getDestination,
  type SocialPlatformModule,
} from '../common/socialOptimizer'
import { WHATSAPP_PROFILE } from './WhatsAppProfile'
import { validateWhatsAppSelection } from './WhatsAppValidator'

export { imageProfile, prepareWhatsAppImage as prepareImage } from './WhatsAppImageOptimizer'

export const profile = WHATSAPP_PROFILE

export const analyzeVideo: SocialPlatformModule['analyzeVideo'] = (
  metadata: VideoMetadata,
  destinationKey: string,
) => {
  const destination = getDestination(WHATSAPP_PROFILE, destinationKey)
  if (!destination) return null
  return evaluateSocialVideo(metadata, destination)
}

export const planVideo: SocialPlatformModule['planVideo'] = (
  fileName: string,
  metadata: VideoMetadata,
  destinationKey: string,
) => {
  const decision = analyzeVideo(metadata, destinationKey)
  if (!decision) return null
  return createSocialVideoPlan(fileName, 'whatsapp', decision)
}

export const validate: SocialPlatformModule['validate'] = validateWhatsAppSelection
