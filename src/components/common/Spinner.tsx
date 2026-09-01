type SpinnerProps = { label: string }

export function Spinner({ label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent)]" />
      {label}
    </span>
  )
}
