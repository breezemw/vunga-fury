export function formatDuration(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return 'Unavailable'
  const wholeSeconds = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const remainingSeconds = wholeSeconds % 60
  return [hours, minutes, remainingSeconds]
    .map((value, index) => (index === 0 && hours === 0 ? null : String(value).padStart(2, '0')))
    .filter((value): value is string => value !== null)
    .join(':')
}
