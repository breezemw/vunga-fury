import { createVerificationResult } from '../features/video-verification/verifyVideo'
import type {
  VerificationWorkerResult,
  WorkerCommand,
  WorkerResponse,
} from '../types/workerMessages'

const workerScope = self as unknown as Worker
const maximumHashBytes = 64 * 1024 * 1024

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

workerScope.addEventListener('message', (event: MessageEvent<WorkerCommand>) => {
  const command = event.data
  if (command.type === 'CANCEL') {
    workerScope.postMessage({ type: 'CANCELLED', jobId: command.jobId } satisfies WorkerResponse)
    return
  }
  if (command.type === 'CLEANUP') {
    workerScope.postMessage({ type: 'COMPLETE', jobId: command.jobId } satisfies WorkerResponse)
    return
  }
  if (command.type !== 'VERIFY') {
    workerScope.postMessage({
      type: 'ERROR',
      jobId: command.jobId,
      message: 'This command is not handled by the verification worker.',
    } satisfies WorkerResponse)
    return
  }
  void (async () => {
    try {
      workerScope.postMessage({
        type: 'LOADING',
        jobId: command.jobId,
        message: 'Comparing local video metadata…',
      } satisfies WorkerResponse)
      const outputHash =
        command.outputFile.size <= maximumHashBytes
          ? toHex(await crypto.subtle.digest('SHA-256', await command.outputFile.arrayBuffer()))
          : null
      const result = createVerificationResult(
        command.mode,
        command.original,
        command.output,
        outputHash,
      )
      workerScope.postMessage({
        type: 'COMPLETE',
        jobId: command.jobId,
        result,
      } satisfies WorkerResponse<VerificationWorkerResult>)
    } catch {
      workerScope.postMessage({
        type: 'ERROR',
        jobId: command.jobId,
        message: 'Output verification failed.',
      } satisfies WorkerResponse)
    }
  })()
})
