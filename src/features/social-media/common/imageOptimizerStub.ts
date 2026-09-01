export type ImageOptimizationStubResult = {
  reason: string
  supported: false
}

/**
 * Image preparation is intentionally not implemented. This stub exists so every
 * platform module has the file structure required for future maintenance while
 * making the unimplemented state explicit rather than pretending to process images.
 */
export function createUnsupportedImageOptimizationResult(): ImageOptimizationStubResult {
  return {
    reason:
      'Local image preparation is not implemented yet. Only local video preparation is available.',
    supported: false,
  }
}
