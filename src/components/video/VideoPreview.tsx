import { memo } from 'react'

type VideoPreviewProps = { fileName: string; objectUrl: string }

export const VideoPreview = memo(function VideoPreview({ fileName, objectUrl }: VideoPreviewProps) {
  return (
    <video
      className="max-h-[32rem] w-full bg-black object-contain"
      controls
      playsInline
      preload="metadata"
      aria-label={`Preview of ${fileName}`}
      src={objectUrl}
    />
  )
})
