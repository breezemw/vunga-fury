import type { PropsWithChildren } from 'react'

type AlertProps = PropsWithChildren<{ title: string; tone?: 'info' | 'warning' }>

export function Alert({ children, title, tone = 'info' }: AlertProps) {
  const color =
    tone === 'warning'
      ? 'border-[#d6a85d] text-[#f3d39c]'
      : 'border-[var(--border-strong)] text-[var(--text)]'
  return (
    <aside className={`border-l-2 bg-[var(--surface-raised)] p-4 ${color}`} aria-label={title}>
      <p className="text-sm font-semibold text-[var(--heading)]">{title}</p>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </aside>
  )
}
