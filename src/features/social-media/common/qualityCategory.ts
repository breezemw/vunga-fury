/**
 * The result vocabulary used everywhere a result is shown to the user, for both
 * images and video. These are the only categories ever displayed; the
 * application never reports a platform "bypass" because no evidence of one was
 * ever obtained (see docs/SOCIAL_MEDIA_COMPRESSION_RESEARCH.md).
 *
 * - LOSSLESS: local processing produced bit-for-bit or pixel-for-pixel identical output.
 * - QUALITY-PRESERVING: the source already met the destination's requirements; nothing was changed.
 * - PLATFORM-OPTIMIZED: one controlled local conversion pass was applied to meet a verified requirement.
 * - NOT-VERIFIED: local verification could not confirm the result (or no verified rule exists to check against).
 *
 * A separate, always-shown disclosure states that platform-side server
 * processing after upload is never controlled or verified by this application.
 */
export type QualityResultCategory =
  | 'LOSSLESS'
  | 'PLATFORM-OPTIMIZED'
  | 'QUALITY-PRESERVING'
  | 'NOT-VERIFIED'

export const PLATFORM_SIDE_PROCESSING_DISCLOSURE =
  'PLATFORM-SIDE PROCESSING: not controlled or verified by this application. The selected platform may re-encode, resize, or otherwise transform this file after upload.'
