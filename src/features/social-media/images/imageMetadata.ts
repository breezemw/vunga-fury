export type ImageFormat = 'JPEG' | 'PNG' | 'WEBP' | 'AVIF' | 'UNKNOWN'

export type ImageMetadata = {
  fileName: string
  fileSize: number
  width: number
  height: number
  aspectRatio: string
  format: ImageFormat
  hasAlpha: boolean | null
}

type MagicBytePattern = { bytes: number[]; format: ImageFormat; offset: number }

// Detected from real file-header bytes (magic numbers), not from the browser-reported
// MIME type, which can be blank or wrong depending on how the file was selected.
const MAGIC_BYTE_PATTERNS: MagicBytePattern[] = [
  { bytes: [0xff, 0xd8, 0xff], format: 'JPEG', offset: 0 },
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], format: 'PNG', offset: 0 },
  { bytes: [0x57, 0x45, 0x42, 0x50], format: 'WEBP', offset: 8 },
  { bytes: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66], format: 'AVIF', offset: 4 },
]

export async function detectImageFormat(file: File): Promise<ImageFormat> {
  const headerBytes = new Uint8Array(await file.slice(0, 32).arrayBuffer())
  for (const pattern of MAGIC_BYTE_PATTERNS) {
    const matches = pattern.bytes.every((byte, index) => headerBytes[pattern.offset + index] === byte)
    if (matches) return pattern.format
  }
  return 'UNKNOWN'
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

export function computeAspectRatioLabel(width: number, height: number): string {
  if (width <= 0 || height <= 0) return 'UNKNOWN'
  const divisor = greatestCommonDivisor(Math.round(width), Math.round(height))
  return `${Math.round(width) / divisor}:${Math.round(height) / divisor}`
}
