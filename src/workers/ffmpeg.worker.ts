import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'
import classWorkerURL from '@ffmpeg/ffmpeg/worker?url'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { FFMPEG_CORE_VERSION } from '../lib/ffmpeg/ffmpegConfig'
import { buildLosslessRemuxCommand } from '../features/video-optimization/remuxer'
import { buildSmartConversionCommand } from '../features/video-optimization/smartConversionCommand'
import type { FFFSType } from '@ffmpeg/ffmpeg'
import type { FfmpegWorkerResult, WorkerCommand, WorkerResponse } from '../types/workerMessages'

const workerScope = self as unknown as Worker
let ffmpeg: FFmpeg | null = null
let loadingJobId: string | null = null
let activeOptimizationJobId: string | null = null
const respond = (response: WorkerResponse<FfmpegWorkerResult>) => {
  const output =
    response.type === 'COMPLETE' && response.result && 'output' in response.result
      ? response.result.output
      : null
  workerScope.postMessage(response, output ? [output.buffer] : [])
}

function isSafeVirtualFileName(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value) && !value.includes('..')
}

async function loadEngine(jobId: string) {
  if (ffmpeg?.loaded) {
    respond({ type: 'COMPLETE', jobId, result: { coreVersion: FFMPEG_CORE_VERSION } })
    return
  }
  loadingJobId = jobId
  respond({ type: 'LOADING', jobId, message: 'Preparing video engine…' })
  try {
    ffmpeg ??= new FFmpeg()
    await ffmpeg.load({ classWorkerURL, coreURL, wasmURL })
    if (loadingJobId !== jobId) return
    respond({ type: 'COMPLETE', jobId, result: { coreVersion: FFMPEG_CORE_VERSION } })
  } catch {
    ffmpeg?.terminate()
    ffmpeg = null
    respond({
      type: 'ERROR',
      jobId,
      message: 'The local FFmpeg engine could not be loaded in this browser.',
    })
  } finally {
    loadingJobId = null
  }
}

async function removeTemporaryFiles(outputPath: string, mountPoint: string) {
  if (!ffmpeg) return
  await Promise.allSettled([
    ffmpeg.deleteFile(outputPath),
    ffmpeg.unmount(mountPoint),
    ffmpeg.deleteDir(mountPoint),
  ])
}

async function optimizeVideo(command: Extract<WorkerCommand, { type: 'OPTIMIZE' }>) {
  if (
    !(command.file instanceof File) ||
    !isSafeVirtualFileName(command.inputName) ||
    !isSafeVirtualFileName(command.outputName) ||
    !command.outputName.endsWith('.mp4') ||
    (command.mode !== 'lossless' && command.mode !== 'conversion')
  ) {
    respond({
      type: 'ERROR',
      jobId: command.jobId,
      message: 'The optimization request contains invalid local file details.',
    })
    return
  }
  if (!ffmpeg?.loaded) {
    respond({
      type: 'ERROR',
      jobId: command.jobId,
      message: 'The local video engine is not ready.',
    })
    return
  }
  const mountPoint = `/vunga-input-${command.jobId}`
  const inputPath = `${mountPoint}/${command.inputName}`
  const outputPath = `/${command.outputName}`
  activeOptimizationJobId = command.jobId
  const startedAt = performance.now()
  const onProgress = ({ progress }: { progress: number }) => {
    if (activeOptimizationJobId === command.jobId && Number.isFinite(progress))
      respond({
        type: 'PROGRESS',
        jobId: command.jobId,
        stage:
          command.mode === 'lossless' ? 'Remuxing MP4 container' : 'Re-encoding video and audio',
        value: Math.max(0, Math.min(100, progress * 100)),
      })
  }
  try {
    respond({
      type: 'LOADING',
      jobId: command.jobId,
      message:
        command.mode === 'lossless'
          ? 'Preparing lossless container optimization…'
          : 'Preparing Smart Conversion…',
    })
    await ffmpeg.createDir(mountPoint)
    await ffmpeg.mount('WORKERFS' as FFFSType, { files: [command.file] }, mountPoint)
    ffmpeg.on('progress', onProgress)
    const exitCode = await ffmpeg.exec(
      command.mode === 'lossless'
        ? buildLosslessRemuxCommand(inputPath, outputPath)
        : buildSmartConversionCommand(inputPath, outputPath),
    )
    if (activeOptimizationJobId !== command.jobId) return
    if (exitCode !== 0)
      throw new Error(
        command.mode === 'lossless'
          ? 'FFmpeg could not remux this video without re-encoding.'
          : 'FFmpeg could not complete Smart Conversion for this video.',
      )
    const output = await ffmpeg.readFile(outputPath)
    if (!(output instanceof Uint8Array))
      throw new Error('FFmpeg did not produce a readable MP4 output.')
    respond({
      type: 'COMPLETE',
      jobId: command.jobId,
      result: {
        output,
        outputFileName: command.outputName,
        processingTime: performance.now() - startedAt,
      },
    })
  } catch (error) {
    if (activeOptimizationJobId === command.jobId)
      respond({
        type: 'ERROR',
        jobId: command.jobId,
        message:
          error instanceof Error
            ? error.message
            : command.mode === 'lossless'
              ? 'Lossless container optimization failed.'
              : 'Smart Conversion failed.',
      })
  } finally {
    ffmpeg?.off('progress', onProgress)
    await removeTemporaryFiles(outputPath, mountPoint)
    if (activeOptimizationJobId === command.jobId) activeOptimizationJobId = null
  }
}

workerScope.addEventListener('message', (event: MessageEvent<WorkerCommand>) => {
  const command = event.data
  if (command.type === 'CANCEL') {
    if (loadingJobId || activeOptimizationJobId) ffmpeg?.terminate()
    ffmpeg = null
    loadingJobId = null
    activeOptimizationJobId = null
    respond({ type: 'CANCELLED', jobId: command.jobId })
    return
  }
  if (command.type === 'CLEANUP') {
    ffmpeg?.terminate()
    ffmpeg = null
    loadingJobId = null
    activeOptimizationJobId = null
    respond({ type: 'COMPLETE', jobId: command.jobId })
    return
  }
  if (command.type === 'LOAD') {
    void loadEngine(command.jobId)
    return
  }
  if (command.type === 'OPTIMIZE') {
    void optimizeVideo(command)
    return
  }
  respond({
    type: 'ERROR',
    jobId: command.jobId,
    message:
      'FFmpeg is loaded, but video processing commands are not configured until a later stage.',
  })
})
