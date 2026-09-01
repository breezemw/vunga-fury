import { createContext } from 'react'

export type Appearance = 'dark' | 'light' | 'system'
type ResolvedAppearance = Exclude<Appearance, 'system'>

export type ThemeContextValue = {
  appearance: Appearance
  resolvedAppearance: ResolvedAppearance
  setAppearance: (appearance: Appearance) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
