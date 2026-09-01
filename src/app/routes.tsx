import { useSyncExternalStore, type ReactNode } from 'react'
import { navigate } from './navigation'
import { routes } from './routeConfig'

const subscribeToLocation = (callback: () => void) => {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const getPathname = () => window.location.pathname.slice(basePath.length) || '/'

function toHref(path: string) {
  return `${basePath}${path}`
}

export function AppRouter() {
  const pathname = useSyncExternalStore(subscribeToLocation, getPathname, () => '/')
  const route = routes.find((candidate) => candidate.path === pathname)
  const Page = route?.component ?? routes[0].component

  return <Page />
}

type AppLinkProps = {
  children: ReactNode
  className?: string
  href: string
  onNavigate?: () => void
}

export function AppLink({ children, className, href, onNavigate }: AppLinkProps) {
  return (
    <a
      className={className}
      href={toHref(href)}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return
        }

        event.preventDefault()
        navigate(href)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}
