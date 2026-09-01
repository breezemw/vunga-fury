import { useCallback, useEffect, useRef, useState } from 'react'
import { validateVideoDescriptor } from '../features/video-analysis/validateVideo'
import type { VideoMetadata } from '../features/video-analysis/videoTypes'

type VideoFileStatus = 'empty' | 'validating' | 'analyzing' | 'ready' | 'error'

type UseVideoFileOptions = {
  onBeforeClear?: () => void
}

export function useVideoFile({ onBeforeClear }: UseVideoFileOptions = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [status, setStatus] = useState<VideoFileStatus>('empty')
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const objectUrlRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const releaseObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  const clear = useCallback(() => {
    onBeforeClear?.()
    requestIdRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    releaseObjectUrl()
    setFile(null)
    setObjectUrl(null)
    setMetadata(null)
    setErrors([])
    setWarnings([])
    setStatus('empty')
  }, [onBeforeClear, releaseObjectUrl])

  const selectFile = useCallback(
    async (nextFile: File) => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      onBeforeClear?.()
      abortControllerRef.current?.abort()
      const abortController = new AbortController()
      abortControllerRef.current = abortController
      releaseObjectUrl()
      setFile(null)
      setObjectUrl(null)
      setMetadata(null)
      setErrors([])
      setWarnings([])
      setStatus('validating')

      const validation = validateVideoDescriptor(nextFile)
      if (validation.errors.length > 0) {
        if (requestId === requestIdRef.current) {
          setErrors(validation.errors)
          setWarnings(validation.warnings)
          setStatus('error')
        }
        return
      }

      const nextObjectUrl = URL.createObjectURL(nextFile)
      objectUrlRef.current = nextObjectUrl
      setFile(nextFile)
      setObjectUrl(nextObjectUrl)
      setWarnings(validation.warnings)
      setStatus('analyzing')

      try {
        const { analyzeVideo } = await import('../features/video-analysis/analyzeVideo')
        const result = await analyzeVideo(nextFile, nextObjectUrl, abortController.signal)
        if (requestId !== requestIdRef.current) return
        setMetadata(result.metadata)
        setWarnings((currentWarnings) => [...currentWarnings, ...result.warnings])
        setStatus('ready')
        abortControllerRef.current = null
      } catch (error) {
        if (requestId !== requestIdRef.current) return
        releaseObjectUrl()
        setObjectUrl(null)
        setFile(null)
        setErrors([
          error instanceof Error ? error.message : 'Video analysis could not be completed.',
        ])
        setStatus('error')
        abortControllerRef.current = null
      }
    },
    [onBeforeClear, releaseObjectUrl],
  )

  useEffect(() => releaseObjectUrl, [releaseObjectUrl])

  return { clear, errors, file, metadata, objectUrl, selectFile, status, warnings }
}
