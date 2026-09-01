import { analyzeImage } from '../images/imageAnalyzer'
import { buildSocialImageComparison, type SocialImagePreparationResult } from '../images/imageComparison'
import { evaluateSocialImage, buildSocialImageFileName, processSocialImage } from '../images/imageOptimizer'
import { compareImagePixels } from '../images/imageVerifier'
import { INSTAGRAM_IMAGE_PROFILE } from './InstagramImageProfile'

export const imageProfile = INSTAGRAM_IMAGE_PROFILE

export async function prepareInstagramImage(
  file: File,
  destinationKey: string,
): Promise<SocialImagePreparationResult | null> {
  const destination = INSTAGRAM_IMAGE_PROFILE[destinationKey]
  if (!destination) return null
  const metadata = await analyzeImage(file)
  const decision = evaluateSocialImage(metadata, destination)
  const result = await processSocialImage(file, decision, metadata)
  const pixelComparison = await compareImagePixels(file, result.blob)
  const comparison = buildSocialImageComparison(
    metadata,
    { fileSize: result.blob.size, height: result.height, width: result.width },
    pixelComparison,
    result.wasReencoded,
    decision,
  )
  return {
    comparison,
    outputBlob: result.blob,
    outputFileName: buildSocialImageFileName(file.name, 'instagram'),
  }
}
