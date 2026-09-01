import { describe, expect, it } from 'vitest'
import { formatDuration } from '../../src/lib/utils/formatDuration'
import { formatFileSize } from '../../src/lib/utils/formatFileSize'

describe('video metadata formatters', () => {
  it('formats known durations and unavailable durations', () => {
    expect(formatDuration(63)).toBe('01:03')
    expect(formatDuration(3600)).toBe('01:00:00')
    expect(formatDuration(null)).toBe('Unavailable')
  })

  it('formats file sizes and invalid size values', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
    expect(formatFileSize(-1)).toBe('Unavailable')
  })
})
