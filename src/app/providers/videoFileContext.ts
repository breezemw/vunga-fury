import { createContext } from 'react'
import type { useVideoFile } from '../../hooks/useVideoFile'

export type VideoFileContextValue = ReturnType<typeof useVideoFile>

export const VideoFileContext = createContext<VideoFileContextValue | null>(null)
