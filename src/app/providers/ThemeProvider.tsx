import { useEffect, useState, type PropsWithChildren } from 'react'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { ThemeContext, type Appearance } from './themeContext'

type ResolvedAppearance = Exclude<Appearance, 'system'>

function getSystemAppearance(): ResolvedAppearance {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const { settings, updateSettings } = useLocalSettings()
  const appearance = settings.theme
  const [systemAppearance, setSystemAppearance] = useState<ResolvedAppearance>(getSystemAppearance)
  const resolvedAppearance = appearance === 'system' ? systemAppearance : appearance

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = () => setSystemAppearance(mediaQuery.matches ? 'light' : 'dark')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedAppearance
  }, [resolvedAppearance])

  return (
    <ThemeContext
      value={{
        appearance,
        resolvedAppearance,
        setAppearance: (theme) => updateSettings({ theme }),
      }}
    >
      {children}
    </ThemeContext>
  )
}
