import { compareMetadata } from './compareMetadata'
import type { VerificationMode, VerificationResult } from './verificationTypes'
import type { VideoMetadata } from '../video-analysis/videoTypes'

export function createVerificationResult(
  mode: VerificationMode,
  original: VideoMetadata,
  output: VideoMetadata,
  outputHash: string | null,
): VerificationResult {
  const comparisons = compareMetadata(original, output)
  const warnings = comparisons
    .filter((comparison) => comparison.matches === null)
    .map(
      (comparison) => `${comparison.label} could not be compared because metadata is unavailable.`,
    )
  if (mode === 'conversion')
    return {
      comparisons,
      outputMetadata: output,
      outputHash,
      outputHashAlgorithm: outputHash ? 'SHA-256' : null,
      status: 'reencoded',
      success: true,
      warnings,
    }
  const essentialLabels = new Set([
    'Video codec',
    'Width',
    'Height',
    'Frame rate',
    'Duration',
    'Audio codec',
    'Stream count',
  ])
  const essential = comparisons.filter((comparison) => essentialLabels.has(comparison.label))
  if (essential.some((comparison) => comparison.matches === false))
    return {
      comparisons,
      outputMetadata: output,
      outputHash,
      outputHashAlgorithm: outputHash ? 'SHA-256' : null,
      status: 'inconclusive',
      success: true,
      warnings: [
        ...warnings,
        'Output is readable, but preserved streams cannot be confirmed because compared stream properties differ.',
      ],
    }
  if (essential.some((comparison) => comparison.matches === null))
    return {
      comparisons,
      outputMetadata: output,
      outputHash,
      outputHashAlgorithm: outputHash ? 'SHA-256' : null,
      status: 'inconclusive',
      success: true,
      warnings: [
        ...warnings,
        'Output is readable, but stream preservation is inconclusive because required metadata is unavailable.',
      ],
    }
  return {
    comparisons,
    outputMetadata: output,
    outputHash,
    outputHashAlgorithm: outputHash ? 'SHA-256' : null,
    status: 'preserved',
    success: true,
    warnings,
  }
}
