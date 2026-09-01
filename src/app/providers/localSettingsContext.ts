import { createContext } from 'react'
import type { LocalSettings, ProcessingHistoryEntry } from '../../features/storage/storageTypes'

export type LocalSettingsContextValue = {
  addHistoryEntry: (entry: ProcessingHistoryEntry) => void
  clearLocalData: () => Promise<boolean>
  history: ProcessingHistoryEntry[]
  isStorageAvailable: boolean
  settings: LocalSettings
  updateSettings: (changes: Partial<LocalSettings>) => void
}

export const LocalSettingsContext = createContext<LocalSettingsContextValue | null>(null)
