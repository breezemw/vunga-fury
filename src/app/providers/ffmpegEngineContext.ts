import { createContext } from 'react'
import type { useFfmpegEngine } from '../../hooks/useFfmpegEngine'

export type FfmpegEngineContextValue = ReturnType<typeof useFfmpegEngine>
export const FfmpegEngineContext = createContext<FfmpegEngineContextValue | null>(null)
