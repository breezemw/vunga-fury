import { useState } from 'react'
import { formatDuration } from '../../lib/utils/formatDuration'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export function LocalDataPanel() {
  const { clearLocalData, history, isStorageAvailable } = useLocalSettings()
  const [clearMessage, setClearMessage] = useState<string | null>(null)
  const clear = async () => {
    const cleared = await clearLocalData()
    setClearMessage(
      cleared
        ? 'Local settings and metadata history cleared.'
        : 'Local storage is unavailable or another tab is using the database.',
    )
  }
  return (
    <Card className="mt-4 max-w-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--heading)]">Local data</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Only settings and metadata history are stored. Video files are never added to IndexedDB.
          </p>
        </div>
        <span className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]">
          {isStorageAvailable ? 'LOCAL STORAGE ACTIVE' : 'IN-MEMORY ONLY'}
        </span>
      </div>
      <div className="mt-5">
        {history.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No processing history.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li key={entry.id} className="border-t border-[var(--border)] pt-3 text-sm">
                <p className="text-[var(--heading)]">{entry.fileName}</p>
                <p className="mt-1 text-[var(--muted)]">
                  {entry.mode === 'lossless' ? 'Lossless Optimize' : 'Smart Conversion'} ·{' '}
                  {entry.resolution ?? 'Resolution unavailable'} · {formatDuration(entry.duration)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="button" variant="secondary" className="mt-6" onClick={() => void clear()}>
        CLEAR LOCAL DATA
      </Button>
      {clearMessage && (
        <p className="mt-3 text-sm text-[var(--muted)]" role="status">
          {clearMessage}
        </p>
      )}
    </Card>
  )
}
