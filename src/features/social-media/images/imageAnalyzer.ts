import { computeAspectRatioLabel, detectImageFormat } from './imageMetadata'
import type { ImageMetadata } from './imageMetadata'

/**
 * Reads real, locally-decoded image metadata. Runs on the main thread using
 * `createImageBitmap`, which is fast enough for typical photo sizes and avoids
 * loading any video-processing modules (FFmpeg.wasm) for image-only work.
 */
export async function analyzeImage(file: File): Promise<ImageMetadata> {
  const format = await detectImageFormat(file)
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  let hasAlpha: boolean | null = null
  try {
    const canvas = document.createElement('canvas')
    canvas.width = Math.min(width, 64)
    canvas.height = Math.min(height, 64)
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
      hasAlpha = false
      for (let index = 3; index < data.length; index += 4) {
        if (data[index] < 255) {
          hasAlpha = true
          break
        }
      }
    }
  } catch {
    hasAlpha = null
  } finally {
    bitmap.close()
  }

  return {
    aspectRatio: computeAspectRatioLabel(width, height),
    fileName: file.name,
    fileSize: file.size,
    format,
    hasAlpha,
    height,
    width,
  }
}
