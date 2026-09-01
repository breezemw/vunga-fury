export type ImagePixelComparisonStatus = 'identical' | 'changed' | 'not-compared'

export type ImagePixelComparisonResult = {
  message: string
  status: ImagePixelComparisonStatus
}

function readPixels(bitmap: ImageBitmap): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context is unavailable in this browser.')
  context.drawImage(bitmap, 0, 0)
  return context.getImageData(0, 0, canvas.width, canvas.height).data
}

/**
 * Compares the original file against the produced output and reports a real,
 * evidence-based pixel status. Never reports "identical" without an actual
 * byte-for-byte or decoded pixel-for-pixel comparison.
 */
export async function compareImagePixels(
  originalFile: File,
  outputBlob: Blob,
): Promise<ImagePixelComparisonResult> {
  if (originalFile.size === outputBlob.size) {
    const [originalBuffer, outputBuffer] = await Promise.all([
      originalFile.arrayBuffer(),
      outputBlob.arrayBuffer(),
    ])
    const originalBytes = new Uint8Array(originalBuffer)
    const outputBytes = new Uint8Array(outputBuffer)
    const identical = originalBytes.every((byte, index) => byte === outputBytes[index])
    if (identical) {
      return {
        message: 'PIXEL DATA IDENTICAL — the output file is byte-for-byte identical to the original.',
        status: 'identical',
      }
    }
  }

  const [originalBitmap, outputBitmap] = await Promise.all([
    createImageBitmap(originalFile),
    createImageBitmap(outputBlob),
  ])
  try {
    if (originalBitmap.width !== outputBitmap.width || originalBitmap.height !== outputBitmap.height) {
      return {
        message: `PIXEL DATA CHANGED — dimensions changed from ${originalBitmap.width}×${originalBitmap.height} to ${outputBitmap.width}×${outputBitmap.height}.`,
        status: 'changed',
      }
    }

    const originalData = readPixels(originalBitmap)
    const outputData = readPixels(outputBitmap)
    let differingPixels = 0
    for (let index = 0; index < originalData.length; index += 4) {
      if (
        originalData[index] !== outputData[index] ||
        originalData[index + 1] !== outputData[index + 1] ||
        originalData[index + 2] !== outputData[index + 2] ||
        originalData[index + 3] !== outputData[index + 3]
      ) {
        differingPixels += 1
      }
    }
    if (differingPixels === 0) {
      return {
        message: 'PIXEL DATA IDENTICAL — every decoded pixel matched the original.',
        status: 'identical',
      }
    }
    const totalPixels = originalData.length / 4
    const percentChanged = ((differingPixels / totalPixels) * 100).toFixed(2)
    return {
      message: `PIXEL DATA CHANGED — ${percentChanged}% of pixels differ from the original.`,
      status: 'changed',
    }
  } finally {
    originalBitmap.close()
    outputBitmap.close()
  }
}
