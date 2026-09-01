import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  cleanupExpiredMetadata,
  deleteLocalDatabase,
  getDefaultSettings,
  isIndexedDbAvailable,
  loadHistory,
  loadSettings,
  openVungaFuryDb,
  saveHistoryEntry,
  saveSettings,
  saveTemporaryMetadata,
} from '../../src/features/storage/indexedDb'
import { isStorageLow } from '../../src/features/storage/storageManager'

async function deleteDatabase() {
  await deleteLocalDatabase()
}

beforeEach(async () => {
  await deleteDatabase()
})

afterEach(async () => {
  await deleteDatabase()
})

describe('vunga-fury-db', () => {
  it('creates the versioned local stores on a fresh installation', async () => {
    const database = await openVungaFuryDb()
    expect(database?.version).toBe(DATABASE_VERSION)
    expect(database?.objectStoreNames.contains('settings')).toBe(true)
    expect(database?.objectStoreNames.contains('jobs')).toBe(true)
    expect(database?.objectStoreNames.contains('metadata')).toBe(true)
    database?.close()
  })

  it('persists settings and metadata-only history', async () => {
    const settings = {
      ...getDefaultSettings(),
      theme: 'light' as const,
      optimizationPreference: 'conversion' as const,
    }
    await saveSettings(settings)
    await saveHistoryEntry({
      completedAt: 100,
      duration: 12,
      fileName: 'clip_optimized.mp4',
      id: 'job-1',
      mode: 'conversion',
      processingTime: 500,
      resolution: '1080 × 1920',
      status: 'reencoded',
    })
    expect(await loadSettings()).toEqual(settings)
    expect(await loadHistory()).toEqual([
      expect.objectContaining({ id: 'job-1', fileName: 'clip_optimized.mp4' }),
    ])
  })

  it('migrates an existing version-one database to the current schema', async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1)
      request.onupgradeneeded = () => request.result.createObjectStore('legacy')
      request.onsuccess = () => {
        request.result.close()
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
    const database = await openVungaFuryDb()
    expect(database?.version).toBe(DATABASE_VERSION)
    expect(database?.objectStoreNames.contains('legacy')).toBe(true)
    expect(database?.objectStoreNames.contains('settings')).toBe(true)
    expect(database?.objectStoreNames.contains('jobs')).toBe(true)
    expect(database?.objectStoreNames.contains('metadata')).toBe(true)
    database?.close()
  })

  it('cleans expired temporary metadata without storing files', async () => {
    await saveTemporaryMetadata({ expiresAt: 10, id: 'expired', kind: 'job-state' })
    await saveTemporaryMetadata({ expiresAt: 1000, id: 'active', kind: 'job-state' })
    expect(await cleanupExpiredMetadata(100)).toBe(true)
    const database = await openVungaFuryDb()
    const transaction = database?.transaction('metadata', 'readonly')
    const entries = await new Promise<Array<{ id: string }>>((resolve) => {
      const request = transaction?.objectStore('metadata').getAll()
      if (!request) return resolve([])
      request.onsuccess = () => resolve(request.result as Array<{ id: string }>)
    })
    expect(entries).toEqual([{ expiresAt: 1000, id: 'active', kind: 'job-state' }])
    database?.close()
  })

  it('falls back safely when IndexedDB is unavailable', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB')
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined })
    expect(isIndexedDbAvailable()).toBe(false)
    expect(await openVungaFuryDb()).toBeNull()
    if (descriptor) Object.defineProperty(globalThis, 'indexedDB', descriptor)
  })

  it('identifies a nearly full browser storage estimate', () => {
    expect(isStorageLow({ available: true, quota: 100, usage: 90, usageRatio: 0.9 })).toBe(true)
    expect(isStorageLow({ available: true, quota: 100, usage: 89, usageRatio: 0.89 })).toBe(false)
  })

  it('clears all local application data by deleting the database', async () => {
    await saveSettings({ ...getDefaultSettings(), theme: 'light' })
    expect(await deleteLocalDatabase()).toBe(true)
    expect(await loadSettings()).toEqual(getDefaultSettings())
  })
})
