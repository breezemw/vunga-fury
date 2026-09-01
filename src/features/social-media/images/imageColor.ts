export const CANVAS_COLOR_LIMITATION =
  'Browsers rasterize decoded images onto an sRGB canvas before re-encoding. Any wide-gamut (e.g. Display P3), embedded ICC profile, or HDR color data in the original file cannot be preserved through a canvas-based re-encode. Only the ORIGINAL, untouched file preserves the source color data exactly.'

export type ColorHandlingStatus = 'preserved' | 'converted'

export type ColorHandlingResult = {
  message: string
  status: ColorHandlingStatus
}

/**
 * Describes what actually happened to color data, based on whether the file
 * bytes were re-encoded. This is a real, verifiable browser limitation, not a
 * guess: canvas 2D contexts do not expose or preserve ICC/wide-gamut profiles.
 */
export function describeColorHandling(wasReencoded: boolean): ColorHandlingResult {
  if (!wasReencoded) {
    return {
      message: 'COLOR SPACE PRESERVED — the original file bytes were not modified.',
      status: 'preserved',
    }
  }
  return {
    message: `COLOR SPACE CONVERTED — ${CANVAS_COLOR_LIMITATION}`,
    status: 'converted',
  }
}
