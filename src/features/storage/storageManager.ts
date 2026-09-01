import type { StorageQuota } from './storageTypes'

export async function getStorageQuota(): Promise<StorageQuota> {
  if (!navigator.storage?.estimate)
    return { available: false, quota: null, usage: null, usageRatio: null }
  try {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage ?? null
    const quota = estimate.quota ?? null
    return {
      available: true,
      quota,
      usage,
      usageRatio: usage !== null && quota && quota > 0 ? usage / quota : null,
    }
  } catch {
    return { available: false, quota: null, usage: null, usageRatio: null }
  }
}

export function isStorageLow(quota: StorageQuota) {
  return quota.usageRatio !== null && quota.usageRatio >= 0.9
}
