import { useContext } from 'react'
import { LocalSettingsContext } from '../app/providers/localSettingsContext'

export function useLocalSettings() {
  const context = useContext(LocalSettingsContext)
  if (!context) throw new Error('useLocalSettings must be used within LocalSettingsProvider')
  return context
}
