import { useCallback, useEffect, useRef, useState } from 'react'
import { createLosslessOptimizationResult } from '../features/video-optimization/losslessOptimizer'
import { createSmartConversionResult } from '../features/video-optimization/smartConverter'
import { verifyVideoInWorker } from '../lib/workers/verificationWorkerClient'
import { useLocalSettings } from './useLocalSettings'
import type {
  LosslessOptimizationResult,
  OptimizationPlan,
  OptimizationWorkerResult,
  SmartConversionPlan,
  SmartConversionResult,
} from '../features/video-optimization/optimizationTypes'
import type { VideoMetadata } from '../features/video-analysis/videoTypes'
import type { VerificationResult } from '../features/video-verification/verificationTypes'
import type { FfmpegEngineStatus, FutureProcessingStatus } from '../types/ffmpeg'
import type { FfmpegWorkerResult, WorkerCommand, WorkerResponse } from '../types/workerMessages'

export function useFfmpegEngine() {
  const { addHistoryEntry } = useLocalSettings()
  const [status, setStatus] = useState<FfmpegEngineStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<FutureProcessingStatus>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [result, setResult] = useState<LosslessOptimizationResult | null>(null)
  const [conversionResult, setConversionResult] = useState<SmartConversionResult | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [output, setOutput] = useState<Blob | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const jobIdRef = useRef<string | null>(null)
  const optimizationJobIdRef = useRef<string | null>(null)
  const verificationAbortControllerRef = useRef<AbortController | null>(null)
  const progressUpdateRef = useRef({ updatedAt: 0, value: -1 })
  const optimizationInputRef = useRef<{
    metadata: VideoMetadata
    plan: OptimizationPlan | SmartConversionPlan
  } | null>(null)

  const terminateWorker = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = null
  }, [])

  const verifyCompletedOutput = useCallback(
    async (
      jobId: string,
      outputBlob: Blob,
      workerResult: OptimizationWorkerResult,
      metadata: VideoMetadata,
      plan: OptimizationPlan | SmartConversionPlan,
    ) => {
      const verificationAbortController = new AbortController()
      verificationAbortControllerRef.current = verificationAbortController
      const outputFile = new File([outputBlob], workerResult.outputFileName, { type: 'video/mp4' })
      const outputUrl = URL.createObjectURL(outputBlob)
      try {
        const { analyzeVideo } = await import('../features/video-analysis/analyzeVideo')
        const outputAnalysis = await analyzeVideo(
          outputFile,
          outputUrl,
          verificationAbortController.signal,
        )
        if (optimizationJobIdRef.current !== jobId) return
        if (
          outputAnalysis.metadata.container !== 'MP4' ||
          outputAnalysis.metadata.duration === null ||
          outputAnalysis.metadata.width === null ||
          outputAnalysis.metadata.height === null
        ) {
          throw new Error('Output verification failed.')
        }
        const verification = await verifyVideoInWorker(
          {
            mode: plan.mode,
            original: metadata,
            output: outputAnalysis.metadata,
            outputFile,
          },
          verificationAbortController.signal,
        )
        if (optimizationJobIdRef.current !== jobId || !verification.success) return
        setOutput(outputBlob)
        setVerificationResult(verification)
        if (plan.mode === 'lossless') {
          setResult(
            createLosslessOptimizationResult(
              metadata,
              workerResult.output.byteLength,
              workerResult.outputFileName,
              workerResult.processingTime,
              [...plan.warnings, ...verification.warnings],
            ),
          )
        } else {
          setConversionResult(
            createSmartConversionResult(
              metadata,
              workerResult.output.byteLength,
              workerResult.outputFileName,
              workerResult.processingTime,
              [...plan.warnings, ...verification.warnings],
              outputAnalysis.metadata,
            ),
          )
        }
        setProcessingStatus('complete')
        setProgress(100)
        setMessage(
          verification.status === 'preserved'
            ? 'Output verified. Video stream preservation was confirmed.'
            : verification.status === 'reencoded'
              ? 'Output verified. Video was re-encoded as requested.'
              : 'Output verified, but stream preservation is inconclusive.',
        )
        addHistoryEntry({
          completedAt: Date.now(),
          duration: outputAnalysis.metadata.duration,
          fileName: workerResult.outputFileName,
          id: crypto.randomUUID(),
          mode: plan.mode,
          processingTime: workerResult.processingTime,
          resolution:
            outputAnalysis.metadata.width && outputAnalysis.metadata.height
              ? `${outputAnalysis.metadata.width} × ${outputAnalysis.metadata.height}`
              : null,
          status: verification.status,
        })
        terminateWorker()
        setStatus('idle')
      } catch (error) {
        if (optimizationJobIdRef.current === jobId) {
          setProcessingStatus('error')
          setMessage(error instanceof Error ? error.message : 'Output verification failed.')
          terminateWorker()
          setStatus('idle')
        }
      } finally {
        URL.revokeObjectURL(outputUrl)
        if (verificationAbortControllerRef.current === verificationAbortController) {
          verificationAbortControllerRef.current = null
        }
        if (optimizationJobIdRef.current === jobId) {
          optimizationJobIdRef.current = null
          optimizationInputRef.current = null
        }
      }
    },
    [addHistoryEntry, terminateWorker],
  )

  const load = useCallback(() => {
    if (status === 'loading' || status === 'ready') return
    terminateWorker()
    const worker = new Worker(new URL('../workers/ffmpeg.worker.ts', import.meta.url), {
      type: 'module',
    })
    const jobId = crypto.randomUUID()
    workerRef.current = worker
    jobIdRef.current = jobId
    setStatus('loading')
    setMessage('Preparing video engine…')
    worker.addEventListener(
      'message',
      (event: MessageEvent<WorkerResponse<FfmpegWorkerResult>>) => {
        const response = event.data
        if (response.jobId === jobId && response.type === 'LOADING') setMessage(response.message)
        if (response.jobId === jobId && response.type === 'COMPLETE') {
          jobIdRef.current = null
          setStatus('ready')
          setMessage('Video engine is ready for local optimization.')
        }
        if (response.jobId === jobId && response.type === 'ERROR') {
          jobIdRef.current = null
          setStatus('error')
          setMessage(response.message)
          terminateWorker()
        }
        if (response.jobId === jobId && response.type === 'CANCELLED') {
          jobIdRef.current = null
          setStatus('cancelled')
          setMessage('Preparing the video engine was cancelled.')
          terminateWorker()
        }
        if (response.jobId !== optimizationJobIdRef.current) return
        if (response.type === 'LOADING') {
          setProcessingStatus('loading')
          setMessage(response.message)
        }
        if (response.type === 'PROGRESS') {
          setProcessingStatus('processing')
          const nextValue = response.value ?? null
          const now = performance.now()
          if (
            nextValue === null ||
            nextValue >= 100 ||
            now - progressUpdateRef.current.updatedAt >= 100 ||
            Math.abs(nextValue - progressUpdateRef.current.value) >= 1
          ) {
            progressUpdateRef.current = { updatedAt: now, value: nextValue ?? -1 }
            setProgress(nextValue)
          }
        }
        if (
          response.type === 'COMPLETE' &&
          response.result &&
          'output' in response.result &&
          optimizationInputRef.current
        ) {
          const workerResult = response.result as OptimizationWorkerResult
          const { metadata, plan } = optimizationInputRef.current
          const outputBlob = new Blob([workerResult.output.buffer as ArrayBuffer], {
            type: 'video/mp4',
          })
          setProcessingStatus('verifying')
          setMessage('Verifying output locally…')
          void verifyCompletedOutput(response.jobId, outputBlob, workerResult, metadata, plan)
        }
        if (response.type === 'ERROR') {
          setProcessingStatus('error')
          setMessage(response.message)
          optimizationJobIdRef.current = null
          optimizationInputRef.current = null
        }
        if (response.type === 'CANCELLED') {
          setProcessingStatus('cancelled')
          setMessage('Lossless container optimization was cancelled.')
          optimizationJobIdRef.current = null
          optimizationInputRef.current = null
        }
      },
    )
    worker.addEventListener('error', () => {
      setStatus('error')
      setMessage('The video engine could not start in this browser.')
      terminateWorker()
    })
    worker.postMessage({ type: 'LOAD', jobId } satisfies WorkerCommand)
  }, [status, terminateWorker, verifyCompletedOutput])

  const optimize = useCallback(
    (file: File, metadata: VideoMetadata, plan: OptimizationPlan) => {
      if (
        !workerRef.current ||
        status !== 'ready' ||
        plan.mode !== 'lossless' ||
        ['loading', 'processing', 'verifying'].includes(processingStatus)
      )
        return
      const jobId = crypto.randomUUID()
      optimizationJobIdRef.current = jobId
      optimizationInputRef.current = { metadata, plan }
      setOutput(null)
      setResult(null)
      setVerificationResult(null)
      setProgress(null)
      progressUpdateRef.current = { updatedAt: 0, value: -1 }
      setProcessingStatus('loading')
      setMessage('Preparing lossless container optimization…')
      workerRef.current.postMessage({
        type: 'OPTIMIZE',
        jobId,
        file,
        inputName: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
        mode: 'lossless',
        outputName: plan.outputFileName,
      } satisfies WorkerCommand)
    },
    [processingStatus, status],
  )

  const convert = useCallback(
    (file: File, metadata: VideoMetadata, plan: SmartConversionPlan) => {
      if (
        !workerRef.current ||
        status !== 'ready' ||
        ['loading', 'processing', 'verifying'].includes(processingStatus)
      )
        return
      const jobId = crypto.randomUUID()
      optimizationJobIdRef.current = jobId
      optimizationInputRef.current = { metadata, plan }
      setOutput(null)
      setConversionResult(null)
      setVerificationResult(null)
      setProgress(null)
      progressUpdateRef.current = { updatedAt: 0, value: -1 }
      setProcessingStatus('loading')
      setMessage('Preparing Smart Conversion…')
      workerRef.current.postMessage({
        type: 'OPTIMIZE',
        jobId,
        file,
        inputName: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
        mode: 'conversion',
        outputName: plan.outputFileName,
      } satisfies WorkerCommand)
    },
    [processingStatus, status],
  )

  const cancel = useCallback(() => {
    const activeJobId = jobIdRef.current ?? optimizationJobIdRef.current
    if (!workerRef.current || !activeJobId) return
    workerRef.current.postMessage({
      type: 'CANCEL',
      jobId: activeJobId,
    } satisfies WorkerCommand)
    jobIdRef.current = null
    optimizationJobIdRef.current = null
    optimizationInputRef.current = null
    verificationAbortControllerRef.current?.abort()
    verificationAbortControllerRef.current = null
    terminateWorker()
    if (status === 'loading') {
      setStatus('cancelled')
      setMessage('Preparing the video engine was cancelled.')
    } else {
      setStatus('cancelled')
      setProcessingStatus('cancelled')
      setMessage('Lossless container optimization was cancelled.')
    }
  }, [status, terminateWorker])

  const cleanup = useCallback(() => {
    terminateWorker()
    jobIdRef.current = null
    optimizationJobIdRef.current = null
    optimizationInputRef.current = null
    verificationAbortControllerRef.current?.abort()
    verificationAbortControllerRef.current = null
    setStatus('idle')
    setMessage(null)
    setOutput(null)
    setProgress(null)
    setResult(null)
    setConversionResult(null)
    setVerificationResult(null)
    setProcessingStatus('idle')
  }, [terminateWorker])
  useEffect(() => cleanup, [cleanup])
  return {
    cancel,
    cleanup,
    conversionResult,
    convert,
    load,
    message,
    optimize,
    output,
    processingStatus,
    progress,
    result,
    status,
    verificationResult,
  }
}
