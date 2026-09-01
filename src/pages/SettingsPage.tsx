import type { Appearance } from '../app/providers/themeContext'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { CapabilityPanel } from '../components/settings/CapabilityPanel'
import { LocalDataPanel } from '../components/settings/LocalDataPanel'
import { ProcessingSettings } from '../components/settings/ProcessingSettings'
import { StorageQuotaPanel } from '../components/settings/StorageQuotaPanel'
import { PageContainer } from '../components/layout/PageContainer'
import { useLocalSettings } from '../hooks/useLocalSettings'
import { useTheme } from '../hooks/useTheme'

const appearances: Appearance[] = ['dark', 'light', 'system']

export function SettingsPage() {
  const { appearance, setAppearance } = useTheme()
  const { isStorageAvailable } = useLocalSettings()
  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>LOCAL SETTINGS</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Application preferences
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        Preferences and completed-job metadata stay in this browser only.
      </p>
      <Card className="mt-6 max-w-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-[var(--heading)]">Appearance</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Choose how VUNGA FURY looks on this device.
            </p>
          </div>
          <span className="text-xs text-[var(--muted)]">
            {isStorageAvailable ? 'STORED LOCALLY' : 'IN-MEMORY ONLY'}
          </span>
        </div>
        <fieldset className="mt-6 flex flex-wrap gap-2">
          <legend className="sr-only">Appearance preference</legend>
          {appearances.map((option) => (
            <label
              key={option}
              className={`min-h-11 cursor-pointer border px-4 py-3 text-sm capitalize focus-within:outline-2 focus-within:outline-[var(--accent)] focus-within:outline-offset-2 ${appearance === option ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--heading)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
            >
              <input
                className="sr-only"
                type="radio"
                name="appearance"
                value={option}
                checked={appearance === option}
                onChange={() => setAppearance(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
      </Card>
      <ProcessingSettings />
      <StorageQuotaPanel />
      <LocalDataPanel />
      <CapabilityPanel />
    </PageContainer>
  )
}
