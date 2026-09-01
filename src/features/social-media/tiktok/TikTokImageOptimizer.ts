import { createUnsupportedImageOptimizationResult } from '../common/imageOptimizerStub'

/** TikTok image (cover/thumbnail) preparation is not implemented. */
export function createTikTokImageOptimizationResult() {
  return createUnsupportedImageOptimizationResult()
}
