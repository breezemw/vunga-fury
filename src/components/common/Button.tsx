import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'quiet'
  }
>

const variants = {
  primary: 'border border-[var(--accent)] bg-[var(--accent)] text-[#182000] hover:bg-[#e4fa89]',
  secondary:
    'border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--heading)] hover:border-[var(--muted)]',
  quiet: 'text-[var(--muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--heading)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className = '', variant = 'primary', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`min-h-12 px-5 text-sm font-semibold tracking-[0.06em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
