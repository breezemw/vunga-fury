import { formatFileSize } from '../../lib/utils/formatFileSize'
import { isStorageLow } from '../../features/storage/storageManager'
import { useStorageQuota } from '../../hooks/useStorageQuota'
import { Alert } from '../common/Alert'
import { Card } from '../common/Card'

export function StorageQuotaPanel() {
  const quota = useStorageQuota()
  if (!quota.available)
    return (
      <Card className="mt-4 max-w-2xl p-5 sm:p-6">
        <h2 className="text-lg font-medium text-[var(--heading)]">Browser storage</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Storage estimates are unavailable in this browser.
        </p>
      </Card>
    )
  return (
    <Card className="mt-4 max-w-2xl p-5 sm:p-6">
      <h2 className="text-lg font-medium text-[var(--heading)]">Browser storage</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {quota.usage !== null ? formatFileSize(quota.usage) : 'Unavailable'} used of{' '}
        {quota.quota !== null ? formatFileSize(quota.quota) : 'unavailable'}.
      </p>
      {isStorageLow(quota) && (
        <div className="mt-4">
          <Alert title="Low browser storage" tone="warning">
            Your device is running low on browser storage. Please clear temporary files or free
            device storage before continuing.
          </Alert>
        </div>
      )}
    </Card>
  )
}
