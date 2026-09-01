import { useCallback, type PropsWithChildren } from 'react'
import { useFfmpegEngineContext } from '../../hooks/useFfmpegEngineContext'
import { useVideoFile } from '../../hooks/useVideoFile'
import { VideoFileContext } from './videoFileContext'

export function VideoFileProvider({ children }: PropsWithChildren) {
  const { cleanup } = useFfmpegEngineContext()
  const videoFile = useVideoFile({ onBeforeClear: cleanup })
  const clear = useCallback(() => {
    videoFile.clear()
  }, [videoFile])
  const value = { ...videoFile, clear }
  return <VideoFileContext value={value}>{children}</VideoFileContext>
}
