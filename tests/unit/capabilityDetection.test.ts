import { describe, expect, it } from 'vitest'
import { classifyProcessingCapability } from '../../src/lib/browser/capabilityDetection'

describe('processing capability classification', () => {
  it('requires WebAssembly and workers for local processing readiness', () => {
    expect(
      classifyProcessingCapability({
        deviceMemoryGiB: null,
        videoPlayback: true,
        webAssembly: false,
        webWorkers: true,
      }),
    ).toBe('unsupported')
  })

  it('marks constrained browser capabilities as limited', () => {
    expect(
      classifyProcessingCapability({
        deviceMemoryGiB: 2,
        videoPlayback: true,
        webAssembly: true,
        webWorkers: true,
      }),
    ).toBe('limited')
  })

  it('marks capable environments as full', () => {
    expect(
      classifyProcessingCapability({
        deviceMemoryGiB: null,
        videoPlayback: true,
        webAssembly: true,
        webWorkers: true,
      }),
    ).toBe('full')
  })
})
