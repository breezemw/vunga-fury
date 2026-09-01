import { useEffect, useState } from 'react'
import { AppLink } from '../../app/routes'
import { routes } from '../../app/routeConfig'
import { PageContainer } from './PageContainer'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="border-b border-[var(--border)] bg-[var(--canvas)]">
      <PageContainer className="flex min-h-16 items-center justify-between gap-4 sm:min-h-18">
        <AppLink href="/" className="text-sm font-semibold tracking-[0.12em] text-[var(--heading)]">
          VUNGA FURY
        </AppLink>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {routes
            .filter(({ path }) => path !== '/')
            .map(({ label, path }) => (
              <AppLink
                key={path}
                href={path}
                className="flex min-h-11 items-center rounded-sm px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--heading)]"
              >
                {label}
              </AppLink>
            ))}
        </nav>
        <button
          type="button"
          className="min-h-11 min-w-11 border border-[var(--border)] px-3 text-xs font-semibold tracking-[0.08em] text-[var(--heading)] md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          MENU
        </button>
      </PageContainer>
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[var(--border)] md:hidden"
        >
          <PageContainer className="grid py-2">
            {routes
              .filter(({ path }) => path !== '/')
              .map(({ label, path }) => (
                <AppLink
                  key={path}
                  href={path}
                  onNavigate={() => setIsMenuOpen(false)}
                  className="min-h-11 px-1 py-3 text-sm text-[var(--muted)]"
                >
                  {label}
                </AppLink>
              ))}
          </PageContainer>
        </nav>
      )}
    </header>
  )
}
