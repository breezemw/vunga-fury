import type { ImageMetadata } from './imageMetadata'
import type { ImageDestinationProfile } from './imageProfiles'

export type SocialImageStatus = 'already-optimal' | 'requires-resize' | 'unsupported'

export type SocialImageDecision = {
  destination: ImageDestinationProfile
  reason: string
  status: SocialImageStatus
  targetWidth: number | null
  warnings: string[]
}

/**
 * Pixel-preservation-first decision engine for images: never resizes or
 * recompresses unless a verified official width range requires it, and never
 * resizes more than once.
 */
export function evaluateSocialImage(
  metadata: ImageMetadata,
  destination: ImageDestinationProfile,
): SocialImageDecision {
  const warnings: string[] = []
  const ratio = metadata.height > 0 ? metadata.width / metadata.height : 0
  const ratioRange = destination.recommendedWidthToHeightRatio
  if (ratioRange !== 'UNKNOWN' && (ratio < ratioRange.min || ratio > ratioRange.max)) {
    warnings.push(
      "This image's aspect ratio falls outside the verified supported range. The platform may crop it; VUNGA FURY does not crop images automatically.",
    )
  }

  if (destination.recommendedMinWidth === 'UNKNOWN' || destination.recommendedMaxWidth === 'UNKNOWN') {
    return {
      destination,
      reason:
        'No verified official width range exists for this destination. The original file is kept unchanged to avoid an unjustified resize or recompression.',
      status: 'already-optimal',
      targetWidth: null,
      warnings,
    }
  }

  if (metadata.width >= destination.recommendedMinWidth && metadata.width <= destination.recommendedMaxWidth) {
    return {
      destination,
      reason: 'The image width is already within the verified supported range. No resize is needed.',
      status: 'already-optimal',
      targetWidth: null,
      warnings,
    }
  }

  const targetWidth =
    metadata.width > destination.recommendedMaxWidth
      ? destination.recommendedMaxWidth
      : destination.recommendedMinWidth
  return {
    destination,
    reason:
      metadata.width > destination.recommendedMaxWidth
        ? `The image is wider than the verified maximum (${destination.recommendedMaxWidth}px). It will be resized down once to ${targetWidth}px.`
        : `The image is narrower than the verified minimum (${destination.recommendedMinWidth}px). It will be resized up once to ${targetWidth}px.`,
    status: 'requires-resize',
    targetWidth,
    warnings,
  }
}

export type SocialImageResult = {
  blob: Blob
  height: number
  wasReencoded: boolean
  width: number
}

/**
 * Performs at most one resize/encode pass, only when the decision requires it.
 * Runs entirely locally in the browser via Canvas 2D; no data leaves the device.
 */
export async function processSocialImage(
  file: File,
  decision: SocialImageDecision,
  metadata: ImageMetadata,
): Promise<SocialImageResult> {
  if (decision.status !== 'requires-resize' || decision.targetWidth === null) {
    return { blob: file, height: metadata.height, wasReencoded: false, width: metadata.width }
  }

  const bitmap = await createImageBitmap(file)
  try {
    const scale = decision.targetWidth / bitmap.width
    const targetHeight = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = decision.targetWidth
    canvas.height = targetHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D context is unavailable in this browser.')
    context.drawImage(bitmap, 0, 0, decision.targetWidth, targetHeight)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Local image encoding failed.'))),
        'image/jpeg',
        0.95,
      )
    })
    return { blob, height: targetHeight, wasReencoded: true, width: decision.targetWidth }
  } finally {
    bitmap.close()
  }
}

function sanitizeBaseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'image'
}

export function buildSocialImageFileName(fileName: string, platformKey: string): string {
  return `${sanitizeBaseName(fileName)}_${platformKey}.jpg`
}
