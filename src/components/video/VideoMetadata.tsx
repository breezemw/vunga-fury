import { formatDuration } from '../../lib/utils/formatDuration'
import { formatFileSize } from '../../lib/utils/formatFileSize'
import type { VideoMetadata as VideoMetadataValue } from '../../features/video-analysis/videoTypes'

type VideoMetadataProps = { metadata: VideoMetadataValue }

function formatBitrate(value: number | null) {
  return value === null ? 'Unavailable' : `${(value / 1_000_000).toFixed(1)} Mbps`
}

export function VideoMetadata({ metadata }: VideoMetadataProps) {
  const values = [
    ['Filename', metadata.fileName],
    ['File size', formatFileSize(metadata.fileSize)],
    ['Duration', formatDuration(metadata.duration)],
    [
      'Resolution',
      metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : 'Unavailable',
    ],
    ['Aspect ratio', metadata.aspectRatio ?? 'Unavailable'],
    ['Frame rate', metadata.frameRate ? `${metadata.frameRate.toFixed(2)} FPS` : 'Unavailable'],
    ['Video codec', metadata.videoCodec ?? 'Unavailable'],
    ['Video bitrate', formatBitrate(metadata.videoBitrate)],
    ['Audio codec', metadata.audioCodec ?? 'Unavailable'],
    ['Audio bitrate', formatBitrate(metadata.audioBitrate)],
    ['Pixel format', metadata.pixelFormat ?? 'Unavailable'],
    ['Container', metadata.container],
    ['Color information', metadata.colorInformation ?? 'Unavailable'],
    ['HDR information', metadata.hdrInformation ?? 'Unavailable'],
  ]
  return (
    <dl className="grid border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
      {values.map(([label, value]) => (
        <div key={label} className="border-b border-r border-[var(--border)] p-4">
          <dt className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]">{label}</dt>
          <dd className="mt-2 break-words text-sm text-[var(--heading)]">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
