import { createSmartConversionPlan } from '../../features/video-optimization/smartConverter'
import { formatFileSize } from '../../lib/utils/formatFileSize'
import { useFfmpegEngineContext } from '../../hooks/useFfmpegEngineContext'
import type { VideoMetadata } from '../../features/video-analysis/videoTypes'
import { Alert } from '../common/Alert'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { ProgressBar } from '../common/ProgressBar'

type SmartConverterPanelProps = {
  file: File | null
  metadata: VideoMetadata | null
}

export function SmartConverterPanel({ file, metadata }: SmartConverterPanelProps) {
  const { cancel, conversionResult, convert, message, processingStatus, progress, status } =
    useFfmpegEngineContext()
  const plan = metadata ? createSmartConversionPlan(metadata.fileName) : null
  const isWorking =
    processingStatus === 'loading' ||
    processingStatus === 'processing' ||
    processingStatus === 'verifying'
  const canConvert = Boolean(file && metadata && plan && status === 'ready' && !isWorking)

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">SMART CONVERSION</p>
      <div className="mt-4">
        <Alert title="Re-encoding warning" tone="warning">
          This mode re-encodes the video and may change image quality.
        </Alert>
      </div>
      {plan ? (
        <>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{plan.reason}</p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Recommended profile: {plan.profileName}. It preserves aspect ratio, avoids upscaling,
            retains the source frame rate, and encodes H.264 video with AAC audio.
          </p>
          {isWorking ? (
            <>
              <div className="mt-5">
                <ProgressBar
                  label={message ?? 'Processing local video'}
                  value={progress ?? undefined}
                />
              </div>
              <Button type="button" variant="secondary" className="mt-6" onClick={cancel}>
                CANCEL PROCESSING
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="mt-6"
              disabled={!canConvert}
              onClick={() => file && metadata && plan && convert(file, metadata, plan)}
            >
              CONVERT VIDEO
            </Button>
          )}
          {conversionResult && (
            <dl className="mt-6 grid gap-3 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Mode</dt>
                <dd className="text-[var(--heading)]">Smart Conversion</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Video re-encoded</dt>
                <dd className="text-[var(--heading)]">Yes</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Output verified</dt>
                <dd className="text-[var(--heading)]">Yes</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Output size</dt>
                <dd className="text-[var(--heading)]">
                  {formatFileSize(conversionResult.outputSize)}
                </dd>
              </div>
            </dl>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Select a fully analyzed local video to prepare Smart Conversion.
        </p>
      )}
    </Card>
  )
}
