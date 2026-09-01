import type { VideoMetadata } from '../../video-analysis/videoTypes'
import {
  createSocialVideoPlan,
  evaluateSocialVideo,
  getDestination,
  type SocialPlatformModule,
} from '../common/socialOptimizer'
import { FACEBOOK_PROFILE } from './FacebookProfile'
import { validateFacebookSelection } from './FacebookValidator'

export { imageProfile, prepareFacebookImage as prepareImage } from './FacebookImageOptimizer'

export const profile = FACEBOOK_PROFILE

export const analyzeVideo: SocialPlatformModule['analyzeVideo'] = (
  metadata: VideoMetadata,
  destinationKey: string,
) => {
  const destination = getDestination(FACEBOOK_PROFILE, destinationKey)
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
  return createSocialVideoPlan(fileName, 'facebook', decision)
}

export const validate: SocialPlatformModule['validate'] = validateFacebookSelection
