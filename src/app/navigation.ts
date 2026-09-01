const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

export function navigate(path: string) {
  const href = `${basePath}${path}`
  if (window.location.pathname !== href) {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}
