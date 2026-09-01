import type { HTMLAttributes, PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement>>

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <section
      className={`border border-[var(--border)] bg-[var(--surface)] ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}
