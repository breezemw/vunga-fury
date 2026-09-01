import { useContext } from 'react'
import { FfmpegEngineContext } from '../app/providers/ffmpegEngineContext'

export function useFfmpegEngineContext() {
  const context = useContext(FfmpegEngineContext)
  if (!context) throw new Error('useFfmpegEngineContext must be used within FfmpegEngineProvider')
  return context
}
