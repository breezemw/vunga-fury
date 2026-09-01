import { runWorkerCommand } from './runWorkerCommand'
import type { AnalysisWorkerResult, WorkerCommand } from '../../types/workerMessages'

export function createAnalysisWorker() {
  return new Worker(new URL('../../workers/analysis.worker.ts', import.meta.url), {
    type: 'module',
  })
}

export async function analyzeContainerInWorker(
  file: File,
  signal?: AbortSignal,
): Promise<AnalysisWorkerResult> {
  if (typeof Worker === 'undefined') return null
  const jobId = crypto.randomUUID()
  const worker = createAnalysisWorker()
  const command: WorkerCommand = { type: 'ANALYZE', jobId, file }
  const response = await runWorkerCommand<AnalysisWorkerResult>(worker, command, signal)
  return response.type === 'COMPLETE' ? (response.result ?? null) : null
}
