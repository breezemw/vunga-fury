import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import {
  cleanupExpiredMetadata,
  deleteLocalDatabase,
  getDefaultSettings,
  isIndexedDbAvailable,
  loadHistory,
  loadSettings,
  saveHistoryEntry,
  saveSettings,
} from '../../features/storage/indexedDb'
import type { LocalSettings, ProcessingHistoryEntry } from '../../features/storage/storageTypes'
import { LocalSettingsContext } from './localSettingsContext'

export function LocalSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<LocalSettings>(getDefaultSettings)
  const [history, setHistory] = useState<ProcessingHistoryEntry[]>([])
  const [isStorageAvailable] = useState(isIndexedDbAvailable)

  useEffect(() => {
    if (!isStorageAvailable) return
    void Promise.all([loadSettings(), loadHistory()]).then(([storedSettings, storedHistory]) => {
      setSettings(storedSettings)
      setHistory(storedHistory)
      if (storedSettings.automaticCleanup) void cleanupExpiredMetadata()
    })
  }, [isStorageAvailable])

  const updateSettings = useCallback(
    (changes: Partial<LocalSettings>) => {
      setSettings((current) => {
        const next = { ...current, ...changes }
        if (isStorageAvailable) void saveSettings(next)
        return next
      })
    },
    [isStorageAvailable],
  )

  const addHistoryEntry = useCallback(
    (entry: ProcessingHistoryEntry) => {
      setHistory((current) => [entry, ...current].slice(0, 25))
      if (isStorageAvailable) void saveHistoryEntry(entry)
    },
    [isStorageAvailable],
  )

  const clearLocalData = useCallback(async () => {
    const cleared = await deleteLocalDatabase()
    setSettings(getDefaultSettings())
    setHistory([])
    return cleared
  }, [])

  return (
    <LocalSettingsContext
      value={{
        addHistoryEntry,
        clearLocalData,
        history,
        isStorageAvailable,
        settings,
        updateSettings,
      }}
    >
      {children}
    </LocalSettingsContext>
  )
}
