import { useLocalSettings } from '../../hooks/useLocalSettings'
import { Card } from '../common/Card'

export function ProcessingSettings() {
  const { settings, updateSettings } = useLocalSettings()
  return (
    <Card className="mt-4 max-w-2xl p-5 sm:p-6">
      <h2 className="text-lg font-medium text-[var(--heading)]">Processing preferences</h2>
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-[var(--heading)]">Preferred mode</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['lossless', 'conversion'] as const).map((mode) => (
            <label
              key={mode}
              className={`min-h-11 cursor-pointer border px-4 py-3 text-sm capitalize focus-within:outline-2 focus-within:outline-[var(--accent)] focus-within:outline-offset-2 ${settings.optimizationPreference === mode ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--heading)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
            >
              <input
                className="sr-only"
                type="radio"
                name="preferred-mode"
                checked={settings.optimizationPreference === mode}
                onChange={() => updateSettings({ optimizationPreference: mode })}
              />
              {mode === 'lossless' ? 'Lossless Optimize' : 'Smart Conversion'}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[var(--text)]">
        <input
          type="checkbox"
          checked={settings.automaticCleanup}
          onChange={(event) => updateSettings({ automaticCleanup: event.target.checked })}
        />
        Automatically clear expired local job metadata
      </label>
    </Card>
  )
}
