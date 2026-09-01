import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'

export function CapabilityPanel() {
  const capabilities = useDeviceCapabilities()
  const values = [
    ['WebAssembly', capabilities.webAssembly],
    ['Web Workers', capabilities.webWorkers],
    ['Video playback', capabilities.videoPlayback],
    ['IndexedDB', capabilities.indexedDb],
    ['WebCodecs', capabilities.webCodecs],
    ['File System Access', capabilities.fileSystemAccess],
    ['Storage estimate', capabilities.storageEstimate],
    ['SharedArrayBuffer', capabilities.sharedArrayBuffer],
  ]
  return (
    <Card className="mt-4 max-w-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--heading)]">Browser capabilities</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Detected locally in this browser. Optional APIs do not block basic use.
          </p>
        </div>
        <Badge>{capabilities.mode.toUpperCase()}</Badge>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
        {values.map(([label, supported]) => (
          <div key={label as string}>
            <dt className="text-[var(--muted)]">{label as string}</dt>
            <dd className="mt-1 font-medium text-[var(--heading)]">
              {supported ? 'Supported' : 'Unavailable'}
            </dd>
          </div>
        ))}
        <div>
          <dt className="text-[var(--muted)]">Reported memory</dt>
          <dd className="mt-1 font-medium text-[var(--heading)]">
            {capabilities.deviceMemoryGiB ? `${capabilities.deviceMemoryGiB} GiB` : 'Unavailable'}
          </dd>
        </div>
      </dl>
    </Card>
  )
}
