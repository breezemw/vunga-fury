import type { VideoMetadata } from '../../video-analysis/videoTypes'
import {
  createSocialVideoPlan,
  evaluateSocialVideo,
  getDestination,
  type SocialPlatformModule,
} from '../common/socialOptimizer'
import { TIKTOK_PROFILE } from './TikTokProfile'
import { validateTikTokSelection } from './TikTokValidator'

export const profile = TIKTOK_PROFILE

export const analyzeVideo: SocialPlatformModule['analyzeVideo'] = (
  metadata: VideoMetadata,
  destinationKey: string,
) => {
  const destination = getDestination(TIKTOK_PROFILE, destinationKey)
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
  return createSocialVideoPlan(fileName, 'tiktok', decision)
}

export const validate: SocialPlatformModule['validate'] = validateTikTokSelection
