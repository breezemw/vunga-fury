import { runWorkerCommand } from './runWorkerCommand'
import type {
  VerificationRequest,
  VerificationResult,
} from '../../features/video-verification/verificationTypes'
import type { WorkerCommand } from '../../types/workerMessages'

export async function verifyVideoInWorker(request: VerificationRequest, signal?: AbortSignal) {
  const worker = new Worker(new URL('../../workers/verification.worker.ts', import.meta.url), {
    type: 'module',
  })
  const command: WorkerCommand = { type: 'VERIFY', jobId: crypto.randomUUID(), ...request }
  const response = await runWorkerCommand<VerificationResult>(worker, command, signal)
  if (response.type !== 'COMPLETE' || !response.result)
    throw new Error('Output verification failed.')
  return response.result
}
