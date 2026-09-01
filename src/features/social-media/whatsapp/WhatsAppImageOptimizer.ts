import { createUnsupportedImageOptimizationResult } from '../common/imageOptimizerStub'

/** WhatsApp image preparation (e.g. Profile Photo) is not implemented. */
export function createWhatsAppImageOptimizationResult() {
  return createUnsupportedImageOptimizationResult()
}
