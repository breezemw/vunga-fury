export type UnknownOr<T> = T | 'UNKNOWN'

export type ImageQualityStrategy =
  | 'preserve-original'
  | 'lossless-metadata-pass'
  | 'controlled-conversion-when-required'

export type ImageDestinationProfile = {
  limitations: string
  notes: string
  qualityStrategy: ImageQualityStrategy
  recommendedFormat: UnknownOr<'JPEG' | 'PNG' | 'WEBP'>
  recommendedMaxWidth: UnknownOr<number>
  recommendedMinWidth: UnknownOr<number>
  recommendedWidthToHeightRatio: UnknownOr<{ max: number; min: number }>
  sourceDocumentation: string
  targetSurface: string
}
