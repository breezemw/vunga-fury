import type { PropsWithChildren } from 'react'

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex border border-[var(--border-strong)] px-2 py-1 text-[0.68rem] font-semibold tracking-[0.1em] text-[var(--muted)]">
      {children}
    </span>
  )
}
