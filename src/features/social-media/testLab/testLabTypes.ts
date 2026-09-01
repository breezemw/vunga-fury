export type TestLabUploadMethod = 'mobile-app' | 'desktop-web' | 'share-sheet' | 'official-api' | 'other'
export type TestLabMediaType = 'image' | 'video'
export type TestLabResultCategory =
  | 'PRESERVED'
  | 'PARTIALLY PRESERVED'
  | 'PLATFORM PROCESSED'
  | 'RE-ENCODED'
  | 'UNKNOWN'
  | 'NOT TESTED'

export type TestLabComparisonInput = {
  dimensionsMatch: boolean | null
  formatOrCodecMatch: boolean | null
  pixelStatus: 'identical' | 'changed' | 'not-compared' | null
}

/**
 * Classifies a REAL, manually-recorded comparison between a file VUNGA FURY
 * prepared and the file the operator manually downloaded back from a platform
 * after uploading it themselves. This never runs automatically against a
 * platform; the operator must perform the upload/download themselves. See
 * docs/SOCIAL_MEDIA_COMPRESSION_RESEARCH.md for why this cannot be automated
 * in this environment.
 */
export function classifyTestLabResult(input: TestLabComparisonInput): TestLabResultCategory {
  const { dimensionsMatch, formatOrCodecMatch, pixelStatus } = input
  if (dimensionsMatch === null && formatOrCodecMatch === null && pixelStatus === null) {
    return 'NOT TESTED'
  }
  if (dimensionsMatch === false) {
    return 'RE-ENCODED'
  }
  if (pixelStatus === 'identical' && formatOrCodecMatch !== false) {
    return 'PRESERVED'
  }
  if (formatOrCodecMatch === false) {
    return 'PLATFORM PROCESSED'
  }
  if (pixelStatus === 'changed') {
    return 'PARTIALLY PRESERVED'
  }
  return 'UNKNOWN'
}

export type TestLabRecord = {
  destination: string
  details: string
  id: string
  mediaType: TestLabMediaType
  platform: string
  recordedAt: string
  result: TestLabResultCategory
  uploadMethod: TestLabUploadMethod
}
