import { describe, expect, it } from 'vitest'
import { runWorkerCommand, type WorkerLike } from '../../src/lib/workers/runWorkerCommand'
import type { WorkerCommand, WorkerResponse } from '../../src/types/workerMessages'

class MockWorker {
  readonly messages: WorkerCommand[] = []
  terminated = false
  private messageHandler: ((event: MessageEvent<WorkerResponse>) => void) | null = null
  private errorHandler: (() => void) | null = null

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    if (type === 'message')
      this.messageHandler = listener as (event: MessageEvent<WorkerResponse>) => void
    if (type === 'error') this.errorHandler = listener as () => void
  }

  removeEventListener(type: string) {
    if (type === 'message') this.messageHandler = null
    if (type === 'error') this.errorHandler = null
  }

  postMessage(message: WorkerCommand) {
    this.messages.push(message)
  }

  terminate() {
    this.terminated = true
  }

  complete(response: WorkerResponse) {
    this.messageHandler?.({ data: response } as MessageEvent<WorkerResponse>)
  }

  fail() {
    this.errorHandler?.()
  }
}

const analyzeCommand: WorkerCommand = { type: 'ANALYZE', jobId: 'job-1', file: {} as File }

describe('worker command lifecycle', () => {
  it('sends a command, receives a result, and cleans up the worker', async () => {
    const worker = new MockWorker()
    const request = runWorkerCommand<string>(worker as unknown as WorkerLike, analyzeCommand)
    worker.complete({ type: 'COMPLETE', jobId: 'job-1', result: 'complete' })
    await expect(request).resolves.toEqual({ type: 'COMPLETE', jobId: 'job-1', result: 'complete' })
    expect(worker.messages).toEqual([analyzeCommand])
    expect(worker.terminated).toBe(true)
  })

  it('propagates worker errors and terminates the worker', async () => {
    const worker = new MockWorker()
    const request = runWorkerCommand(worker as unknown as WorkerLike, analyzeCommand)
    worker.complete({ type: 'ERROR', jobId: 'job-1', message: 'Local analysis failed.' })
    await expect(request).rejects.toThrow('Local analysis failed.')
    expect(worker.terminated).toBe(true)
  })

  it('sends cancellation and terminates an in-flight worker', async () => {
    const worker = new MockWorker()
    const controller = new AbortController()
    const request = runWorkerCommand(
      worker as unknown as WorkerLike,
      analyzeCommand,
      controller.signal,
    )
    controller.abort()
    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
    expect(worker.messages).toEqual([analyzeCommand, { type: 'CANCEL', jobId: 'job-1' }])
    expect(worker.terminated).toBe(true)
  })

  it('recovers from an unexpected worker event', async () => {
    const worker = new MockWorker()
    const request = runWorkerCommand(worker as unknown as WorkerLike, analyzeCommand)
    worker.fail()
    await expect(request).rejects.toThrow('The local worker could not complete its task.')
    expect(worker.terminated).toBe(true)
  })
})
