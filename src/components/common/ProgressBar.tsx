type ProgressBarProps = { label: string; value?: number }

export function ProgressBar({ label, value }: ProgressBarProps) {
  const isDeterminate = typeof value === 'number'
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm text-[var(--muted)]">
        <span>{label}</span>
        {isDeterminate && <span>{Math.round(value)}%</span>}
      </div>
      <progress
        className="h-2 w-full accent-[var(--accent)]"
        aria-label={label}
        max={100}
        value={isDeterminate ? Math.max(0, Math.min(100, value)) : undefined}
      />
    </div>
  )
}
