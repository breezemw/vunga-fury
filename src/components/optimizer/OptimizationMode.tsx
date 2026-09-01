export type OptimizationModeValue = 'lossless' | 'conversion'

type OptimizationModeProps = {
  mode: OptimizationModeValue
  onChange: (mode: OptimizationModeValue) => void
}

export function OptimizationMode({ mode, onChange }: OptimizationModeProps) {
  const options: Array<{ label: string; value: OptimizationModeValue }> = [
    { label: 'LOSSLESS OPTIMIZE', value: 'lossless' },
    { label: 'SMART CONVERSION', value: 'conversion' },
  ]

  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold text-[var(--heading)]">OPTIMIZATION MODE</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`min-h-12 cursor-pointer border px-4 py-3 text-sm font-semibold tracking-[0.05em] focus-within:outline-2 focus-within:outline-[var(--accent)] focus-within:outline-offset-2 ${mode === option.value ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--heading)]' : 'border-[var(--border)] text-[var(--muted)]'}`}
          >
            <input
              className="sr-only"
              type="radio"
              name="optimization-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
