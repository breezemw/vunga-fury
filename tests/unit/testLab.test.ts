import { describe, expect, it } from 'vitest'
import { classifyTestLabResult } from '../../src/features/social-media/testLab/testLabTypes'

describe('classifyTestLabResult', () => {
  it('reports NOT TESTED when no comparison data exists', () => {
    expect(
      classifyTestLabResult({ dimensionsMatch: null, formatOrCodecMatch: null, pixelStatus: null }),
    ).toBe('NOT TESTED')
  })

  it('reports PRESERVED when pixels are identical and format/codec matches', () => {
    expect(
      classifyTestLabResult({
        dimensionsMatch: true,
        formatOrCodecMatch: true,
        pixelStatus: 'identical',
      }),
    ).toBe('PRESERVED')
  })

  it('reports RE-ENCODED when dimensions changed', () => {
    expect(
      classifyTestLabResult({
        dimensionsMatch: false,
        formatOrCodecMatch: true,
        pixelStatus: 'changed',
      }),
    ).toBe('RE-ENCODED')
  })

  it('reports PLATFORM PROCESSED when dimensions match but format/codec changed', () => {
    expect(
      classifyTestLabResult({
        dimensionsMatch: true,
        formatOrCodecMatch: false,
        pixelStatus: 'not-compared',
      }),
    ).toBe('PLATFORM PROCESSED')
  })

  it('reports PARTIALLY PRESERVED when dimensions and format match but pixels changed', () => {
    expect(
      classifyTestLabResult({
        dimensionsMatch: true,
        formatOrCodecMatch: true,
        pixelStatus: 'changed',
      }),
    ).toBe('PARTIALLY PRESERVED')
  })
})
