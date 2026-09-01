import { useEffect, useState } from 'react'
import { getStorageQuota } from '../features/storage/storageManager'
import type { StorageQuota } from '../features/storage/storageTypes'

const unavailableQuota: StorageQuota = {
  available: false,
  quota: null,
  usage: null,
  usageRatio: null,
}

export function useStorageQuota() {
  const [quota, setQuota] = useState<StorageQuota>(unavailableQuota)
  useEffect(() => {
    void getStorageQuota().then(setQuota)
  }, [])
  return quota
}
