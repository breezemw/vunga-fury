import type { LocalSettings, ProcessingHistoryEntry, TemporaryMetadata } from './storageTypes'

export const DATABASE_NAME = 'vunga-fury-db'
export const DATABASE_VERSION = 2
const SETTINGS_STORE = 'settings'
const JOBS_STORE = 'jobs'
const METADATA_STORE = 'metadata'

const defaults: LocalSettings = {
  automaticCleanup: true,
  optimizationPreference: 'lossless',
  theme: 'dark',
}

type SettingRecord = { key: keyof LocalSettings; value: LocalSettings[keyof LocalSettings] }

export function isIndexedDbAvailable() {
  return typeof indexedDB !== 'undefined'
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'))
  })
}

export function openVungaFuryDb(): Promise<IDBDatabase | null> {
  if (!isIndexedDbAvailable()) return Promise.resolve(null)
  return new Promise((resolve) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
        database.createObjectStore(SETTINGS_STORE, { keyPath: 'key' })
      }
      if (!database.objectStoreNames.contains(JOBS_STORE)) {
        const jobs = database.createObjectStore(JOBS_STORE, { keyPath: 'id' })
        jobs.createIndex('completedAt', 'completedAt')
      }
      if (!database.objectStoreNames.contains(METADATA_STORE)) {
        const metadata = database.createObjectStore(METADATA_STORE, { keyPath: 'id' })
        metadata.createIndex('expiresAt', 'expiresAt')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => Promise<T>,
) {
  const database = await openVungaFuryDb()
  if (!database) return null
  try {
    const result = await callback(database.transaction(storeName, mode).objectStore(storeName))
    return result
  } catch {
    return null
  } finally {
    database.close()
  }
}

export async function loadSettings(): Promise<LocalSettings> {
  const records = await withStore<SettingRecord[]>(SETTINGS_STORE, 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<SettingRecord[]>),
  )
  if (!records) return defaults
  return records.reduce<LocalSettings>(
    (settings, record) => ({ ...settings, [record.key]: record.value }),
    { ...defaults },
  )
}

export async function saveSettings(settings: LocalSettings) {
  const records = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  })) as SettingRecord[]
  return withStore(SETTINGS_STORE, 'readwrite', async (store) => {
    await Promise.all(records.map((record) => requestToPromise(store.put(record))))
    return true
  })
}

export async function loadHistory() {
  const history = await withStore<ProcessingHistoryEntry[]>(JOBS_STORE, 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<ProcessingHistoryEntry[]>),
  )
  return history?.sort((first, second) => second.completedAt - first.completedAt) ?? []
}

export async function saveHistoryEntry(entry: ProcessingHistoryEntry) {
  return withStore(JOBS_STORE, 'readwrite', (store) =>
    requestToPromise(store.put(entry)).then(() => true),
  )
}

export async function saveTemporaryMetadata(entry: TemporaryMetadata) {
  return withStore(METADATA_STORE, 'readwrite', (store) =>
    requestToPromise(store.put(entry)).then(() => true),
  )
}

export async function cleanupExpiredMetadata(now = Date.now()) {
  const records = await withStore<TemporaryMetadata[]>(METADATA_STORE, 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<TemporaryMetadata[]>),
  )
  if (!records) return false
  const expiredIds = records.filter((record) => record.expiresAt <= now).map((record) => record.id)
  if (expiredIds.length === 0) return true
  return withStore(METADATA_STORE, 'readwrite', async (store) => {
    await Promise.all(expiredIds.map((id) => requestToPromise(store.delete(id))))
    return true
  })
}

export function deleteLocalDatabase() {
  if (!isIndexedDbAvailable()) return Promise.resolve(false)
  return new Promise<boolean>((resolve) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME)
    request.onsuccess = () => resolve(true)
    request.onerror = () => resolve(false)
    request.onblocked = () => resolve(false)
  })
}

export function getDefaultSettings(): LocalSettings {
  return { ...defaults }
}
