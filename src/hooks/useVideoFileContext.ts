import { useContext } from 'react'
import { VideoFileContext } from '../app/providers/videoFileContext'

export function useVideoFileContext() {
  const context = useContext(VideoFileContext)
  if (!context) throw new Error('useVideoFileContext must be used within VideoFileProvider')
  return context
}
