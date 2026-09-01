import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  LARGE_VIDEO_WARNING_BYTES,
  LOW_END_DEVICE_WARNING_BYTES,
  MAX_VIDEO_FILE_SIZE_BYTES,
} from '../../src/config/videoConfig'
import {
  getFileExtension,
  validateVideoDescriptor,
} from '../../src/features/video-analysis/validateVideo'

const originalWindow = globalThis.window
const originalNavigator = globalThis.navigator

beforeEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { HTMLVideoElement: class HTMLVideoElement {}, URL: { createObjectURL: () => '' } },
  })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} })
})

afterEach(() => {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator })
})

describe('local video validation', () => {
  it('accepts an MP4 with a supported MIME type', () => {
    expect(validateVideoDescriptor({ name: 'clip.mp4', size: 1024, type: 'video/mp4' })).toEqual({
      errors: [],
      warnings: [],
    })
  })

  it('accepts a MOV with an unavailable MIME type and records a verification warning', () => {
    const result = validateVideoDescriptor({ name: 'clip.MOV', size: 1024, type: '' })
    expect(result.errors).toEqual([])
    expect(result.warnings).toHaveLength(1)
  })

  it('rejects an unsupported file type', () => {
    const result = validateVideoDescriptor({
      name: 'clip.avi',
      size: 1024,
      type: 'video/x-msvideo',
    })
    expect(result.errors).toHaveLength(2)
  })

  it('rejects oversized local files', () => {
    const result = validateVideoDescriptor({
      name: 'large.mp4',
      size: MAX_VIDEO_FILE_SIZE_BYTES + 1,
      type: 'video/mp4',
    })
    expect(result.errors).toContain('This file exceeds the 2 GB local processing limit.')
  })

  it('warns before a large file reaches the hard 2 GB limit', () => {
    const result = validateVideoDescriptor({
      name: 'large.mp4',
      size: LARGE_VIDEO_WARNING_BYTES,
      type: 'video/mp4',
    })

    expect(result.errors).toEqual([])
    expect(result.warnings).toContain(
      'This large video may require significant memory. Keep this tab open and avoid running other heavy apps while processing.',
    )
  })

  it('warns on a low-memory device before a large analysis begins', () => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { deviceMemory: 2 },
    })
    const result = validateVideoDescriptor({
      name: 'phone.mp4',
      size: LOW_END_DEVICE_WARNING_BYTES + 1,
      type: 'video/mp4',
    })

    expect(result.warnings).toContain(
      'This video may require significant memory on this device. Analysis may take longer.',
    )
  })

  it('extracts a case-insensitive filename extension', () => {
    expect(getFileExtension('Portrait.Mp4')).toBe('mp4')
  })
})
