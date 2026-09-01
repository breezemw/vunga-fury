import { useFfmpegEngineContext } from '../../hooks/useFfmpegEngineContext'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Spinner } from '../common/Spinner'

type FfmpegEnginePanelProps = {
  canLoad: boolean
}

export function FfmpegEnginePanel({ canLoad }: FfmpegEnginePanelProps) {
  const { cancel, load, message, status } = useFfmpegEngineContext()

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">LOCAL VIDEO ENGINE</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        FFmpeg.wasm loads only when requested and remains on this device.
      </p>
      {status === 'loading' && (
        <div className="mt-5">
          <Spinner label={message ?? 'Preparing video engine…'} />
        </div>
      )}
      {status !== 'loading' && message && (
        <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{message}</p>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {status === 'loading' ? (
          <Button type="button" variant="secondary" onClick={cancel}>
            CANCEL ENGINE LOAD
          </Button>
        ) : (
          <Button type="button" disabled={!canLoad || status === 'ready'} onClick={load}>
            {status === 'ready' ? 'VIDEO ENGINE READY' : 'PREPARE VIDEO ENGINE'}
          </Button>
        )}
      </div>
      {!canLoad && (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Select and analyze a local video before loading the engine.
        </p>
      )}
    </Card>
  )
}
