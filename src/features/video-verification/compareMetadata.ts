import type { VideoMetadata } from '../video-analysis/videoTypes'
import type { MetadataComparison } from './verificationTypes'

type MetadataField = keyof Pick<
  VideoMetadata,
  | 'container'
  | 'videoCodec'
  | 'width'
  | 'height'
  | 'frameRate'
  | 'duration'
  | 'audioCodec'
  | 'audioBitrate'
  | 'videoBitrate'
  | 'pixelFormat'
  | 'streamCount'
>

const fields: Array<{ label: string; name: MetadataField; tolerance?: number }> = [
  { label: 'Container', name: 'container' },
  { label: 'Video codec', name: 'videoCodec' },
  { label: 'Width', name: 'width' },
  { label: 'Height', name: 'height' },
  { label: 'Frame rate', name: 'frameRate', tolerance: 0.01 },
  { label: 'Duration', name: 'duration', tolerance: 0.1 },
  { label: 'Audio codec', name: 'audioCodec' },
  { label: 'Audio bitrate', name: 'audioBitrate' },
  { label: 'Video bitrate', name: 'videoBitrate' },
  { label: 'Pixel format', name: 'pixelFormat' },
  { label: 'Stream count', name: 'streamCount' },
]

function display(value: string | number | null) {
  return value === null ? 'Unavailable' : String(value)
}

export function compareMetadata(
  original: VideoMetadata,
  output: VideoMetadata,
): MetadataComparison[] {
  return fields.map(({ label, name, tolerance }) => {
    const originalValue = original[name]
    const outputValue = output[name]
    const matches =
      originalValue === null || outputValue === null
        ? null
        : typeof originalValue === 'number' &&
            typeof outputValue === 'number' &&
            tolerance !== undefined
          ? Math.abs(originalValue - outputValue) <= tolerance
          : originalValue === outputValue
    return { label, original: display(originalValue), output: display(outputValue), matches }
  })
}
