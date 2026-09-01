import { describe, expect, it } from 'vitest'
import { getVideoQualityCategory } from '../../src/features/social-media/common/socialOptimizer'
import { getImageQualityCategory } from '../../src/features/social-media/images/imageComparison'

describe('getVideoQualityCategory', () => {
  it('reports NOT-VERIFIED when there is no verification evidence', () => {
    expect(getVideoQualityCategory('lossless-optimization', null)).toBe('NOT-VERIFIED')
    expect(getVideoQualityCategory('lossless-optimization', 'failed')).toBe('NOT-VERIFIED')
    expect(getVideoQualityCategory('lossless-optimization', 'inconclusive')).toBe('NOT-VERIFIED')
  })

  it('reports QUALITY-PRESERVING only when already-optimal and verified preserved', () => {
    expect(getVideoQualityCategory('already-optimal', 'preserved')).toBe('QUALITY-PRESERVING')
  })

  it('reports LOSSLESS when verified preserved but not already-optimal', () => {
    expect(getVideoQualityCategory('lossless-optimization', 'preserved')).toBe('LOSSLESS')
  })

  it('reports PLATFORM-OPTIMIZED when the output was re-encoded', () => {
    expect(getVideoQualityCategory('requires-conversion', 'reencoded')).toBe('PLATFORM-OPTIMIZED')
  })
})

describe('getImageQualityCategory', () => {
  it('reports NOT-VERIFIED when pixels were not compared', () => {
    expect(getImageQualityCategory('already-optimal', 'not-compared')).toBe('NOT-VERIFIED')
  })

  it('reports QUALITY-PRESERVING when already-optimal and pixel-identical', () => {
    expect(getImageQualityCategory('already-optimal', 'identical')).toBe('QUALITY-PRESERVING')
  })

  it('reports LOSSLESS when pixel-identical after a resize decision path', () => {
    expect(getImageQualityCategory('requires-resize', 'identical')).toBe('LOSSLESS')
  })

  it('reports PLATFORM-OPTIMIZED when pixels changed', () => {
    expect(getImageQualityCategory('requires-resize', 'changed')).toBe('PLATFORM-OPTIMIZED')
  })
})
