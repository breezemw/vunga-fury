import type { WorkerCommand, WorkerResponse } from '../../types/workerMessages'

export type WorkerLike = Pick<
  Worker,
  'addEventListener' | 'postMessage' | 'removeEventListener' | 'terminate'
>

export function runWorkerCommand<TResult>(
  worker: WorkerLike,
  command: WorkerCommand,
  signal?: AbortSignal,
) {
  return new Promise<WorkerResponse<TResult>>((resolve, reject) => {
    const cleanup = () => {
      worker.removeEventListener('message', handleMessage)
      worker.removeEventListener('error', handleError)
      signal?.removeEventListener('abort', handleAbort)
      worker.terminate()
    }
    const handleMessage = (event: MessageEvent<WorkerResponse<TResult>>) => {
      const response = event.data
      if (
        response.jobId !== command.jobId ||
        response.type === 'LOADING' ||
        response.type === 'PROGRESS'
      )
        return
      cleanup()
      if (response.type === 'COMPLETE') resolve(response)
      else if (response.type === 'CANCELLED')
        reject(new DOMException('Worker operation was cancelled.', 'AbortError'))
      else reject(new Error(response.message))
    }
    const handleError = () => {
      cleanup()
      reject(new Error('The local worker could not complete its task.'))
    }
    const handleAbort = () => {
      worker.postMessage({ type: 'CANCEL', jobId: command.jobId } satisfies WorkerCommand)
      cleanup()
      reject(new DOMException('Worker operation was cancelled.', 'AbortError'))
    }
    worker.addEventListener('message', handleMessage)
    worker.addEventListener('error', handleError)
    signal?.addEventListener('abort', handleAbort, { once: true })
    if (signal?.aborted) {
      handleAbort()
      return
    }
    worker.postMessage(command)
  })
}
