import type { VideoMetadata } from '../../video-analysis/videoTypes'
import {
  createSocialVideoPlan,
  evaluateSocialVideo,
  getDestination,
  type SocialPlatformModule,
} from '../common/socialOptimizer'
import { INSTAGRAM_PROFILE } from './InstagramProfile'
import { validateInstagramSelection } from './InstagramValidator'

export const profile = INSTAGRAM_PROFILE

export const analyzeVideo: SocialPlatformModule['analyzeVideo'] = (
  metadata: VideoMetadata,
  destinationKey: string,
) => {
  const destination = getDestination(INSTAGRAM_PROFILE, destinationKey)
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
  return createSocialVideoPlan(fileName, 'instagram', decision)
}

export const validate: SocialPlatformModule['validate'] = validateInstagramSelection
