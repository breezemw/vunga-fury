import { PageContainer } from './PageContainer'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)]">
      <PageContainer className="flex min-h-18 flex-col justify-center gap-2 py-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium tracking-[0.08em] text-[var(--heading)]">VUNGA FURY</p>
        <p>YOUR VIDEO STAYS ON YOUR DEVICE</p>
      </PageContainer>
    </footer>
  )
}
