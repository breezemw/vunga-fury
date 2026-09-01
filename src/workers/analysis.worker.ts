import { inspectContainer } from '../features/video-analysis/containerAnalysis'
import type { WorkerCommand, WorkerResponse } from '../types/workerMessages'

const cancelledJobs = new Set<string>()
const workerScope = self as unknown as Worker
const respond = (response: WorkerResponse) => workerScope.postMessage(response)

workerScope.addEventListener('message', (event: MessageEvent<WorkerCommand>) => {
  const command = event.data
  if (command.type === 'CANCEL') {
    cancelledJobs.add(command.jobId)
    respond({ type: 'CANCELLED', jobId: command.jobId })
    return
  }
  if (command.type === 'CLEANUP') {
    cancelledJobs.delete(command.jobId)
    respond({ type: 'COMPLETE', jobId: command.jobId })
    return
  }
  if (command.type !== 'ANALYZE') {
    respond({
      type: 'ERROR',
      jobId: command.jobId,
      message: 'This command is not handled by the analysis worker.',
    })
    return
  }
  void (async () => {
    respond({
      type: 'LOADING',
      jobId: command.jobId,
      message: 'Inspecting local container metadata.',
    })
    try {
      const result = await inspectContainer(command.file, () => cancelledJobs.has(command.jobId))
      respond(
        cancelledJobs.has(command.jobId)
          ? { type: 'CANCELLED', jobId: command.jobId }
          : { type: 'COMPLETE', jobId: command.jobId, result },
      )
    } catch {
      respond({
        type: 'ERROR',
        jobId: command.jobId,
        message: 'Container metadata could not be read locally.',
      })
    } finally {
      cancelledJobs.delete(command.jobId)
    }
  })()
})
