import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PropsWithChildren,
} from 'react'
import { Button } from './Button'

type ModalProps = PropsWithChildren<{ isOpen: boolean; onClose: () => void; title: string }>

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  const trapFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md border border-[var(--border-strong)] bg-[var(--surface)] p-5 shadow-2xl"
        onKeyDown={trapFocus}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-medium text-[var(--heading)]">
            {title}
          </h2>
          <Button
            ref={closeButtonRef}
            type="button"
            variant="quiet"
            className="min-h-11 px-3"
            onClick={onClose}
          >
            CLOSE
          </Button>
        </div>
        <div className="mt-4 text-sm leading-6 text-[var(--text)]">{children}</div>
      </section>
    </div>
  )
}
