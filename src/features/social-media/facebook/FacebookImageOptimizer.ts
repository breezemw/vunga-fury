import { createUnsupportedImageOptimizationResult } from '../common/imageOptimizerStub'

/** Facebook image preparation is not implemented. See common/imageOptimizerStub.ts. */
export function createFacebookImageOptimizationResult() {
  return createUnsupportedImageOptimizationResult()
}
