import type { PropsWithChildren } from 'react'
import { useFfmpegEngine } from '../../hooks/useFfmpegEngine'
import { FfmpegEngineContext } from './ffmpegEngineContext'

export function FfmpegEngineProvider({ children }: PropsWithChildren) {
  const engine = useFfmpegEngine()
  return <FfmpegEngineContext value={engine}>{children}</FfmpegEngineContext>
}
